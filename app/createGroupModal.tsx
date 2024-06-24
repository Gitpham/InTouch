import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, Dialog, ListItem } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { requestPermissionsAsync } from "expo-contacts";
import { useRouter } from 'expo-router';


// const groupList : Group[] = [];


export const group : Group = {name: "", 
  members: [], 
  schedule: "", 
  typeOfCall: ""
};

export const member : Member = {firstName: "",
  lastName: "",
  number: ""
};




export default function createGroupScreen() {
    // For navigation purposes
    const router = useRouter();

    // For Bottom Sheet
    const [isVisible, setIsVisible] = useState(false);

    //for dialog
    const [addMemberVisible, setAddMemberVisible] = useState(false);
    
    // async function  addFromContacts() {
    //   const {status} = await requestPermissionsAsync();
    //   if (status == 'granted') {
    //     console.log("Got permission!")
    //   } else {
    //     console.log("No Permisson")
    //   }
    // }



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
            onPress={() => setAddMemberVisible(true)}
            buttonStyle={styles.button}
          />

          <Dialog
            isVisible={addMemberVisible}
            onBackdropPress={() => setAddMemberVisible(false)}
            >
              <Dialog.Title title="Add Member"></Dialog.Title>
              <ThemedText darkColor="black">Test</ThemedText>
              <Dialog.Button title="Add from contacts" 
              // onPress={addFromContacts}
              ></Dialog.Button>
              <Dialog.Button title="Add Manually" onPress={() => {setAddMemberVisible(false); router.push('/addMemberScreen');}}></Dialog.Button>

          </Dialog>


          {/* <BottomSheet modalProps={{}} isVisible={isVisible}>
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
          </BottomSheet> */}
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