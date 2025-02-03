import { StandardButton } from "@/components/ButtonStandard";

import {  useEffect, useState } from "react";
import { Pressable,  FlatList, View, Alert } from "react-native";
import { Reminder } from "@/constants/types";
import React from "react";
import { ListItem } from "@rneui/base";
import { styles } from "@/constants/Stylesheet";
import { DeleteIcon } from "@/components/DeleteIcon";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteReminder, getRemindersOfBondDB, getRemindersOfPersonDB } from "@/assets/db/ReminderRepo";

export default function ReminderBondScreen() {
  const localSearchParams = useLocalSearchParams();
  const db = useSQLiteContext();

  const bondName = localSearchParams.bondName;
  const personName = localSearchParams.personName;
  const isFromBond: boolean = localSearchParams.bid != undefined ? true : false;
  const pid = +localSearchParams.pid;
  const bid = +localSearchParams.bid;

  const insets = useSafeAreaInsets();

  const [reminderList, setReminderList] = useState<Reminder[]>();
  useEffect(() => {

    const fetchData = async () => {
      console.log("fetchData():")
      let r
      try {
        if (isFromBond) {
          console.log("bid: ", bid)
          r = await getRemindersOfBondDB(db, bid);
        } else {
          console.log("pid: ", pid)
          r = await getRemindersOfPersonDB(db, pid);
        }
        console.log("----")
      } catch (e) {
        console.error(e);
        throw Error("reminderDisplayCard(): failed to fetch data")
      }
      setReminderList(r);
    };
    fetchData();
  }, []);

  const renderReminder = ({ item }: { item: Reminder }) => {
          return (
            <ListItem bottomDivider>
              <ListItem.Content id={item.reminder_id.toString()}>
                <View style={styles.rowOrientation}>
                  <View style={styles.nameContainer}>
        
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
  };

  const deleteReminderAlert = (reminder: Reminder) => {
    const alertMessage = `Delete note for ${reminder.owner}?`;
 
    Alert.alert(alertMessage, "", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          {
            await removeReminder(reminder.reminder_id);
          }
        },
        isPreferred: true,
      },
    ]);
  };

  const removeReminder = async (rid: number) => {
    await deleteReminder(db, rid);
    const updatedReminderList = reminderList.filter(r => {
      return r.reminder_id != rid;
    })
    setReminderList(updatedReminderList);

  };

  const onAddReminder = () => {
    console.log("onAddReminder()")
    console.log("Bid: ", bid)
    console.log("pid: ", pid)
    console.log("--b--")
    if (isFromBond){
      router.navigate({
        pathname: "./addReminderModal",
        params: { person_id: undefined, bond_id: bid },
      })
    } else {
      router.navigate({
        pathname: "./addReminderModal",
        params: { person_id: pid, bond_id: undefined },
      })
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingBottom: insets.bottom}} >
      <Stack.Screen
        options={{
          headerTitleStyle: {
            color: 'black'
          },
          headerTitle: isFromBond
            ? ` ${bondName}'s Notes`
            : ` ${personName}'s Notes`,
        }}
      />
      <View style={{flex : 1}}>

     <FlatList
       
        data={reminderList}
        renderItem={renderReminder}
        keyExtractor={(item) => item.reminder_id.toString()}
      /> 
      <StandardButton
        title="+Add Note"
        onPress={onAddReminder }
      />
    </View>

    </View>
  );
}
