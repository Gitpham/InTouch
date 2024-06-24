import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { member, group } from "./createGroupModal";
import * as Contacts from 'expo-contacts';

export default function addMemberScreen() {
    // Member information
    const [memberFirstName, memFirstNameChange] = useState(""); 
    const [memberLastName, memLastNameChange] = useState(""); 
    const [memberNumber, memNumberChange] = useState("");

    useEffect(() => {
      (async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails],
          });
  
          if (data.length > 0) {
            const contact = data[0];
            console.log(contact);
          }
        }
      })();
    }, []);
    
    function addGroupMember() {
        member.firstName = memberFirstName;
        member.lastName = memberLastName;
        member.number = memberNumber;
        group.members.push(member);
  
      }

    async function importFromContacts() {
      console.log("import from contacts")
      const person = await Contacts.presentContactPickerAsync()
      console.log(person?.firstName)
      console.log(person?.lastName)
      console.log(person?.phoneNumbers)
    }

    return (<SafeAreaView>
            <Button onPress={importFromContacts}>Import From Contacts</Button>
            <ThemedText>First Name</ThemedText>
            <TextInput 
              onChangeText = {memFirstNameChange}
              value = {memberFirstName}
              placeholder = "e.g. John"
              style = {{height: 40, margin: 13, borderWidth: 1, padding: 10, color: "white", backgroundColor: "gray"}}>
            </TextInput>
            <ThemedText>Last Name</ThemedText>
            <TextInput 
              onChangeText = {memLastNameChange}
              value = {memberLastName}
              placeholder = "e.g. Doe"
              style = {{height: 40, margin: 13, borderWidth: 1, padding: 10, color: "white", backgroundColor: "gray"}}>
            </TextInput>
            <ThemedText>Phone Number</ThemedText>
            <TextInput 
              onChangeText = {memNumberChange}
              value = {memberNumber}
              placeholder = "e.g. (111)-111-1111"
              keyboardType = "numeric"
              style = {{height: 40, margin: 13, borderWidth: 1, padding: 10, color: "white", backgroundColor: "gray"}}>
            </TextInput>
            <Link href="createGroupModal" asChild>
    {/* `          <Button
                title="Add Member"
                onPress={() => {addGroupMember()}}
                buttonStyle={styles.button}
            /> */}
            </Link>

    </SafeAreaView>)
}

const styles = StyleSheet.create({
    button: {
      margin: 10,
    },
  });