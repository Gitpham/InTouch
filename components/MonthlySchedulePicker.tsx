import { Card } from "@rneui/themed";
import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { StandardButton } from "./ButtonStandard";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { DayOfMonth } from "@/constants/types";
import { Picker } from "@react-native-picker/picker";
import {
  convertNumberToOrdinal,
  convertTo12HourTime,
  convertToDayOfWeek,
} from "@/context/ScheduleUtils";
import { styles } from "@/constants/Stylesheet";
import { ThemedText } from "./ThemedText";
import { CheckBox, Divider } from "@rneui/base";

interface MonthlySchedulePickerInterface {
  selectedWeekOfMonth: number;
  changeSelectedWeekOfMonth: (w: number) => void;

  selectedDayOfWeek: number;
  changeSelectedDayOfWeek: (d: number) => void;

  monthlyTime: Date;
  changeMonthlyTime: (t: Date) => void;

  monthlySet: Set<DayOfMonth>;
  changeMonthlySet: (u: Set<DayOfMonth>) => void;

  selectedMonthDate: Date;
  changeSelectedMonthDate: (d: Date) => void;

  selectedMonthDateTime: Date;
  changeSelectedMonthDateTime: (t: Date) => void;
}

export default function MonthlySchedulePicker({
  selectedWeekOfMonth,
  changeSelectedWeekOfMonth,

  selectedDayOfWeek,
  changeSelectedDayOfWeek,

  monthlyTime,
  changeMonthlyTime,

  monthlySet,
  changeMonthlySet,

  selectedMonthDate,
  changeSelectedMonthDate,

  selectedMonthDateTime,
  changeSelectedMonthDateTime,
}: MonthlySchedulePickerInterface) {

    const [onTheIsChecked, setOnTheIsChecked] = useState(true)
    const [eachIsChecked, setEachIsChecked] = useState(false)




  function displayMonthlySet() {
    if (monthlySet.size == 0) return <Text>No Selected Dates</Text>;

    const currentDates: React.JSX.Element[] = [];
    let i = 0;
    monthlySet.forEach((d) => {
      currentDates.push(
        <Text id={"" + i}>
          The {convertNumberToOrdinal(parseInt(d.weekOfMonth))}{" "}
          {convertToDayOfWeek(parseInt(d.dayOfWeek))} at{" "}
          {convertTo12HourTime(d.time.toTimeString())}
        </Text>
      );
      i++;
    });
    return <>{currentDates}</>;
  }

  function onAddDayOfMonth() {
    const day: DayOfMonth = {
      weekOfMonth: selectedWeekOfMonth as number,
      dayOfWeek: selectedDayOfWeek as number,
      time: monthlyTime,
    };

    const newDay = new Set([day]);

    if (!monthlySet.has(day)) {
      changeMonthlySet(new Set<DayOfMonth>([...monthlySet, ...newDay]));
    }
    return;
  }

  function onOnThePressed() {
    setOnTheIsChecked(!onTheIsChecked);
    setEachIsChecked(!eachIsChecked)
  }

  function onEachPressed() {
    setOnTheIsChecked(!onTheIsChecked);
    setEachIsChecked(!eachIsChecked)
  }

  function displayOnThePicker() {

    return (
      <View style={styles.centeredView}>
      <View style={styles.rowOrientation }>
        <View style={{ flex: 0.5, flexDirection: "column" }}>
          <Picker
            selectedValue={selectedWeekOfMonth}
            onValueChange={(itemValue, itemIndex) => {
              changeSelectedWeekOfMonth(itemValue);
            }}
          >
            <Picker.Item label="1st" value="1" />
            <Picker.Item label="2nd" value="2" />
            <Picker.Item label="3rd" value="3" />
            <Picker.Item label="4th" value="4" />
          </Picker>
        </View>

        <View style={{ flex: 0.5, flexDirection: "column" }}>
          <Picker
            selectedValue={selectedDayOfWeek}
            onValueChange={(itemValue, itemIndex) =>
              changeSelectedDayOfWeek(itemValue)
            }
          >
            <Picker.Item label="Sun." value="1" />
            <Picker.Item label="Mon." value="2" />
            <Picker.Item label="Tues." value="3" />
            <Picker.Item label="Weds." value="4" />
            <Picker.Item label="Thurs." value="5" />
            <Picker.Item label="Fri." value="6" />
            <Picker.Item label="Sat." value="7" />
          </Picker>
        </View>
      </View>
      <ThemedText style={styles.title}> Of the month at </ThemedText>
      <View>
        <DateTimePicker
          value={monthlyTime}
          mode="time"
          onChange={(e, d) => changeMonthlyTime(d)}
        ></DateTimePicker>
      </View>
      </View>

    )
    
  }

  function displayMonthlyDatePicker() {

    return (
      <View>
        <DateTimePicker
        minimumDate={new Date()}
      value={selectedMonthDate}
      onChange={(e, d) => {
          changeSelectedMonthDate(d)
      }}
      >
      </DateTimePicker>
  </View>
    )

  }

  return (
    <ScrollView style={{ padding: 10 }}>
    
      <Card>
      <View style={styles.rowOrientation}>
        <CheckBox checked={onTheIsChecked} onPress={onOnThePressed}title="On the" />
        <CheckBox checked={eachIsChecked} onPress={onEachPressed} title="Each" />
      </View>
      {
        onTheIsChecked ? 
        displayOnThePicker() :
        displayMonthlyDatePicker()
      }
     
      </Card>

      <StandardButton title="Add" onPress={onAddDayOfMonth}></StandardButton>
      <Card>
        <Text style={styles.title}>Current Monthly Schedule: </Text>
        {displayMonthlySet()}
        <StandardButton
          title="Clear current schedule"
          onPress={() => {
            changeMonthlySet(new Set());
          }}
        ></StandardButton>
      </Card>
    </ScrollView>
  );
}
