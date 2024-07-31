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
            <Picker.Item label="First" value="1" />
            <Picker.Item label="Second" value="2" />
            <Picker.Item label="Third" value="3" />
            <Picker.Item label="Fourth" value="4" />
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
            <Picker.Item label="Sunday" value="1" />
            <Picker.Item label="Monday" value="2" />
            <Picker.Item label="Tuesday" value="3" />
            <Picker.Item label="Wednesday" value="4" />
            <Picker.Item label="Thursday" value="5" />
            <Picker.Item label="Friday" value="6" />
            <Picker.Item label="Saturday" value="7" />
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
      <Card>
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
