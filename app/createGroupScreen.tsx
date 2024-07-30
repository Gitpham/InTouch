import { ThemedText } from "@/components/ThemedText";
import { useContext, useState, useEffect } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {  Button, ListItem, } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { Bond, Person } from "@/constants/types";
import { StandardButton } from "@/components/ButtonStandard";
import { styles } from "@/constants/Stylesheet";
import React from "react";

export default function createGroupScreen() {
  // Data to be stored in record
  const [bondName, groupNameChange] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { createBond, generateBondId, tempBondMembers, clearTempBondMembers, createBondMember, peopleList } = useContext(InTouchContext);

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
        createBondMember(tempBondMembers, bondID)
      } catch (e) {
        console.error(e);
        throw Error ("failed to call createBondMember()")
      }
    clearTempBondMembers();
    router.push("./(tabs)");
  }
  let title = "Create Group";
  if (bondName) {
    title = bondName;
  }

  const renderGroupMembers = ({ item }: { item: number }) => {
    let personToShow: Person = peopleList[0];
    peopleList.forEach((person: Person) => {
      if (person.person_id === item) {
        personToShow = person;

    }
  })
  return (
    <ListItem bottomDivider>
      <ListItem.Content id={item.toString()}>
        <ListItem.Title>
          {personToShow.firstName} {personToShow.lastName}
        </ListItem.Title>
        <ListItem.Title>
          Phone Number: {personToShow.phoneNumber} id: {item}
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
  };


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
        style = {styles.textInput}
      ></TextInput>
      <View style={styles.centeredView}>
      <ThemedText type="subtitle" style={styles.title}>
          Members
      </ThemedText>

      </View>
      <FlatList
        data={([...tempBondMembers])}
        renderItem={renderGroupMembers}
        keyExtractor={(item) => item.toString()}
      />

      <StandardButton
        title="Add Group Member"
        onPress={() =>
          router.navigate({
            pathname: "./addMemberScreen",
            params: { bond_id: bondID },
          })
        }
      />

      <StandardButton
        title="Done"
        onPress={onDonePress}
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