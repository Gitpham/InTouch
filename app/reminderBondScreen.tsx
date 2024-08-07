import { StandardButton } from "@/components/ButtonStandard";

import { InTouchContext } from "@/context/InTouchContext";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, FlatList, View, Alert } from "react-native";
import { Bond, Person, Reminder } from "@/constants/types";
import React from "react";
import { ListItem } from "@rneui/base";
import { stackViews, styles } from "@/constants/Stylesheet";
import { DeleteIcon } from "@/components/DeleteIcon";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { getBond } from "@/assets/db/BondRepo";
import { useSQLiteContext } from "expo-sqlite";
import { getPerson } from "@/assets/db/PersonRepo";

export default function ReminderBondScreen() {
  const localSearchParams = useLocalSearchParams();
  const db = useSQLiteContext();
  const { reminderList, removeReminder } = useContext(InTouchContext);
  const [bond, setBond] = useState<Bond>();
  const [person, setPerson] = useState<Person>();
  const stackView = stackViews();
  const bondName = localSearchParams.bondName;
  const personName = localSearchParams.personName;
  const isFromBond: boolean = localSearchParams.bid != undefined ? true : false;

  useEffect(() => {

    const fetchData = async () => {
      console.log("reminderBondScreen useEffect() render");
      if (isFromBond) {
        const bid = parseInt(localSearchParams.bid);
        try {
          const b = await getBond(db, bid);
          setBond(b);
        } catch (e) {
          console.error(e);
          throw new Error("reminderBondScreen(): failed to call getBond()");
        }
      } else {
        const pid = parseInt(localSearchParams.pid);
        try {
          const p = await getPerson(db, pid);
          setPerson(p);
        } catch (e) {
          console.error(e);
          throw new Error("reminderBondScreen(): failed to call getPerson()");
        }
      }
    };
    fetchData();
  }, []);

  const renderReminder = ({ item }: { item: Reminder }) => {
    if (isFromBond) {

      if (item.bond_id) {
        if (item.bond_id == bond?.bond_id) {
          return (
            <ListItem bottomDivider>
              <ListItem.Content id={item.reminder_id.toString()}>
                <View style={styles.rowOrientation}>
                  <View style={styles.nameContainer}>
                    <ListItem.Title style={styles.name}>
                      {bond?.bondName + " "}
                    </ListItem.Title>
                  </View>
                  <ListItem.Title style={styles.date}>
                    {item.date}
                  </ListItem.Title>
                </View>
                <ListItem.Title>{item.reminder}</ListItem.Title>
              </ListItem.Content>

              <Pressable
                onPress={() => deleteReminderAlert(item)}
                style={styles.touchable}
              >
                <DeleteIcon></DeleteIcon>
              </Pressable>
            </ListItem>
          );
        }
      } 

    } else {
      if (item.person_id) {
        if (item.person_id == person?.person_id) {
          return (
            <ListItem bottomDivider>
              <ListItem.Content id={item.reminder_id.toString()}>
                <View style={styles.rowOrientation}>
                  <View style={styles.nameContainer}>
                    <ListItem.Title style={styles.name}>
                      {person.firstName + " " + person.lastName}
                    </ListItem.Title>
                  </View>
                  <ListItem.Title style={styles.date}>
                    {item.date}
                  </ListItem.Title>
                </View>
                <ListItem.Title>{item.reminder}</ListItem.Title>
              </ListItem.Content>
              <Pressable
                onPress={() => deleteReminderAlert(item)}
                style={styles.touchable}
              >
                <DeleteIcon></DeleteIcon>
              </Pressable>
            </ListItem>
          );
        }
      } 
    }
  };

  const deleteReminderAlert = (reminder: Reminder) => {
    let alertMessage: string;
    if (isFromBond) {
      alertMessage = `Delete reminder for ${bond?.bondName}?`;
    } else {
      alertMessage = `Delete reminder for ${person?.firstName}?`;
    }

    Alert.alert(alertMessage, "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          {
            deleteReminder(reminder.reminder_id);
          }
        },
        isPreferred: true,
      },
    ]);
  };

  const deleteReminder = (reminder_id: number) => {
    removeReminder(reminder_id);
  };

  const onAddReminder = () => {
    if (isFromBond){
      router.navigate({
        pathname: "./addReminderModal",
        params: { person_id: -1, bond_id: bond.bond_id },
      })
    } else {
      router.navigate({
        pathname: "./addReminderModal",
        params: { person_id: person?.person_id, bond_id: -1 },
      })
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}} >
      <Stack.Screen
        options={{
          headerTitle: isFromBond
            ? ` ${bondName} Reminders`
            : ` ${personName} Reminders`,
        }}
      />
      <View style={{flex : 1}}>

     <FlatList
       
        data={reminderList}
        renderItem={renderReminder}
        keyExtractor={(item) => item.reminder_id.toString()}
      /> 
      <StandardButton
        title="+Add Reminder"
        onPress={onAddReminder }
      />
    </View>

    </View>
  );
}
