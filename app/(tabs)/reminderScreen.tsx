import { StandardButton } from "@/components/ButtonStandard";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { useContext } from "react";
import { Person } from "@/constants/types";


export default function ReminderScreen() {

     const {createBondMember, peopleList, bondList} = useContext(InTouchContext)

     function onTestAddMember() {
        
          createBondMember(bondList[0], peopleList[0])
     }
       return (
        <SafeAreaView>
          
             <ThemedText type= 'title'> Testing Reminder Screen </ThemedText>
             <StandardButton title="TestAddMember" onPress={onTestAddMember}/>
        </SafeAreaView>

       )

    

}