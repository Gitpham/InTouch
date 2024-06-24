import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { member, group } from "./createGroupModal";
import * as Contacts from 'expo-contacts';
import { useRouter } from 'expo-router';

export default function addMemberScreen() {
  const styles = StyleSheet.create({
    button: {
        margin: 10,
        backgroundColor: 'white',
    },
    title: {
        color: "black",
    },
    stepContainer: {
        backgroundColor: 'white',
      }
  });

    // Member information
    const [memberFirstName, memFirstNameChange] = useState(""); 
    const [memberLastName, memLastNameChange] = useState(""); 
    const [memberNumber, memNumberChange] = useState("");
    
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
        
        <ThemedText darkColor="black">"Add Member"</ThemedText>
        
        <Button 
            title="Enter Contact Manually" 
            onPress={() => {router.push('/addMemberManualScreen');}}
            buttonStyle={styles.button}
            titleStyle={styles.title}
        />
        <Button
            title="Add from Contacts"
            onPress={importFromContacts}
            buttonStyle={styles.button}
            titleStyle={styles.title}
        />
  </SafeAreaView>)


}

