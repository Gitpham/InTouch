import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";


export default function createGroupScreen() {
     const [groupName, groupNameChange] = useState("");
     const [memberName, memNameChange] = useState(""); 
     const [memberNumber, memNumberChange] = useState("");

       return (
        <SafeAreaView>
          <ThemedText type = "title"> Create Group </ThemedText>
          <ThemedText type = "subtitle">+Name Group</ThemedText>
          <TextInput 
          onChangeText = {groupNameChange}
          value = {groupName}
          placeholder = "Enter Group Name"
          style = {{height: 40, margin: 13, borderWidth: 1, padding: 10, color: "white", backgroundColor: "gray"}}>
          </TextInput>

          <ThemedText type = "subtitle">+Add Group Member</ThemedText>
          <TextInput 
          onChangeText = {memNameChange}
          value = {memberName}
          placeholder = "Enter Name"
          style = {{height: 40, margin: 13, borderWidth: 1, padding: 10, color: "white", backgroundColor: "gray"}}>
          </TextInput>

          <TextInput 
          onChangeText = {memNumberChange}
          value = {memberNumber}
          placeholder = "Enter Number"
          keyboardType = "numeric"
          style = {{height: 40, margin: 13, borderWidth: 1, padding: 10, color: "white", backgroundColor: "gray"}}>
          </TextInput>
        </SafeAreaView>

       )

    

}