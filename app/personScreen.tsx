/* eslint-disable react/react-in-jsx-scope */
import { ThemedText } from "@/components/ThemedText";
import { Bond, Person, Reminder, formatDate } from "@/constants/types";
import { Card, ListItem, Button } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { JSX, useContext, useEffect, useState } from "react";
import { InTouchContext } from "@/context/InTouchContext";
import { Alert, FlatList, Pressable, View, Linking, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { stackViews, styles } from "@/constants/Stylesheet";
import { DeleteIcon } from "@/components/DeleteIcon";
import { useSQLiteContext } from "expo-sqlite";
import CallTextButton from "@/components/CallTextButton";
import { StandardButton } from "@/components/ButtonStandard";
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
  const db = useSQLiteContext();
  const stackView = stackViews();

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

  const showBonds = (bonds: Bond[]) => {
    const bondList: JSX.Element[] = [];

    bonds.forEach(b => {
      bondList.push(
        <ListItem bottomDivider>
        <Pressable>
          <ListItem.Content id={b.bond_id.toString()}>
            <ListItem.Title>{b.bondName}</ListItem.Title>
          </ListItem.Content>
        </Pressable>
      </ListItem>

      )
    })

    return bondList
  }
  // const renderBonds = ({ item }: { item: Bond }) => {
  //   if (item) {
  //     return (
  //       <ListItem bottomDivider>
  //         <Pressable>
  //           <ListItem.Content id={item.bond_id.toString()}>
  //             <ListItem.Title>{item.bondName}</ListItem.Title>
  //           </ListItem.Content>
  //         </Pressable>
  //       </ListItem>
  //     );
  //   } else {
  //     return <ListItem bottomDivider></ListItem>;
  //   }
  // };

  const showReminders = (reminders: Reminder[]) => {
    const reminderList = [];

    let index = 0;
    for (const reminder of reminders) {
      if (index < 3) {
        if (reminder.person_id && reminder.person_id == person?.person_id) {
          reminderList.push(
            <ListItem bottomDivider>
              <ListItem.Content id={reminder?.reminder_id.toString()}>
                <View style={styles.rowOrientation}>
                  <View style={styles.nameContainer}>
                    <ListItem.Title style={styles.date}>
                      {reminder?.date}
                    </ListItem.Title>
                    <ListItem.Title>{reminder?.reminder}</ListItem.Title>
                  </View>
                </View>
              </ListItem.Content>
              <Pressable
                onPress={() => deleteReminderAlert(reminder.reminder_id)}
                style={styles.touchable}
              >
                <DeleteIcon></DeleteIcon>
              </Pressable>
            </ListItem>
          );
          index++;
        }
      }
    }

    return reminderList;
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
  const sendSMS = async (phoneNumber: string) => {
    const url = `sms:${phoneNumber}`;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.error(e);
      throw new Error("personScreen: sendSMS(): failed");
    }
  };

  return (
    <ScrollView
    contentContainerStyle={stackView} style={{backgroundColor: 'white'}}
  >
    {/* <View style={stackView}> */}
      <View style={styles.centeredView}>
        <ThemedText darkColor="black" style={styles.title} type="title">
          {person?.firstName} {person?.lastName}
        </ThemedText>
      </View>

      <CallTextButton person={person as Person}></CallTextButton>

      <Card containerStyle={{ flex: 1 }}>
        <Card.Title>Phone</Card.Title>
        <Card.Divider></Card.Divider>
        <ThemedText darkColor="black">{person?.phoneNumber}</ThemedText>
      </Card>

      <Card containerStyle={{ flex: 3 }}>
        <Card.Title>Reminders</Card.Title>
        {reminderList != undefined ? (
          showReminders(reminderList)
        ) : (
          <Text>No Reminders Set</Text>
        )}

        <StandardButton
          title="See All Reminders"
          onPress={() => {
            router.navigate({
              pathname: "./reminderBondScreen",
              params: { pid: person?.person_id, personName: `${person?.firstName} ${person?.lastName}` },
            });
          }}
        ></StandardButton>

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
      </Card>

      <Card containerStyle={{ flex: 3 }}>
        <Card.Title>Bonds</Card.Title>
        {
          bonds != undefined?
          showBonds(bonds) :
          <Text>No Bonds Yet!</Text>
        }
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
          onPress={() => deletePerson()}
        />
      </View>
    </ScrollView>
  );
}
