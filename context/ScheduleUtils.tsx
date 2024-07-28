import { uploadScheduleToDB } from "@/assets/db/ScheduleRepo";
import { Schedule, Bond, isDailySchedule, isWeeklySchedule, isMonthlySchedule, isYearlySchedule, DailySchedule, ScheduleFrequency, WeeklySchedule, MonthlySchedule, YearlySchedule } from "@/constants/types";
import { scheduleDailyNotification, scheduleWeeklyNotification, scheduleMonthlyNotification, scheduleYearlyNotification } from "./NotificationUtils";
import * as SQLite from "expo-sqlite";

//SCHEDULE FUNCTIONS
export const generateNotificationSchedule = async (potentialSchedule: Schedule, bond: Bond, db: SQLite.SQLiteDatabase) => {


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
  
      } catch (e) {
        console.error(e)
        throw new Error("generateSchedule(): failed scheduleYearlyNotification()")
      }
  
      return;
    }
  
    console.log("No type detected");
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
      await uploadScheduleToDB(db, ScheduleFrequency.DAILY, time, null, null, null, bond.bond_id, nid )
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
   export  const writeWeeklyScheduleToDB = async (
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
  
      let i = 0;
      dayOfWeek.forEach(async (d) => {
        try {
          const time: string = timesOfWeek[i];
          await uploadScheduleToDB(db, ScheduleFrequency.WEEKLY, time, d, null, null, bond.bond_id, nids[i])
          i++;
        } catch (e) {
          console.error(e);
          throw new Error("writeWeeklyScheduleToDb(): uploadScheduleToDB failed");
        }
      });
    };
  
  export const writeMonthlyScheduleToDB = async (
    schedule: MonthlySchedule,
    bond: Bond,
    nids: string[], 
    db: SQLite.SQLiteDatabase
  ) => {
    let i = 0;
    schedule.daysInMonth.forEach(async (d) => {
      const time: string = d.time.toTimeString();
      const dayOfWeek: number = d.dayOfWeek;
      const weekOfMonth: number = d.weekOfMonth;
      try {
        await uploadScheduleToDB(db, ScheduleFrequency.MONTHLY, time, dayOfWeek, weekOfMonth, null, bond.bond_id, nids[i])
        i++;
      } catch (e) {
        console.error(e);
        throw new Error("writeMonthlyScheduleToDB() failed");
      }
    });
  };
  
  export const writeYearlyScheduleToDB = async (
    schedule: YearlySchedule,
    bond: Bond,
    nids: string[],
    db: SQLite.SQLiteDatabase
  ) => {
    let i = 0;
    schedule.datesInYear.forEach(async (d) => {
      const time = d.time.toTimeString();
      const date = d.date.toDateString();
      const nid = nids[i];
      const bid = bond.bond_id;
      try {
        await uploadScheduleToDB(db, ScheduleFrequency.YEARLY, time, null, null, date, bid, nid )
        i++;
      } catch (e) {
        console.error(e);
        throw new Error("writeYearlyScheduleToDB() failed");
      }
    });
  };
  