import { getPersonsOfBondDB, updatePersonBond } from "@/assets/db/PersonBondRepo";
import { getPerson } from "@/assets/db/PersonRepo";
import { BondPerson, Person } from "@/constants/types";
import * as SQLite from "expo-sqlite";
import { Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";

const formatPhoneNumber = (phoneNumber: string): string => {
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    

    // Ensure the phone number starts with a + and is followed by digits
    const e164PhoneNumber = cleaned.startsWith('+') ? cleaned : `+1${cleaned}`;
    if (e164PhoneNumber.length != 12){
        throw new Error("phone number is not 11 digits")
    }

    return e164PhoneNumber
  };
  
  const isE164PhoneNumber = (phoneNumber: string): boolean => {
    const pattern = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    return pattern.test(phoneNumber);
  };
  
  const validateAndFormatPhoneNumber = (phoneNumber: string): string => {
    if (isE164PhoneNumber(phoneNumber)) {
      return phoneNumber;
    } else {
      return formatPhoneNumber(phoneNumber);
    }
  };


  export const getNextToCallUtil = async (bondID: number, db: SQLite.SQLiteDatabase): Promise<Person> => {
    try {
      const members: BondPerson[] = await getPersonsOfBondDB(db, bondID);
      // IF SOMEBODY IS MARKED AND IS NOT END
      for (let i = 0; i < members.length; i++) {
        if (members[i].nextToCall == 1) {
          const persToCall = await getPerson(db, members[i].person_id);
          await updatePersonBond(
            db,
            members[i].person_id,
            members[i].bond_id,
            0
          );

          if (i + 1 < members.length) {
            await updatePersonBond(
              db,
              members[i + 1].person_id,
              members[i + 1].bond_id,
              1
            );
            return persToCall as Person;
          }

          // wraps around
          await updatePersonBond(
            db,
            members[0].person_id,
            members[0].bond_id,
            1
          );
          return persToCall as Person;
        }
      }
      // If there is no member markedd
      const firstToCall: Person = (await getPerson(
        db,
        members[0].person_id
      )) as Person;

      if (members.length == 1) {
        await updatePersonBond(db, members[0].person_id, members[0].bond_id, 1);
        return firstToCall;
      }
      await updatePersonBond(db, members[1].person_id, members[1].bond_id, 1);
      return firstToCall;
    } catch (e) {
      console.error();
      throw new Error(
        "getNextToCallInBond(): failed to call getPersonsOfBondDB"
      );
    }
  };

  const callPersonUtil = async (notification: Notifications.Notification, db: SQLite.SQLiteDatabase) => {
    const bondID: number = +notification.request.content.data?.bondID;
    const toCall: Person = await getNextToCallUtil(bondID, db);
    const phoneNumber: string = validateAndFormatPhoneNumber(
      toCall.phoneNumber
    );
    const phoneURL: string = `tel:${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(phoneURL);

    if (canOpen) {
      Linking.openURL(phoneURL);
    } else {
      Alert.alert("could not open url");
    }
  };
  export {
    validateAndFormatPhoneNumber,
    callPersonUtil
  }