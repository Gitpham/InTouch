import { View, StyleSheet, TextInput } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bond, Person, Reminder } from "@/constants/types";
import { Button } from "@rneui/themed";
import { useContext, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';import { StandardButton } from '@/components/ButtonStandard';
import { InTouchContext } from '@/context/InTouchContext';
import { Alert } from 'react-native';
;

export default function addReminderModal() {
    const { reminderList, createReminder } = useContext(InTouchContext);   
    const [reminder, setReminder] = useState("")
    const localParams = useLocalSearchParams();
    const person_id = +localParams.person_id;

    const onDonePress = () => {

        if (!reminder) {
            Alert.alert("Please write a reminder")
            return;
        }

        createReminder(person_id, reminder);
        router.back();
    }

    const onCancelPress = () => {
        router.back();
    }



  return (
    <SafeAreaView style = {styles.stepContainer}>
        <View style={styles.centeredView}>
            <ThemedText type="subtitle" style={styles.title}>Set Reminder</ThemedText>
        </View>

        <TextInput
        onChangeText={setReminder}
        value={reminder}
        placeholder="e.g. Ask about Nate's soccer tournament"
        style={{
        height: 320,
        margin: 13,
        borderWidth: 1,
        padding: 10,
        color: "white",
        backgroundColor: "gray",
        }}
        />

        <StandardButton 
        title = "Done"
        onPress = {() => onDonePress()}
        />

        <StandardButton 
        title = "Cancel"
        onPress = {() => onCancelPress()}
        />

  </SafeAreaView>
  );
};

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
    redButton: {
      margin: 10,
      backgroundColor: "white",
      borderColor: "red",
      borderWidth: 2,
    },
    redTitle: {
      color: "red",
    },
    stepContainer: {
      flex: 1,
      backgroundColor: "white",
      gap: 8,
      marginBottom: 8,
      flexDirection: "column",
      paddingTop: 50,
    },
    centeredView: {
      alignItems: "center",
    },
    flatList: {
      height: 200,
    }
  });