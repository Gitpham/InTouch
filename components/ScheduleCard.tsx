import { Card } from "@rneui/themed"
import React, { useContext, useEffect, useState } from "react"
import { ThemedText } from "./ThemedText"
import { StandardButton } from "./ButtonStandard"
import { deleteScheduleOfBond, displayPotentialSchedule, displaySchedule } from "@/context/ScheduleUtils";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { getScheduleOfBond } from "@/assets/db/ScheduleRepo";
import { Bond, Schedule_DB } from "@/constants/types";
import { ScheduleContext } from "@/context/ScheduleContext";

interface ScheduleCardInterface {
    bond: Bond
}
export default function ScheduleCard({bond}: ScheduleCardInterface) {
    const db = useSQLiteContext();
    const [showSchedule, setShowSchedule] = useState<React.JSX.Element[]>([])
    const { hasEditedSchedule,} = useContext(ScheduleContext)

    useEffect(() => {
        const initSchedule = async () => {
            setShowSchedule([])
            schedules = await getScheduleOfBond(db, bond.bond_id);
            schedules.forEach(s => {
                const day = displaySchedule(s)
                setShowSchedule((prev) => {
                     return [...prev, day] 
                }
                )
            })
        }
        initSchedule()
       
    }, [hasEditedSchedule])

    function viewSchedule(){
        return showSchedule
    }
   
      async function onModifySchedule() {
        router.navigate({pathname: "./createScheduleScreen", params: {bid: `${bond?.bond_id}`, isFromBondScreen: "true"}})
      }
    

    return (   <Card>
        <Card.Title>Schedule: {bond?.schedule}</Card.Title>
        <Card.Divider></Card.Divider>
        {viewSchedule()}

        <StandardButton title="Edit Schedule" onPress={onModifySchedule}></StandardButton>
      </Card>)
}