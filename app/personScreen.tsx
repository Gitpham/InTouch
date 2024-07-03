import { ThemedText } from "@/components/ThemedText";
import { Person } from "@/constants/types";
import { Card } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";


export default function PersonScreen() {

  const localParams = useLocalSearchParams();
  useEffect(() => {
    console.log("local params", localParams)
  }, [])
       return (
        <SafeAreaView>
             <ThemedText type= 'title'> Person Screen </ThemedText>
             <Card>
               <Card.Title>Person: </Card.Title>
             </Card>
        </SafeAreaView>

       )

    

}