import { printPotentialSchedule, ScheduleContext } from "@/context/ScheduleContext";
import { useContext, useEffect, useState } from "react";
import { Pressable, View, Text } from "react-native";
import React from "react";
import { Person, personToString, } from "@/constants/types";
import { testDailySchedule } from "./ScheduleContextMockData";

export default function ScheduleContextDummyComponent(){
    const {getNextToCall, callPerson, generateSchedule, createPotentialSchedule, potentialSchedule} = useContext(ScheduleContext);
    const [personToCall, setPersonToCall] = useState<Person>({firstName: "firstName", lastName: "lastName", phoneNumber: "0", person_id: 0});

    const pSchedule:string = printPotentialSchedule(potentialSchedule);
    const pToCall = personToString(personToCall);

    function onCreatePotentialDailySchedule() {
        createPotentialSchedule(testDailySchedule);
    }

    async function onGetNextToCall_noneMarked() {
        setPersonToCall(await getNextToCall(1));
    }

    async function onGetNextToCall_noneMarked_sizeOne(){
        setPersonToCall(await getNextToCall(0));
    }

    async function onGetNextToCall_marked() {
        
        setPersonToCall(await getNextToCall(2));
    }

    async function getNextToCall_lastMarked() {
        setPersonToCall(await getNextToCall(3));
    }


    return(
        <View>
            <Text testID="potentialSchedule">{pSchedule}</Text>
            <Pressable testID="createPotentialDailySchedule" onPress={onCreatePotentialDailySchedule}>
                <Text>createPotentialDailySchedule()</Text>
            </Pressable>

            <Pressable testID="getNextToCall_noneMarked" onPress={onGetNextToCall_noneMarked}>
                <Text testID="nextToCall_noneMarked">{pToCall}</Text>
            </Pressable>

            <Pressable testID="getNextToCall_noneMarked_sizeOne" onPress={onGetNextToCall_noneMarked_sizeOne}>
                <Text testID="nextToCall_noneMarked_sizeOne">{pToCall}</Text>
            </Pressable>

            <Pressable testID="getNextToCall_marked" onPress={onGetNextToCall_marked}>
                <Text testID="nextToCall_marked">{pToCall}</Text>
            </Pressable>

            <Pressable testID="getNextToCall_lastMarked" onPress={getNextToCall_lastMarked}>
                <Text testID="nextToCall_lastMarked">{pToCall}</Text>
            </Pressable>
            
        </View>
    )
}