import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, Dialog, ListItem } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';


export default function homeScreen() {

    return <SafeAreaView style = {styles.stepContainer}>
        <View style = {styles.centeredView}><ThemedText style = {styles.title} type = "title">My Groups</ThemedText></View>

        <Button buttonStyle = {styles.button}
        titleStyle = {styles.title}
        title = {"+Add Group"}
        onPress = {() => router.push("./createGroupModal")}
        />

    </SafeAreaView>

}

const styles= StyleSheet.create({
    button: {
      margin: 10,
      backgroundColor: 'white',
      borderColor: 'black',
      borderWidth: 2, 
    },
    title: {
      color: "black",
   },
    stepContainer: {
      flex: 1,
      backgroundColor: 'white',
      gap: 8,
      marginBottom: 8,
      flexDirection: 'column',
      paddingTop: 50
    },
    centeredView : {
      alignItems: "center"
    }
  });