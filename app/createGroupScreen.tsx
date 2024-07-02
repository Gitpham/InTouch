import { ThemedText } from "@/components/ThemedText";
import { useContext, useState } from "react";
import { Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, Dialog, ListItem } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Person } from "./db/PersonRepo";
import { Bond } from "./db/BondRepo";
import { InTouchContext } from "@/context/InTouchContext";

export const groupList: Group[] = [];

export const group: Bond = {
  bondName: "",
  schedule: "",
  typeOfCall: "",
  id: "",
};



export default function createGroupScreen() {
  // For Bottom Sheet
  const [isVisible, setIsVisible] = useState(false);

  // Data to be stored in record
  const [bondName, groupNameChange] = useState("");
  const { createBond } = useContext(InTouchContext);

  function onDonePress() {
    const bondToAdd: Bond = {
      bondName: bondName,
      typeOfCall: "",
      schedule: "",
      id: "",
    };
    createBond(bondToAdd);
    router.push("./(tabs)");
  }

  return (
    <SafeAreaView style={styles.stepContainer}>
      <View style={styles.centeredView}>
        <ThemedText type="title" style={styles.title}>
          {" "}
          Create Group{" "}
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
        onPress={() => router.push("./addMemberScreen")}
        buttonStyle={styles.button}
        titleStyle={styles.title}
      />

      <Button
        title="Done"
        onPress={onDonePress}
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
  centeredView: {
    alignItems: "center",
  },
});
