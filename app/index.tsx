
import {Button, Pressable, View} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { styles } from "@/constants/Stylesheet"
import { hasViewedTutorial, setTutorialViewed } from '@/context/AsyncStorageUtils';
import { StandardButton } from '@/components/ButtonStandard';



export default function greetingScreen() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const checkTutorial = async () => {
      const viewedTutorial = await hasViewedTutorial();
      setShowTutorial(!viewedTutorial);
    };
    checkTutorial();
  }, []);

  const handleFinishTutorial = async () => {
    await setTutorialViewed();
    setShowTutorial(false);
  };

  if (showTutorial) {
    return (
      <SafeAreaView style={styles.stepContainer}>
        <View style = {{flex: 1, justifyContent: 'center'}}>
        <View style = {styles.centeredView}>
        <ThemedText type= "title" style = {{color: "black", marginTop: 30, marginBottom: 30}}>
          Welcome to inTouch! 
        </ThemedText>
        <ThemedText type="subtitle" style = {{color: "black", margin: 10, marginBottom: 30, textAlign: "center"}}>
         Stay in touch with friends and family. Here is a quick overview to get you started!
        </ThemedText>
        </View>
        <View style = {{margin: 15}}>
        <ThemedText style = {{color: "black", marginBottom: 10, fontWeight: 'bold', textAlign: "center"}}>
          With inTouch you will be able to:
        </ThemedText>
        <ThemedText style = {{color: "black", marginBottom: 10, fontWeight: 'bold',}}>
          1. Create a bond with one or more members.
        </ThemedText>
        <ThemedText style = {{color: "black", marginBottom: 10, fontWeight: 'bold',}}>
          2. Setup a schedule to call or text the members of your bond.
        </ThemedText>
        <ThemedText style = {{color: "black", marginBottom: 10, fontWeight: 'bold',}}>
          3. Write personalized reminders for upcoming calls.
        </ThemedText>
        <ThemedText style = {{color: "black", marginBottom: 10, fontWeight: 'bold',}}>
          4. And maintain important relationships!
        </ThemedText >
        <ThemedText style = {{color: "black", marginBottom: 10, fontWeight: 'bold',}}>
          4.5. Win gems for Clash of Clans.
        </ThemedText>
        </View>
        </View>
        <StandardButton title="Get Started!" onPress={handleFinishTutorial} />
      </SafeAreaView>
    );
  }

  
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