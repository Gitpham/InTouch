import { ThemedText } from "@/components/ThemedText";
import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

import { View, Text } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { ListItem, Card, SearchBar } from "@rneui/themed";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as Contacts from "expo-contacts";
import { InTouchContext } from "@/context/InTouchContext";
import { AddButton, StandardButton } from "@/components/ButtonStandard";
import AddMemberManual from "@/components/AddMemberManual";
import { BondPerson, Person } from "@/constants/types";
import { styles } from "@/constants/Stylesheet";
import React from "react";
import ConfirmationMessage from "@/components/ConfirmationMessage";
import { Dialog } from "@rneui/base";
import { validateAndFormatPhoneNumber } from "@/context/PhoneNumberUtils";
import { useSQLiteContext } from "expo-sqlite";
import { addPerson, getAllPersons } from "@/assets/db/PersonRepo";
import { addBondMembers, addPersonBond, getPersonsOfBondDB } from "@/assets/db/PersonBondRepo";

export default function addMemberScreen() {
  const { addTempBondMember, tempBondMembers, clearTempBondMembers } =
    useContext(InTouchContext);

  const [refresh, setRefresh] = useState(false);
  const [memberFirstName, memFirstNameChange] = useState("");
  const [memberLastName, memLastNameChange] = useState("");
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [memberNumber, memNumberChange] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [peopleToShow, setPeopleToShow] = useState<Array<Person>>([]);

  const localParams = useLocalSearchParams();
  const group_screen = +localParams.group_screen === 1 ? true : false;
  const bid = +localParams.bond_id;

  const db = useSQLiteContext();
  // REFACTORED

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const pList = await getAllPersons(db);
        let currBondMembers: BondPerson[];
        if(group_screen){
          currBondMembers = await getPersonsOfBondDB(db, bid);
        }
        const filteredPeople = pList.filter( (p) => {

          if(!group_screen){
            return !tempBondMembers.has(p.person_id as number);
          }

          if(group_screen){
            let isPartOfBond = false;
            currBondMembers.forEach(pers => {
              if(pers.person_id == p.person_id){
                isPartOfBond = true;
              }
            })
            return !isPartOfBond

          }


        });
        console.log("filteredPeople: ", filteredPeople);

    
        setPeopleToShow(filteredPeople);
      };
      // TODO: redo search

      fetchData();
    }, [tempBondMembers, refresh])
  );

  async function importFromContacts() {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === "granted") {
      const person = await Contacts.presentContactPickerAsync();
      if (person) {
        try {
          const phoneNumber = validateAndFormatPhoneNumber(
            person?.phoneNumbers?.[0]?.number as string
          );
          const newContact: Person = {
            firstName: (person?.firstName as string).trim(),
            lastName: (person?.lastName as string).trim(),
            phoneNumber: phoneNumber,
            person_id: undefined,
          };

          await addPerson(db, newContact);
          setRefresh((r) => !r);
        } catch (e) {
          Alert.alert("Phone number is not formatted correctly");
        }
      } else {
        Alert.alert("unable to add from contacts");
      }
    }
  }
  const renderInTouchContacts = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <Pressable
          onPress={async () => {
            addTempBondMember(item.person_id as number);

            let name = item.firstName.trim();
            if (item.lastName) {
              name += " ";
              name += item.lastName.trim();
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

  const onSavePress = async () => {
    if (group_screen) {
        await addBondMembers(db, tempBondMembers, bid);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        {
          // bondId !== -1 &&
          peopleToShow != undefined && peopleToShow != null ? (
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
                data={peopleToShow}
                style={styles.flatList}
                renderItem={renderInTouchContacts}
                keyExtractor={(item) => (item.person_id as number).toString()}
                ListEmptyComponent={
                  <View style={{ justifyContent: "center" }}>
                    <Text style={styles.title}>
                      There is nobody in your inTouch contacts that arent
                      already in your bond!
                    </Text>
                  </View>
                }
              />
            </Card>
          ) : null
        }
        <AddButton
          color={"darkorchid"}
          title="Add New Person Manually"
          onPress={() => {
            const newVisible = !isVisible;
            setIsVisible(newVisible);
          }}
        />

        <Dialog
          overlayStyle={{ backgroundColor: "white" }}
          isVisible={isVisible}
          onBackdropPress={Keyboard.dismiss}
        >
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <AddMemberManual
              memberFirstName={memberFirstName}
              memFirstNameChange={memFirstNameChange}
              memberLastName={memberLastName}
              memLastNameChange={memLastNameChange}
              memberNumber={memberNumber}
              memNumberChange={memNumberChange}
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </View>
        </Dialog>

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
    </TouchableWithoutFeedback>
  );
}
