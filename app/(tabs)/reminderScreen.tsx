import { StandardButton } from "@/components/ButtonStandard";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { useContext } from "react";
import { Pressable, StyleSheet, FlatList, View } from "react-native";
import { Bond, Person, Reminder } from "@/constants/types";
import React from "react";
import { deleteReminder } from "@/assets/db/ReminderRepo";
import { ListItem } from "@rneui/base";


export default function ReminderScreen() {
     const { reminderList, peopleList, bondList, removeReminder } = useContext(InTouchContext);

     function associateReminder(reminder: Reminder) {
          let toBeReturned = ""
          let isBond = false; 
          if (reminder.bond_id) {
               isBond = true;
          }
          
          // Bond reminder
          if (isBond) {
              for (const bond of bondList) {
                    if (bond.bond_id === reminder.bond_id) {
                         console.log(bond.bondName)
                         toBeReturned = bond.bondName;
                         break;
                    }
               }
          }
          // Person Reminder
          else {
               for (const person of peopleList) {
                    if (person.person_id === reminder.person_id) {
                         toBeReturned = person.firstName + " " + person.lastName.trim()
                    }
               }
          }

          return toBeReturned;
     }
     const renderReminder = ({ item }: { item: Reminder }) => {
          if (item) {
               const name = associateReminder(item)
            return (
              <ListItem bottomDivider>
                <ListItem.Content id={item.reminder_id.toString()}>
                    <View style = {styles.rowOrientation}>
                  <ListItem.Title style = {styles.name}>
                    {name + " "} 
                  </ListItem.Title>
                  <ListItem.Title style = {styles.date}>
                    {item.date} 
                  </ListItem.Title>
                  </View>
                  <ListItem.Title>
                    {item.reminder} 
                  </ListItem.Title>
                </ListItem.Content>
                <Pressable
                 onPress={() => deleteReminder(item.reminder_id)}
                 style={styles.touchable}>
                  <ThemedText>Delete</ThemedText>
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

          </SafeAreaView>
     )


}


const styles = StyleSheet.create({
     button: {
       margin: 10,
       backgroundColor: "white",
       borderColor: "black",
       borderWidth: 2,
     },
     title: {
       color: "black",
     },
     name: {
          color: "black",
          fontWeight: 'bold',
          fontSize: 20
     },
     date: {
          color: "gray",
          fontSize: 12
     },
     redButton: {
       margin: 10,
       backgroundColor: "white",
       borderColor: "red",
       borderWidth: 2,
     },
     redTitle: {
       color: "red",
     },
     stepContainer: {
       flex: 1,
       backgroundColor: "white",
       gap: 8,
       marginBottom: 8,
       flexDirection: "column",
       paddingTop: 50,
     },
     centeredView: {
       alignItems: "center",
     },
     flatList: {
       height: 200,
     },
     rowOrientation: {
       flexDirection: "row",
       justifyContent: 'space-between',
       alignItems: 'center',
     },
     nameContainer: {
       flex: 1,
       marginRight: 10, // Adds space between delete button and name
     },
     touchable: {
       padding: 10,
     }
});