import { useContext, useState } from "react";
import DateTimePicker, {
    DateTimePickerEvent,
  } from "@react-native-community/datetimepicker";
import { Card } from "@rneui/themed";
import React from "react";
import { Text } from "react-native";
import { DailySchedule, Schedule } from "@/constants/types";
import { ScheduleContext } from "@/context/ScheduleContext";

export default function DailySchedulePicker({dailyTime, changeDailyTime}) {
    
    async function onDailyPress(event: DateTimePickerEvent, time: Date) {
        changeDailyTime(time)
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
