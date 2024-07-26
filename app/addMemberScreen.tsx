import { ThemedText } from "@/components/ThemedText";
import { useContext, useState } from "react";
import { Alert, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ListItem } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Contacts from "expo-contacts";
import { InTouchContext } from "@/context/InTouchContext";
import { StandardButton } from "@/components/ButtonStandard";
import { Person } from "@/constants/types";
import React from "react";

export default function addMemberScreen() {
  const { createPerson, addTempBondMember, generatePersonId , tempBondMembers, peopleList, bondPersonMap, createBondMember } = useContext(InTouchContext);
  const [refresh, setRefresh] = useState(false)
  const localParams = useLocalSearchParams();
  const tempBondID = +localParams.bond_id;
  const group_screen = +localParams.group_screen;

  async function importFromContacts() {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === "granted") {
      const person = await Contacts.presentContactPickerAsync();
      console.log("Person: ", person)
      console.log("firstName: ", person?.firstName)
      if (person) {

        // Generate unique person id
        const personID = generatePersonId();

        const newContact: Person = {
          firstName: person?.firstName as string,
          lastName: person?.lastName as string,
          phoneNumber: person?.phoneNumbers?.[0]?.number as string,
          person_id: undefined,
        };
        await createPerson(newContact);
        
        if (tempBondID !== -1) {
          console.log("addTBondMember")
          addTempBondMember(personID);
          }
      } else {
        Alert.alert("unable to add from contacts");
      }
    }
  }

  const addBondMember = ({ item }: { item: Person }) => {
    if (!tempBondMembers.has(item.person_id)) {
      const bond_members = bondPersonMap.get(tempBondID);
      if (bond_members) {
        if (bond_members.has(item.person_id)) {
          return null;
        }
      }
      return (
        <ListItem bottomDivider>
          <Pressable onPress={() => {addTempBondMember(item.person_id); setRefresh((oldValue) => {return !oldValue})}}>
          <ListItem.Content id={item.person_id.toString()}>
            <ListItem.Title>
              {item.firstName} {item.lastName}
            </ListItem.Title>
            <ListItem.Title>
              Phone Number: {item.phoneNumber} id: {item.person_id.toString()}
            </ListItem.Title>
          </ListItem.Content>
          </Pressable>

        </ListItem>
    );}
  };

  const onDonePress = () => {
    if (group_screen === 1) {
      createBondMember(tempBondMembers, tempBondID);
    }
    router.back()
  }


  return (
    <SafeAreaView style={styles.stepContainer}>
      <View style={styles.centeredView}>
        {(tempBondID !== -1) ?  (
        <>
        <ThemedText type="subtitle" style={styles.title}>
          Choose From inTouch Contacts
        </ThemedText>
      
      <FlatList
        data={peopleList}
        style = {styles.flatList}
        renderItem={addBondMember}
        keyExtractor={(item) => item.person_id.toString()}
      />
      </>) :  null}
      </View>


      <StandardButton
        title="Create Contact Manually"
        onPress={() => {
          router.navigate({pathname: "./addMemberManualScreen", params: {tempBondID: localParams.tempBondID}});
        }}
      />

      <StandardButton
        title="Import from Contacts"
        onPress={importFromContacts}
      />

      <StandardButton
        title="Done"
        onPress={() => onDonePress()}
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
  flatList: {
    height: 200,
  }
});
