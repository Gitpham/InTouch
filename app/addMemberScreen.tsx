import { ThemedText } from "@/components/ThemedText";
import { useContext } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Contacts from "expo-contacts";
import { InTouchContext } from "@/context/InTouchContext";
import { StandardButton } from "@/components/ButtonStandard";
import { Person } from "@/constants/types";
import React from "react";

export default function addMemberScreen() {
  const { createPerson, addTempBondMember, generatePersonId , tempBondMembers} = useContext(InTouchContext);
  const localParams = useLocalSearchParams();

  async function importFromContacts() {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === "granted") {
      const person = await Contacts.presentContactPickerAsync();
      if (person) {

        // Generate unique person id
        const personID = generatePersonId();

        const newContact: Person = {
          firstName: person?.firstName as string,
          lastName: person?.lastName as string,
          phoneNumber: person?.phoneNumbers?.[0]?.number as string,
          person_id: personID,
        };
        createPerson(newContact);

        const bond_id = +localParams.bond_id;
        
        if (bond_id !== -1) {
          addTempBondMember(personID);
          }
      } else {
        Alert.alert("unable to add from contacts");
      }
    }
  }

  return (
    <SafeAreaView style={styles.stepContainer}>
      <View style={styles.centeredView}>
        <ThemedText type="subtitle" style={styles.title}>
          Create new contact
        </ThemedText>
      </View>

      <StandardButton
        title="Create Contact Manually"
        onPress={() => {
          router.navigate({pathname: "./addMemberManualScreen", params: {bond_id: localParams.bond_id}});
        }}
      />

      <StandardButton
        title="Import from Contacts"
        onPress={importFromContacts}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "black",
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
});
