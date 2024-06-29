import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import * as SQLite from "expo-sqlite";
import { Person, getAllPersons } from "../db/PersonRepo";
import { useEffect, useState } from "react";

export default function PeopleScreen() {
  const db = SQLite.useSQLiteContext();
  const [contacts, setContacts] = useState<Person[]>();

  const [refreshing, setRefreshing] = useState(false)



  useEffect(() => {
    console.log("useEffect()");

    (async () => {
      try {
        const persons: Person[] = await getAllPersons(db);
        // console.log("all people", persons[0])
        console.log(persons);
        await setContacts(persons);
      } catch (error) {
        console.error(error);
        console.log("faild to load contacts", error);
      }
    })();

    console.log("contact state variable", contacts);
  }, []);

  const showPeople = async () => {
    console.log("showPeople");
    const people = await getAllPersons(db);
    console.log(people);
  };

   const renderContacts = ({item}: {item: Person}) => {
    return  (<ListItem id ={item.id}>
    <ListItem.Content>
    <ListItem.Title>{item.firstName} {item.lastName}</ListItem.Title>
    <ListItem.Title>Phone Number: {item.phoneNumber} id: {item.id}</ListItem.Title>
    </ListItem.Content>
  </ListItem>)

   }

  // const testPerson: Person = {
  //      firstName: "Alex",
  //      lastName: "Aaron",
  //      phoneNumber: "111-111-1111"
  // }

  // const addPerson =  async () => {
  //      console.log("add Person")
  //      const people = await getAllPersons(db)
  //      console.log(people)
  // }

  return (
    <SafeAreaView style={styles.stepContainer}>

      <FlatList
        data={contacts}
        renderItem={renderContacts}
        keyExtractor={(item) => item.id}
      />

      <ThemedText type="title"> People Screen </ThemedText>
      <Button
        title="Add New Contact"
        onPress={showPeople}
        buttonStyle={styles.button}
        titleStyle={styles.title}
      />
    </SafeAreaView>
  );
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
    justifyContent: "center",
  },
  centeredView: {
    alignItems: "center",
  },
});
