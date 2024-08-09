import { ThemedText } from "@/components/ThemedText";
import {
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
import { Bond,  Person, Reminder, trimName } from "@/constants/types";
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
  getNextToCallUtil,
} from "@/context/PhoneNumberUtils";
import CallTextButton from "@/components/CallTextButton";
import DeleteMessage from "@/components/DeleteMessage";
import ReminderDisplayCard from "@/components/ReminderDisplayCard";

export default function groupScreen() {
  const {
    removeBondMember,
    bondList,
    getMembersOfBond,
    removeBond,
    bondPersonMap,
    getRemindersOfBond,
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
        let n = await displayNextToCall(b.bond_id, db);
        if (!n) {
          n = await getNextToCallUtil(b.bond_id, db);
        }
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

  const deletePersonAlert = (person: Person) => {

    let name = person.firstName.trim() + " ";
    if (person.lastName) {
      name += person.lastName.trim() + " ";
    }

    // If last member, delete whole group
    if (members.length === 1) {
      Alert.alert(`Warning! Removing ${name} will delete ${bond?.bondName.trim()} entirely`,"", [
      { 
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          if (bond) {
            onDelete();
          }
        }
      }
      ]);
    }
    else {
      Alert.alert(`Remove ${name} from ${bond?.bondName.trim()}?`, "", [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            if (bond) {
              removeBondMember(bond, person);
              // Display delete message
              const name = trimName(person);
              setName(name as string);
              setDeleteVisible(true);
              setTimeout(() => setDeleteVisible(false), 100);
            }
          },
          isPreferred: true,
        },
      ]);
    };
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
          Next to Call {`${trimName(nextToCall as Person)}`}
        </ThemedText>
      </View>
      <DeleteMessage message = {`Removed ${name} from ${bond?.bondName}`} show = {isDeleteVisible}/>

      <CallTextButton person={nextToCall as Person}></CallTextButton>

      {bond ? <ScheduleCard bond={bond}></ScheduleCard> : <></>}

      {bond ? <ReminderDisplayCard person={undefined} bond={bond} /> : <></>}

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
          onPress={() => onDeleteAlert()}
        />
      </View>
    </ScrollView>
  );
}
