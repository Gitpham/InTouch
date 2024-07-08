import { StandardButton } from "@/components/ButtonStandard";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { useContext } from "react";
import { Bond, Person } from "@/constants/types";
import { getAllPersonBonds } from "@/assets/db/PersonBondRepo";


export default function ReminderScreen() {

     const {createBondMember, peopleList, bondList, getBondPersonMap, getPersonBondMap } = useContext(InTouchContext)





     function onTestAddMember() {


          createBondMember(peopleList[5], bondList[5]);
          getBondPersonMap();
          getPersonBondMap();
          

     }
       return (
        <SafeAreaView>
          
             <ThemedText type= 'title'> Testing Reminder Screen </ThemedText>
             <StandardButton title="TestAddMember" onPress={onTestAddMember}/>
        </SafeAreaView>

       )

    

}