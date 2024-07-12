import { ThemedText } from "@/components/ThemedText";
import { useContext, useState } from "react";
import { Alert, TextInput } from "react-native";
import { } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {  Button, } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { InTouchContext } from "@/context/InTouchContext";
import { Bond } from "@/constants/types";
import { Group } from "expo-contacts";
import { StandardButton } from "@/components/ButtonStandard";

export default function createGroupScreen() {
  // For Bottom Sheet
  const [isVisible, setIsVisible] = useState(false);

  // Data to be stored in record
  const [bondName, groupNameChange] = useState("");
  const { createBond, bondList } = useContext(InTouchContext);

  // Generate unique bond_id
  let bond_id = 0;
  if (bondList.length > 0) {
    bond_id = bondList[bondList.length - 1].bond_id + 1;
  }

  const bondToAdd: Bond = {
    bondName: bondName,
    typeOfCall: "",
    schedule: "",
    bond_id: bond_id,
  };

  function onDonePress() {

    if (!bondName) {
      Alert.alert("Must enter a Bond name")
      return;
    }
    createBond(bondToAdd);
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
        onPress={() => router.navigate({pathname: "./addMemberScreen", params : {bond_id: bond_id}})}
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
      onPress={() => router.back()}
      >
      </StandardButton>


      
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
