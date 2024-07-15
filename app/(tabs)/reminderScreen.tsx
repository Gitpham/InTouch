import { StandardButton } from "@/components/ButtonStandard";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { useContext } from "react";
import { Bond, Person } from "@/constants/types";
import { getAllPersonBonds } from "@/assets/db/PersonBondRepo";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { getAllPersons } from "@/assets/db/PersonRepo";
import { clearDB } from "@/assets/db/db";
import { getAllBonds } from "@/assets/db/BondRepo";


export default function ReminderScreen() {

     const {createBondMember, peopleList, bondList, getBondPersonMap, getPersonBondMap } = useContext(InTouchContext)
     const db = useSQLiteContext();




     async function onTestAddMember() {
          const personBonds = await getAllPersonBonds(db)
          console.log("all personBonds: ", personBonds);

     }

     async function onShowPeople() {
          const personBonds = await getAllPersons(db)
          console.log("all people ", personBonds);

     }

     function onPeopleList() {
          console.log("peopleList ", peopleList);

     }

     async function onPressShowBonds() {
          const personBonds = await getAllBonds(db)
          console.log("all bonds", personBonds);

     }

     async function onPressClearDB() {
          clearDB(db)
     }

     function onPressShowBondPersonMap() {
          console.log(getBondPersonMap())
     }
       return (
        <SafeAreaView>
          
             <ThemedText type= 'title'> Testing Reminder Screen </ThemedText>
             <StandardButton title="getAllBondMembersMember" onPress={onTestAddMember}/>

             <StandardButton title="display people from db" onPress={onShowPeople}/>

             <StandardButton title="display peopleList" onPress={onPeopleList}/>

             <StandardButton title="clear db" onPress={onPressClearDB}/>

             <StandardButton title="print bonds" onPress={onPressShowBonds}/>

             <StandardButton title="show bondPersonMap" onPress={onPressShowBondPersonMap}/>


        </SafeAreaView>

       )

    

}