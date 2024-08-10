import { ThemedText } from "@/components/ThemedText";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, TextInput } from "react-native";
import {} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, ListItem } from "@rneui/themed";
import { View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { Bond, Person } from "@/constants/types";
import { StandardButton } from "@/components/ButtonStandard";
import { stackViews, styles } from "@/constants/Stylesheet";
import React from "react";
import { ScheduleContext } from "@/context/ScheduleContext";
import {
  displayPotentialSchedule,
  generateNotificationSchedule,
  getScheduleType,
} from "@/context/ScheduleUtils";
import { useSQLiteContext } from "expo-sqlite";
import { updatePersonBond } from "@/assets/db/PersonBondRepo";
import { allowsNotificationsAsync, requestNotificationPermission } from "@/context/NotificationUtils";

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
  const stackView = stackViews();
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

  let title = "Create Bond";
  if (bondName) {
    title = bondName;
  }

  useEffect(() => {
    const initNotifications = async ()  => {
      const allowsNotificaitons = await allowsNotificationsAsync()
      console.log("allowsNotifications: ", allowsNotificaitons)
      if (!allowsNotificaitons ){
        console.log("should request permission")
        await requestNotificationPermission();
      }

    }
    initNotifications();
    setSchedule(displayPotentialSchedule(potentialSchedule));
    if (potentialSchedule != undefined) {
      setHasCreatedSchedule(true);
    }
  }, [potentialSchedule]);

  async function onDonePress() {
    if (!bondName) {
      Alert.alert("Invalid Bond", "Please enter a name for this bond");
      return;
    }

    if (tempBondMembers.size === 0) {
      Alert.alert("Invalid Bond", "Bond must have at least one member");
      return;
    }

    if (!potentialSchedule) {
      Alert.alert("Invalid Bond", "Please choose a schedule");
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
      const nextToCall = tempBondMembers.values().next().value;
      await updatePersonBond(db, nextToCall, bondID, 1)
    } catch (e) {
      console.error(e);
      throw Error("failed to call createBondMember()");
    }
    generateNotificationSchedule(potentialSchedule, bondToAdd, db);
    createPotentialSchedule(undefined);
    router.push("./(tabs)");
    clearTempBondMembers();
  }

  function onCreateSchedule() {
    router.navigate({
      pathname: "./createScheduleScreen",
      params: { bid: `20`, isFromBondScreen: "false" },
    });
  }

  const showTempBondMembers = (tempBondMembers: Set<number>) => {
    const bondMemberList: React.JSX.Element[] = [];
    let personToShow: Person = peopleList[0];
    peopleList.forEach((person: Person) => {
      if (tempBondMembers.has(person.person_id as number)) {
        personToShow = person;
        bondMemberList.push(
          <ListItem bottomDivider>
            <ListItem.Content id={person.person_id?.toString()}>
              <ListItem.Title>
                {personToShow.firstName} {personToShow.lastName}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        );
      }
    });
    return bondMemberList;
  };

  return (
    <ScrollView
      contentContainerStyle={stackView}
      style={{ backgroundColor: "white" }}
    >
      {/* <SafeAreaView style={styles.stepContainer}> */}
      <View style={styles.centeredView}>
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
      </View>

      <TextInput
        containerStyle={{}}
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
          showTempBondMembers(tempBondMembers)
        ) : (
          <Text>No Members Yet</Text>
        )}
        <StandardButton
          title="Add Bond Member"
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

          {schedule != undefined ? schedule : <Text>No Schedule Set</Text>}

        </View>

        {hasCreatedSchedule ? (
          <StandardButton
            title="Edit Schedule"
            onPress={onCreateSchedule}
          ></StandardButton>
        ) : (
          <StandardButton
            title="Create Schedule"
            onPress={onCreateSchedule}
          ></StandardButton>
        )}
      </Card>

      <View style={styles.btnOrientation}>
        <StandardButton title="Submit Bond" onPress={onDonePress} />

        <StandardButton
          title="Cancel"
          onPress={() => {
            clearTempBondMembers();
            createPotentialSchedule(undefined);
            router.back();
          }}
        ></StandardButton>
      </View>
      {/* </SafeAreaView> */}
    </ScrollView>
  );
}
