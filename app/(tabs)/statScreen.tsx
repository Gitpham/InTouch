import {  useContext, useState } from "react";
import {  SafeAreaView, ScrollView } from "react-native";
import React from "react";
import { getAllBonds } from "@/assets/db/BondRepo";
import { clearDB, createDB, getTableNames, removeTable, Table } from "@/assets/db/db";
import { getAllPersonBonds } from "@/assets/db/PersonBondRepo";
import { getAllPersons } from "@/assets/db/PersonRepo";
import { getAllReminders } from "@/assets/db/ReminderRepo";
import { StandardButton } from "@/components/ButtonStandard";
import { ThemedText } from "@/components/ThemedText";
import { InTouchContext } from "@/context/InTouchContext";
import { useSQLiteContext } from "expo-sqlite";
import { getAllSchedules } from "@/assets/db/ScheduleRepo";
import { getAllScheduledNotifications, cancelAllNotifications } from "@/context/NotificationUtils";
import ConfirmationMessage from "@/components/ConfirmationMessage";

   
   export default function statScreen() {
    const [isVisible, setIsVisible] = useState(false);
    const db = useSQLiteContext();

    async function onDisplaySchedules() {
      const s = await getAllSchedules(db)
      console.log("schedules in db: ", s);
    }
  
    async function onDisplayNotifications() {
      console.log("getAllScheduledNotifications(): " , getAllScheduledNotifications())
    }
  
  
    async function clearScheduledNotifications() {
      await cancelAllNotifications()
    }
  

    async function onTestAddMember() {
         const personBonds = await getAllPersonBonds(db)
         console.log("all personBonds: ", personBonds);

    }

    async function onShowPeople() {
         const personBonds = await getAllPersons(db)
         console.log("all people ", personBonds);

    }

    async function onShowReminders() {
         const reminders = await getAllReminders(db)
         console.log("all reminders ", reminders);

    }


    async function onPressShowBonds() {
         const personBonds = await getAllBonds(db)
         console.log("all bonds", personBonds);

    }



    async function onPressClearDB() {
         clearDB(db)
     // const reminder : Table = "reminder"
     // removeTable(db, reminder);
    }

    async function tableNames() {
         getTableNames(db);
    }

 

     async function dropReminder() {
          try {
          await removeTable(db, "reminder")

          } catch (e){
               console.log("failed dropReminder()")
          }
     }

     async function recreateDB() {
          try {
          await createDB(db);

          } catch (e){
               console.log("failed dropReminder()")
          }
     }

      return (
       <SafeAreaView>
          <ScrollView>

       
         
            <ThemedText type= 'title'> Testing Reminder Screen </ThemedText>
            <StandardButton title="getAllBondMembersMember" onPress={onTestAddMember}/>

            <StandardButton title="display people from db" onPress={onShowPeople}/>

            <StandardButton title="display reminders from db" onPress={onShowReminders}/>


            <StandardButton title="clear db" onPress={onPressClearDB}/>

            <StandardButton title="print bonds from db" onPress={onPressShowBonds}/>

            <StandardButton title="show tables" onPress={() => {setIsVisible(old => !old); tableNames()}}/>

            <StandardButton title="drop reminder tables" onPress={() => {dropReminder()}}/>
            <StandardButton title="createDB" onPress={() => {recreateDB()}}/>


          <StandardButton title = "clear notifications" onPress={clearScheduledNotifications}></StandardButton>
          <StandardButton title="Display Schedules from DB" onPress={onDisplaySchedules}></StandardButton>

{/* 
              <StandardButton title="Display Schedules from DB" onPress={onDisplaySchedules}></StandardButton>
        <StandardButton title="Display scheudleNotificaions" onPress={onDisplayNotifications}></StandardButton>
       */}
       
        </ScrollView>

       </SafeAreaView>

      )
   }
