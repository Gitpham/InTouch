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
import { Alert, Linking, Platform } from "react-native";
import { validateAndFormatPhoneNumber } from "@/context/PhoneNumberUtils";
import { BondPerson, Person } from "@/constants/types";
import { getPersonsOfBondDB, updatePersonBond } from "@/assets/db/PersonBondRepo";
import { getPerson } from "@/assets/db/PersonRepo";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


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
            callPerson(response.notification);
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

  const callPerson = async (notification: Notifications.Notification) => {
    const bondID: number = +notification.request.content.data?.bondID;
    const toCall: Person = await getNextToCall(bondID);
    const phoneNumber: string = validateAndFormatPhoneNumber(
      toCall.phoneNumber
    );
    const phoneURL: string = `tel:${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(phoneURL);

    if (canOpen) {
      Linking.openURL(phoneURL);
    } else {
      Alert.alert("could not open url");
    }
  };

  const getNextToCall = async (bondID: number): Promise<Person> => {
    try {
      const members: BondPerson[] = await getPersonsOfBondDB(db, bondID);
      // IF SOMEBODY IS MARKED AND IS NOT END
      for (let i = 0; i < members.length; i++) {
        if (members[i].nextToCall == 1) {
          const persToCall = await getPerson(db, members[i].person_id);
          await updatePersonBond(
            db,
            members[i].person_id,
            members[i].bond_id,
            0
          );

          if (i + 1 < members.length) {
            await updatePersonBond(
              db,
              members[i + 1].person_id,
              members[i + 1].bond_id,
              1
            );
            return persToCall as Person;
          }

          // wraps around
          await updatePersonBond(
            db,
            members[0].person_id,
            members[0].bond_id,
            1
          );
          return persToCall as Person;
        }
      }
      // If there is no member markedd
      const firstToCall: Person = (await getPerson(
        db,
        members[0].person_id
      )) as Person;

      if (members.length == 1) {
        await updatePersonBond(db, members[0].person_id, members[0].bond_id, 1);
        return firstToCall;
      }
      await updatePersonBond(db, members[1].person_id, members[1].bond_id, 1);
      return firstToCall;
    } catch (e) {
      console.error();
      throw new Error(
        "getNextToCallInBond(): failed to call getPersonsOfBondDB"
      );
    }
  };

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
