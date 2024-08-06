import { StandardButton } from "@/components/ButtonStandard";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, FlatList, View, Alert } from "react-native";
import { Bond, Person, Reminder } from "@/constants/types";
import React from "react";
import { ListItem } from "@rneui/base";
import { stackViews, styles } from "@/constants/Stylesheet";
import { DeleteIcon } from "@/components/DeleteIcon";
import { useLocalSearchParams } from "expo-router";
import { getBond } from "@/assets/db/BondRepo";
import { useSQLiteContext } from "expo-sqlite";

export default function ReminderBondScreen() {
  const localSearchParams = useLocalSearchParams();
  const db = useSQLiteContext();
  const { reminderList, peopleList, bondList, removeReminder } =
    useContext(InTouchContext);

  const [bondReminders, setBondReminders] = useState<Reminder[]>();
  const [bond, setBond] = useState<Bond>();
  const stackView = stackViews();

  useEffect(() => {
    const bid = parseInt(localSearchParams.bid);

    const fetchData = async () => {
      try {
        const b = await getBond(db, bid);
        setBond(b);
      } catch (e) {
        console.error(e);
        throw new Error("reminderBondScreen(): failed to call getBond()");
      }
    };
    fetchData();

    setBondReminders(
      reminderList.filter((r) => {
        if (r.bond_id) {
          return r.bond_id == bid;
        }
        return;
      })
    );
  }, []);


  const renderReminder = ({ item }: { item: Reminder }) => {
    if (item) {
      return (
        <ListItem bottomDivider>
          <ListItem.Content id={item.reminder_id.toString()}>
            <View style={styles.rowOrientation}>
              <View style={styles.nameContainer}>
                <ListItem.Title style={styles.name}>
                  {bond?.bondName + " "}
                </ListItem.Title>
              </View>
              <ListItem.Title style={styles.date}>{item.date}</ListItem.Title>
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
    } else {
      return <ListItem bottomDivider></ListItem>;
    }
  };

  const deleteReminderAlert = (reminder: Reminder) => {
    Alert.alert(`Delete reminder for ${bond?.bondName}?`, "", [
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

  return (
    <View style={stackView}>

      <FlatList
        data={bondReminders}
        renderItem={renderReminder}
        keyExtractor={(item) => item.reminder_id.toString()}
      />
    </View>
  );
}
