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
import { Bond, Person, trimName } from '@/constants/types';

export default function addReminderModal() {
    const { reminderList, createReminder, peopleList, bondList } = useContext(InTouchContext);   
    const [reminder, setReminder] = useState("")
    const [ segment, setSegment ] = useState("Person")
    const localParams = useLocalSearchParams();
    let person_id = +localParams.person_id;
    let bond_id = +localParams.bond_id;
    let reminder_screen = false;
    if (+localParams.reminder_screen === 1) {
        reminder_screen = true
    }

    const [ bond, setBond ] = useState(person_id)
    const [ person, setPerson ] = useState(bond_id)
    const onDonePress = () => {

        if (!reminder) {
          Alert.alert("Please write a note")
            return;
        }

        if (!bond && !person) {
            Alert.alert("Please choose a bond or person");
            return;
        }

        if (person) {
        createReminder(reminder, person, -1)
        }
        else {
            createReminder(reminder, -1, bond)
        }
        router.back();
    }

    const onCancelPress = () => {
        router.back();
    }

    const onSegmentChange = (value: string) => {
        setSegment(value)
    }

    const renderPeople = ({ item }: { item: Person }) => {
        const name = trimName(item);
        return (
          <ListItem bottomDivider containerStyle={{ height: 50, justifyContent: 'center' }}  >
    
            <ListItem.Content id={item.person_id?.toString()}>
            <View style = {{...styles.rowOrientation, ...styles.nameContainer}}>
            <ListItem.Title>
                {name}
              </ListItem.Title>
              <CheckBox checked={person === item.person_id}
              onPress = {() => {
                setPerson(item.person_id);
                setBond(-0);
              }}
              containerStyle={{ margin: 0, padding: 0 }}  // Remove extra padding/margin
              />
              </View>

             
            </ListItem.Content>
    
          </ListItem>
        );
      };

      
    const renderBonds = ({ item }: { item: Bond }) => {
        return (
          <ListItem bottomDivider containerStyle={{ height: 50, justifyContent: 'center' }} >
    
            <ListItem.Content id={item.bond_id?.toString()}>
                <View style = {{...styles.rowOrientation, ...styles.nameContainer}}>
              <ListItem.Title>
                {item.bondName}
              </ListItem.Title>
              <CheckBox checked={bond === item.bond_id}
              onPress = {() => {
                setPerson(-0);
                setBond(item.bond_id)
              }}
              containerStyle={{ margin: 0, padding: 0 }}  // Remove extra padding/margin
              />
              </View>
             
            </ListItem.Content>
    
          </ListItem>
        );
      };


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

        {reminder_screen && (
       <SegmentedControl
        onValueChange={onSegmentChange}
        values = {["Person", "Bond"]}
        />)}
        {segment === "Person" && reminder_screen &&
       <FlatList
        data={peopleList}
        renderItem={renderPeople}
        keyExtractor={(item) => (item.person_id as number).toString()}
      />
        }
        {segment === "Bond" && reminder_screen &&
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