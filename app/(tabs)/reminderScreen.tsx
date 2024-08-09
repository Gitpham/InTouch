import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { useContext } from "react";
import { Pressable,  FlatList, View, Alert } from "react-native";
import {  Reminder } from "@/constants/types";
import React from "react";
import { Divider, ListItem } from "@rneui/base";
import { styles } from "@/constants/Stylesheet"
import { DeleteIcon } from "@/components/DeleteIcon";
import { getReminderName } from "@/context/ReminderUtils";
import { router } from "expo-router";
import { AddButton } from "@/components/ButtonStandard";


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
    Alert.alert(`Delete notes for ${name}?`, "",[
      {text: 'Cancel',
        onPress: () => {},
        style: 'cancel',},
      {text: 'OK',
        onPress: () => {{deleteReminder(reminder.reminder_id)}},
        isPreferred: true
      },
    ])
  }

  const deleteReminder = (reminder_id: number) => {
        removeReminder(reminder_id);
      }
     return (
          <SafeAreaView style = {styles.stepContainer}>
               <View style = {styles.centeredView}>
               <ThemedText type = "title" style = {styles.title}>All Notes</ThemedText>
               </View>
               <Divider
        inset={true}
        insetType="middle"
        style={{ borderWidth: 2, borderColor: "chocolate" }}
      ></Divider>
               
               <FlatList
               data = {reminderList}
               renderItem = {renderReminder}
               keyExtractor={(item) => item.reminder_id.toString()}
               />

               <AddButton
                color={'chocolate'}
                title = "Add Note"
                onPress = {() => {router.navigate({pathname: "../addReminderModal", params : {reminder_screen: 1}})}}
               />

          </SafeAreaView>
     )


}