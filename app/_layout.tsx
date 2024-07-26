import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {  useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import { SQLiteProvider } from "expo-sqlite";
import { InTouchContextProvider } from "@/context/InTouchContext";
import React from "react";
import * as SQLite from 'expo-sqlite';
import { createDB } from "@/assets/db/db";
import { ScheduleContextProvider } from "@/context/ScheduleContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {

  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {


    const initDB = async () => {
      const db = await SQLite.openDatabaseAsync("July26_ScheduleTable_2.db");
      createDB(db);
    };

    try {
      initDB();

    } catch (e) {
      console.error(e);
      console.log("failed to initDB()")
    }
  });

  useEffect(() => {

   
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="July26_ScheduleTable_2.db">
        <ScheduleContextProvider>

        <InTouchContextProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="createGroupScreen"
              options={{ headerBackTitle: "home", headerTitle: "" }}
            />
            <Stack.Screen
              name="addMemberScreen"
              options={{ headerTitle: "" }}
            />
            <Stack.Screen
              name="addMemberManualScreen"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="personScreen"
              options={{ headerTitle: "Person" }}
            />
            <Stack.Screen
              name="addReminderModal"
              options={{ headerTitle: "Add Reminders", presentation: "modal"}}
            />
          </Stack>
        </InTouchContextProvider>
        </ScheduleContextProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
