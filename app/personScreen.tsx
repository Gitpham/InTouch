/* eslint-disable react/react-in-jsx-scope */
import { ThemedText } from "@/components/ThemedText";
import { Bond, Person, Reminder, formatDate } from "@/constants/types";
import { Card, ListItem, Button } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { Alert, FlatList, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function PersonScreen() {

  const {peopleList, getBondsOfPerson, removePerson, reminderList, getRemindersOfPerson, removeReminder } = useContext(InTouchContext)
  const localParams = useLocalSearchParams();
  const [person, setPerson] = useState<Person>()
  const [bonds, setBonds] = useState<Array<Bond>>();
  const [reminders, setReminders] = useState<Array<Reminder>>();


  useEffect(() => {
    const personId: number = Number(localParams.id)
    let person_index = peopleList.findIndex(item => item.person_id === personId)
    if (person_index !== -1) {
      const p: Person = peopleList[person_index];
      setPerson(p);
      const b = getBondsOfPerson(p);
      setBonds(b);
      const r = getRemindersOfPerson(personId);
      setReminders(r)
    }

  }, [reminderList])


  const renderBonds = ({ item }: { item: Bond }) => {
    if (item) {
      return (
        <ListItem bottomDivider>
          <Pressable >
  
          <ListItem.Content id={item.bond_id.toString()}>
            <ListItem.Title>
              {item.bondName} 
            </ListItem.Title>
          </ListItem.Content>
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
    const renderReminders = ({ item }: { item: Reminder }) => {
      if (item) {
  
        return (
          <ListItem bottomDivider>
    
            <ListItem.Content id={item.reminder_id.toString()}>
              <View style = {styles.rowOrientation}>
              <View style = {styles.nameContainer}>
                <ListItem.Title style = {styles.date}>
                  {item.date}
                </ListItem.Title>
              <ListItem.Title>
                {item.reminder} 
              </ListItem.Title>
              </View>
              </View>
            </ListItem.Content>
            <Pressable
             onPress={() => deleteReminderAlert(item.reminder_id)}
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

    const deletePerson = () => {
      if (person) {
      removePerson(person);
      }
      router.back();
    }

    const deleteReminder = (reminder_id: number) => {
      removeReminder(reminder_id);
    }

    const deleteReminderAlert = (reminder_id: number) => {
      const name = person?.firstName + " " + person?.lastName
      Alert.alert(`Delete reminder for ${name}?`, "",[
        {text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',},
        {text: 'Yes',
          onPress: () => {if (person) {deleteReminder(reminder_id)}},
          isPreferred: true
        },
      ]);
   }


       return (
        <SafeAreaView style = {styles.stepContainer}>
             <Card>
               <Card.Title>Name: {person?.firstName} {person?.lastName} ID: {person?.person_id}</Card.Title>
               <Card.Divider></Card.Divider>
               <ThemedText>Number: </ThemedText>
               <ThemedText>{person?.phoneNumber}</ThemedText>
             </Card>

             <Card>
              <Card.Title>Reminders</Card.Title>
              <FlatList
              data={reminders}
              renderItem={renderReminders}
              keyExtractor={(item) => item.reminder_id.toString()}
              />
             </Card>

             <Button
             title = "+Add Reminder"
             buttonStyle = {styles.button}
             titleStyle = {styles.title}
             onPress = {() => router.navigate({pathname: "./addReminderModal", params: {person_id: person?.person_id, bond_id: -1}})}
             />


             <Card>
              <Card.Title>Groups</Card.Title>
              <FlatList
            data={bonds}
            renderItem={renderBonds}
            keyExtractor={(item) => item.bond_id.toString()}
          />
             </Card>

             <Button
             title = "Delete"
             buttonStyle = {styles.redButton}
             titleStyle = {styles.redTitle}
             onPress = {() => deletePerson()}
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
  touchable: {
    padding: 10,
  },
  rowOrientation: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: "gray",
    fontSize: 12
},
nameContainer: {
  flex: 1,
  marginRight: 10, // Adds space between delete button and name
},
});