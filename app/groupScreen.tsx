import { ThemedText } from "@/components/ThemedText";
import {
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  View,
  Alert,
} from "react-native";
import { Card, ListItem, Button } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { Bond, Person, Reminder,} from "@/constants/types";
import { router } from "expo-router";
import React from "react";
import { StandardButton } from "@/components/ButtonStandard";
import { useSQLiteContext } from "expo-sqlite";
import { ScheduleContext } from "@/context/ScheduleContext";
import ScheduleCard from "@/components/ScheduleCard";
import { cancelNotificationsForBond } from "@/context/NotificationUtils";
import { DeleteIcon } from "@/components/DeleteIcon";
import { styles } from "@/constants/Stylesheet";
import { sendSMS, getNextToCallUtil, callUtil } from "@/context/PhoneNumberUtils";

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

  useEffect(() => {
    const fetchData = async () => {
    const bondId: number = +(localParams.id as string);
    const bond_index = bondList.findIndex(item => item.bond_id === bondId)
    if (bond_index !== -1) {
      const b: Bond = bondList[bond_index];
      setBond(b);
      const p = getMembersOfBond(b);
      setMembers(p);
      const r = getRemindersOfBond(bondId);
      setReminders(r);
      const n = await getNextToCallUtil(b.bond_id, db)
      setNextToCall(n)
    }
  }

  try {fetchData()
  }
  catch (e) {
    console.error(e);
    console.log("Could not get Next to call")
  }
  }, [bondPersonMap, reminderList, ]);

  const renderMembers = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content id={item.person_id?.toString()}>
        <View style = {styles.rowOrientation}>
          <View style = {styles.nameContainer}>
            <Pressable onPress = {() => {router.navigate({pathname: "./personScreen", params: {id: `${item.person_id}`}})}}>
              <ListItem.Title>
                {item.firstName} {item.lastName}
              </ListItem.Title>
            </Pressable>
          </View>
          <Pressable
            onPress = {() => {deletePersonAlert(item)}}
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
            <View style = {styles.rowOrientation}>
            <View style = {styles.nameContainer}>
              <ListItem.Title style = {styles.date}>
                {item.date}
              </ListItem.Title>
            <ListItem.Title>
              {item.reminder} 
            </ListItem.Title>
            </View>
            </View>
          </ListItem.Content>
          <Pressable
           onPress={() => deleteReminderAlert(item.reminder_id)}
           style={styles.touchable}>
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


  const onDelete = async () => {
    if (bond) {
      await cancelNotificationsForBond(db, bond.bond_id)
      removeBond(bond);
    }
    router.back();

  }

  const deletePersonAlert = (person: Person) => {
    const name = person.firstName + " " + person.lastName
    Alert.alert(`Remove ${name} from ${bond?.bondName}?`, "", [
      {text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',},
      {text: 'OK',
        onPress: () => {if (bond) {removeBondMember(bond, person)}},
        isPreferred: true
      },
    ]);
  }

  const deleteReminderAlert = (reminder_id: number) => {
    Alert.alert(`Delete reminder for ${bond?.bondName}?`, "",[
      {text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',},
      {text: 'OK',
        onPress: () => {if (bond) {deleteReminder(reminder_id)}},
        isPreferred: true
      },
    ]);
 }

  return (
    <SafeAreaView style={styles.stepContainer}>
      <ScrollView nestedScrollEnabled={true}>
        <Card>
          <Card.Title>Name: {bond?.bondName}</Card.Title>
          <Card.Divider></Card.Divider>
          <ThemedText darkColor="black">Number: </ThemedText>
        </Card>
        {bond ? <ScheduleCard bond={bond}></ScheduleCard> : <></>}

        <View style = {styles.centeredView}>
          <ThemedText style = {{
            color: "black",
            marginTop: 10,
            marginBottom: 10
          }}
            >Next to Call {`${nextToCall?.firstName} ${nextToCall?.lastName}`}
          </ThemedText>
          <View style = {{width : 150}}>
            <Button
              title = "Call"

              buttonStyle = {{
                margin: 10,
                backgroundColor: "red",
                borderColor: "black",
                borderWidth: 2,
              }}
              titleStyle = {{
                fontSize: 24,
                fontWeight: 'bold', 
              }}
              onPress = {() => callUtil(nextToCall as Person, db)}
              />
            </View>

            <Pressable
            onPress={() => sendSMS(nextToCall?.phoneNumber.toString() as string)}
            >

            <ThemedText 
            style = {{
              fontSize : 16,
              marginTop: 10,
              color: "black",
              textDecorationLine: "underline",
            }}
            >
              Text
            </ThemedText>
            </Pressable>
        </View>

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
          onPress={onDelete}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
