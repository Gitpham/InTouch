import { Card, ListItem } from "@rneui/base";
import React, { useContext, useEffect, useState } from "react";
import { StandardButton } from "./ButtonStandard";
import { router } from "expo-router";
import { Reminder, Bond, Person } from "@/constants/types";
import { Text } from "@rneui/themed";
import { InTouchContext } from "@/context/InTouchContext";
import { Alert, Pressable, View } from "react-native";
import { styles } from "@/constants/Stylesheet";
import { DeleteIcon } from "./DeleteIcon";

interface ReminderDisplayCardIterface {
  person: Person | undefined;
  bond: Bond | undefined;
}
export default function ReminderDisplayCard({
  person,
  bond,
}: ReminderDisplayCardIterface) {
  const { removeReminder, reminderList, getRemindersOfBond, getRemindersOfPerson } = useContext(InTouchContext);
  const isFromBond: boolean = bond != undefined ? true : false;

  const [remindersForEntity, setRemindersForEntity] = useState<Reminder[]>([])


  useEffect(() => {
    if (isFromBond) {
       setRemindersForEntity(getRemindersOfBond(bond?.bond_id as number))
      } else {
        setRemindersForEntity(getRemindersOfPerson(person?.person_id as number))
      }
  }, [reminderList])

  const onSeeAllReminders = () => {
    if (isFromBond) {
      router.navigate({
        pathname: "./reminderEntityScreen",
        params: { bid: bond?.bond_id, bondName: `${bond?.bondName}` },
      });

      return;
    }
    router.navigate({
      pathname: "./reminderEntityScreen",
      params: { pid: person?.person_id, personName: `${person?.firstName}` },
    });
  };

  const onAddReminder = () => {
    if (isFromBond) {
      router.navigate({
        pathname: "./addReminderModal",
        params: { bond_id: bond?.bond_id, person_id: -1 },
      });
      return;
    }

    router.navigate({
      pathname: "./addReminderModal",
      params: { person_id: person?.person_id, bond_id: -1 },
    });
    return;
  };

  const reminderListItem = (reminder: Reminder) => {
    return (
      <ListItem bottomDivider id={reminder?.reminder_id.toString()}>
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
          onPress={() => deleteReminderAlert(reminder)}
          style={styles.touchable}
        >
          <DeleteIcon></DeleteIcon>
        </Pressable>
      </ListItem>
    );
  };

  const showRemindersForEntity = () => {
    const reminderList = [];
    let index = 0;
      for (const reminder of remindersForEntity) {
        if (index < 3) {
            reminderList.push(reminderListItem(reminder));
            index++;
        }
      }

    if (index == 0) {
      return <Text>No Reminders</Text>;
    }
    return reminderList;
  };

  const deleteReminder = (reminder_id: number) => {
    removeReminder(reminder_id);
  };

  const deleteReminderAlert = (reminder: Reminder) => {

    let alertMessage: string;
    if (isFromBond) {
      alertMessage = `Delete note for ${bond?.bondName.trim()}?`;
    } else {
      let name = person?.firstName.trim() + " "
      if (person?.lastName) {
        name += person.lastName.trim()
      }
      alertMessage = `Delete note for ${name}?`;
    }

    Alert.alert(alertMessage, "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          {
            deleteReminder(reminder.reminder_id);
          }
        },
        isPreferred: true,
      },
    ]);
  };

  return (
    <Card containerStyle={{ flex: 3 }}>
      <Card.Title>Notes</Card.Title>
      <Card.Divider/>


      {remindersForEntity.length != 0 ? (
        showRemindersForEntity()
      ) : (
        <Text style={{alignSelf: 'center'}}>No Notes Created</Text>
      )}

      {
        remindersForEntity.length > 3 ?
        <StandardButton
        title="See All Notes"
        onPress={onSeeAllReminders}
      ></StandardButton> :
      <></>
      }


      <StandardButton title="+Add Note" onPress={onAddReminder} />
    </Card>
  );
}
