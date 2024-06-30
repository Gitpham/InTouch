import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, Dialog, ListItem } from '@rneui/themed';
import { StyleSheet, View, FlatList} from 'react-native';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { groupList } from '../createGroupModal'


export default function homeScreen() {

    return <SafeAreaView style = {styles.stepContainer}>
        <View style = {styles.centeredView}><ThemedText style = {styles.title} type = "title">My Groups</ThemedText></View>
        <FlatList data = {groupList}
          renderItem = {({item}) => <ListItem bottomDivider><ListItem.Title>{item.name}</ListItem.Title></ListItem>}
        />
        <Button buttonStyle = {styles.button}
        titleStyle = {styles.title}
        title = {"+Add Group"}
        onPress = {() => router.push("../createGroupModal")}
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
    items: {
      color: "black",
      margin: 25
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