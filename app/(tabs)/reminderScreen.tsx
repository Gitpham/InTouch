import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { Pressable, FlatList, View, Alert } from "react-native";
import { Reminder } from "@/constants/types";
import React from "react";
import { Divider, ListItem } from "@rneui/base";
import { styles } from "@/constants/Stylesheet";
import { DeleteIcon } from "@/components/DeleteIcon";
import { router, useFocusEffect } from "expo-router";
import { AddButton } from "@/components/ButtonStandard";
import { useSQLiteContext } from "expo-sqlite";
import { deleteReminder, getAllReminders } from "@/assets/db/ReminderRepo";

export default function ReminderScreen() {

  const db = useSQLiteContext();

  const [reminderList, setReminderList] = useState<Reminder[]>();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const rList = await getAllReminders(db);
        console.log("fetched reminder data")
        setReminderList(rList);
      };
      fetchData();
      console.log("useFocuseEffeect reminders");
    }, [])
  );

  const renderReminder = ({ item }: { item: Reminder }) => {
    if (item) {
      return (
        <ListItem bottomDivider>
          <ListItem.Content id={item.reminder_id.toString()}>
            <View style={styles.rowOrientation}>
              <View style={styles.nameContainer}>
                <ListItem.Title style={styles.name}>
                  {item.owner ? item.owner : " "}
                </ListItem.Title>
              </View>
              <ListItem.Title style={styles.date}>{item.date}</ListItem.Title>
            </View>
            <ListItem.Title>{item.reminder}</ListItem.Title>
          </ListItem.Content>

          <Pressable
            onPress={() => { deleteReminderAlert(item)
            }}
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

  const deleteReminderAlert = async (reminder: Reminder) => {
    Alert.alert(`Delete notes for ${reminder.owner}?`, "", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          {
            await deleteReminder(db, reminder.reminder_id);
          }
        },
        isPreferred: true,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.stepContainer}>
      <View style={styles.centeredView}>
        <ThemedText type="title" style={styles.title}>
          All Notes
        </ThemedText>
      </View>
      <Divider
        inset={true}
        insetType="middle"
        style={{ borderWidth: 2, borderColor: "chocolate" }}
      ></Divider>

      <FlatList
        data={reminderList}
        renderItem={renderReminder}
        keyExtractor={(item) => item.reminder_id.toString()}
      />

      <AddButton
        color={"chocolate"}
        title="Add Note"
        onPress={() => {
          router.navigate({
            pathname: "../addReminderModal",
            params: { reminder_screen: 1 },
          });
        }}
      />
    </SafeAreaView>
  );
}
