import { printPotentialSchedule, ScheduleContext } from "@/context/scheduleContext";
import { useContext, useEffect, useState } from "react";
import { Pressable, View, Text } from "react-native";
import React from "react";
import { DailySchedule, Schedule } from "@/constants/types";
import { testDailySchedule } from "./ScheduleContextMockData";

export default function ScheduleContextDummyComponent(){
    const {getNextToCall, callPerson, generateSchedule, createPotentialSchedule, potentialSchedule} = useContext(ScheduleContext);


    const pSchedule:string = printPotentialSchedule(potentialSchedule);


    function onCreatePotentialDailySchedule() {
      
        createPotentialSchedule(testDailySchedule);
    }


    return(
        <View>
            <Text testID="potentialSchedule">{pSchedule}</Text>
            <Pressable testID="createPotentialDailySchedule" onPress={onCreatePotentialDailySchedule}>
                <Text>createPotentialDailySchedule()</Text>
            </Pressable>
            
        </View>
    )
}