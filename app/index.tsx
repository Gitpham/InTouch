import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet,  Pressable, Alert } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import React from 'react';
import { styles } from "@/constants/Stylesheet"



export default function greetingScreen() {
  return (
    <>
    <SafeAreaView style = {styles.homeContainer}>
 
    <Link href="./(tabs)" asChild>
    <Pressable>
        <ThemedText type="title" darkColor="black" >Get in Touch</ThemedText>
     </Pressable>
    </Link>
   
    </SafeAreaView>
     </>

    
  )
}