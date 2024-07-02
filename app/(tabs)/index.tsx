import { ThemedText } from "@/components/ThemedText";
import React, { useState, useEffect, useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, Dialog, ListItem } from '@rneui/themed';
import { StyleSheet, View, FlatList} from 'react-native';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { groupList } from '../createGroupModal'
import { connectToDatabase } from "../db/db";
import { Bond, getAllBonds } from "../db/BondRepo";
import { InTouchContext } from "@/context/InTouchContext";


export default function homeScreen() {
    const [groupList, setGroupList] = useState<Bond[]>();
    const {bondList} = useContext(InTouchContext);

  const renderBonds = ({item}: {item: Bond}) => {
    return  (
      <ListItem bottomDivider>
    <ListItem.Content id ={item.id} >
    <ListItem.Title>{item.bondName} </ListItem.Title>
    </ListItem.Content>
  </ListItem>
  )
}



    // useEffect(() => {
    //   (async () => {
    //     try {
    //       const db = await connectToDatabase();
    //       const groups: Bond[] = await getAllBonds(db);
    //       setGroupList(groups);
    //     } catch (e) {
    //       console.error(e);
    //       console.log("failed to load bonds", e);
    //     }
    //   })();
    // })

    return <SafeAreaView style = {styles.stepContainer}>
        <View style = {styles.centeredView}><ThemedText style = {styles.title} type = "title">My Groups</ThemedText></View>
     
        <FlatList
        data={bondList}
        renderItem={renderBonds}
        keyExtractor={(item) => item.id}
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