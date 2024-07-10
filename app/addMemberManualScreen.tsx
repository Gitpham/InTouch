import { ThemedText } from "@/components/ThemedText";
import { useContext, useState } from "react";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import { InTouchContext } from "@/context/InTouchContext";
import { Person } from "@/constants/types";

export default function addMemberManualScreen() {
  const router = useRouter();
  const { createPerson } = useContext(InTouchContext);

  // Member information
  const [memberFirstName, memFirstNameChange] = useState("");
  const [memberLastName, memLastNameChange] = useState("");
  const [memberNumber, memNumberChange] = useState("");

  async function savePerson() {
    const newContact: Person = {
      firstName: memberFirstName,
      lastName: memberLastName,
      phoneNumber: memberNumber,
      person_id: -0,
    };

    createPerson(newContact);
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
        style={{
          height: 40,
          margin: 13,
          borderWidth: 1,
          padding: 10,
          color: "white",
          backgroundColor: "gray",
        }}
      ></TextInput>

      <View style={styles.indentedView}>
        <ThemedText style={styles.title}>Last Name</ThemedText>
      </View>
      <TextInput
        onChangeText={memLastNameChange}
        value={memberLastName}
        placeholder="e.g. Doe"
        style={{
          height: 40,
          margin: 13,
          borderWidth: 1,
          padding: 10,
          color: "white",
          backgroundColor: "gray",
        }}
      ></TextInput>
      <View style={styles.indentedView}>
        <ThemedText style={styles.title}>Phone Number</ThemedText>
      </View>
      <TextInput
        onChangeText={memNumberChange}
        value={memberNumber}
        placeholder="e.g. (111)-111-1111"
        keyboardType="numeric"
        style={{
          height: 40,
          margin: 13,
          borderWidth: 1,
          padding: 10,
          color: "white",
          backgroundColor: "gray",
        }}
      ></TextInput>

      <Button
        title="Create Contact"
        onPress={() => {
          savePerson();
          //  router.push('/createGroupModal');
        }}
        buttonStyle={styles.button}
        titleStyle={styles.title}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
  },
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
  indentedView: {
    paddingLeft: 10,
  },
  centeredView: {
    alignItems: "center",
  },
});
