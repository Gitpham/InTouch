import { Card } from "@rneui/themed";
import React from "react";
import { Alert, View, Text } from "react-native";
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

interface MonthlySchedulePickerInterface {
  selectedWeekOfMonth: number;
  changeSelectedWeekOfMonth: (w: number) => void;

  selectedDayOfWeek: number;
  changeSelectedDayOfWeek: (d: number) => void;

  monthlyTime: Date;
  changeMonthlyTime: (t: Date) => void;

  monthlySet: Set<DayOfMonth>;
  changeMonthlySet: (u: Set<DayOfMonth>) => void;
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
}: MonthlySchedulePickerInterface) {
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

  return (
    <>
      
      <Card>

      <View style={styles.rowOrientation}>
        <View style={{ flex: 0.37, flexDirection: "column" }}>
          <ThemedText darkColor="black" style={styles.title}>
            Week of Month
          </ThemedText>
          <Picker
            style={{ borderBlockColor: "black" }}
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

        <View style={{ flex: 0.37, flexDirection: "column" }}>
          <ThemedText darkColor="black" style={styles.title}>
            Day of Week
          </ThemedText>
          <Picker
            style={{ flex: 0.37 }}
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

        <View style={{ flex: 0.25, flexDirection: "column" }}>
          <ThemedText darkColor="black" style={styles.title}>
            Time
          </ThemedText>
          <DateTimePicker
            value={monthlyTime}
            mode="time"
            onChange={(e, d) => changeMonthlyTime(d)}
          ></DateTimePicker>
        </View>
      </View>


        <StandardButton title="Add" onPress={onAddDayOfMonth}></StandardButton>

        <Card>
          <Text>Current Monthly Schedule: </Text>
          {displayMonthlySet()}
        </Card>

        <StandardButton
          title="Clear current schedule"
          onPress={() => {
            changeMonthlySet(new Set());
          }}
        ></StandardButton>
      </Card>
    </>
  );
}
