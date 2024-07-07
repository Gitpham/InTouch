import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import homeScreen from "./(tabs)";
import { SQLiteProvider } from "expo-sqlite";
import { InTouchContextProvider } from "@/context/InTouchContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {

  // const loadData = useCallback(async () => {
  //   try {
  //     const db = await connectToDatabase();
  //     await createTables(db);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // useEffect(() => {
  //   loadData();
  // },[loadData])

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
      <SQLiteProvider databaseName="Test_DataBase_1.db" assetSource={{ assetId: require('./../Test_DataBase_1.db') }}>
      <InTouchContextProvider>

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen
            name="createGroupModal"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="addMemberScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="addMemberManualScreen"
            options={{ headerShown: false }}
          />
        </Stack>
        </InTouchContextProvider>

      </SQLiteProvider>
    </ThemeProvider>
  );
}
