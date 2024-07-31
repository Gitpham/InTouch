import Scheduler from "@/components/Scheduler"
import { useLocalSearchParams } from "expo-router"
import React
 from "react"
export default function createScheduleScreen(){
    const localSearchParams = useLocalSearchParams();
    const isFromBondScreen = Boolean(localSearchParams.isFromBondScreen);
    const bid = parseInt(localSearchParams.bid as string);
    return (<Scheduler bid={bid} isFromBondScreen={isFromBondScreen}></Scheduler>)
}