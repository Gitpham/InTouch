import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {  StrictMode, useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";
import { InTouchContextProvider } from "@/context/InTouchContext";
import React from "react";
import * as SQLite from 'expo-sqlite';
import { createDB, getTableNames } from "@/assets/db/db";
import { ScheduleContextProvider } from "@/context/ScheduleContext";
import { Platform, AppState } from "react-native";
import { callPersonUtil,  } from "@/context/PhoneNumberUtils";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// type CallContextType = {
//   callLength: MutableRefObject<number>;
// }
// export const CallContext = createContext<CallContextType>({
//   callLength: number;
// });



export default function RootLayout() {

  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  let db: SQLite.SQLiteDatabase;

  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  //TRACKING CALL VARIABLES
  const appState = useRef(AppState.currentState);
  // const isCalling = useRef(false);
  // const changeIsCalling = (bool: boolean) => {
  //   isCalling.current = bool;
  // }

  const recievedCallNotification = useRef(false);
  const isCallingFromNotification = useRef(false);

  const isCallingFromNotificationWhileOnApp = useRef(false);

  const timeOfStartCall = useRef<Date>();
  const timeOfEndCall = useRef<Date>();
  const callLength = useRef<number>(0);



  useEffect(() => {
    // INITIALIZE DB
    const initDB = async () => {
      db = await SQLite.openDatabaseAsync("July26_ScheduleTable_5.db");
      await db.execAsync('PRAGMA foreign_keys = ON');
      await createDB(db);
      console.log(getTableNames(db))

    };

    try {
      initDB();     
      console.log("init db()")
    } catch (e) {
      console.error(e);
      console.log("failed to initDB()")
    }


    // INITIALIZE NOTIFICAITON HANDLERS
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
            recievedCallNotification.current = true;
          } catch (e) {
            console.error(e);
            throw Error("failed to navigate away");
          }
        }
      );

    // INITIALIZE APP STATE HANDLERS
    const subscription = AppState.addEventListener('change', nextAppState => {

      //USER RECIEVES NOTIFICATION WHILE AWAY FROM APP
      if (
        (appState.current.match(/background/)) &&
        (recievedCallNotification.current == true) &&
        (nextAppState === 'active')
      ) {
        recievedCallNotification.current = false;
        isCallingFromNotification.current = true;

        timeOfStartCall.current = new Date();
        console.log('started call from notification!');
        return;
      }
     
      if (
        (appState.current.match(/background/)) &&
        (isCallingFromNotification.current == true) &&
        (nextAppState === 'active')
      ) {
        isCallingFromNotification.current = false;

        console.log('Ended Call from notification!');

        timeOfEndCall.current = new Date();
        callLength.current = ((timeOfEndCall.current as Date).getTime() - (timeOfStartCall.current as Date).getTime()) / 1000;
        console.log("length of call: ", callLength)
        return;
      }

      //USER RECEIVES NOTIICATION WHILE ON APP

      if (
        (appState.current.match(/active|inactive/)) &&
        (recievedCallNotification.current == true) &&
        (nextAppState === 'background')
      ) {
        recievedCallNotification.current = false;
        isCallingFromNotificationWhileOnApp.current = true;
        timeOfStartCall.current = new Date();

        console.log('started call from notification while on app!');
        return;
      }

      if (
        (appState.current.match(/background|inactive/)) &&
        (isCallingFromNotificationWhileOnApp.current == true) &&
        (nextAppState === 'active')
      ) {
        isCallingFromNotificationWhileOnApp.current = false;
        console.log('Ended Call from notification while on app!');
        timeOfEndCall.current = new Date();
        callLength.current = ((timeOfEndCall.current as Date).getTime() - (timeOfStartCall.current as Date).getTime()) / 1000;
        console.log("length of call: ", callLength)
        return;
      }
      appState.current = nextAppState;
      console.log("appState: " , appState.current)

    });


    return () => {
      subscription.remove();
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <StrictMode>

    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* <CallContext.Provider value={{
        changeIsCalling,
        callLength,
      }}> */}
      <SQLiteProvider databaseName="July26_ScheduleTable_2.db">
        <ScheduleContextProvider>
        <InTouchContextProvider>
          <Stack screenOptions={{
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: 'white', 
        },

        
        }}>
            <Stack.Screen name="index" options={{ headerShown: false  }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="createGroupScreen"
              options={{ headerBackTitle: "home", headerTitle: "" }}
            />
            <Stack.Screen
              name="groupScreen"
              options={{headerTitle: "" , headerBackTitleVisible: false , }}
            />
            <Stack.Screen
              name="addMemberScreen"
              options={{ headerTitle: "", headerBackTitleVisible: false }}
            />
     
            <Stack.Screen
              name="personScreen"
              options={{ headerTitle: "", headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="createScheduleScreen"
              options={{  headerTitle: "Schedule", headerTitleStyle: {color: "black", fontSize: "30"}}}
            />
            <Stack.Screen
              name="addReminderModal"
              options={{ headerTitle: "Add Notes", presentation: "modal"}}
            />
            <Stack.Screen
              name="reminderEntityScreen"
              options={{ headerTitle: "", headerBackTitleVisible: false }}
            />

          </Stack>
        </InTouchContextProvider>
        </ScheduleContextProvider>
      </SQLiteProvider>
      {/* </CallContext.Provider> */}
    </ThemeProvider>
    </StrictMode>

  );
}
