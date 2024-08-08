import { View,  TextInput, FlatList } from 'react-native';
import {router } from 'expo-router';
import React from 'react';
import { useContext,  useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';import { StandardButton } from '@/components/ButtonStandard';
import { InTouchContext } from '@/context/InTouchContext';
import { Alert } from 'react-native';
import { styles } from "@/constants/Stylesheet"
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { CheckBox, ListItem } from '@rneui/base';
import { Bond, Person } from '@/constants/types';

export default function addReminderModal() {
    const { reminderList, createReminder, peopleList, bondList } = useContext(InTouchContext);   
    const [reminder, setReminder] = useState("")
    const [ segment, setSegment ] = useState("Person")
    const localParams = useLocalSearchParams();
    let person_id = +localParams.person_id;
    let bond_id = +localParams.bond_id;

    const [ bond, setBond ] = useState(-1)
    const [ person, setPerson ] = useState(-1)
    const onDonePress = () => {

        if (!reminder) {
            Alert.alert("Please write a reminder");
            return;
        }

        if (!bond_id && !person_id) {
            Alert.alert("Please choose a bond or person");
            return;
        }

        createReminder(reminder, person_id, bond_id)
        router.back();
    }

    const onCancelPress = () => {
        router.back();
    }

    const onSegmentChange = (value: string) => {
        setSegment(value)
    }

    const renderPeople = ({ item }: { item: Person }) => {
        return (
          <ListItem bottomDivider>
    
            <ListItem.Content id={item.person_id?.toString()}>
            <View style = {styles.rowOrientation}>
              <ListItem.Title>
                {item.firstName.trim()} {item.lastName.trim()}
              </ListItem.Title>
              <CheckBox checked={person === item.person_id}
              onPress = {() => {
                setPerson(item.person_id);
                setBond(-1);
              }}/>
              </View>

             
            </ListItem.Content>
    
          </ListItem>
        );
      };

      
    const renderBonds = ({ item }: { item: Bond }) => {
        return (
          <ListItem bottomDivider>
    
            <ListItem.Content id={item.bond_id?.toString()}>
                <View style = {styles.rowOrientation}>
              <ListItem.Title>
                {item.bondName}
              </ListItem.Title>
              <CheckBox checked={bond === item.bond_id}
              onPress = {() => {
                setPerson(-1);
                setBond(item.bond_id)
              }}/>
              </View>
             
            </ListItem.Content>
    
          </ListItem>
        );
      };


  return (
    <SafeAreaView style = {styles.stepContainer}>
        <View style={styles.centeredView}>
            <ThemedText type="subtitle" style={styles.title}>Set Reminder</ThemedText>
        </View>

        <TextInput
        onChangeText={setReminder}
        value={reminder}
        placeholder="e.g. Ask about Nate's soccer tournament"
        style= {styles.textInput}
        />

        <SegmentedControl
        onValueChange={onSegmentChange}
        values = {["Person", "Bond"]}
        />
        {segment === "Person" && 
       <FlatList
        data={peopleList}
        renderItem={renderPeople}
        keyExtractor={(item) => (item.person_id as number).toString()}
      />
        }
        {segment === "Bond" && 
       <FlatList
       data={bondList}
       renderItem={renderBonds}
       keyExtractor={(item) => (item.bond_id as number).toString()}
     />}
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