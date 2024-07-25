import { Card } from "@rneui/themed";
import React from "react";
import { Alert, View, Text } from "react-native";
import { StandardButton } from "./ButtonStandard";
import DateTimePicker, {
    DateTimePickerEvent,
  } from "@react-native-community/datetimepicker";
import { DayOfMonth } from "@/constants/types";
import {Picker} from '@react-native-picker/picker';

interface MonthlySchedulePickerInterface {
  selectedWeekOfMonth: number,
  changeSelectedWeekOfMonth: (w: number) => void,

  selectedDayOfWeek: number,
  changeSelectedDayOfWeek: (d: number) => void,

  monthlyTime: Date,
  changeMonthlyTime: (t: Date) => void,

  monthlySet: Set<DayOfMonth>,
  changeMonthlySet: (u: Set<DayOfMonth>) => void
}
    

export default function MonthlySchedulePicker({
  selectedWeekOfMonth,
  changeSelectedWeekOfMonth,

  selectedDayOfWeek,
  changeSelectedDayOfWeek,

  monthlyTime,
  changeMonthlyTime,

  monthlySet,
  changeMonthlySet

}: MonthlySchedulePickerInterface){



    

    function onAddDayOfMonth() {
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
            onPress={onAddDayOfMonth}
          ></StandardButton>

          <Card>
            <Text>Current Schedule: </Text>
            {monthlySet.forEach((d: DayOfMonth) => {
              <Text>Week: {d.weekOfMonth} Day: {d.dayOfWeek} time: {d.time.toTimeString()}</Text>
            })}
          </Card>
  
          <StandardButton
            title="Clear current schedule"
            onPress={() => {
              changeMonthlySet(new Set());
            }}
          ></StandardButton>
        </Card>
      );

}