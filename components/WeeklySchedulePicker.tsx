import { Card, CheckBox } from "@rneui/themed";
import { useContext, useState } from "react";
import React from "react";
import { Text } from "@rneui/base";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Schedule, WeeklySchedule } from "@/constants/types";
import { ScheduleContext } from "@/context/ScheduleContext";

export default function WeeklySchedulePicker({
  mon,
  changeMon,
  monTime,
  changeMonTime

  tues,
  changeTues,
  tuesTime,
  changeTuesTime,

  weds,
  changeWeds,
  wedsTime,
  changeWedsTime,

  thurs,
  changeThurs,
  thursTime,
  changeThursTime,

  fri,
  changeFri,
  friTime,
  changeFriTime,

  sat,
  changeSat,
  satTime,
  changeSatTime,

  sun,
  changeSun,
  sunTime,
  changeSunTime
}) {
  console.log("WeeklySchedulerRenders");

  function onSelectDayOfWeek(day: string) {
    console.log("day: ", day);

    switch (day) {
      case "mon":
        {
          changeMon(!mon);
        }
        break;
      case "tues":
        {
          changeTues(!tues);
        }
        break;
      case "weds": {
        changeWeds(!weds);

        break;
      }
      case "thurs":
        {
          changeThurs(!thurs);
        }
        break;
      case "fri":
        {
          changeFri(!fri);
        }
        break;
      case "sat": {
        changeSat(!sat);
        break;
      }
      case "sun":
        {
          changeSun(!sun);
        }
        break;
    }
  }

  return (
    <Card>
      <Text>Weekly </Text>

      <View style={{ flexDirection: "row" }}>
        <CheckBox
          checked={mon}
          onPress={() => onSelectDayOfWeek("mon")}
          title="Monday"
        ></CheckBox>
        <DateTimePicker
          value={monTime}
          mode="time"
          onChange={(e, d) => changeMonTime(d)}
        ></DateTimePicker>
      </View>

      <View style={{ flexDirection: "row" }}>
        <CheckBox
          checked={tues}
          onPress={() => onSelectDayOfWeek("tues")}
          title="Tuesday"
        ></CheckBox>
        <DateTimePicker
          value={tuesTime}
          mode="time"
          onChange={(e, d) => changeTuesTime(d)}
        ></DateTimePicker>
      </View>

      <View style={{ flexDirection: "row" }}>
        <CheckBox
          checked={weds}
          onPress={() => onSelectDayOfWeek("weds")}
          title="Wednesday"
        ></CheckBox>
        <DateTimePicker
          value={wedsTime}
          mode="time"
          onChange={(e, d) => changeWedsTime(d)}
        ></DateTimePicker>
      </View>

      <View style={{ flexDirection: "row" }}>
        <CheckBox
          checked={thurs}
          onPress={() => onSelectDayOfWeek("thurs")}
          title="Thursday"
        ></CheckBox>
        <DateTimePicker
          value={thursTime}
          mode="time"
          onChange={(e, d) => changeThursTime(d)}
        ></DateTimePicker>
      </View>

      <View style={{ flexDirection: "row" }}>
        <CheckBox
          checked={fri}
          onPress={() => onSelectDayOfWeek("fri")}
          title="Friday"
        ></CheckBox>
        <DateTimePicker
          value={friTime}
          mode="time"
          onChange={(e, d) => changeFriTime(d)}
        ></DateTimePicker>
      </View>

      <View style={{ flexDirection: "row" }}>
        <CheckBox
          checked={sat}
          onPress={() => onSelectDayOfWeek("sat")}
          title="Saturday"
        ></CheckBox>
        <DateTimePicker
          value={satTime}
          mode="time"
          onChange={(e, d) => changeSatTime(d)}
        ></DateTimePicker>
      </View>

      <View style={{ flexDirection: "row" }}>
        <CheckBox
          checked={sun}
          onPress={() => onSelectDayOfWeek("sun")}
          title="Sunday"
        ></CheckBox>
        <DateTimePicker
          value={sunTime}
          mode="time"
          onChange={(e, d) => changeSunTime(d)}
        ></DateTimePicker>
      </View>
    </Card>
  );
}
