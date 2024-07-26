import { StyleSheet, } from 'react-native';
import Scheduler from '@/components/Scheduler';
import React from 'react';
import { Text } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function callScreen() {
  return (
    <SafeAreaView>
    <Text>Nothing to show yet</Text>

    </SafeAreaView>

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
