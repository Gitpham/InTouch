import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Image, StyleSheet, Platform, Button, Touchable, Pressable, Alert } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { connectToDatabase, createTables, getTableNames, removeTable } from '../db/db';
import { SQLiteDatabase } from 'expo-sqlite';


export default function HomeScreen() {

  // connectToDatabase();

  const loadData = useCallback(async () => {
    try {
      const db =  await connectToDatabase();
      createTables(db)
      let tables = await getTableNames(db)
      console.log(tables)

      // await removeTable(db, "person");
      // tables = await getTableNames(db)
      // console.log(tables)


    } catch (error){
      console.error(error)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])




  function testButton() {
    Alert.alert("Test Button Pressed!")
  }

  const drawerLayout = () => {
    return <GestureHandlerRootView>
      <Drawer></Drawer>
    </GestureHandlerRootView>

  }

  return (
    <>
    <SafeAreaView style = {styles.stepContainer}>
    <Link href="../createGroupModal" asChild>
    <Pressable >
        <ThemedText type="title" darkColor="black" >Get in Touch</ThemedText>
     </Pressable>
    </Link>
    </SafeAreaView>
     {/* {drawerLayout()} */}
     </>

    
  )
}





const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    flex: 1,
    backgroundColor: 'white',
    gap: 8,
    marginBottom: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  testButton: {
    color: 'red'
  }
});