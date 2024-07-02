import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet,  Pressable, Alert } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import React, { useContext } from 'react';



export default function greetingScreen() {
  return (
    <>
    <SafeAreaView style = {styles.stepContainer}>
 
    <Link href="./screens/(tabs)" asChild>
    <Pressable>
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