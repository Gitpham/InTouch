import { Card } from "@rneui/themed";
import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { StandardButton } from "./ButtonStandard";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { DateAndTime, DayOfMonth } from "@/constants/types";
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
    if(onOnThePressed){
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

    const day: DateAndTime = {
      date: selectedMonthDate,
      time: selectedMonthDateTime
    };

    const newDay = new Set([day]);

    if (!monthlySet.has(day)) {
      changeMonthlySet(new Set<DayOfMonth>([...monthlySet, ...newDay]));
    }


    
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
      <View style={styles.stepContainer}>
      {/* <View style={styles.rowOrientation }> */}
        <View 
        // style={{ flex: 0.5, flexDirection: "column" }}
        >
          <Picker
            selectedValue={selectedWeekOfMonth}
            onValueChange={(itemValue, itemIndex) => {
              changeSelectedWeekOfMonth(itemValue);
            }}
          >
            <Picker.Item label="First" value="1" />
            <Picker.Item label="Second" value="2" />
            <Picker.Item label="Third" value="3" />
            <Picker.Item label="Fourth" value="4" />
          </Picker>
        </View>

        <View 
        // style={{ flex: 0.5, flexDirection: "column" }}
        >
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
        {/* </View> */}
      </View>
      <View style={styles.centeredView}>
      <ThemedText style={styles.title}> Of the month at </ThemedText>

      </View>
      <View style={styles.centeredView}>
        <DateTimePicker
          value={monthlyTime}
          mode="time"
          onChange={(e, d) => changeMonthlyTime(d)}
        ></DateTimePicker>
      </View>
      </View>

    )
    
  }

  // Function to get the first date of the month
function getFirstDateOfMonth(date: Date) {
  // Create a new Date object with the same year and month, but set the day to 1
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getLastDateOfMonth(date: Date) {
  // Create a new Date object with the same year and month, but set the day to 1
  return new Date(date.getFullYear(), date.getMonth(), 31);
}

  function displayMonthlyDatePicker() {

    return (
      <View>
        <View style={styles.centeredView}>

      <Text style={styles.title}>{selectedMonthDate.getDate()} OF THE MONTH</Text>
      </View>
      <Picker
            selectedValue={selectedWeekOfMonth}
            onValueChange={(itemValue, itemIndex) => {
              changeSelectedWeekOfMonth(itemValue);
            }}
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="8" value="8" />
            <Picker.Item label="9" value="9" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="11" value="11" />
            <Picker.Item label="12" value="12" />
            <Picker.Item label="13" value="13" />
            <Picker.Item label="14" value="14" />
            <Picker.Item label="15" value="15" />
            <Picker.Item label="16" value="16" />
            <Picker.Item label="17" value="17" />
            <Picker.Item label="18" value="18" />
            <Picker.Item label="19" value="19" />
            <Picker.Item label="20" value="20" />
            <Picker.Item label="21" value="21" />
            <Picker.Item label="22" value="22" />
            <Picker.Item label="23" value="23" />
            <Picker.Item label="24" value="24" />
            <Picker.Item label="25" value="25" />
            <Picker.Item label="26" value="26" />
            <Picker.Item label="27" value="27" />
            <Picker.Item label="28" value="28" />
            <Picker.Item label="29" value="29" />
            <Picker.Item label="30" value="30" />
            <Picker.Item label="31" value="31" />
          </Picker>

        {/* <DateTimePicker style={{alignSelf:"flex-start"}}
        minimumDate={getFirstDateOfMonth(new Date())}
        maximumDate={getLastDateOfMonth(new Date())}
      value={selectedMonthDate}
      onChange={(e, d) => {
          changeSelectedMonthDate(d)
      }}
      >
      </DateTimePicker> */}

      <View style={styles.centeredView}>
      <ThemedText style={styles.title}> at </ThemedText>
        <DateTimePicker
          value={selectedMonthDateTime}
          mode="time"
          onChange={(e, d) => changeSelectedMonthDateTime(d)}
        ></DateTimePicker>
      </View>
  </View>
    )

  }

  return (
    <ScrollView style={{ padding: 10 }}>
    
      <Card>
        <View style={styles.centeredView}>
          <ThemedText darkColor="black" style={styles.title}>REPEAT</ThemedText>
        </View>
      <View style={styles.rowOrientation}>
        <CheckBox checked={onTheIsChecked} onPress={onOnThePressed}title="On the" />
        <CheckBox checked={eachIsChecked} onPress={onEachPressed} title="Every" />
      </View>
      {
        onTheIsChecked ? 
        displayOnThePicker() :
        displayMonthlyDatePicker()
      }
      <StandardButton title="Add" onPress={onAddDayOfMonth}></StandardButton>
     
      </Card>

      <Card>
        <View style={styles.centeredView}>
        <Text style={styles.title}>Current Monthly Schedule: </Text>

        </View>
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
