import { View, TextInput, FlatList } from "react-native";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { StandardButton } from "@/components/ButtonStandard";
import { Alert } from "react-native";
import { styles } from "@/constants/Stylesheet";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { CheckBox, ListItem } from "@rneui/base";
import { Bond, Person, trimName } from "@/constants/types";
import { createReminderUtil } from "@/context/ReminderUtils";
import { useSQLiteContext } from "expo-sqlite";
import { getAllPersons } from "@/assets/db/PersonRepo";
import { getAllBonds } from "@/assets/db/BondRepo";

export default function addReminderModal() {


  const localParams = useLocalSearchParams();
  const db = useSQLiteContext();

  const person_id = localParams.person_id != undefined ? +localParams.person_id : -2;
  const bond_id = localParams.bond_id != undefined ? +localParams.bond_id : -2;
  const reminder_screen = +localParams.reminder_screen == 1 ? true : false

  //--------------STATE VARIABLES--------------
  const [reminder, setReminder] = useState("");
  const [segment, setSegment] = useState("Person");
  const [bid, setBid] = useState(bond_id);
  const [pid, setPid] = useState(person_id);

  //refactoring DB
  const [peopleList, setPeopleList] = useState<Person[]>();
  const [bondList, setBondList] = useState<Bond[]>();

  useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          const pList = await getAllPersons(db)
          setPeopleList(pList);
          const bList = await getAllBonds(db);
          setBondList(bList);
        }
        fetchData();
        console.log("pid: ", pid)
        console.log("bid: ", bid)

      }, [])
    );




  
  const onDonePress = async () => {
    if (!reminder) {
      Alert.alert("Please write a note");
      return;
    }

    if ((bid < 0) && (pid < 0)) {
      Alert.alert("Please choose a bond or person");
      return;
    }

    if (pid > 0) {
      await createReminderUtil(db, reminder, pid, -1);
    } else {
      await createReminderUtil(db, reminder, -1, bid);
    }
    router.back();
  };

  const onCancelPress = () => {
    router.back();
  };

  const onSegmentChange = (value: string) => {
    setSegment(value);
  };

  const renderPeople = ({ item }: { item: Person }) => {
    const name = trimName(item);
    return (
      <ListItem
        bottomDivider
        containerStyle={{ height: 50, justifyContent: "center" }}
      >
        <ListItem.Content id={item.person_id?.toString()}>
          <View style={{ ...styles.rowOrientation, ...styles.nameContainer }}>
            <ListItem.Title>{name}</ListItem.Title>
            <CheckBox
              checked={pid === item.person_id}
              onPress={() => {
                setPid(item.person_id as number);
                setBid(-0);
              }}
              containerStyle={{ margin: 0, padding: 0 }} // Remove extra padding/margin
            />
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  const renderBonds = ({ item }: { item: Bond }) => {
    return (
      <ListItem
        bottomDivider
        containerStyle={{ height: 50, justifyContent: "center" }}
      >
        <ListItem.Content id={item.bond_id?.toString()}>
          <View style={{ ...styles.rowOrientation, ...styles.nameContainer }}>
            <ListItem.Title>{item.bondName}</ListItem.Title>
            <CheckBox
              checked={bid === item.bond_id}
              onPress={() => {
                setPid(-0);
                setBid(item.bond_id);
              }}
              containerStyle={{ margin: 0, padding: 0 }} // Remove extra padding/margin
            />
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <SafeAreaView style={styles.stepContainer}>
      <View style={styles.centeredView}>
        <ThemedText type="subtitle" style={styles.title}>
          Create Note
        </ThemedText>
      </View>

      <TextInput
        onChangeText={setReminder}
        value={reminder}
        placeholder="e.g. Ask about Nate's soccer tournament"
        style={styles.textInput}
      />

      {reminder_screen && (
        <SegmentedControl
          onValueChange={onSegmentChange}
          values={["Person", "Bond"]}
        />
      )}
      {segment === "Person" && reminder_screen && (
        <FlatList
          data={peopleList}
          renderItem={renderPeople}
          keyExtractor={(item) => (item.person_id as number).toString()}
        />
      )}
      {segment === "Bond" && reminder_screen && (
        <FlatList
          data={bondList}
          renderItem={renderBonds}
          keyExtractor={(item) => (item.bond_id as number).toString()}
        />
      )}

      <StandardButton title="Done" onPress={() => onDonePress()} />

      <StandardButton title="Cancel" onPress={() => onCancelPress()} />
    </SafeAreaView>
  );
}
