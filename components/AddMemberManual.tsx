import { styles } from "@/constants/Stylesheet";
import { Person } from "@/constants/types";
import { InTouchContext } from "@/context/InTouchContext";
import { phoneNumberVerifier } from "@/context/PhoneNumberUtils";
import { Button } from "@rneui/themed";
import { useContext } from "react";

import { ThemedText } from "./ThemedText";
import React from "react";
import { TextInput, View } from "react-native";

interface addMemberManualInterface {
    memberFirstName: string,
    memFirstNameChange: (n: string) => void,

    memberLastName: string,
    memLastNameChange: (n: string) => void

    memberNumber: string,
    memNumberChange: (n: string) => void,

    bondId: number,
    setBondID: (n: number) => void,

    isVisible: boolean,
    setIsVisible: (b: boolean) => void
}

export default function AddMemberManual({
    memberFirstName, 
    memFirstNameChange,

    memberLastName, 
    memLastNameChange,

    memberNumber,
    memNumberChange,

    bondId,
    setBondID,

    isVisible, 
    setIsVisible,
    
} : addMemberManualInterface) {
    const { createPerson, generatePersonId, addTempBondMember } = useContext(InTouchContext);
  
    // Member information
  
    async function savePerson() {
      const personID = generatePersonId();
  
      const newContact: Person = {
        firstName: memberFirstName,
        lastName: memberLastName,
        phoneNumber: memberNumber,
        person_id: undefined,
      };
  
      await createPerson(newContact);
      const bond_id = +(localParams.bond_id as string)
      if (bond_id !== -1) {
          addTempBondMember(personID);
      }
    }
  
    return (
      <>
        <View style={styles.centeredView}>
          <ThemedText type="subtitle" style={styles.title}>
            Enter Contact Information
          </ThemedText>
        </View>
  
        <View style={styles.indentedView}>
          <ThemedText style={styles.title}>First Name</ThemedText>
        </View>
  
        <TextInput
          onChangeText={memFirstNameChange}
          value={memberFirstName}
          placeholder="e.g. John"
          style={styles.textInput}
        ></TextInput>
  
        <View style={styles.indentedView}>
          <ThemedText style={styles.title}>Last Name</ThemedText>
        </View>
        <TextInput
          onChangeText={memLastNameChange}
          value={memberLastName}
          placeholder="e.g. Doe"
          style={styles.textInput}
        ></TextInput>
        <View style={styles.indentedView}>
          <ThemedText style={styles.title}>Phone Number</ThemedText>
        </View>
        <TextInput
          onChangeText={memNumberChange}
          value={memberNumber}
          placeholder="e.g. (111)-111-1111"
          keyboardType="numeric"
          style={styles.textInput}
        ></TextInput>
        <View style = {styles.centeredView}>
            <Button
            title="Create Contact"
            onPress={() => {
                if (phoneNumberVerifier(memberNumber.trim())) {
                savePerson();
                memFirstNameChange("")
                memLastNameChange("")
                memNumberChange("")
                const newVisible = !isVisible;
                setIsVisible(newVisible);
                }
            }}
            buttonStyle = {{
                width: 150,
                backgroundColor: "black"
            }}
            />
        </View>
        </>
    );
  }
  