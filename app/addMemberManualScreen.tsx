import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { member, group } from './createGroupModal'
import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite'
import { Person, addPerson, getAllPersons } from "./db/PersonRepo";


export default function addMemberManualScreen() {
  const router = useRouter();
  const db = SQLite.useSQLiteContext();

    // Member information
    const [memberFirstName, memFirstNameChange] = useState(""); 
    const [memberLastName, memLastNameChange] = useState(""); 
    const [memberNumber, memNumberChange] = useState("");
    
    async function createPerson() {
        member.firstName = memberFirstName;
        member.lastName = memberLastName;
        member.number = memberNumber;
        group.members.push(member);

        const newContact: Person = {
          firstName: memberFirstName,
          lastName: memberLastName,
          phoneNumber: memberNumber,
          id: ""
        }
        
        console.log(newContact)
        await addPerson(db, newContact);
        const allContacts = await getAllPersons(db);
        console.log("all contacts", allContacts)
      }

    return <SafeAreaView style = {styles.stepContainer}>
            <View style = {styles.centeredView}>
              <ThemedText type="subtitle" 
                  style={styles.title}>
                  Enter Contact Information
              </ThemedText>
            </View>

            <View style = {styles.indentedView}>
              <ThemedText style = {styles.title}>First Name</ThemedText>
            </View>

            <TextInput 
              onChangeText = {memFirstNameChange}
              value = {memberFirstName}
              placeholder = "e.g. John"
              style = {{height: 40, margin: 13, borderWidth: 1, padding: 10, color: "white", backgroundColor: "gray"}}>
            </TextInput>
            
            <View style = {styles.indentedView}>
              <ThemedText style = {styles.title}>Last Name</ThemedText>
            </View>
            <TextInput 
              onChangeText = {memLastNameChange}
              value = {memberLastName}
              placeholder = "e.g. Doe"
              style = {{height: 40, margin: 13, borderWidth: 1, padding: 10, color: "white", backgroundColor: "gray"}}>
            </TextInput>
            <View style = {styles.indentedView}>
              <ThemedText style = {styles.title}>Phone Number</ThemedText>
            </View>
            <TextInput 
              onChangeText = {memNumberChange}
              value = {memberNumber}
              placeholder = "e.g. (111)-111-1111"
              keyboardType = "numeric"
              style = {{height: 40, margin: 13, borderWidth: 1, padding: 10, color: "white", backgroundColor: "gray"}}>
            </TextInput>
            <Button
              title="Create Contact"
              onPress={() => {createPerson(); router.push('/createGroupModal');}}
              buttonStyle={styles.button}
              titleStyle={styles.title}
            />

    </SafeAreaView>
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2, 
  },
  title: {
    color: "black",
 },
  stepContainer: {
    flex: 1,
    backgroundColor: 'white',
    gap: 8,
    marginBottom: 8,
    flexDirection: 'column',
    paddingTop: 50
  },
  indentedView : {
    paddingLeft: 10
  },
  centeredView : {
    alignItems: "center"
}
});
