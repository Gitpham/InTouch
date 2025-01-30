/* eslint-disable react/react-in-jsx-scope */
import { ThemedText } from "@/components/ThemedText";
import { Bond, BondPerson, Person, Reminder } from "@/constants/types";
import { Card, ListItem, Button } from "@rneui/themed";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { JSX, useCallback, useContext, useEffect, useState } from "react";
import { InTouchContext } from "@/context/InTouchContext";
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
import { useSQLiteContext } from "expo-sqlite";
import { deletePerson, getPerson } from "@/assets/db/PersonRepo";
import { getBondsOfPersonDB } from "@/assets/db/PersonBondRepo";
import { getRemindersOfPersonDB } from "@/assets/db/ReminderRepo";
import { getBond } from "@/assets/db/BondRepo";
export default function PersonScreen() {
  const {
    removePerson,
  } = useContext(InTouchContext);

  const localParams = useLocalSearchParams();
  const [person, setPerson] = useState<Person>();
  const [bonds, setBonds] = useState<Array<Bond>>();
  const stackView = stackViews();

  const db = useSQLiteContext();
  // REFACTORED
  useFocusEffect(
      useCallback(() => {
        // Do something when the screen is focused
        const init = async () => {
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
        init();
      }, [])
    );


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
          onPress: () => deleteThisPerson(),
          isPreferred: true,
        },
      ]
    );
  };
  const deleteThisPerson = () => {
    if (person) {
      deletePerson(db, person)
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
        <ReminderDisplayCard person={person} bond={undefined} />
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
