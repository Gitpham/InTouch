import { ThemedText } from "@/components/ThemedText";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, TextInput } from "react-native";
import {} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, ListItem } from "@rneui/themed";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { Bond, Person } from "@/constants/types";
import { StandardButton } from "@/components/ButtonStandard";
import { styles } from "@/constants/Stylesheet";
import React from "react";
import { ScheduleContext } from "@/context/ScheduleContext";
import {
  displayPotentialSchedule,
  generateNotificationSchedule,
  getScheduleType,
} from "@/context/ScheduleUtils";
import { useSQLiteContext } from "expo-sqlite";

export default function createGroupScreen() {
  // Data to be stored in record
  const [bondName, groupNameChange] = useState("");
  const {
    createBond,
    generateBondId,
    tempBondMembers,
    clearTempBondMembers,
    createBondMember,
    peopleList,
  } = useContext(InTouchContext);
  const { potentialSchedule, createPotentialSchedule } =
    useContext(ScheduleContext);
  const bondID = generateBondId();
  const db = useSQLiteContext();
  const [schedule, setSchedule] = useState(
    displayPotentialSchedule(potentialSchedule)
  );

  const [hasCreatedSchedule, setHasCreatedSchedule] = useState(false);

  const bondToAdd: Bond = {
    bondName: bondName,
    typeOfCall: "",
    schedule: "",
    bond_id: bondID,
  };

  let title = "Create Group";
  if (bondName) {
    title = bondName;
  }

  useEffect(() => {
    setSchedule(displayPotentialSchedule(potentialSchedule));
    if (potentialSchedule != undefined){
    setHasCreatedSchedule(true)

    }
  }, [potentialSchedule]);

  async function onDonePress() {
    if (!bondName) {
      Alert.alert("Must enter a Bond name");
      return;
    }

    try {
      bondToAdd.schedule = getScheduleType(potentialSchedule);
      await createBond(bondToAdd);
    } catch (e) {
      console.error(e);
      throw Error(
        "createGroupScreen onDonePress(): Error calling createbond()"
      );
    }
    try {
      createBondMember(tempBondMembers, bondID);
    } catch (e) {
      console.error(e);
      throw Error("failed to call createBondMember()");
    }
    clearTempBondMembers();
    generateNotificationSchedule(potentialSchedule, bondToAdd, db);
    createPotentialSchedule(undefined);
    router.push("./(tabs)");
  }

  function onCreateSchedule() {
    router.navigate({
      pathname: "./createScheduleScreen",
      params: { bid: `20`, isFromBondScreen: "false" },
    });
  }

  const renderGroupMembers = ({ item }: { item }) => {
    let personToShow: Person = peopleList[0];

    peopleList.forEach((person: Person) => {
      if (person.person_id === item) {
        personToShow = person;
      }
    });

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

  const renderPotentialSchedule = ({ item }: { item: any }) => {
    return item;
  };

  return (
    <SafeAreaView style={styles.stepContainer}>
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.centeredView}>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
        </View>
        <TextInput
          onChangeText={groupNameChange}
          value={bondName}
          placeholder="Enter Group Name"
          style={styles.textInput}
        ></TextInput>

        <Card>
          <View style={styles.centeredView}>
            <ThemedText type="subtitle" style={styles.title}>
              Members
            </ThemedText>
          </View>
          {tempBondMembers.size > 0 ? (
            <FlatList
              nestedScrollEnabled={true}
              data={[...tempBondMembers]}
              renderItem={renderGroupMembers}
              keyExtractor={(item) => item.toString()}
            />
          ) : (
            <View style={styles.centeredView}>
              <ThemedText darkColor="black">No members set</ThemedText>
            </View>
          )}

          <StandardButton
            title="Add Group Member"
            onPress={() =>
              router.navigate({
                pathname: "./addMemberScreen",
                params: { bond_id: bondID },
              })
            }
          />
        </Card>

        <Card>
        <View style={styles.centeredView}>
          <ThemedText type="subtitle" style={styles.title}>
            Schedule
          </ThemedText>

          <FlatList
            data={[schedule]}
            renderItem={renderPotentialSchedule}
            keyExtractor={(item) => item}
          />
        </View>

          { hasCreatedSchedule ?
            <StandardButton title="Edit Schedule" onPress={onCreateSchedule}></StandardButton> :
            <StandardButton
            title="Create Schedule"
            onPress={onCreateSchedule}
          ></StandardButton>
          


          }
      
        </Card>

            <View style={styles.rowOrientation}>
          
        <StandardButton title="Submit Bond" onPress={onDonePress}/>

        <StandardButton
          title="Cancel"
          onPress={() => {
            clearTempBondMembers();
            createPotentialSchedule(undefined);
            router.back();
          }}
        ></StandardButton>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}
