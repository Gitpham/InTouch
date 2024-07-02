import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import * as SQLite from "expo-sqlite";
import { Person, getAllPersons } from "../db/PersonRepo";
import { useContext, useEffect, useState } from "react";
import { RefreshContactsContext } from "@/context/RefreshContactsContext";
import { router } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { StandardButton } from "@/components/ButtonStandard";

export default function PeopleScreen() {
  const { peopleList } = useContext(InTouchContext);


  const renderContacts = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content id={item.id}>
          <ListItem.Title>
            {item.firstName} {item.lastName}
          </ListItem.Title>
          <ListItem.Title>
            Phone Number: {item.phoneNumber} id: {item.id}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };
  return (
    <SafeAreaView style={styles.stepContainer}>
      <ThemedText type="title"> People Screen </ThemedText>

      <FlatList
        data={peopleList}
        renderItem={renderContacts}
        keyExtractor={(item) => item.id}
      />

      <StandardButton 
       title="Add New Contact"
       onPress={() => router.push("../addMemberScreen")}/>

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
  stepContainer: {
    flex: 1,
    backgroundColor: "white",
    gap: 8,
    marginBottom: 8,
    flexDirection: "column",
    paddingTop: 50,
    justifyContent: "center",
  },
  centeredView: {
    alignItems: "center",
  },
});
