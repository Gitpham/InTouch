import { ThemedText } from "@/components/ThemedText";
import { useContext, useState } from "react";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { InTouchContext } from "@/context/InTouchContext";
import { Person } from "@/constants/types";
import { styles } from "@/constants/Stylesheet"
import { StandardButton } from "@/components/ButtonStandard";
import { phoneNumberVerifier } from "@/context/PhoneNumberUtils";

export default function addMemberManualScreen() {
  const router = useRouter();
  const { createPerson, generatePersonId, addTempBondMember } = useContext(InTouchContext);
  const localParams = useLocalSearchParams();

  // Member information
  const [memberFirstName, memFirstNameChange] = useState("");
  const [memberLastName, memLastNameChange] = useState("");
  const [memberNumber, memNumberChange] = useState("");

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

    router.back();
  }

  return (
    <SafeAreaView style={styles.stepContainer}>
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

      <StandardButton
        title="Create Contact"
        onPress={() => {
          if (phoneNumberVerifier(memberNumber.trim())) {
          savePerson();
          }
        }}
      />

    </SafeAreaView>
  );
}
