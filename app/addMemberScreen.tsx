import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { member, group } from './createGroupModal'
import { useRouter } from 'expo-router';

export default function addMemberScreen() {
    // For navigation
    const router = useRouter();


    return <SafeAreaView>
        <ThemedText darkColor="black">"Add Member"</ThemedText>
        
        <Button 
            title="Enter Contact Manually" 
            onPress={() => {router.push('/addMemberManualScreen');}}
            buttonStyle={styles.button}
            titleStyle={styles.title}
        />
        <Button
            title="Add from Contacts"
            // onPress={addFromContacts}
            buttonStyle={styles.button}
            titleStyle={styles.title}
        />
  </SafeAreaView>
}

const styles = StyleSheet.create({
    button: {
        margin: 10,
        backgroundColor: 'white',
    },
    title: {
        color: "black",
    },
    stepContainer: {
        backgroundColor: 'white',
      }
  });