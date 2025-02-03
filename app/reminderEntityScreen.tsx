import { StandardButton } from "@/components/ButtonStandard";

import { InTouchContext } from "@/context/InTouchContext";
import { useContext, useEffect, useState } from "react";
import { Pressable,  FlatList, View, Alert } from "react-native";
import { Bond, Person, Reminder } from "@/constants/types";
import React from "react";
import { ListItem } from "@rneui/base";
import { styles } from "@/constants/Stylesheet";
import { DeleteIcon } from "@/components/DeleteIcon";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { getBond } from "@/assets/db/BondRepo";
import { useSQLiteContext } from "expo-sqlite";
import { getPerson } from "@/assets/db/PersonRepo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteReminder, getRemindersOfBondDB, getRemindersOfPersonDB } from "@/assets/db/ReminderRepo";

export default function ReminderBondScreen() {
  const localSearchParams = useLocalSearchParams();
  const db = useSQLiteContext();

  const bondName = localSearchParams.bondName;
  const personName = localSearchParams.personName;
  const isFromBond: boolean = localSearchParams.bid != undefined ? true : false;
  const insets = useSafeAreaInsets();

  const [reminderList, setReminderList] = useState<Reminder[]>();
  useEffect(() => {

    const fetchData = async () => {
      let r
      try {
        if (isFromBond) {
          const bid = +localSearchParams.bid;
          r = await getRemindersOfBondDB(db, bid);
        } else {
          const pid = +localSearchParams.pid;
          r = await getRemindersOfPersonDB(db, pid);
        }

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
    if (isFromBond){
      router.navigate({
        pathname: "./addReminderModal",
        params: { person_id: -1, bond_id: bond?.bond_id },
      })
    } else {
      router.navigate({
        pathname: "./addReminderModal",
        params: { person_id: person?.person_id, bond_id: -1 },
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
