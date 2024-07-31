import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {  useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";
import { InTouchContextProvider } from "@/context/InTouchContext";
import React from "react";
import * as SQLite from 'expo-sqlite';
import { createDB } from "@/assets/db/db";
import { ScheduleContextProvider } from "@/context/ScheduleContext";
import { Platform } from "react-native";
import { callPersonUtil, } from "@/context/PhoneNumberUtils";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function RootLayout() {

  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  let db: SQLite.SQLiteDatabase;


  useEffect(() => {
    const initDB = async () => {
      db = await SQLite.openDatabaseAsync("July26_ScheduleTable_2.db");
      createDB(db);
    };
    try {
      initDB();
    } catch (e) {
      console.error(e);
      console.log("failed to initDB()")
    }

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });
    }

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log("Recieved Response!")
          try {
            callPersonUtil(response.notification, db)
          } catch (e) {
            console.error(e);
            throw Error("failed to navigate away");
          }
        }
      );

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
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
          <Stack screenOptions={{headerStyle: {
          backgroundColor: 'white',
        },}}>
            <Stack.Screen name="index" options={{ headerShown: false  }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="createGroupScreen"
              options={{ headerBackTitle: "home", headerTitle: "" }}
            />
            <Stack.Screen
              name="groupScreen"
              options={{headerTitle: "" , headerBackTitleVisible: false}}
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
              options={{ headerTitle: "" }}
            />
            <Stack.Screen
              name="createScheduleScreen"
              options={{ headerTitle: ""}}
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
