import { ThemedText } from "@/components/ThemedText";
import {
  FlatList,
  Pressable,
  ScrollView,
  View,
  Alert,
  Text,
} from "react-native";
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
  getNextToCallUtil,
  callUtil,
} from "@/context/PhoneNumberUtils";
import CallTextButton from "@/components/CallTextButton";
import ReminderDisplayCard from "@/components/ReminderDisplayCard";

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
        const n = await getNextToCallUtil(b.bond_id, db);
        setNextToCall(n);
      }
    };

    try {
      fetchData();
    } catch (e) {
      console.error(e);
      console.log("Could not get Next to call");
    }
  }, [bondPersonMap, reminderList]);

  const renderMembers = (members: Person[]) => {
    const memberList: React.JSX.Element[] = [];
    members.forEach((p) => {
      memberList.push(
        <ListItem bottomDivider>
          <ListItem.Content id={p.person_id?.toString()}>
            <View style={styles.rowOrientation}>
              <View style={styles.nameContainer}>
                <Pressable
                  onPress={() => {
                    router.navigate({
                      pathname: "./personScreen",
                      params: { id: `${p.person_id}` },
                    });
                  }}
                >
                  <ListItem.Title>
                    {p.firstName} {p.lastName}
                  </ListItem.Title>
                </Pressable>
              </View>
              <Pressable
                onPress={() => {
                  deletePersonAlert(p);
                }}
              >
                <DeleteIcon></DeleteIcon>
              </Pressable>
            </View>
          </ListItem.Content>
        </ListItem>
      );
    });

    return memberList;
  };
  const onDelete = async () => {
    if (bond) {
      await cancelNotificationsForBond(db, bond.bond_id);
      removeBond(bond);
    }
    router.back();
  };

  const deletePersonAlert = (person: Person) => {
    let name = person.firstName + " ";
    if (person.lastName) {
      name += person.lastName + " ";
    }
    Alert.alert(`Remove ${name} from ${bond?.bondName}?`, "", [
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
          }
        },
        isPreferred: true,
      },
    ]);
  };



  return (
    <ScrollView
      contentContainerStyle={stackView}
      style={{ backgroundColor: "white" }}
    >
      <View style={styles.centeredView}>
        <ThemedText darkColor="black" style={styles.title} type="title">
          {bond?.bondName}
        </ThemedText>
      </View>
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

      <CallTextButton person={nextToCall as Person}></CallTextButton>

      {bond ? <ScheduleCard bond={bond}></ScheduleCard> : <></>}

      <ReminderDisplayCard
        person={undefined}
        bond={bond}
      />

      <Card containerStyle={{ flex: 2 }}>
        <Card.Title>Members</Card.Title>
        {members != undefined ? (
          renderMembers(members)
        ) : (
          <Text>No Members</Text>
        )}
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
          onPress={onDelete}
        />
      </View>
    </ScrollView>
  );
}
