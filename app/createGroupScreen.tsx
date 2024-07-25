import { ThemedText } from "@/components/ThemedText";
import { useContext, useState } from "react";
import { Alert, TextInput } from "react-native";
import {} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { InTouchContext } from "@/context/InTouchContext";
import { Bond } from "@/constants/types";
import { StandardButton } from "@/components/ButtonStandard";
import React from "react";

export default function createGroupScreen() {
  // Data to be stored in record
  const [bondName, groupNameChange] = useState("");
  const {
    createBond,
    generateBondId,
    tempBondMembers,
    clearTempBondMembers,
    createBondMember,
  } = useContext(InTouchContext);

  const bondID = generateBondId();

  const bondToAdd: Bond = {
    bondName: bondName,
    typeOfCall: "",
    schedule: "",
    bond_id: bondID,
  };

  function onDonePress() {
    if (!bondName) {
      Alert.alert("Must enter a Bond name");
      return;
    }
    createBond(bondToAdd);
    try {
      createBondMember(tempBondMembers, bondID);
    } catch (e) {
      console.error(e);
      throw Error("failed to call createBondMember()");
    }
    clearTempBondMembers();
    router.push("./(tabs)");
  }
  let title = "Create Group";
  if (bondName) {
    title = bondName;
  }

  return (
    <SafeAreaView style={styles.stepContainer}>
      <View style={styles.centeredView}>
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
      </View>

      <TextInput
        onChangeText={groupNameChange}
        value={bondName}
        placeholder="Enter Group Name"
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
        title="Add Group Member"
        onPress={() =>
          router.navigate({
            pathname: "./addMemberScreen",
            params: { bond_id: bondID },
          })
        }
        buttonStyle={styles.button}
        titleStyle={styles.title}
      />

      <Button
        title="Done"
        onPress={onDonePress}
        buttonStyle={styles.button}
        titleStyle={styles.title}
      />

      <StandardButton
        title="Cancel"
        onPress={() => {
          clearTempBondMembers();
          router.back();
        }}
      ></StandardButton>
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
  centeredView: {
    alignItems: "center",
  },
});
