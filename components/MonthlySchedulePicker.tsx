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
  dayWeekMonthSet: Set<DayOfMonth>;
  changeDayWeekMonthSet: (u: Set<DayOfMonth>) => void;

  dateMonthSet: Set<DateAndTime>;
  changeDateMonthSet: (u: Set<DateAndTime>) => void;
}

export default function MonthlySchedulePicker({
  dayWeekMonthSet,
  changeDayWeekMonthSet,

  dateMonthSet,
  changeDateMonthSet,
}: MonthlySchedulePickerInterface) {
  const [onTheIsChecked, setOnTheIsChecked] = useState(true);
  const [eachIsChecked, setEachIsChecked] = useState(false);
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<number>(1);
  const [selectedWeekOfMonth, setSelectedWeekOfMonth] = useState<number>(1);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(1);
  const [monthlyTime, setMonthlyTime] = useState(new Date());
  const [selectedMonthDateTime, setSelectedMonthDateTime] = useState(
    new Date()
  );

  function displayMonthlySet() {
    if (onTheIsChecked) {
      if (dayWeekMonthSet.size == 0) return <Text>No Selected Dates</Text>;

      const currentDates: React.JSX.Element[] = [];
      let i = 0;
      dayWeekMonthSet.forEach((d) => {
        currentDates.push(
          <Text id={"" + i}>
            The {convertNumberToOrdinal(parseInt(d.weekOfMonth))}{" "}
            {convertToDayOfWeek(parseInt(d.dayOfWeek))} of the month at{" "}
            {convertTo12HourTime(d.time.toTimeString())}
          </Text>
        );
        i++;
      });
      return <>{currentDates}</>;
    }

    if (dateMonthSet.size == 0) return <Text>No Selected Dates</Text>;

    const currentDates: React.JSX.Element[] = [];
    let i = 0;
    dateMonthSet.forEach((d) => {
      currentDates.push(
        <Text id={"" + i}>
          Each {d.date.getDate()} of the month at{" "}
          {convertTo12HourTime(d.time.toTimeString())}
        </Text>
      );
      i++;
    });
    return <>{currentDates}</>;
  }

  function onClearSchedule() {
    if (onTheIsChecked) {
      changeDayWeekMonthSet(new Set());
      return;
    }

    changeDateMonthSet(new Set());
  }

  function onAddDay() {
    if (onTheIsChecked) {
      const day: DayOfMonth = {
        weekOfMonth: selectedWeekOfMonth as number,
        dayOfWeek: selectedDayOfWeek as number,
        time: monthlyTime,
      };

      const newDay = new Set([day]);

      if (!dayWeekMonthSet.has(day)) {
        changeDayWeekMonthSet(
          new Set<DayOfMonth>([...dayWeekMonthSet, ...newDay])
        );
      }
      return;
    }

    const today = new Date();
    const newDate = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      selectedDayOfMonth
    );
    const day: DateAndTime = {
      date: newDate,
      time: selectedMonthDateTime,
    };

    const newDay = new Set([day]);

    if (!dateMonthSet.has(day)) {
      changeDateMonthSet(new Set<DateAndTime>([...dateMonthSet, ...newDay]));
    }
    return;
  }

  function onOnThePressed() {
    setOnTheIsChecked(!onTheIsChecked);
    setEachIsChecked(!eachIsChecked);
    changeDateMonthSet(new Set());
  }

  function onEachPressed() {
    setOnTheIsChecked(!onTheIsChecked);
    setEachIsChecked(!eachIsChecked);
    changeDayWeekMonthSet(new Set());
  }

  function displayOnThePicker() {
    return (
      <View style={styles.stepContainer}>
        <View style={{ borderWidth: 1, borderRadius: 10, }}>
          <Picker
            itemStyle={{ height: 150 }}
            selectedValue={selectedWeekOfMonth}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedWeekOfMonth(itemValue);
            }}
          >
            <Picker.Item label="First" value="1" />
            <Picker.Item label="Second" value="2" />
            <Picker.Item label="Third" value="3" />
            <Picker.Item label="Fourth" value="4" />
          </Picker>
        </View>

        <View style={{ borderWidth: 1, borderRadius: 10 }}>
          <Picker
            itemStyle={{ height: 150 }}
            selectedValue={selectedDayOfWeek}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedDayOfWeek(itemValue)
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
        </View>

        <View style={styles.centeredView}>
          <ThemedText style={styles.title}>OF THE MONTH AT </ThemedText>
        </View>

        <View style={{ alignItems: "center", flex: 0.5, borderWidth: 1, borderRadius: 10 }}>
          <DateTimePicker
            value={monthlyTime}
            mode="time"
            onChange={(e, d) => setMonthlyTime(d)}
          ></DateTimePicker>
        </View>
      </View>
    );
  }

  function displayMonthlyDatePicker() {
    return (
      <View style={styles.stepContainer}>
        <View style={styles.centeredView}>
        </View>
        <View style={{borderWidth: 1}}>

        <Picker
          itemStyle={{height: 150}}
          selectedValue={selectedDayOfMonth}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedDayOfMonth(itemValue);
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
        </View>


        <View style={styles.centeredView}>
          <ThemedText style={styles.title}>OF THE MONTH AT </ThemedText>
        </View>
        <View style={styles.centeredView}>
          <DateTimePicker
            value={selectedMonthDateTime}
            mode="time"
            onChange={(e, d) => setSelectedMonthDateTime(d)}
          ></DateTimePicker>
        </View>
      </View>
    );
  }

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Card>
        <View style={styles.centeredView}>
          <Text style={styles.title}>Current Monthly Schedule: </Text>
        </View>
        {displayMonthlySet()}
        <StandardButton
          title="Clear current schedule"
          onPress={onClearSchedule}
        ></StandardButton>
      </Card>
      <Card>
        <View style={styles.centeredView}>
          <ThemedText darkColor="black" style={styles.title}>
            REPEAT
          </ThemedText>
        </View>
        <View style={styles.rowOrientation}>
          <CheckBox
            checked={onTheIsChecked}
            onPress={onOnThePressed}
            title="On the"
          />
          <CheckBox
            checked={eachIsChecked}
            onPress={onEachPressed}
            title="Every"
          />
        </View>
        {onTheIsChecked ? displayOnThePicker() : displayMonthlyDatePicker()}
        <StandardButton title="Add" onPress={onAddDay}></StandardButton>
      </Card>
    </View>
  );
}
