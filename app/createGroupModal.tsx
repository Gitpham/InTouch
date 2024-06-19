import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

// Member to be added
interface Member {firstName: string, lastName: string, number: string}

// Group to be saved
interface Group { name: string, members: Member[], schedule: string, typeOfCall: string}

// const groupList : Group[] = [];


const group : Group = {name: "", 
  members: [], 
  schedule: "", 
  typeOfCall: ""
};

const member : Member = {firstName: "",
  lastName: "",
  number: ""
};


export default function createGroupScreen() {
    // For Bottom Sheet
    const [isVisible, setIsVisible] = useState(false);


  // Data to be stored in record
    const [groupName, groupNameChange] = useState("");
    const [memberFirstName, memFirstNameChange] = useState(""); 
    const [memberLastName, memLastNameChange] = useState(""); 
    const [memberNumber, memNumberChange] = useState("");


    function addGroupMember() {
      member.firstName = memberFirstName;
      member.lastName = memberLastName;
      member.number = memberNumber;
      group.members.push(member);

    }
      
    function saveGroup() {
      group.name = groupName; 

      // Testing purpo
      console.log(group.members.length);
  
      if (group.name) {
        const testMember = group.members[0];
        if (testMember) {
          console.log("Group " + group.name + " includes: " + testMember.firstName);
        }
        else {
          console.log("Group " + group.name + " is empty");
        }

      // Saving to Repo
      // groupList.push(group);
      }
    }

    function resetGroup() {
      group.name = ""; 
      group.members = [];
      group.schedule = "";

    }

    return (
        <SafeAreaView>
          <ThemedText type = "title"> Create Group </ThemedText>
        
          <TextInput 
            onChangeText = {groupNameChange}
            value = {groupName}
            placeholder = "Enter Group Name"
            style = {{height: 40, margin: 13, borderWidth: 1, padding: 10, color: "white", backgroundColor: "gray"}}>
          </TextInput>

          <Button
            title="Add Group Member"
            onPress={() => setIsVisible(true)}
            buttonStyle={styles.button}
          />
          <BottomSheet modalProps={{}} isVisible={isVisible}>
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

            <Button
              title="Add Member"
              onPress={() => {addGroupMember();setIsVisible(false);}}
              buttonStyle={styles.button}
            />
          </BottomSheet>
          <Link href="./(tabs)" asChild>
            <Pressable
              onPress={() => {saveGroup(); resetGroup();}}>
              <ThemedText type="title">Done</ThemedText>
           </Pressable>
          </Link>

        </SafeAreaView>

       )

}

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
});