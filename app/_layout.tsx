import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";
import { InTouchContextProvider } from "@/context/InTouchContext";
// import { loadDB } from "@/assets/db/db";
import React from "react";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const loadDB = async () => {
  const dbName = "Test_DataBase_5.db";
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dbAsset = require("../assets/Test_DataBase_5.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  try {
    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    if (!fileInfo.exists) {
      console.log("open new db");

      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite`,
        { intermediates: true }
      );
      await FileSystem.downloadAsync(dbUri, dbFilePath);
    }
  } catch (e) {
    console.error(e);
    console.log("failed to get filepath");
  }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  let dbHasLoaded = false;

  useEffect(() => {
    if (!dbHasLoaded) {
      const load=  async () => {
        await loadDB();
      };
      load()

      dbHasLoaded = true;
    }
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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SQLiteProvider
        databaseName="Test_DataBase_5.db"
        // assetSource={{ assetId: require("../assets/InTouchDB_1.db") }}
      >
        <InTouchContextProvider>
          <Stack
          // screenOptions={{ headerShown: false }}
          >
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
          </Stack>
        </InTouchContextProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
