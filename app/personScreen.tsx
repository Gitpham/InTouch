import { ThemedText } from "@/components/ThemedText";
import { Person } from "@/constants/types";
import { Card } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";

export default function PersonScreen() {

  const {peopleList} = useContext(InTouchContext)
  const localParams = useLocalSearchParams();
  let person: Person;

  useEffect(() => {
    const personId: number = Number(localParams.id)
    console.log(peopleList[personId -1])
    person = peopleList[personId -1];

  }, [])

       return (
        <SafeAreaView>
             <ThemedText type= 'title'> Person Screen </ThemedText>
             <Card>
               <Card.Title>Person:  </Card.Title>
             </Card>
        </SafeAreaView>

       )

    

}