import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Card } from "@rneui/themed";
import React, { useState } from "react";
import { View, Text } from "react-native";
import { StandardButton } from "./ButtonStandard";
import { DateAndTime } from "@/constants/types";
import { convertTo12HourTime, convertToMonth } from "@/context/ScheduleUtils";
import { styles } from "@/constants/Stylesheet";
import { ThemedText } from "./ThemedText";

interface YearlySchedulePickerInterface {
  datesInYear: Set<DateAndTime>;
  changeDatesInYear: (s: Set<DateAndTime>) => void;
}

export default function YearlySchedulePicker({
  datesInYear,
  changeDatesInYear,
}: YearlySchedulePickerInterface) {
  const [selectedDayInYear, setSelectedDayInYear] = useState<Date>(new Date());
  const [selectedTimeInYear, setSelectedTimeInYear] = useState<Date>(
    new Date()
  );

  function displayYearlySet() {
    if (datesInYear.size == 0) return <Text>No Selected Dates</Text>;

    const currentDates: React.JSX.Element[] = [];
    let i = 0;
    datesInYear.forEach((d) => {
      currentDates.push(
        <Text id={"" + i}>
          {convertToMonth(d.date.getUTCMonth())} {d.date.getUTCDate()}{" "}
          {convertTo12HourTime(d.time.toTimeString())}
        </Text>
      );
      i++;
    });
    return <>{currentDates}</>;
  }

  function addToYearlySchedule(day: Date, time: Date) {
    const newDateAndTime: DateAndTime = {
      date: day,
      time: time,
    };

    const newSet: Set<DateAndTime> = new Set(datesInYear);

    newSet.add(newDateAndTime);
    changeDatesInYear(newSet);
  }

  function clearYearlySchedule() {
    changeDatesInYear(new Set());
  }

  return (
    <>
      <Card>
        <View>
          <ThemedText darkColor="black" style={styles.title}>
            Current Yearly Schedule
          </ThemedText>
          {displayYearlySet()}
        </View>
        <Card.Divider></Card.Divider>

        <StandardButton
          title="Clear Schedule"
          onPress={clearYearlySchedule}
        ></StandardButton>
      </Card>
      <Card>
        <View style={styles.rowOrientation}>
          <DateTimePicker
            mode="date"
            value={selectedDayInYear}
            onChange={(e, d) => {
              setSelectedDayInYear(d);
            }}
          ></DateTimePicker>

          <DateTimePicker
            mode="time"
            value={selectedTimeInYear}
            onChange={(e, d) => {
              setSelectedTimeInYear(d);
            }}
          ></DateTimePicker>
        </View>
        <StandardButton
          title="Add Date"
          onPress={() =>
            addToYearlySchedule(selectedDayInYear, selectedTimeInYear)
          }
        ></StandardButton>
      </Card>
    </>
  );
}
