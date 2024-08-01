import { useContext, useState } from "react";
import { View, Alert } from "react-native";
import React from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { StandardButton } from "./ButtonStandard";
import {
  Bond,
  DailySchedule,
  DateAndTime,
  DayOfMonth,
  MonthlySchedule,
  Schedule,
  ScheduleFrequency,
  WeeklySchedule,
  YearlySchedule,
} from "@/constants/types";
import { ScheduleContext } from "@/context/ScheduleContext";
import { useSQLiteContext } from "expo-sqlite";
import DailySchedulePicker from "./DailySchedulePicker";
import WeeklySchedulePicker from "./WeeklySchedulePicker";
import MonthlySchedulePicker from "./MonthlySchedulePicker";
import YearlySchedulePicker from "./YearlySchedulePicker";
import { router, useLocalSearchParams } from "expo-router";
import {
  getScheduleType,
  replaceScheduleOfBond,
} from "@/context/ScheduleUtils";
import { getBond } from "@/assets/db/BondRepo";
import { InTouchContext } from "@/context/InTouchContext";
import { styles } from "@/constants/Stylesheet";

interface SchedulerInterface {
  bid: number | undefined;
  isFromBondScreen: boolean;
}
export default function Scheduler({
  bid,
  isFromBondScreen,
}: SchedulerInterface) {
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>(
    ScheduleFrequency.DAILY
  );
  const { createPotentialSchedule, hasEditedSchedule, markHasEditedSchedule } =
    useContext(ScheduleContext);
  const { updateBondCache } = useContext(InTouchContext);
  const db = useSQLiteContext();
  //DAILY STATE VARIABLES AND SETTERS
  const [dailyTime, setDailyTime] = useState(new Date());

  function changeDailyTime(time: Date) {
    setDailyTime(time);
  }

  //WEEKLY STATE VARIABLES AND SETTERS
  const [mon, setMon] = useState(false);
  function changeMon(isSelected: boolean) {
    setMon(isSelected);
  }
  const [monTime, setMonTime] = useState<Date>(new Date());
  function changeMonTime(time: Date) {
    setMonTime(time);
  }

  const [tues, setTues] = useState(false);
  function changeTues(isSelected: boolean) {
    setTues(isSelected);
  }
  const [tuesTime, setTuesTime] = useState<Date>(new Date());
  function changeTuesTime(time: Date) {
    setTuesTime(time);
  }

  const [weds, setWeds] = useState(false);
  function changeWeds(isSelected: boolean) {
    setWeds(isSelected);
  }
  const [wedsTime, setWedsTime] = useState<Date>(new Date());
  function changeWedsTime(time: Date) {
    setWedsTime(time);
  }

  const [thurs, setThurs] = useState(false);
  function changeThurs(isSelected: boolean) {
    setThurs(isSelected);
  }
  const [thursTime, setThursTime] = useState<Date>(new Date());
  function changeThursTime(time: Date) {
    setThursTime(time);
  }

  const [fri, setFri] = useState(false);
  function changeFri(isSelected: boolean) {
    setFri(isSelected);
  }
  const [friTime, setFriTime] = useState<Date>(new Date());
  function changeFriTime(time: Date) {
    setFriTime(time);
  }

  const [sat, setSat] = useState(false);
  function changeSat(isSelected: boolean) {
    setSat(isSelected);
  }
  const [satTime, setSatTime] = useState<Date>(new Date());
  function changeSatTime(time: Date) {
    setSatTime(time);
  }

  const [sun, setSun] = useState(false);
  function changeSun(isSelected: boolean) {
    setSun(isSelected);
  }
  const [sunTime, setSunTime] = useState<Date>(new Date());
  function changeSunTime(time: Date) {
    setSunTime(time);
  }

  //MONTHLY STATE VARIABLES AND SETTERS
  const [selectedWeekOfMonth, setSelectedWeekOfMonth] = useState<number>(1);
  function changeSelectedWeekOfMonth(week: number) {
    setSelectedWeekOfMonth(week);
  }

  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(1);
  function changeSelectedDayOfWeek(day: number) {
    setSelectedDayOfWeek(day);
  }

  const [monthlyTime, setMonthlyTime] = useState(new Date());
  function changeMonthlyTime(time: Date) {
    setMonthlyTime(time);
  }

  const [monthlySet, setMonthlySet] = useState<Set<DayOfMonth>>(new Set());
  function changeMonthlySet(updatedMonthSet: Set<DayOfMonth>) {
    setMonthlySet(updatedMonthSet);
  }

  const [selectedMonthDate, setSelectedMonthDate] = useState(new Date());
  function changeSelectedMonthDate(updatedDate: Date){
    setSelectedMonthDate(updatedDate);
  } 


  const [selectedMonthDateTime, setSelectedMonthDateTime] = useState(new Date())
  function changeSelectedMonthDateTime(updatedTime: Date) {
    setSelectedMonthDateTime(updatedTime);
  }
  //Yearly State variables
  const [selectedDayInYear, setSelectedDayInYear] = useState<Date>(new Date());
  const [selectedTimeInYear, setSelectedTimeInYear] = useState<Date>(
    new Date()
  );

  function onSegmentedControlValueChange(value) {
    setScheduleFrequency(value);
  }

  async function onDonePress() {
    let pSchedule: Schedule;
    switch (scheduleFrequency) {
      case ScheduleFrequency.DAILY:
        {
          const potentialDailySchedule: DailySchedule = {
            time: dailyTime,
          };
          pSchedule = {
            schedule: potentialDailySchedule,
          };
        }
        break;
      case ScheduleFrequency.WEEKLY:
        {
          const potentialWeeklySchedule: WeeklySchedule = {
            monday: undefined,
            tuesday: undefined,
            wednesday: undefined,
            thursday: undefined,
            friday: undefined,
            saturday: undefined,
            sunday: undefined,
          };
          if (!mon && !tues && !weds && !thurs && !fri && !sat && !sun) {
            Alert.alert("Must have some days checked for a weekly schedule");
            break;
          }
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

          pSchedule = {
            schedule: potentialWeeklySchedule,
          };
        }
        break;
      case ScheduleFrequency.MONTHLY:
        {
          const pMonthlySchedule: MonthlySchedule = {
            daysInMonth: [],
          };
          monthlySet.forEach((d) => {
            pMonthlySchedule.daysInMonth.push(d);
          });

          pSchedule = {
            schedule: pMonthlySchedule,
          };
        }
        break;
      case ScheduleFrequency.YEARLY:
        {
          const pYearSchedule: YearlySchedule = {
            datesInYear: datesInYear,
          };
          pSchedule = {
            schedule: pYearSchedule,
          };
        }
        break;
      default:
        break;
    }

    if (isFromBondScreen == false) {
      createPotentialSchedule(pSchedule);
      router.back();
      return;
    }

    if (isFromBondScreen === true) {
      Alert.alert(
        "Replace Schedule",
        "Clicking 'confirm' will replace your old schedule with the one you just made",
        [
          { text: "Confirm", onPress: () => onConfirmPress(pSchedule) },
          { text: "Cancel" },
        ]
      );
      return;
    }
  }

  async function onConfirmPress(schedule: Schedule) {
    await replaceScheduleOfBond(db, bid as number, schedule);
    markHasEditedSchedule(!hasEditedSchedule);
    const currBond: Bond = await getBond(db, bid as number);
    const newBond: Bond = {
      bondName: currBond.bondName,
      bond_id: currBond.bond_id,
      schedule: getScheduleType(schedule),
      typeOfCall: "",
    };
    await updateBondCache(newBond);
    router.back();
  }

  function dailySelector() {
    return (
      <DailySchedulePicker
        dailyTime={dailyTime}
        changeDailyTime={changeDailyTime}
      ></DailySchedulePicker>
    );
  }

  function weeklySelector() {
    return (
      <WeeklySchedulePicker
        mon={mon}
        changeMon={changeMon}
        monTime={monTime}
        changeMonTime={changeMonTime}
        tues={tues}
        changeTues={changeTues}
        tuesTime={tuesTime}
        changeTuesTime={changeTuesTime}
        weds={weds}
        changeWeds={changeWeds}
        wedsTime={wedsTime}
        changeWedsTime={changeWedsTime}
        thurs={thurs}
        changeThurs={changeThurs}
        thursTime={thursTime}
        changeThursTime={changeThursTime}
        fri={fri}
        changeFri={changeFri}
        friTime={friTime}
        changeFriTime={changeFriTime}
        sat={sat}
        changeSat={changeSat}
        satTime={satTime}
        changeSatTime={changeSatTime}
        sun={sun}
        changeSun={changeSun}
        sunTime={sunTime}
        changeSunTime={changeSunTime}
      ></WeeklySchedulePicker>
    );
  }

  function monthlySelector() {
    return (
      <MonthlySchedulePicker
        selectedWeekOfMonth={selectedWeekOfMonth}
        changeSelectedWeekOfMonth={changeSelectedWeekOfMonth}
        selectedDayOfWeek={selectedDayOfWeek}
        changeSelectedDayOfWeek={changeSelectedDayOfWeek}
        monthlyTime={monthlyTime}
        changeMonthlyTime={changeMonthlyTime}
        monthlySet={monthlySet}
        changeMonthlySet={changeMonthlySet}

        selectedMonthDate={selectedMonthDate}
        changeSelectedMonthDate={changeSelectedMonthDate}

        selectedMonthDateTime={selectedMonthDateTime}
        changeSelectedMonthDateTime={changeSelectedMonthDateTime}
      ></MonthlySchedulePicker>
    );
  }

  function changeSelectedDayInYear(selectedDay: Date) {
    setSelectedDayInYear(selectedDay);
  }
  function changeSelectedTimeInYear(selectedTime: Date) {
    setSelectedTimeInYear(selectedTime);
  }

  const [datesInYear, setDatesInYear] = useState<Set<DateAndTime>>(new Set());

  function changeDatesInYear(updatedDates: Set<DateAndTime>) {
    setDatesInYear(updatedDates);
  }

  function yearlySelector() {
    return (
      <YearlySchedulePicker
        selectedTimeInYear={selectedTimeInYear}
        changeSelectedTimeInYear={changeSelectedTimeInYear}
        selectedDayInYear={selectedDayInYear}
        changeSelectedDayInYear={changeSelectedDayInYear}
        datesInYear={datesInYear}
        changeDatesInYear={changeDatesInYear}
      ></YearlySchedulePicker>
    );
  }

  function displayScheduleSelectors() {
    return (
      <>
        {scheduleFrequency == ScheduleFrequency.DAILY && dailySelector()}

        {scheduleFrequency == ScheduleFrequency.WEEKLY && weeklySelector()}

        {scheduleFrequency == ScheduleFrequency.MONTHLY && monthlySelector()}

        {scheduleFrequency == ScheduleFrequency.YEARLY && yearlySelector()}
      </>
    );
  }

  return (
    <View style={styles.stepContainer}>
      <View style={styles.centeredView}></View>

      <View>
        <SegmentedControl
          onValueChange={onSegmentedControlValueChange}
          values={[
            ScheduleFrequency.DAILY,
            ScheduleFrequency.WEEKLY,
            ScheduleFrequency.MONTHLY,
            ScheduleFrequency.YEARLY,
          ]}
        ></SegmentedControl>
        {displayScheduleSelectors()}
      </View>

      <View>
        <StandardButton title="Done" onPress={onDonePress}></StandardButton>
      </View>
    </View>
  );
}
