import { ThemedText } from "@/components/ThemedText";
import { Person } from "@/constants/types";
import { Card } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";


export default function PersonScreen() {
       return (
        <SafeAreaView>
             <ThemedText type= 'title'> Person Screen </ThemedText>
             <Card>
               <Card.Title>Person: </Card.Title>
             </Card>
        </SafeAreaView>

       )

    

}