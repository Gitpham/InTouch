import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StandardButton } from "@/components/ButtonStandard";
import { getAllSchedules, getScheduleOfBond } from "@/assets/db/ScheduleRepo";
import { useSQLiteContext } from "expo-sqlite";

export default function statScreen() {
  const db = useSQLiteContext();

  async function onDisplaySchedules() {
    const s = await getAllSchedules(db)
    console.log(s);
  }


  return (
    <SafeAreaView>
      <View>
        <Text>Nothing Here Yet</Text>
        <StandardButton title="Display Schedules from DB" onPress={onDisplaySchedules}></StandardButton>
      </View>
    </SafeAreaView>
  );
}
