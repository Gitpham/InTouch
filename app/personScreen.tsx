/* eslint-disable react/react-in-jsx-scope */
import { ThemedText } from "@/components/ThemedText";
import { Bond, Person } from "@/constants/types";
import { Card, ListItem } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { FlatList, Pressable, StyleSheet } from "react-native";

export default function PersonScreen() {

  const {peopleList, getBondsOfPerson} = useContext(InTouchContext)
  const localParams = useLocalSearchParams();
  const [person, setPerson] = useState<Person>()
  const [bonds, setBonds] = useState<Array<Bond>>();


  useEffect(() => {
    const personId: number = Number(localParams.id)
    setPerson(peopleList[personId -1]);
    const p: Person = peopleList[personId -1];
    const b = getBondsOfPerson(p)
    setBonds(b)

  }, [])


  const renderBonds = ({ item }: { item: Bond }) => {
    return (
      <ListItem bottomDivider>
        <Pressable >

        <ListItem.Content id={item.bond_id}>
          <ListItem.Title>
            {item.bondName} 
          </ListItem.Title>
        </ListItem.Content>
        </Pressable>

      </ListItem>
    );
  }

       return (
        <SafeAreaView>
             <Card>
               <Card.Title>Name: {person?.firstName} {person?.lastName} </Card.Title>
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
        keyExtractor={(item) => item.bond_id}
      />
             </Card>



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