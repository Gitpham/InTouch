import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import * as SQLite from "expo-sqlite";
import { Person, getAllPersons } from "../db/PersonRepo";
import { useContext, useEffect, useState } from "react";
import { RefreshContactsContext } from "@/context/RefreshContactsContext";
import { router } from "expo-router";

export default function PeopleScreen() {
  const db = SQLite.useSQLiteContext();
  const [contacts, setContacts] = useState<Person[]>();
  const {isRefreshingContacts} = useContext(RefreshContactsContext);
  // const { refreshContacts} = useContext(RefreshContactsContext);



  useEffect(() => {
    // console.log("useEffect()");

    (async () => {
      try {
        const persons: Person[] = await getAllPersons(db);
        // console.log("all people", persons[0])
        // console.log(persons);
        await setContacts(persons);
      } catch (error) {
        console.error(error);
        console.log("faild to load contacts", error);
      }
    })();

    // console.log("contact state variable", contacts);
    // console.log("people updated")
  }, [isRefreshingContacts]);

  const showPeople = async () => {
    console.log("showPeople");
    const people = await getAllPersons(db);
    console.log(people);
  };

   const renderContacts = ({item}: {item: Person}) => {
    return  (
      <ListItem bottomDivider>
    <ListItem.Content id ={item.id} >
    <ListItem.Title>{item.firstName} {item.lastName}</ListItem.Title>
    <ListItem.Title>Phone Number: {item.phoneNumber} id: {item.id}</ListItem.Title>
    </ListItem.Content>

  </ListItem>

  )

   }
  return (
    <SafeAreaView style={styles.stepContainer}>
            <ThemedText type="title"> People Screen </ThemedText>

      <FlatList
        data={contacts}
        renderItem={renderContacts}
        keyExtractor={(item) => item.id}
      />

      <Button
        title="Add New Contact"
        onPress={() => router.push("../addMemberScreen")}
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
