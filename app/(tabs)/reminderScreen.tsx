import { StandardButton } from "@/components/ButtonStandard";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { useContext } from "react";
import { Pressable, StyleSheet, FlatList, View, Alert } from "react-native";
import { Bond, Person, Reminder } from "@/constants/types";
import React from "react";
import { ListItem } from "@rneui/base";
import { styles } from "@/constants/Stylesheet"
import { DeleteIcon } from "@/components/DeleteIcon";
import { getReminderName } from "@/context/ReminderUtils";
import { router } from "expo-router";


export default function ReminderScreen() {
  const { reminderList, peopleList, bondList, removeReminder } = useContext(InTouchContext);


  const renderReminder = ({ item }: { item: Reminder }) => {
    if (item) {
          const name = getReminderName(item, bondList, peopleList)
      return (
        <ListItem bottomDivider>
          <ListItem.Content id={item.reminder_id.toString()}>
              <View style = {styles.rowOrientation}>
              <View style = {styles.nameContainer}>
            <ListItem.Title style = {styles.name}>
              {name + " "} 
            </ListItem.Title>
            </View>
            <ListItem.Title style = {styles.date}>
              {item.date} 
            </ListItem.Title>
            </View>
            <ListItem.Title>
              {item.reminder} 
            </ListItem.Title>
          </ListItem.Content>

          <Pressable
            onPress={() => deleteReminderAlert(item)}
            style={styles.touchable}>
            <DeleteIcon></DeleteIcon>
            </Pressable>
  
        </ListItem>
      )}
      else {
        return (
          <ListItem bottomDivider>
          </ListItem>
        );

      }
  }

  const deleteReminderAlert = (reminder: Reminder) => {
    const name = getReminderName(reminder, bondList, peopleList)
    Alert.alert(`Delete reminder for ${name}?`, "",[
      {text: 'Cancel',
        onPress: () => {},
        style: 'cancel',},
      {text: 'OK',
        onPress: () => {{deleteReminder(reminder.reminder_id)}},
        isPreferred: true
      },
    ]);
  }

  const deleteReminder = (reminder_id: number) => {
        removeReminder(reminder_id);
      }

     return (
          <SafeAreaView style = {styles.stepContainer}>
               <View style = {styles.centeredView}>
               <ThemedText type = "title" style = {styles.title}>All Reminders</ThemedText>
               </View>
               
               <FlatList
               data = {reminderList}
               renderItem = {renderReminder}
               keyExtractor={(item) => item.reminder_id.toString()}
               />

               <StandardButton
                title = "Add Note"
                onPress = {() => {router.navigate({pathname: "../addReminderModal", params : {reminder_screen: 1}})}}
               />

          </SafeAreaView>
     )


}