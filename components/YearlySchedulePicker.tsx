import DateTimePicker, {
    DateTimePickerEvent,
  } from "@react-native-community/datetimepicker";
import { Card } from "@rneui/themed";
import React from "react";
import { View, Text} from "react-native";
import { StandardButton } from "./ButtonStandard";
import { DateInYear } from "@/constants/types";

interface YearlySchedulePickerInterface {
    selectedDayInYear: Date,
    changeSelectedDayInYear: (d: Date) => void,

    selectedTimeInYear: Date, 
    changeSelectedTimeInYear:(d: Date) => void,

    datesInYear: Set<DateInYear>,
    changeDatesInYear: (s: Set<DateInYear>)=> void,
}


export default function YearlySchedulePicker({
    selectedDayInYear,
    changeSelectedDayInYear,

    selectedTimeInYear, 
    changeSelectedTimeInYear,

    datesInYear,
    changeDatesInYear,
}: YearlySchedulePickerInterface) {

    function displayYearlySet(){
        if (datesInYear.size == 0) return (<Text>No Selected Dates</Text>)
  
        const currentDates: React.JSX.Element[] = [];
        let i = 0;
        datesInYear.forEach(d => {
          currentDates.push(<Text id={""+i}>
            Date: {d.date.getUTCDate()}
            Time: {d.time.toTimeString()} 
          </Text>)
          i++;
        })
        return <>{currentDates}</>
  
      }


    function addToYearlySchedule(day: Date, time: Date){
        const newDateInYear: DateInYear = {
            date: day,
            time: time,
        }

        const newSet: Set<DateInYear> = new Set(datesInYear)

        newSet.add(newDateInYear)
        changeDatesInYear(newSet);
    }

    function clearYearlySchedule(){
        changeDatesInYear(new Set())
    }

    return (
        <Card>
            <View>
                <DateTimePicker
                mode="date"
                value={selectedDayInYear}
                onChange={(e, d) => {
                    changeSelectedDayInYear(d)
                }}
                >
                </DateTimePicker>

                <DateTimePicker
                mode="time"
                value={selectedTimeInYear}
                onChange={(e, d) => {
                    changeSelectedTimeInYear(d)
                }}
                >
                </DateTimePicker>
            </View>
            <View>
                {displayYearlySet()}
            </View>
            <StandardButton title="Add Date"
            onPress={() => addToYearlySchedule(selectedDayInYear, selectedTimeInYear)}
            ></StandardButton>

            <StandardButton title="Clear Schedule" onPress={clearYearlySchedule}></StandardButton>
            
        </Card>


    )


}