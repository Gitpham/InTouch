import { printPotentialSchedule, ScheduleContext } from "@/context/ScheduleContext";
import { useContext, useEffect, useState } from "react";
import { Pressable, View, Text } from "react-native";
import React from "react";
import { DailySchedule, Person, personToString, Schedule } from "@/constants/types";
import { testDailySchedule } from "./ScheduleContextMockData";
import { testB1 } from "@/__mocks__/expo-sqlite";

export default function ScheduleContextDummyComponent(){
    const {getNextToCall, callPerson, generateSchedule, createPotentialSchedule, potentialSchedule} = useContext(ScheduleContext);
    const [personToCall, setPersonToCall] = useState<Person>({firstName: "firstName", lastName: "lastName", phoneNumber: "0", person_id: 0});

    const pSchedule:string = printPotentialSchedule(potentialSchedule);
    const pToCall = personToString(personToCall);

    function onCreatePotentialDailySchedule() {
        createPotentialSchedule(testDailySchedule);
    }

    async function onGetNextToCall() {
        setPersonToCall(await getNextToCall(1));
    }


    return(
        <View>
            <Text testID="potentialSchedule">{pSchedule}</Text>
            <Pressable testID="createPotentialDailySchedule" onPress={onCreatePotentialDailySchedule}>
                <Text>createPotentialDailySchedule()</Text>
            </Pressable>

            <Pressable testID="getNextToCall" onPress={onGetNextToCall}>
                <Text testID="nextToCall">{pToCall}</Text>
            </Pressable>
            
        </View>
    )
}