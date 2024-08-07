import { ThemedText } from "@/components/ThemedText";
import { FlatList, Pressable, ScrollView, View, Alert } from "react-native";
import { Card, ListItem, Button } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { InTouchContext } from "@/context/InTouchContext";
import { Bond, Person, Reminder } from "@/constants/types";
import { router } from "expo-router";
import React from "react";
import { StandardButton } from "@/components/ButtonStandard";
import { useSQLiteContext } from "expo-sqlite";
import ScheduleCard from "@/components/ScheduleCard";
import { cancelNotificationsForBond } from "@/context/NotificationUtils";
import { DeleteIcon } from "@/components/DeleteIcon";
import { stackViews, styles } from "@/constants/Stylesheet";
import {
  sendSMS,
  displayNextToCall,
  callUtil,
} from "@/context/PhoneNumberUtils";
import CallTextButton from "@/components/CallTextButton";
import DeleteMessage from "@/components/DeleteMessage";

export default function groupScreen() {
  const {
    removeBondMember,
    bondList,
    getMembersOfBond,
    removeBond,
    bondPersonMap,
    getRemindersOfBond,
    removeReminder,
    reminderList,
  } = useContext(InTouchContext);
  const localParams = useLocalSearchParams();
  const [bond, setBond] = useState<Bond>();
  const [members, setMembers] = useState<Array<Person>>();
  const [reminders, setReminders] = useState<Array<Reminder>>();
  const [nextToCall, setNextToCall] = useState<Person>();
  const [isDeleteVisible, setDeleteVisible] = useState(false)
  const [name, setName] = useState("")
  const db = useSQLiteContext();
  const stackView = stackViews();

  useEffect(() => {
    const fetchData = async () => {
      const bondId: number = +(localParams.id as string);
      const bond_index = bondList.findIndex((item) => item.bond_id === bondId);
      if (bond_index !== -1) {
        const b: Bond = bondList[bond_index];
        setBond(b);
        const p = getMembersOfBond(b);
        setMembers(p);
        const r = getRemindersOfBond(bondId);
        setReminders(r);
        const n = await displayNextToCall(b.bond_id, db);
        setNextToCall(n);
      }
    };

    try {
      fetchData();
    } catch (e) {
      console.error(e);
      console.log("Could not get Next to call");
    }
  }, [bondPersonMap, reminderList, bondList]);

  const renderMembers = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content id={item.person_id?.toString()}>
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
            <Pressable
              onPress={() => {
                deletePersonAlert(item);
              }}
            >
              <DeleteIcon></DeleteIcon>
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
            <View style={styles.rowOrientation}>
              <View style={styles.nameContainer}>
                <ListItem.Title style={styles.date}>{item.date}</ListItem.Title>
                <ListItem.Title>{item.reminder}</ListItem.Title>
              </View>
            </View>
          </ListItem.Content>
          <Pressable
            onPress={() => deleteReminderAlert(item.reminder_id)}
            style={styles.touchable}
          >
            <DeleteIcon></DeleteIcon>
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

  const onDeleteAlert = () => {
    Alert.alert(`Delete ${bond?.bondName} from your bonds?`, "This will delete all associated reminders and schedule",
     [{
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => onDelete(),
        isPreferred: true,
      },
    ]);
  }


  const onDelete = async () => {
    if (bond) {
      await cancelNotificationsForBond(db, bond.bond_id);
      removeBond(bond);
    }
    router.back();
  };

  const deletePersonAlert = (person: Person) => {
    let name = person.firstName.trim() + " ";
    if (person.lastName) {
      name += person.lastName + " ";
    }
    Alert.alert(`Remove ${name} from ${bond?.bondName.trim()}?`, "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          if (bond) {
            removeBondMember(bond, person);
            let name = person.firstName.trim();
            if (person.lastName) {
              name += " ";
              name += person.lastName.trim();
            }
            setName(name);
            setDeleteVisible(true);
            setTimeout(() => setDeleteVisible(false), 100);
          }
        },
        isPreferred: true,
      },
    ]);
  };

  const deleteReminderAlert = (reminder_id: number) => {
    Alert.alert(`Delete reminder for ${bond?.bondName.trim()}?`, "", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          if (bond) {
            deleteReminder(reminder_id);
          }
        },
        isPreferred: true,
      },
    ]);
  };

  return (
    <View style={stackView}>
      <View style={styles.centeredView}>
        <ThemedText darkColor="black" style={styles.title} type="title">
          {bond?.bondName}
        </ThemedText>
      </View>
      <DeleteMessage message = {`Removed ${name} from ${bond?.bondName}`} show = {isDeleteVisible}/>

      <CallTextButton person={nextToCall as Person}></CallTextButton>

      {bond ? <ScheduleCard bond={bond}></ScheduleCard> : <></>}
      <View style={styles.centeredView}>
        <ThemedText
          style={{
            color: "black",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          Next to Call {`${nextToCall?.firstName} ${nextToCall?.lastName}`}
        </ThemedText>
       
      </View>

      <Card>
        <Card.Title>Reminders</Card.Title>
        <FlatList
          data={reminders}
          renderItem={renderReminders}
          keyExtractor={(item) => item.reminder_id.toString()}
        />

        <StandardButton
          title="+Add Reminder"
          onPress={() =>
            router.navigate({
              pathname: "./addReminderModal",
              params: { person_id: -1, bond_id: bond.bond_id },
            })
          }
        />
      </Card>

      <Card containerStyle={{ flex: 2 }}>
        <Card.Title>Members</Card.Title>
        <FlatList
          nestedScrollEnabled={true}
          style={{ height: "50%" }}
          data={members}
          renderItem={renderMembers}
          keyExtractor={(item) => item.person_id.toString()}
        />
        <StandardButton
          title="+Add Member"
          onPress={() => {
            router.navigate({
              pathname: "./addMemberScreen",
              params: { bond_id: bond.bond_id, group_screen: 1 },
            });
          }}
        />
      </Card>
      <View
        style={{
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          title="Delete"
          buttonStyle={{
            margin: 10,
            backgroundColor: "white",
            borderColor: "red",
            borderWidth: 2,
          }}
          titleStyle={styles.redTitle}
          onPress={() => onDeleteAlert()}
        />
      </View>
    </View>
  );
}
