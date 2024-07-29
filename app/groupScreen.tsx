import { ThemedText } from "@/components/ThemedText";
import {
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Card, ListItem, Button } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { Bond, Person, Reminder, Schedule_DB } from "@/constants/types";
import { router } from "expo-router";
import React from "react";
import { StandardButton } from "@/components/ButtonStandard";
import { getScheduleOfBond } from "@/assets/db/ScheduleRepo";
import { useSQLiteContext } from "expo-sqlite";
import { deleteScheduleOfBond, displayPotentialSchedule, displaySchedule } from "@/context/ScheduleUtils";
import { ScheduleContext } from "@/context/ScheduleContext";

export default function groupScreen() {
  const {
    bondList,
    getMembersOfBond,
    removeBond,
    bondPersonMap,
    getRemindersOfBond,
    removeReminder,
    reminderList,
  } = useContext(InTouchContext);
  const {potentialSchedule} = useContext(ScheduleContext)
  const localParams = useLocalSearchParams();
  const [bond, setBond] = useState<Bond>();
  const [members, setMembers] = useState<Array<Person>>();
  const [reminders, setReminders] = useState<Array<Reminder>>();
  const [schedule, setSchedule] = useState<Schedule_DB[]>([]);
  const [scheduleIsModified, setScheduleIsModified] = useState(false);
  const db = useSQLiteContext();

  useEffect(() => {
    const bondId: number = +localParams.id;
    let bond_index = bondList.findIndex((item) => item.bond_id === bondId);
    if (bond_index !== -1) {
      const b: Bond = bondList[bond_index];
      setBond(b);
      const p = getMembersOfBond(b);
      setMembers(p);
      const r = getRemindersOfBond(bondId);
      setReminders(r);

      const getSchedule = async () => {
        const s = await getScheduleOfBond(db, bondId);
        console.log("got schedule", s);
        setSchedule(s);
      };
      getSchedule();
    }
  }, [bondPersonMap, reminderList]);

  const renderMembers = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content id={item.person_id.toString()}>
          <View style={styles.rowOrientation}>
            <View style={styles.nameContainer}>
              <Pressable
                onPress={() => {
                  router.navigate({
                    pathname: "./personScreen",
                    params: { id: `${item.person_id}` },
                  });
                }}
              >
                <ListItem.Title>
                  {item.firstName} {item.lastName}
                </ListItem.Title>
              </Pressable>
            </View>
            <Pressable onPress={() => console.log("delete!")}>
              <ThemedText>Delete</ThemedText>
            </Pressable>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  const renderReminders = ({ item }: { item: Reminder }) => {
    if (item) {
      return (
        <ListItem bottomDivider>
          <ListItem.Content id={item.reminder_id.toString()}>
            <ListItem.Title>{item.date + " - " + item.reminder}</ListItem.Title>
          </ListItem.Content>
          <Pressable
            onPress={() => deleteReminder(item.reminder_id)}
            style={styles.touchable}
          >
            <ThemedText>Delete</ThemedText>
          </Pressable>
        </ListItem>
      );
    } else {
      return <ListItem bottomDivider></ListItem>;
    }
  };

  const deleteReminder = (reminder_id: number) => {
    removeReminder(reminder_id);
  };

  const deleteBond = () => {
    if (bond) {
      removeBond(bond);
    }
    router.back();
  };


  function showSchedule(){
    if (!scheduleIsModified){
      schedule[0] ?
           schedule.forEach(s => {
            show.push(displaySchedule(s))
           })
           : <></>
    }

    if (scheduleIsModified) {
      return (displayPotentialSchedule(potentialSchedule));
    }
    const show: (React.JSX.Element | undefined)[] = [];

    return show;
  }

  async function onCancelSchedule(){
    await deleteScheduleOfBond(db, bond?.bond_id as number);
    setSchedule([])
  }

  async function onModifySchedule() {
    router.navigate({pathname: "./createScheduleScreen", params: {id: `${bond?.bond_id}`}})
    setScheduleIsModified(true);
  }



  return (
    <SafeAreaView style={styles.stepContainer}>
      <ScrollView nestedScrollEnabled={true}>
        <Card>
          <Card.Title>Name: {bond?.bondName}</Card.Title>
          <Card.Divider></Card.Divider>
          <ThemedText>Number: </ThemedText>
        </Card>

        <Card>
          <Card.Title>Schedule</Card.Title>
          <Card.Divider></Card.Divider>
          <ThemedText>Type of Schedule: {bond?.schedule} </ThemedText>
          <ThemedText>{showSchedule()}</ThemedText>
          <StandardButton title="Cancel Schedule" onPress={onCancelSchedule}></StandardButton>
          <StandardButton title="Modify Schedule" onPress={onModifySchedule}></StandardButton>
        </Card>

        <Card>
          <Card.Title>Reminders</Card.Title>
          <FlatList
            data={reminders}
            renderItem={renderReminders}
            keyExtractor={(item) => item.reminder_id.toString()}
          />
        </Card>

        <Button
          title="+Add Reminder"
          buttonStyle={styles.button}
          titleStyle={styles.title}
          onPress={() =>
            router.navigate({
              pathname: "./addReminderModal",
              params: { person_id: -1, bond_id: bond.bond_id },
            })
          }
        />

        <Card>
          <Card.Title>Members</Card.Title>
          <FlatList
            nestedScrollEnabled={true}
            style={styles.flatList}
            data={members}
            renderItem={renderMembers}
            keyExtractor={(item) => item.person_id.toString()}
          />
        </Card>

        <StandardButton
          title="+Add Member"
          onPress={() => {
            router.navigate({
              pathname: "./addMemberScreen",
              params: { bond_id: bond.bond_id, group_screen: 1 },
            });
          }}
        />

        <Button
          title="Delete"
          buttonStyle={styles.redButton}
          titleStyle={styles.redTitle}
          onPress={() => deleteBond()}
        />
      </ScrollView>
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
  redButton: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 2,
  },
  redTitle: {
    color: "red",
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
  },
  rowOrientation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameContainer: {
    flex: 1,
    marginRight: 10, // Adds space between delete button and name
  },
  touchable: {
    padding: 10,
  },
});
