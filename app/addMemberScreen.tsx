import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { member, group } from "./createGroupModal";
import * as Contacts from 'expo-contacts';
import { useRouter } from 'expo-router';

export default function addMemberScreen() {

    // Member information
    const [memberFirstName, setMemFirstName] = useState(""); 
    const [memberLastName, setMemLastName] = useState(""); 
    const [memberNumber, setMemNumber] = useState("");
    
    function addGroupMember() {
        member.firstName = memberFirstName;
        member.lastName = memberLastName;
        member.number = memberNumber;
        group.members.push(member);
  
      }

    async function importFromContacts() {
      console.log("import from contacts")
      const person = await Contacts.presentContactPickerAsync()
      
      console.log(person)
      console.log(person?.firstName)
      console.log(person?.lastName)
      console.log(person?.phoneNumbers?.[0]?.number)
      
    }

    return (<SafeAreaView style = {styles.stepContainer}>
        <View style = {styles.centeredView}>
        <ThemedText type="subtitle" 
            style={styles.title}>
            Add Group Member
        </ThemedText>
        </View>
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
    centeredView : {
        alignItems: "center"
    }
  });
