import { ThemedText } from "@/components/ThemedText";
import { Alert, FlatList, Pressable } from "react-native";

import { View, Text } from "react-native";
import { useContext, useEffect, useState } from "react";
import { ListItem, Card, SearchBar } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import * as Contacts from "expo-contacts";
import { InTouchContext } from "@/context/InTouchContext";
import { AddButton, StandardButton } from "@/components/ButtonStandard";
import AddMemberManual from "@/components/AddMemberManual";
import { Person } from "@/constants/types";
import { stackViews, styles } from "@/constants/Stylesheet";
import React from "react";
import ConfirmationMessage from "@/components/ConfirmationMessage";

export default function addMemberScreen() {
  const {
    createPerson,
    addTempBondMember,
    tempBondMembers,
    peopleList,
    bondPersonMap,
    createBondMember,
    clearTempBondMembers,
  } = useContext(InTouchContext);
  const [refresh, setRefresh] = useState(false);
  const [memberFirstName, memFirstNameChange] = useState("");
  const [memberLastName, memLastNameChange] = useState("");
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [memberNumber, memNumberChange] = useState("");
  const [bondId, setBondID] = useState<number>(-1);
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [membersToShow, setMembersToShow] = useState<Array<Person>>([]);

  const localParams = useLocalSearchParams();
  const group_screen = +localParams.group_screen;

  useEffect(() => {
    setBondID(+localParams.bond_id);

    let peopleToShow = peopleList.filter((p) => {
      if (!tempBondMembers.has(p.person_id as number)) {
        const bond_members = bondPersonMap.get(+localParams.bond_id);
        if (!bond_members) {
          return p;
        } else if (!bond_members.has(p.person_id as number)) {
          return p;
        } else {
          return null;
        }
      }
    });

    if (search !== "") {
      peopleToShow = membersToShow.filter((p) => {
        let name = p.firstName;
        if (p.lastName) {
          name += " ";
          name += p.lastName;
        }

        if (name.toLowerCase().includes(search.toLowerCase())) {
          return p;
        } else {
          return null;
        }
      });
    }
    setMembersToShow(peopleToShow);
  }, [tempBondMembers, peopleList, search]);

  async function importFromContacts() {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === "granted") {
      const person = await Contacts.presentContactPickerAsync();
      if (person) {
        // Generate unique person id
        const newContact: Person = {
          firstName: person?.firstName as string,
          lastName: person?.lastName as string,
          phoneNumber: person?.phoneNumbers?.[0]?.number as string,
          person_id: undefined,
        };
        await createPerson(newContact);
      } else {
        Alert.alert("unable to add from contacts");
      }
    }
  }
  const renderInTouchContacts = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <Pressable
          onPress={() => {
            addTempBondMember(item.person_id as number);
            setRefresh((oldValue) => !oldValue);

            let name = item.firstName.trim();
            if (item.lastName) {
              name += " ";
              name += item.lastName;
            }
            setName(name);
            setConfirmationVisible(true);
            setTimeout(() => setConfirmationVisible(false), 100);
          }}
        >
          <ListItem.Content id={item.person_id?.toString()}>
            <ListItem.Title>
              {item.firstName} {item.lastName}
            </ListItem.Title>
          </ListItem.Content>
        </Pressable>
      </ListItem>
    );
  };

  const onSavePress = () => {
    if (group_screen === 1) {
      createBondMember(tempBondMembers, bondId);
      clearTempBondMembers();
    }
    router.back();
  };

  const onCancelPress = () => {
    router.back();
    clearTempBondMembers();
  };

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.centeredView}>
        <ThemedText type="title" style={styles.title}>
          Add Member
        </ThemedText>
      </View>

      <ConfirmationMessage
        message={`Added ${name}`}
        show={isConfirmationVisible}
      />
      {bondId !== -1 && peopleList.length !== 0 ? (
        <Card containerStyle={{ borderColor: "darkorchid" }}>
          <Card.Title>Choose From inTouch Contacts</Card.Title>

          <SearchBar
            placeholder="Search inTouch Contacts"
            onChangeText={updateSearch}
            value={search}
            containerStyle={{
              height: 50,
              width: 300,
              backgroundColor: "lightsteelblue",
              borderRadius: 10,
            }} // Adjust outer container height
            inputContainerStyle={{
              height: 30,
              width: 280,
              backgroundColor: "lightsteelblue",
            }} // Adjust input container height
            inputStyle={{ fontSize: 14, color: "black" }} // Adjust font size
          />
          <FlatList
            data={membersToShow}
            style={styles.flatList}
            renderItem={renderInTouchContacts}
            keyExtractor={(item) => (item.person_id as number).toString()}
            ListEmptyComponent={
            <View style={{justifyContent: 'center'}}>
           <Text style={styles.title}>There is nobody in your inTouch contacts that arent already in your bond!</Text>  
            </View>
            }
          />
        </Card>
      ) : null}
      <AddButton
        color={"darkorchid"}
        title="Add New Person Manually"
        onPress={() => {
          const newVisible = !isVisible;
          setIsVisible(newVisible);
        }}
      />

      {isVisible && (
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            borderColor: "black",
            borderWidth: 2,
            borderRadius: 10,
          }}
        >
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
        </View>
      )}

      <AddButton
        color={"darkorchid"}
        title="Import Person from Contacts"
        onPress={importFromContacts}
      />

      <View style={styles.btnOrientation}>
        <StandardButton title="Save" onPress={() => onSavePress()} />

        <StandardButton title="Cancel" onPress={onCancelPress} />
      </View>
    </View>
  );
}
