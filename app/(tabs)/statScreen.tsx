import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/context/NoticationUtil";
import { useState, useRef, useEffect, useContext } from "react";
import { Platform, View, Button, Text, SafeAreaView } from "react-native";
import React from "react";
import { getAllBonds } from "@/assets/db/BondRepo";
import { clearDB, getTableNames } from "@/assets/db/db";
import { getAllPersonBonds } from "@/assets/db/PersonBondRepo";
import { getAllPersons } from "@/assets/db/PersonRepo";
import { getAllReminders } from "@/assets/db/ReminderRepo";
import { StandardButton } from "@/components/ButtonStandard";
import Scheduler from "@/components/Scheduler";
import { ThemedText } from "@/components/ThemedText";
import { InTouchContext } from "@/context/InTouchContext";
import { useSQLiteContext } from "expo-sqlite";

   
   export default function statScreen() {
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

    async function onShowReminders() {
         const reminders = await getAllReminders(db)
         console.log("all reminders ", reminders);

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

    async function tableNames() {
         getTableNames(db);
    }

    function onPressShowBondPersonMap() {
         console.log(getBondPersonMap())
    }

    function onPressShowPersonBondMap(){
         console.log("personBondMap: ", getPersonBondMap())
    }

      return (
       <SafeAreaView>
         
            <ThemedText type= 'title'> Testing Reminder Screen </ThemedText>
            <StandardButton title="getAllBondMembersMember" onPress={onTestAddMember}/>

            <StandardButton title="display people from db" onPress={onShowPeople}/>

            <StandardButton title="display reminders from db" onPress={onShowReminders}/>

            <StandardButton title="display peopleList" onPress={onPeopleList}/>

            <StandardButton title="clear db" onPress={onPressClearDB}/>

            <StandardButton title="print bonds" onPress={onPressShowBonds}/>

            <StandardButton title="show bondPersonMap" onPress={onPressShowBondPersonMap}/>

            <StandardButton title="show personBondMap" onPress={onPressShowPersonBondMap}/>

            <StandardButton title="show tables" onPress={tableNames}/>
              <Scheduler></Scheduler>


       </SafeAreaView>

      )
   }
