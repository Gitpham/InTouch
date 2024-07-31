import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StandardButton } from "@/components/ButtonStandard";
import { getAllSchedules, getScheduleOfBond } from "@/assets/db/ScheduleRepo";
import { useSQLiteContext } from "expo-sqlite";
import { cancelAllNotifications, getAllScheduledNotifications } from "@/context/NotificationUtils";

export default function statScreen() {
  const db = useSQLiteContext();

  async function onDisplaySchedules() {
    const s = await getAllSchedules(db)
    console.log("schedules in db: ", s);
  }

  async function onDisplayNotifications() {
    console.log("getAllScheduledNotifications(): " , getAllScheduledNotifications())
  }


  async function clearScheduledNotifications() {
    await cancelAllNotifications()
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Nothing Here Yet</Text>
        <StandardButton title="Display Schedules from DB" onPress={onDisplaySchedules}></StandardButton>
        <StandardButton title="Display scheudleNotificaions" onPress={onDisplayNotifications}></StandardButton>
        <StandardButton title="cancel all Notifications" onPress={clearScheduledNotifications}></StandardButton>


      </View>
    </SafeAreaView>
  );
}
