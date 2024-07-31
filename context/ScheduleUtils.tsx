import { deleteScheduleByBond, uploadScheduleToDB } from "@/assets/db/ScheduleRepo";
import {
  Schedule,
  Bond,
  isDailySchedule,
  isWeeklySchedule,
  isMonthlySchedule,
  isYearlySchedule,
  DailySchedule,
  ScheduleFrequency,
  WeeklySchedule,
  MonthlySchedule,
  YearlySchedule,
  DateInYear,
  Schedule_DB,
} from "@/constants/types";
import {
  scheduleDailyNotification,
  scheduleWeeklyNotification,
  scheduleMonthlyNotification,
  scheduleYearlyNotification,
  cancelNotificationsForBond,
} from "./NotificationUtils";
import * as SQLite from "expo-sqlite";
import { View } from "react-native";
import React, { JSXElementConstructor } from "react";
import { ThemedText } from "@/components/ThemedText";
import { getBond } from "@/assets/db/BondRepo";

//SCHEDULE FUNCTIONS
export const generateNotificationSchedule = async (
  potentialSchedule: Schedule,
  bond: Bond,
  db: SQLite.SQLiteDatabase
) => {
  if (potentialSchedule == undefined) {
    throw Error("generateSchedule(): potenialScheudle is undefined");
  }

  if (isDailySchedule(potentialSchedule.schedule)) {
    const nid: string = await scheduleDailyNotification(
      potentialSchedule.schedule,
      bond
    );
    writeDailyScheduleToDB(potentialSchedule.schedule, bond, nid, db);
    return;
  } else if (isWeeklySchedule(potentialSchedule.schedule)) {
    const nids: string[] = await scheduleWeeklyNotification(
      potentialSchedule.schedule,
      bond
    );

    await writeWeeklyScheduleToDB(potentialSchedule.schedule, bond, nids, db);
    return;
  } else if (isMonthlySchedule(potentialSchedule.schedule)) {
    const nids: string[] = await scheduleMonthlyNotification(
      potentialSchedule.schedule,
      bond
    );

    await writeMonthlyScheduleToDB(potentialSchedule.schedule, bond, nids, db);
    return;
  } else if (isYearlySchedule(potentialSchedule.schedule)) {
    try {
      const nids: string[] = await scheduleYearlyNotification(
        potentialSchedule.schedule,
        bond
      );

      await writeYearlyScheduleToDB(potentialSchedule.schedule, bond, nids, db);
      return;
    } catch (e) {
      console.error(e);
      throw new Error(
        "generateSchedule(): failed scheduleYearlyNotification()"
      );
    }
  }
  throw new Error("generateNotificationSchedule(): No Type Detected")

};

//WRITE DATABASE FUNCTIONS

export const writeDailyScheduleToDB = async (
  schedule: DailySchedule,
  bond: Bond,
  nid: string,
  db: SQLite.SQLiteDatabase
) => {
  try {
    const time = schedule.time.toTimeString();
    await uploadScheduleToDB(
      db,
      ScheduleFrequency.DAILY,
      time,
      null,
      null,
      null,
      bond.bond_id,
      nid
    );
  } catch (e) {
    console.error(e);
    throw new Error("writeDailyScheduleToDB() failed");
  }
};

/**
 * dayOFWeek: Sunday = 1, Saty = 7
 * @param schedule
 * @param bond
 * @param nid
 */
export const writeWeeklyScheduleToDB = async (
  schedule: WeeklySchedule,
  bond: Bond,
  nids: string[],
  db: SQLite.SQLiteDatabase
) => {
  const timesOfWeek: string[] = [];
  const dayOfWeek: number[] = [];
  if (schedule.sunday != undefined) {
    dayOfWeek.push(1);
    timesOfWeek.push(schedule.sunday.toTimeString());
  }
  if (schedule.monday != undefined) {
    dayOfWeek.push(2);
    timesOfWeek.push(schedule.monday.toTimeString());
  }
  if (schedule.tuesday != undefined) {
    dayOfWeek.push(3);
    timesOfWeek.push(schedule.tuesday.toTimeString());
  }
  if (schedule.wednesday != undefined) {
    dayOfWeek.push(4);
    timesOfWeek.push(schedule.wednesday.toTimeString());
  }
  if (schedule.thursday != undefined) {
    dayOfWeek.push(5);
    timesOfWeek.push(schedule.thursday.toTimeString());
  }
  if (schedule.friday != undefined) {
    dayOfWeek.push(6);
    timesOfWeek.push(schedule.friday.toTimeString());
  }
  if (schedule.saturday != undefined) {
    dayOfWeek.push(7);
    timesOfWeek.push(schedule.saturday.toTimeString());
  }


  for (let i = 0; i < dayOfWeek.length; i++) {
    const time: string = timesOfWeek[i];
    const nid = nids[i];
    const day = dayOfWeek[i];
    try {
      await uploadScheduleToDB(
        db,
        ScheduleFrequency.WEEKLY,
        time,
        day,
        null,
        null,
        bond.bond_id,
        nid
      );
    } catch (e) {
      console.error(e);
      throw new Error("writeWeeklyScheduleToDb(): uploadScheduleToDB failed");
    }
  }
};

export const writeMonthlyScheduleToDB = async (
  schedule: MonthlySchedule,
  bond: Bond,
  nids: string[],
  db: SQLite.SQLiteDatabase
) => {

  for(let i = 0; i < schedule.daysInMonth.length; i++) {
    const time: string = schedule.daysInMonth[i].time.toTimeString();
    const dayOfWeek: number = schedule.daysInMonth[i].dayOfWeek;
    const weekOfMonth: number = schedule.daysInMonth[i].weekOfMonth;
    const bid = bond.bond_id
    const nid = nids[i]
    try {
      await uploadScheduleToDB(
        db,
        ScheduleFrequency.MONTHLY,
        time,
        dayOfWeek,
        weekOfMonth,
        null,
        bid,
        nid
      );

  }catch (e) {
    console.error(e);
    throw new Error("writeMonthlyScheduleToDB() failed");
  }
}
};

export const writeYearlyScheduleToDB = async (
  schedule: YearlySchedule,
  bond: Bond,
  nids: string[],
  db: SQLite.SQLiteDatabase
) => {

  const scheduleIter = schedule.datesInYear.values();

  for(let i = 0; i< schedule.datesInYear.size; i++) {

    const d: DateInYear = scheduleIter.next().value
    const time = d.time.toTimeString();
    const date = d.date.toDateString();
    const nid = nids[i];
    const bid = bond.bond_id;
    try {
      await uploadScheduleToDB(
        db,
        ScheduleFrequency.YEARLY,
        time,
        null,
        null,
        date,
        bid,
        nid
      );
    } catch (e) {
      console.error(e);
      throw new Error("writeYearlyScheduleToDB() failed");
    }
  }
};

export async function deleteScheduleAndNotificationsOfBond(db: SQLite.SQLiteDatabase, bid: number){
  try {
   await cancelNotificationsForBond(db, bid);
    await deleteScheduleByBond(db, bid);
  return;
  } catch (e) {
    console.error(e);
    throw new Error("deleteScheduleOfBond() failed")
  }
}

export async function replaceScheduleOfBond(db: SQLite.SQLiteDatabase, bid: number, schedule: Schedule){
  try {
    await deleteScheduleAndNotificationsOfBond(db, bid)
    const bond: Bond = await getBond(db, bid);
    return await generateNotificationSchedule(schedule, bond, db);
  } catch (e) {
    console.error(e);
    throw new Error("replaceScheduleOfBond() failed")
  }

}

export function getScheduleType(schedule: Schedule): string{
  if(isDailySchedule(schedule.schedule)){
    return "Daily"
  }
  if (isWeeklySchedule(schedule.schedule)){
    return "Weekly"
  }
  if (isMonthlySchedule(schedule.schedule)){
    return "Monthly"
  }
  if(isYearlySchedule(schedule.schedule)){
    return "Yearly"
  }
  return "invalid type"
}

export function displaySchedule(schedule: Schedule_DB): React.JSX.Element {
  if(schedule.type == ScheduleFrequency.DAILY) {
    return (<View>
      <ThemedText darkColor="black">
        Time: {convertTo12HourTime
      (schedule.time)}
      </ThemedText>
    </View>)
  }

  if(schedule.type == ScheduleFrequency.WEEKLY) {
    return (<View>
      <ThemedText darkColor="black" >
        {convertToDayOfWeek(schedule.weekDay as number)}s at {convertTo12HourTime(schedule.time)}
      </ThemedText>
    </View>)
  }

  if(schedule.type == ScheduleFrequency.MONTHLY) {
    return (<View>
      <ThemedText darkColor="black">
        The {convertNumberToOrdinal(schedule.weekOfMonth as number)} {convertToDayOfWeek(schedule.weekDay as number)} of the month at {convertTo12HourTime(schedule.time)}
      </ThemedText>
    </View>)
  }

  if(schedule.type == ScheduleFrequency.YEARLY) {
    return (<View>
      <ThemedText darkColor="black">
        {schedule.date} at {convertTo12HourTime(schedule.time)}
      </ThemedText>
    </View>)
  }
  return (<View><ThemedText>Schedule Type invalid</ThemedText></View>)
  
  
}

export function displayPotentialSchedule(s: Schedule | undefined) {
  if(s == undefined){
    return (<ThemedText darkColor="black">No Schedule Set</ThemedText>)
  }
  const schedule = s.schedule;
  if (isDailySchedule(schedule)) {
    return (
      <View>
        <ThemedText darkColor="black">Daily: {schedule.time.toTimeString()}</ThemedText>
      </View>
    )
  }

  if (isWeeklySchedule(schedule)) {
    const weeklySchedule = [];
    if(schedule.monday != undefined) {
      weeklySchedule.push(
      <View>
        <ThemedText darkColor="black">Monday: {schedule.monday.toTimeString()}</ThemedText>
      </View>)
    }

    if(schedule.tuesday != undefined) {
      weeklySchedule.push(
      <View>
        <ThemedText darkColor="black">Tuesday: {schedule.tuesday.toTimeString()}</ThemedText>
      </View>)
    }

    if(schedule.wednesday != undefined) {
      weeklySchedule.push(
      <View>
        <ThemedText darkColor="black">Wednesday: {schedule.wednesday.toTimeString()}</ThemedText>
      </View>)
    }

    if(schedule.thursday != undefined) {
      weeklySchedule.push(
      <View>
        <ThemedText darkColor="black">Thursday: {schedule.thursday.toTimeString()}</ThemedText>
      </View>)
    }

    if(schedule.friday != undefined) {
      weeklySchedule.push(
      <View>
        <ThemedText darkColor="black">Friday: {schedule.friday.toTimeString()}</ThemedText>
      </View>)
    }

    if(schedule.saturday != undefined) {
      weeklySchedule.push(
      <View>
        <ThemedText>Saturday: {schedule.saturday.toTimeString()}</ThemedText>
      </View>)
    }

    if(schedule.sunday != undefined) {
      weeklySchedule.push(
      <View>
        <ThemedText darkColor="black">Sunday: {schedule.sunday.toTimeString()}</ThemedText>
      </View>)
    }
    return (
      weeklySchedule
    )
  }

  if (isMonthlySchedule(schedule)){
    const monthlySchedule: React.JSX.Element[] = [];
    schedule.daysInMonth.forEach(d => {
      monthlySchedule.push(
        <View>
          <ThemedText darkColor="black">Time: {d.time.toTimeString()} Day of Week: {d.dayOfWeek} Week of Month: {d.weekOfMonth}</ThemedText>
        </View>

      )
    })
    return monthlySchedule;
  }

  if (isYearlySchedule(schedule)) {
    const yearlySchedule: React.JSX.Element[] = [];
    schedule.datesInYear.forEach(d => {
      yearlySchedule.push(
        <View>
          <ThemedText darkColor="black">
            Date: {d.date.toDateString()} Time: {d.time.toTimeString()}
          </ThemedText>
        </View>
      )
    })
    return (yearlySchedule)

  }
}

export function convertTo12HourTime(timeString: string) {
  // Extract the time part from the input string
  if (timeString == null) {
    throw new Error("convertFromToTimeStringTo12HourFormat(): parameter is null:")
  }
  const timePart = timeString?.match(/(\d{2}:\d{2}:\d{2})/)[0];

  // Split the time part into hours, minutes, and seconds
  const [hh, mm] = timePart.split(':');

  // Convert the hour to a number and determine AM/PM
  let hour = parseInt(hh, 10);
  const period = hour >= 12 ? 'PM' : 'AM';

  // Convert hour to 12-hour format
  hour = hour % 12 || 12;

  // Format the minute with leading zeros if needed
  const formattedMinute = mm.padStart(2, '0');

  // Return the formatted string
  return `${hour}:${formattedMinute} ${period}`;
}

/**
 * 
 * @param dayNum sunday = 1
 */
export function convertToDayOfWeek(dayNum: number){
  const n: number = 1;
  n.toLocaleString()

  switch(dayNum){
    case 1: {
      return "Sunday"
    } 
    case 2: {
      return "Monday"
    } 
    case 3: {
      return "Tuesday"
    } 
    case 4: {
      return "Wednesday"
    } 
    case 5: {
      return "Thursday"
    } 
    case 6: {
      return "Friday"
    } 
    case 7: {
      return "Saturday"
    } 
  }
}

export function convertNumberToOrdinal(num: number){
  if (num < 1 || num > 10) {
    throw new Error("convertNumberToOrdinal(): param must be between 1 and 10 inclusive!")
  }
  switch(num) {
    case 1:{
      return "first"
    } 
    case 2:{
      return "second"
    } 
    case 3:{
      return "third"
    } 
    case 4:{
      return "fourth"
    } 
    case 5:{
      return "fifth"
    } 
    case 6:{
      return "sixth"
    } 
    case 7:{
      return "seventh"
    } 
    case 8:{
      return "eighth"
    } 
    case 9:{
      return "ninth"
    } 
    case 10:{
      return "tenth"
    } 
  }

}

