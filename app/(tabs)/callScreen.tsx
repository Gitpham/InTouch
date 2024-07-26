import { StyleSheet, View,} from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import { SafeAreaView } from 'react-native-safe-area-context';
import Scheduler from '@/components/Scheduler';
import React from 'react';
import { router, usePathname, useRouter } from 'expo-router';
import { StandardButton } from '@/components/ButtonStandard';

export default function callScreen() {
  const currPath = usePathname();
  return (

      <Scheduler></Scheduler>

  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
  },
  title: {
    color: "black",
  },
  stepContainer: {
    flex: 1,
    backgroundColor: "white",
    gap: 8,
    marginBottom: 8,
    flexDirection: "column",
    paddingTop: 50,
    justifyContent: "center",
  },
  centeredView: {
    alignItems: "center",
  }})
