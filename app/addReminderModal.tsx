import { View,  TextInput } from 'react-native';
import {router } from 'expo-router';
import React from 'react';
import { useContext,  useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';import { StandardButton } from '@/components/ButtonStandard';
import { InTouchContext } from '@/context/InTouchContext';
import { Alert } from 'react-native';
import { styles } from "@/constants/Stylesheet"

export default function addReminderModal() {
    const { reminderList, createReminder } = useContext(InTouchContext);   
    const [reminder, setReminder] = useState("")
    const localParams = useLocalSearchParams();
    const person_id = +localParams.person_id;
    const bond_id = +localParams.bond_id;

    const onDonePress = () => {

        if (!reminder) {
            Alert.alert("Please write a note")
            return;
        }

        createReminder(reminder, person_id, bond_id)
        router.back();
    }

    const onCancelPress = () => {
        router.back();
    }



  return (
    <SafeAreaView style = {styles.stepContainer}>
        <View style={styles.centeredView}>
            <ThemedText type="subtitle" style={styles.title}>Create Note</ThemedText>
        </View>

        <TextInput
        onChangeText={setReminder}
        value={reminder}
        placeholder="e.g. Ask about Nate's soccer tournament"
        style= {styles.textInput}
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