import { ThemedText } from "@/components/ThemedText";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {  ListItem } from "@rneui/themed";
import {  View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Contacts from "expo-contacts";
import { InTouchContext } from "@/context/InTouchContext";
import { StandardButton } from "@/components/ButtonStandard";
import AddMemberManual from "@/components/AddMemberManual";
import { Person } from "@/constants/types";
import { styles } from "@/constants/Stylesheet"
import React from "react";

export default function addMemberScreen() {
  const { createPerson, addTempBondMember, generatePersonId , tempBondMembers, peopleList, bondPersonMap, createBondMember, clearTempBondMembers } = useContext(InTouchContext);
  const [ refresh, setRefresh] = useState(false)
  const [memberFirstName, memFirstNameChange] = useState("");
  const [memberLastName, memLastNameChange] = useState("");
  const [memberNumber, memNumberChange] = useState("");
  const [bondId, setBondID] = useState<number>(-1);
  const [isVisible, setIsVisible] = useState(false);
  const [membersToShow, setMembersToShow] = useState<Array<Person>>()
  
  const localParams = useLocalSearchParams();

  useEffect(() => {
    setBondID(+localParams.bond_id);

    const peopleToShow = peopleList.filter((p) => {
      if (!tempBondMembers.has(p.person_id as number)) {
        const bond_members = bondPersonMap.get(+localParams.bond_id);
        if (!bond_members) {
          return p;
        }

        else if (!bond_members.has(p.person_id as number)) {
          return p;
        }

        else {
          return null;
        }
      }
    });

    console.log(peopleToShow)
    setMembersToShow(peopleToShow)
  }, [, tempBondMembers, peopleList]);
  
  const group_screen = +localParams.group_screen;

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
          person_id: undefined,
        };
        await createPerson(newContact);
        
        if (bondId !== -1) {
          console.log("addTBondMember")
          addTempBondMember(personID);
          }
      } else {
        Alert.alert("unable to add from contacts");
      }
    }
  }
  const addBondMember = ({ item }: { item: Person }) => {
    // if (!tempBondMembers.has(item.person_id as number)) {
    //   const bond_members = bondPersonMap.get(bondId);
    //   if (bond_members && bond_members.has(item.person_id as number)) {
    //     return null;
    //   }
      return (
        <ListItem bottomDivider>
          <Pressable onPress={() => { addTempBondMember(item.person_id as number); setRefresh((oldValue) => !oldValue); }}>
            <ListItem.Content id={item.person_id?.toString()}>
              <ListItem.Title>
                {item.firstName} {item.lastName}
              </ListItem.Title>
              <ListItem.Title>
                Phone Number: {item.phoneNumber} id: {item.person_id?.toString()}
              </ListItem.Title>
            </ListItem.Content>
          </Pressable>
        </ListItem>
      );
  };

  const onDonePress = () => {
    if (group_screen === 1) {
      createBondMember(tempBondMembers, bondId);
    }
    clearTempBondMembers();
    router.back()
  }


  return (
    <SafeAreaView style={styles.stepContainer}>
      <ScrollView nestedScrollEnabled={true}>
      <View style = {styles.centeredView}>
        <ThemedText type = "title" style = {styles.title}>Add Member</ThemedText>
      </View>
      <StandardButton
        title="Create New Contact"
        onPress={() => {
          // router.navigate({pathname: "./addMemberManualScreen", params: {bond_id: localParams.bond_id}});
          const newVisible = !isVisible;
          setIsVisible(newVisible);
          console.log(membersToShow)
        }}
      />
      
      {isVisible && 
      <View style = {{paddingTop: 10, paddingBottom: 10, borderColor: "black", borderWidth: 2, borderRadius: 10}}>
        <AddMemberManual
        memberFirstName={memberFirstName}
        memFirstNameChange={memFirstNameChange}
        memberLastName={memberLastName}
        memLastNameChange={memLastNameChange}
        memberNumber={memberNumber}
        memNumberChange={memNumberChange}
        bondId={bondId}
        setBondID={setBondID}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      </View>}

      <StandardButton
        title="Import from Contacts"
        onPress={importFromContacts}
      />

      <View style={styles.centeredView}>
        {((bondId !== -1) && (peopleList.length !== 0)) ?  (
        <>
        <ThemedText type="subtitle" style={styles.title}>
          Choose From inTouch Contacts
        </ThemedText>
      
      <FlatList
        data={membersToShow}
        style = {styles.flatList}
        renderItem={addBondMember}
        keyExtractor={(item) => item.person_id.toString()}
      />
      </>) :  null}
      </View>

      <StandardButton
        title="Save"
        onPress={() => onDonePress()}
      />

      <StandardButton
        title="Cancel"
        onPress={() => router.back()}

      /> 
      </ScrollView>
      </SafeAreaView>
  );
}
