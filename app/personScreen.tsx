/* eslint-disable react/react-in-jsx-scope */
import { ThemedText } from "@/components/ThemedText";
import { Bond, BondPerson, Person,  } from "@/constants/types";
import { Card, ListItem, Button } from "@rneui/themed";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { JSX, useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  View,
  Text,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { stackViews, styles } from "@/constants/Stylesheet";
import CallTextButton from "@/components/CallTextButton";
import ReminderDisplayCard from "@/components/ReminderDisplayCard";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { deletePerson, getPerson } from "@/assets/db/PersonRepo";
import { getBondsOfPersonDB, getPersonBondsOfBondDB, getPersonsOfBondDB } from "@/assets/db/PersonBondRepo";
import { deleteBond, getBond } from "@/assets/db/BondRepo";
export default function PersonScreen() {
  const localParams = useLocalSearchParams();
  const [person, setPerson] = useState<Person>();
  const [bonds, setBonds] = useState<Array<Bond>>();
  const stackView = stackViews();

  const db = useSQLiteContext();
  // REFACTORED
  useFocusEffect(
      useCallback(() => {
        // Do something when the screen is focused
        const fetchData = async () => {
          const pid: number = Number(localParams.id);
          try {
            const p = await getPerson(db, pid);
            const bondPersons = await getBondsOfPersonDB(db, pid);
            const bondList: Bond[] = []
            for(let i = 0; i < bondPersons.length; i++){
              const bond = await getBond(db, bondPersons[i].bond_id);
              bondList.push(bond as Bond)
            }
            setPerson(p as Person)
            setBonds(bondList)
          } catch (e) {
            alert("error");
            console.log(e)
          }
        }

        fetchData();
        console.log("personScreen");

      }, [])
    );


  const newDeletePerson = async (db: SQLiteDatabase, pid: number) => {
    console.log("newDeletePerson()")
    try {
      const bondPersons = await getBondsOfPersonDB(db, pid)
      await deletePerson(db, pid);
      console.log("deleted person")
      // must delete bond if the bond has no other members
      for(let i = 0; i < bondPersons.length; i++){
        const bid = bondPersons[i].bond_id;
        const numPeopleInBond: BondPerson[] = await getPersonsOfBondDB(db, bid);
        if(numPeopleInBond.length == 0){
          await deleteBond(db, bid)
        }
      }

    } catch (e) {
      console.error(e)
      throw Error("Failed to newDeletePerson()")
    }

  }


  // Rendering functions for flatlists

  const showBonds = (bonds: Bond[]) => {
    console.log("showBonds()")
    const bondList: JSX.Element[] = [];

    bonds.forEach((b) => {
      bondList.push(
        <ListItem bottomDivider>
          <Pressable>
            <ListItem.Content id={b.bond_id.toString()}>
              <ListItem.Title>{b.bondName}</ListItem.Title>
            </ListItem.Content>
          </Pressable>
        </ListItem>
      );
    });

    return bondList;
  };

  // Delete functions
  const onDeleteAlert = () => {
    let name = person?.firstName.trim();
    if (person?.lastName) {
      name += " ";
      name += person.lastName;
    }
    Alert.alert(
      `Delete ${name} from your inTouch contacts?`,
      "This will delete all associated reminders and remove them from any bond",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => await deleteThisPerson(),
          isPreferred: true,
        },
      ]
    );
  };
  const deleteThisPerson = async () => {
    if (person) {
      console.log("pid to delete: ", person.person_id)
      await newDeletePerson(db, person.person_id as number)
    }
    router.back();
  };


  /**
   * stub method to get CallTextButton to work. Doesn't atualy do anything becasue ther're are no handlers set up yet. 
   * @param bool 
   * @returns 
   */
  function changeIsCalling(bool: boolean){
    return;
  }


  return (
    <ScrollView
      contentContainerStyle={stackView}
      style={{ backgroundColor: "white" }}
    >
      <View style={styles.centeredView}>
        <ThemedText darkColor="black" style={styles.title} type="title">
          {person?.firstName} {person?.lastName}
        </ThemedText>
      </View>

      <CallTextButton
        person={person as Person}
        changeIsCalling={changeIsCalling}
      ></CallTextButton>

      <Card containerStyle={{ flex: 1 }}>
        <Card.Title>Phone</Card.Title>
        <Card.Divider></Card.Divider>
        <ThemedText darkColor="black">{person?.phoneNumber}</ThemedText>
      </Card>

      {person ? (
        <ReminderDisplayCard pid={person.person_id} bid={undefined} />
      ) : (
        <></>
      )}

      <Card containerStyle={{ flex: 3 }}>
        <Card.Title>Bonds</Card.Title>
        {(bonds != undefined && bonds != null) ? showBonds(bonds) : <Text>No Bonds Yet!</Text>}
      </Card>

      <View
        style={{
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          title="Delete"
          buttonStyle={{
            margin: 10,
            backgroundColor: "white",
            borderColor: "red",
            borderWidth: 2,
          }}
          titleStyle={styles.redTitle}
          onPress={() => onDeleteAlert()}
        />
      </View>
    </ScrollView>
  );
}
