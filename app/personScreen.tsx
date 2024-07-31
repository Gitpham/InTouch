/* eslint-disable react/react-in-jsx-scope */
import { ThemedText } from "@/components/ThemedText";
import { Bond, Person, Reminder, formatDate } from "@/constants/types";
import { Card, ListItem, Button } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { InTouchContext } from "@/context/InTouchContext";
import {
  Alert,
  FlatList,
  Pressable,

  ScrollView ,

  View,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/Stylesheet";
import { DeleteIcon } from "@/components/DeleteIcon";

export default function PersonScreen() {
  const {
    peopleList,
    getBondsOfPerson,
    removePerson,
    reminderList,
    getRemindersOfPerson,
    removeReminder,
  } = useContext(InTouchContext);
  const localParams = useLocalSearchParams();
  const [person, setPerson] = useState<Person>();
  const [bonds, setBonds] = useState<Array<Bond>>();
  const [reminders, setReminders] = useState<Array<Reminder>>();

  useEffect(() => {
    const personId: number = Number(localParams.id);
    let person_index = peopleList.findIndex(
      (item) => item.person_id === personId
    );
    if (person_index !== -1) {
      const p: Person = peopleList[person_index];
      setPerson(p);
      const b = getBondsOfPerson(p);
      setBonds(b);
      const r = getRemindersOfPerson(personId);
      setReminders(r);
    }
  }, [reminderList]);

  // Rendering functions for flatlists
  const renderBonds = ({ item }: { item: Bond }) => {
    if (item) {
      return (
        <ListItem bottomDivider>
          <Pressable>
            <ListItem.Content id={item.bond_id.toString()}>
              <ListItem.Title>{item.bondName}</ListItem.Title>
            </ListItem.Content>
          </Pressable>
        </ListItem>
      );
    } else {
      return <ListItem bottomDivider></ListItem>;
    }
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

  // Delete functions
  const deletePerson = () => {
    if (person) {
      removePerson(person);
    }
    router.back();
  };

  const deleteReminder = (reminder_id: number) => {
    removeReminder(reminder_id);
  };

  const deleteReminderAlert = (reminder_id: number) => {
    const name = person?.firstName + " " + person?.lastName;
    Alert.alert(`Delete reminder for ${name}?`, "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          if (person) {
            deleteReminder(reminder_id);
          }
        },
        isPreferred: true,
      },
    ]);
  };

  // For texting and calling user
  const sendSMS = (phoneNumber: string) => {
    const url = `sms:${phoneNumber}`;
    Linking.openURL(url).catch((err) => console.error("Error:", err));
  };

  return (
    <ScrollView nestedScrollEnabled={true} style={{backgroundColor: "white"}} >

    <View style={styles.stepContainer}>
      <View style={styles.centeredView}>
        <ThemedText darkColor="black" style={styles.title} type="title">
          {person?.firstName} {person?.lastName}
        </ThemedText>
      </View>

      <View style={styles.centeredView}>
        <View style={{ width: 150 }}>
          <Button
            title="Call"
            buttonStyle={{
              margin: 10,
              backgroundColor: "red",
              borderColor: "black",
              borderWidth: 2,
            }}
            titleStyle={{
              fontSize: 24,
              fontWeight: "bold",
            }}
            onPress={() => console.log("SUIII")}
          />
        </View>

        <Pressable
          onPress={() => sendSMS(person?.phoneNumber.toString() as string)}
        >
          <ThemedText
            style={{
              fontSize: 16,
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
        <Card.Title>
          Phone
        </Card.Title>
        <Card.Divider></Card.Divider>
        <ThemedText darkColor="black">{person?.phoneNumber}</ThemedText>
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
            params: { person_id: person?.person_id, bond_id: -1 },
          })
        }
      />

      <Card>
        <Card.Title>Groups</Card.Title>
        <FlatList
          data={bonds}
          renderItem={renderBonds}
          keyExtractor={(item) => item.bond_id.toString()}
        />
      </Card>

      <Button
        title="Delete"
        buttonStyle={styles.redButton}
        titleStyle={styles.redTitle}
        onPress={() => deletePerson()}
      />
    </View>
    </ScrollView>

  );
}
