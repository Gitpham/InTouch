import { useContext, useState } from "react";
import DateTimePicker, {
    DateTimePickerEvent,
  } from "@react-native-community/datetimepicker";
import { Card } from "@rneui/themed";
import React from "react";
import { Text } from "react-native";
import { DailySchedule, Schedule } from "@/constants/types";
import { ScheduleContext } from "@/context/ScheduleContext";

export default function DailySchedulePicker() {
    const [dailyTime, setDailyTime] = useState(new Date());
    const {createPotentialSchedule} = useContext(ScheduleContext);
    
    async function onDailyPress(event: DateTimePickerEvent, today: Date) {
        setDailyTime(today)
        const pDailySchedule: DailySchedule = {
            time: today,
          };
          const potentialSchedule: Schedule = {
            schedule: pDailySchedule,
          };
          await createPotentialSchedule(potentialSchedule);
      }
        return (
          <Card>
            <Text>Daily</Text>
    
            <DateTimePicker
              value={dailyTime}
              mode="time"
              onChange={onDailyPress}
            ></DateTimePicker>
          </Card>
        );
    }
