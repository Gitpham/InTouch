import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native"
import { Card } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";

export default function PersonScreen() {

  const {peopleList} = useContext(InTouchContext)
  const localParams = useLocalSearchParams();
  const [person, setPerson] = useState<Person>()

  useEffect(() => {
    const personId: number = Number(localParams.id)
    setPerson(peopleList[personId -1]);
  }, [])

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