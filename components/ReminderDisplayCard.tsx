import { Card, ListItem } from "@rneui/base";
import React, { useCallback,  useState } from "react";
import { StandardButton } from "./ButtonStandard";
import { router, useFocusEffect } from "expo-router";
import { Reminder} from "@/constants/types";
import { Text } from "@rneui/themed";
import { Alert, Pressable, View } from "react-native";
import { styles } from "@/constants/Stylesheet";
import { DeleteIcon } from "./DeleteIcon";
import { useSQLiteContext } from "expo-sqlite";
import { deleteReminder, getRemindersOfBondDB, getRemindersOfPersonDB } from "@/assets/db/ReminderRepo";

interface ReminderDisplayCardIterface {
  pid: number;
  bid: number;
}
export default function ReminderDisplayCard({
  pid,
  bid,
}: ReminderDisplayCardIterface) {

  const isFromBond: boolean = bid != undefined ? true : false;

  const db = useSQLiteContext();

  const [reminderList, setReminderList] = useState<Reminder[]>([])

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        let rList: Reminder[]
        if(bid){
          rList = await getRemindersOfBondDB(db, bid);
        } else if (pid) {
          rList = await getRemindersOfPersonDB(db, pid);
        } else {
          throw Error("reminderDisplayCard: failed to get reminders from db")
        }
        setReminderList(rList);
      };
      fetchData();
    }, [])
  );


  
  const onSeeAllReminders = () => {
    if (isFromBond) {
      router.navigate({
        pathname: "./reminderEntityScreen",
        params: { bid: bid },
      });

      return;
    }
    router.navigate({
      pathname: "./reminderEntityScreen",
      params: { pid: pid },
    });
  };

  const onAddReminder = () => {
    if (isFromBond) {
      router.navigate({
        pathname: "./addReminderModal",
        params: { bond_id: bid, person_id: -1, reminder_screen: -1},
      });
      return;
    }

    router.navigate({
      pathname: "./addReminderModal",
      params: { person_id: pid, bond_id: -1, reminder_screen: -1},
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

  const showreminderList = () => {
    const displayList = [];
    let index = 0;
      for (const reminder of reminderList) {
        if (index < 3) {
            displayList.push(reminderListItem(reminder));
            index++;
        }
      }

    if (index == 0) {
      return <Text>No Reminders</Text>;
    }
    return displayList;
  };

  const removeReminder = async (rid: number) => {

    await deleteReminder(db, rid )
    const updatedReminderList = reminderList.filter(r => {
      return r.reminder_id != rid;
    })
    setReminderList(updatedReminderList);

  };

  const deleteReminderAlert = (reminder: Reminder) => {

   
    const name = reminder.owner;
    const alertMessage = `Delete note for ${name}?`;
  
    Alert.alert(alertMessage, "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          {
            await removeReminder(reminder.reminder_id!);
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


      {reminderList.length != 0 ? (
        showreminderList()
      ) : (
        <Text style={{alignSelf: 'center'}}>No Notes Created</Text>
      )}

      {
        reminderList.length > 3 ?
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
