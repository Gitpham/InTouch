/* eslint-disable react/react-in-jsx-scope */
import { ThemedText } from "@/components/ThemedText";
import { Bond, Person } from "@/constants/types";
import { Card, ListItem, Button } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

export default function PersonScreen() {

  const {peopleList, getBondsOfPerson, removePerson } = useContext(InTouchContext)
  const localParams = useLocalSearchParams();
  const [person, setPerson] = useState<Person>()
  const [bonds, setBonds] = useState<Array<Bond>>();


  useEffect(() => {
    const personId: number = Number(localParams.id)
    let person_index = peopleList.findIndex(item => item.person_id === personId)
    if (person_index !== -1) {
      const p: Person = peopleList[person_index];
      setPerson(p);
      const b = getBondsOfPerson(p);
      setBonds(b);
    }

  }, [])


  const renderBonds = ({ item }: { item: Bond }) => {
    if (item) {
      return (
        <ListItem bottomDivider>
          <Pressable >
  
          <ListItem.Content id={item.bond_id.toString()}>
            <ListItem.Title>
              {item.bondName} 
            </ListItem.Title>
          </ListItem.Content>
          </Pressable>
  
        </ListItem>
      )}
      else {
        return (
          <ListItem bottomDivider>
          </ListItem>
        );

      }
    }

    const deletePerson = () => {
      if (person) {
      removePerson(person);
      }
      router.back();
    }


       return (
        <SafeAreaView style = {styles.stepContainer}>
             <Card>
               <Card.Title>Name: {person?.firstName} {person?.lastName} ID: {person?.person_id}</Card.Title>
               <Card.Divider></Card.Divider>
               <ThemedText>Number: </ThemedText>
               <ThemedText>{person?.phoneNumber}</ThemedText>
             </Card>

             <Card>
              <Card.Title>Reminders</Card.Title>
             </Card>

             <Card>
              <Card.Title>Groups</Card.Title>
              <FlatList
            data={bonds}
            renderItem={renderBonds}
            keyExtractor={(item) => item.bond_id.toString()}
          />
             </Card>

             <Button
             title = "Delete"
             buttonStyle = {styles.redButton}
             titleStyle = {styles.redTitle}
             onPress = {() => deletePerson()}
             />



        </SafeAreaView>

       )
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
  },
  title: {
    color: "black",
  },
  redButton: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 2,
  },
  redTitle: {
    color: "red",
  },
  stepContainer: {
    flex: 1,
    backgroundColor: "white",
    gap: 8,
    marginBottom: 8,
    flexDirection: "column",
    paddingTop: 50,
  },
  centeredView: {
    alignItems: "center",
  },
});