import { getPersonsOfBondDB, updatePersonBond } from "@/assets/db/PersonBondRepo";
import { getPerson } from "@/assets/db/PersonRepo";
import { BondPerson, Person } from "@/constants/types";
import * as SQLite from "expo-sqlite";
import { Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { SQLiteAnyDatabase } from "expo-sqlite/build/NativeStatement";

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


  /**
   * Returns current person
   * @param bondID 
   * @param db 
   * @returns 
   */
  const getNextToCallUtil = async (bondID: number, db: SQLite.SQLiteDatabase): Promise<Person> => {
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
          return await persToCall as Person;
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

  const displayNextToCall = async (bondID: number, db: SQLiteAnyDatabase) : Promise<Person> => {
    try {
      const members: BondPerson[] = await getPersonsOfBondDB(db, bondID);
      for (let i = 0; i < members.length; i++)  {
        if (members[i].nextToCall === 1) {
          const persToCall = await getPerson(db, members[i].person_id);
          return persToCall as Person
        }
      }

      console.log("No nextToCall found!")
    } catch (e) {
      console.error(e);
      console.log("Could not display next to Call")
    }
  }

  const callPersonUtil = async (notification: Notifications.Notification, db: SQLite.SQLiteDatabase) => {
    const bondID: number = +notification.request.content.data?.bondID;
    const toCall: Person = await getNextToCallUtil(bondID, db);
    const phoneNumber: string = validateAndFormatPhoneNumber(
      toCall.phoneNumber
    );
    const phoneURL: string = `tel:${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(phoneURL);
    router.navigate({pathname: "./personScreen", params: {id: `${toCall.person_id}`} })

    if (canOpen) {
      Linking.openURL(phoneURL);
    } else {
      Alert.alert("could not open url");
    }
  };

const callUtil = async (person: Person, db: SQLite.SQLiteDatabase) => {
  const phoneNumber: string = validateAndFormatPhoneNumber(
    person.phoneNumber
  );
  const phoneURL: string = `tel:${phoneNumber}`;
  const canOpen = await Linking.canOpenURL(phoneURL);

  if (canOpen) {
    Linking.openURL(phoneURL);
  } else {
    Alert.alert("could not open url");
  }
}

// For texting user
const sendSMS = (phoneNumber: string) => {
  const url = `sms:${phoneNumber}`;
  Linking.openURL(url).catch(err => console.error('Error:', err));
};


const invalidAreaCodes = [200, 211, 221, 222, 230, 232, 233, 237, 238, 241, 243, 244, 245, 247, 255, 258, 259, 261, 265, 266, 271,
                        273, 275, 277, 278, 280, 282, 285, 286, 287, 288, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 311,
                        322, 328, 333, 335, 338, 342, 344, 348, 349, 355, 356, 358, 359, 362, 366, 370, 371, 372, 373, 374, 375, 376,
                        377, 378, 379, 381, 383, 384, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 411, 420, 
                        421, 422, 426, 427, 429, 433, 439, 444, 446, 449, 451, 452, 453, 454, 455, 459, 460, 461, 462, 465, 466, 467,
                        471, 476, 477, 481, 482, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 511, 535,
                        536, 537, 538, 542, 543, 545, 546, 547, 549, 550, 552, 553, 554, 555, 556, 558, 560, 565, 568, 569, 576, 578, 
                        583, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 611, 625, 627, 632, 633, 634, 635, 637, 638, 642, 
                        643, 644, 648, 652, 653, 654, 655, 663, 665, 666, 668, 673, 674, 675, 676, 677, 685, 687, 688, 690, 691, 692, 
                        693, 694, 695, 696, 697, 698, 699, 711, 722, 723, 733, 735, 736, 739, 741, 744, 745, 746, 749, 750, 751, 752, 
                        755, 756, 759, 761, 764, 766, 768, 776, 777, 783, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 
                        811, 823, 824, 827, 834, 836, 837, 841, 842, 846, 851, 852, 853, 871, 874, 875, 880, 881, 882, 883, 884, 885, 
                        886, 887, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 911, 921, 922, 923, 926, 927, 932, 933, 935, 
                        944, 946, 950, 953, 955, 957, 958, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 974, 976, 977, 981, 982, 
                        987, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999]

function phoneNumberVerifier (phoneNumber: string) : boolean {

  if (phoneNumber.length < 10) {
    Alert.alert("Invalid Phone Number", "Please Enter 3-digit area and 7-digit phone number")
    return false;
  }

  if (phoneNumber.length > 10) {
    Alert.alert("Invalid Phone Number", "Phone number should be 10-digits")
    return false;
  }

  const areaCode = phoneNumber.slice(0,3)
  if (areaCode in invalidAreaCodes) {
    Alert.alert("Invalid Phone Number", "You have entered an invalid area code")
    return false;
  }

  return true;
}


export {
  validateAndFormatPhoneNumber,
  callPersonUtil,
  callUtil,
  sendSMS,
  getNextToCallUtil,
  displayNextToCall,
  phoneNumberVerifier
}
