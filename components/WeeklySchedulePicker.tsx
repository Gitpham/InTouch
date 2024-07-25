import { Card, CheckBox } from "@rneui/themed";
import { useContext, useState } from "react";
import React from "react";
import { Text } from "@rneui/base";
import { Alert, View } from "react-native";
import DateTimePicker, {
  } from "@react-native-community/datetimepicker";
import { Schedule, WeeklySchedule } from "@/constants/types";
import { ScheduleContext } from "@/context/ScheduleContext";


export default function WeeklySchedulePicker(){
    const {createPotentialSchedule} = useContext(ScheduleContext)
    const [mon, setMon] = useState(false);
    const [monTime, setMonTime] = useState<Date>(new Date());
  
    const [tues, setTues] = useState(false);
    const [tuesTime, setTuesTime] = useState<Date>(new Date());
  
    const [weds, setWeds] = useState(false);
    const [wedsTime, setWedsTime] = useState<Date>(new Date());
  
    const [thurs, setThurs] = useState(false);
    const [thursTime, setThursTime] = useState<Date>(new Date());
  
    const [fri, setFri] = useState(false);
    const [friTime, setFriTime] = useState<Date>(new Date());
  
    const [sat, setSat] = useState(false);
    const [satTime, setSatTime] = useState<Date>(new Date());
  
    const [sun, setSun] = useState(false);
    const [sunTime, setSunTime] = useState<Date>(new Date());


  function onSelectDayOfWeek(day: string) {
    switch (day) {
      case "mon": {
        setMon((m) => !m);
        break;
      }
      case "tues":
        {
          setTues((d) => !d);
        }
        break;
      case "weds": {
        setWeds((m) => !m);
        break;
      }
      case "thurs":
        {
          setThurs((d) => !d);
        }
        break;
      case "fri":
        {
          setFri((d) => !d);
        }
        break;
      case "sat": {
        setSat((m) => !m);
        break;
      }
      case "sun":
        {
          setSun((d) => !d);
        }
        break;
    }
    createWeeklySchedule()
  }

  function createWeeklySchedule(){
    const potentialWeeklySchedule: WeeklySchedule = {
        monday: undefined,
        tuesday: undefined,
        wednesday: undefined,
        thursday: undefined,
        friday: undefined,
        saturday: undefined,
        sunday: undefined,
      };
    //   if (!mon && !tues && !weds && !thurs && !fri && !sat && !sun) {
    //     Alert.alert("Must have some days checked for a weekly schedule");
    //     return;
    //   }
      if (mon) {
        potentialWeeklySchedule.monday = monTime;
      }
      if (tues) {
        potentialWeeklySchedule.tuesday = tuesTime;
      }
      if (weds) {
        potentialWeeklySchedule.wednesday = wedsTime;
      }
      if (thurs) {
        potentialWeeklySchedule.thursday = thursTime;
      }
      if (fri) {
        potentialWeeklySchedule.friday = friTime;
      }
      if (sat) {
        potentialWeeklySchedule.saturday = satTime;
      }
      if (sun) {
        potentialWeeklySchedule.sunday = sunTime;
      }

      const pSchedule: Schedule = {
        schedule: potentialWeeklySchedule,
      };
      createPotentialSchedule(pSchedule);
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
              onChange={(e, d) => setMonTime(d)}
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
              onChange={(e, d) => setTuesTime(d)}
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
              onChange={(e, d) => setWedsTime(d)}
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
              onChange={(e, d) => setThursTime(d)}
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
              onChange={(e, d) => setFriTime(d)}
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
              onChange={(e, d) => setSatTime(d)}
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
              onChange={(e, d) => setSunTime(d)}
            ></DateTimePicker>
          </View>
        </Card>
      );
}