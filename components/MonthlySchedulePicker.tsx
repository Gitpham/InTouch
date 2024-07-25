import { Card } from "@rneui/themed";
import React, { useContext, useState } from "react";
import { Alert, View } from "react-native";
import { StandardButton } from "./ButtonStandard";
import DateTimePicker, {
    DateTimePickerEvent,
  } from "@react-native-community/datetimepicker";
import { DayOfMonth, MonthlySchedule, Schedule } from "@/constants/types";
import { ScheduleContext } from "@/context/ScheduleContext";
import {Picker} from '@react-native-picker/picker';
export default function MonthlySchedulePicker({
  selectedWeekOfMonth,
  changeSelectedWeekOfMonth,

  selectedDayOfWeek,
  changeSelectedDayOfWeek,

  monthlyTime,
  changeMonthlyTime,

  monthlySet,
  changeMonthlySet

}){

    

    function onChooseDayMonthly() {
        const day: DayOfMonth = {
          weekOfMonth: selectedWeekOfMonth as number,
          dayOfWeek: selectedDayOfWeek as number,
          time: monthlyTime,
        };

        const newDay = new Set([day])
    
        if (!monthlySet.has(day)) {
          changeMonthlySet(
           new Set<DayOfMonth>([...monthlySet, ...newDay])
          );
        }
          return;
        }
      

    return (
        <Card>
          <View>
            <Picker
              selectedValue={selectedWeekOfMonth}
              onValueChange={(itemValue, itemIndex) =>{
                changeSelectedWeekOfMonth(itemValue)
              }
              }
            >
              <Picker.Item label="First Week" value="1" />
              <Picker.Item label="Second Week" value="2" />
              <Picker.Item label="Third Week" value="3" />
              <Picker.Item label="Fourth Week" value="4" />
            </Picker>
  
            <Picker
              selectedValue={selectedDayOfWeek}
              onValueChange={(itemValue, itemIndex) =>
                changeSelectedDayOfWeek(itemValue)
              }
            >
              <Picker.Item label="Sunday" value="1" />
              <Picker.Item label="Monday" value="2" />
              <Picker.Item label="Tuesday" value="3" />
              <Picker.Item label="Wednesday" value="4" />
              <Picker.Item label="Thursday" value="5" />
              <Picker.Item label="Friday" value="6" />
              <Picker.Item label="Saturday" value="7" />
            </Picker>
  
            <DateTimePicker
              value={monthlyTime}
              mode="time"
              onChange={(e, d) => changeMonthlyTime(d)}
            ></DateTimePicker>
          </View>
  
          <StandardButton
            title="Add"
            onPress={onChooseDayMonthly}
          ></StandardButton>
  
          <StandardButton
            title="Clear current schedule"
            onPress={() => {
              changeMonthlySet(new Set());
            }}
          ></StandardButton>
        </Card>
      );

}