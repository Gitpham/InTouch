import {
  Bond,
  BondPerson,
  DailySchedule,
  isDailySchedule,
  isMonthlySchedule,
  isWeeklySchedule,
  isYearlySchedule,
  MonthlySchedule,
  Person,
  Schedule,
  ScheduleFrequency,
  WeeklySchedule,
  YearlySchedule,
} from "@/constants/types";
import { createContext, useState } from "react";
import React from "react";
import {
  scheduleDailyNotification,
  scheduleWeeklyNotification,
  scheduleMonthlyNotification,
  scheduleYearlyNotification,
  writeWeeklyScheduleToDB,
  writeDailyScheduleToDB,
  writeMonthlyScheduleToDB,
  writeYearlyScheduleToDB,
} from "./NotificationUtils";
import {
  getPersonsOfBondDB,
  updatePersonBond,
} from "@/assets/db/PersonBondRepo";
import { useSQLiteContext } from "expo-sqlite";
import { getPerson } from "@/assets/db/PersonRepo";
import { Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import { validateAndFormatPhoneNumber } from "./PhoneNumberUtils";
import { uploadDailyScheduleDB } from "@/assets/db/DailyScheduleRepo";
import { uploadWeeklyScheduleDB } from "@/assets/db/WeeklyScheduleRepo";
import { uploadMonthlyScheduleDB } from "@/assets/db/MonthlyScheduleRepo";
import { uploadYearlyScheduleDB } from "@/assets/db/YearlyScheduleRepo";
import { uploadNotificationDB } from "@/assets/db/NotificationRepo";
import { uploadScheduleToDB } from "@/assets/db/ScheduleRepo";

//TYPE
type ScheduleContextType = {
  createPotentialSchedule: (s: Schedule) => void;
  potentialSchedule: Schedule;
  generateSchedule: (b: Bond) => void;
  getNextToCall: (bondID: number) => Promise<Person>;
  callPerson: (notification: Notifications.Notification) => void;
};

export const printPotentialSchedule = (s: Schedule) => {
  if (isDailySchedule(s?.schedule)) {
    let stringOfSchedule: string = "Daily: ";
    stringOfSchedule += "hours: " + s.schedule.time.getHours() + " ";
    stringOfSchedule += "minutes: " + s.schedule.time.getMinutes();
    return stringOfSchedule;
  }
  if (isWeeklySchedule(s?.schedule)) {
    const schedule: WeeklySchedule = s.schedule;
    let scheduleString: string = "";
    scheduleString +=
      "Monday: " +
      schedule.monday?.getHours() +
      " " +
      schedule.monday?.getMinutes();
    scheduleString +=
      "Tuesday: " +
      schedule.tuesday?.getHours() +
      " " +
      schedule.tuesday?.getMinutes();
    scheduleString +=
      "wednesday: " +
      schedule.wednesday?.getHours() +
      " " +
      schedule.wednesday?.getMinutes();
    scheduleString +=
      "thursday: " +
      schedule.thursday?.getHours() +
      " " +
      schedule.thursday?.getMinutes();
    scheduleString +=
      "friday: " +
      schedule.friday?.getHours() +
      " " +
      schedule.friday?.getMinutes();
    scheduleString +=
      "saturday: " +
      schedule.saturday?.getHours() +
      " " +
      schedule.saturday?.getMinutes();
    scheduleString +=
      "sunday: " +
      schedule.sunday?.getHours() +
      " " +
      schedule.sunday?.getMinutes();
    return scheduleString;
  }

  return "";
};

//DECLARATION
export const ScheduleContext = createContext<ScheduleContextType>({
  createPotentialSchedule: function (s: Schedule): void {
    throw new Error("Function not implemented.");
  },
  potentialSchedule: {
    schedule: {
      time: undefined,
    },
  },
  generateSchedule: function (b: Bond): void {
    throw new Error("Function not implemented.");
  },
  getNextToCall: function (bondID: number): Promise<Person> {
    throw new Error("Function not implemented.");
  },
  callPerson: function (notification: Notifications.Notification): void {
    throw new Error("Function not implemented.");
  },
  printPotentialSchedule: function (s: Schedule): string {
    throw new Error("Function not implemented.");
  },
});

export const ScheduleContextProvider: React.FC<{
  children: React.ReactNode;
  // eslint-disable-next-line react/prop-types
}> = ({ children }) => {
  //STATE VARIABLES
  const db = useSQLiteContext();
  const [potentialSchedule, setPotentialSchedule] = useState<Schedule>();

  /**
   * Finds the next person in bond to call. Then updates who's next to call.
   *
   * If there is no next person to call, it marks the first personBond in the list.
   * @param bond
   */
  const getNextToCall = async (bondID: number): Promise<Person> => {
    try {
      const members: BondPerson[] = await getPersonsOfBondDB(db, bondID);
      // IF SOMEBODY IS MARKED AND IS NOT END
      for (let i = 0; i < members.length; i++) {
        if (members[i].nextToCall == 1) {
          const persToCall = await getPerson(db, members[i].person_id);
          await updatePersonBond(
            db,
            members[i].person_id,
            members[i].bond_id,
            0
          );

          if (i + 1 < members.length) {
            await updatePersonBond(
              db,
              members[i + 1].person_id,
              members[i + 1].bond_id,
              1
            );
            return persToCall as Person;
          }

          // wraps around
          await updatePersonBond(
            db,
            members[0].person_id,
            members[0].bond_id,
            1
          );
          return persToCall as Person;
        }
      }
      // If there is no member markedd
      const firstToCall: Person = (await getPerson(
        db,
        members[0].person_id
      )) as Person;

      if (members.length == 1) {
        await updatePersonBond(db, members[0].person_id, members[0].bond_id, 1);
        return firstToCall;
      }
      await updatePersonBond(db, members[1].person_id, members[1].bond_id, 1);
      return firstToCall;
    } catch (e) {
      console.error();
      throw new Error(
        "getNextToCallInBond(): failed to call getPersonsOfBondDB"
      );
    }
  };

  const callPerson = async (notification: Notifications.Notification) => {
    const bondID: number = +notification.request.content.data?.bondID;
    const toCall: Person = await getNextToCall(bondID);
    const phoneNumber: string = validateAndFormatPhoneNumber(
      toCall.phoneNumber
    );
    const phoneURL: string = `tel:${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(phoneURL);

    if (canOpen) {
      Linking.openURL(phoneURL);
    } else {
      Alert.alert("could not open url");
    }
  };

  const createPotentialSchedule = async (s: Schedule) => {
    await setPotentialSchedule(s);
  };

  const generateSchedule = async (bond: Bond) => {
    console.log(
      "generateSchedule() potentialSchedule: ",
      potentialSchedule?.schedule
    );

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
      } catch (e) {
        console.error(e)
        throw new Error("generateSchedule(): failed scheduleYearlyNotification()")
      }

      await writeYearlyScheduleToDB(potentialSchedule.schedule, bond, nids, db);
      return;
    }

    console.log("No type detected");
  };

  // const writeDailyScheduleToDB = async (
  //   schedule: DailySchedule,
  //   bond: Bond,
  //   nid: string
  // ) => {
  //   try {
  //     const time = schedule.time.toTimeString();
  //     await uploadScheduleToDB(db, ScheduleFrequency.DAILY, time, null, null, null, bond.bond_id, nid )
  //   } catch (e) {
  //     console.error(e);
  //     throw new Error("writeDailyScheduleToDB() failed");
  //   }
  // };

  // /**
  //  * dayOFWeek: Sunday = 1, Saty = 7
  //  * @param schedule
  //  * @param bond
  //  * @param nid
  //  */
  // const writeWeeklyScheduleToDB = async (
  //   schedule: WeeklySchedule,
  //   bond: Bond,
  //   nids: string[]
  // ) => {
  //   const timesOfWeek: string[] = [];
  //   const dayOfWeek: number[] = [];
  //   if (schedule.sunday != undefined) {
  //     dayOfWeek.push(1);
  //     timesOfWeek.push(schedule.sunday.toTimeString());
  //   }
  //   if (schedule.monday != undefined) {
  //     dayOfWeek.push(2);
  //     timesOfWeek.push(schedule.monday.toTimeString());
  //   }
  //   if (schedule.tuesday != undefined) {
  //     dayOfWeek.push(3);
  //     timesOfWeek.push(schedule.tuesday.toTimeString());
  //   }
  //   if (schedule.wednesday != undefined) {
  //     dayOfWeek.push(4);
  //     timesOfWeek.push(schedule.wednesday.toTimeString());
  //   }
  //   if (schedule.thursday != undefined) {
  //     dayOfWeek.push(5);
  //     timesOfWeek.push(schedule.thursday.toTimeString());
  //   }
  //   if (schedule.friday != undefined) {
  //     dayOfWeek.push(6);
  //     timesOfWeek.push(schedule.friday.toTimeString());
  //   }
  //   if (schedule.saturday != undefined) {
  //     dayOfWeek.push(7);
  //     timesOfWeek.push(schedule.saturday.toTimeString());
  //   }

  //   let i = 0;
  //   dayOfWeek.forEach(async (d) => {
  //     try {
  //       const time: string = timesOfWeek[i];
  //       await uploadScheduleToDB(db, ScheduleFrequency.WEEKLY, time, d, null, null, bond.bond_id, nids[i])
  //       i++;
  //     } catch (e) {
  //       console.error(e);
  //       throw new Error("writeWeeklyScheduleToDb(): uploadScheduleToDB failed");
  //     }
  //   });
  // };

  // const writeMonthlyScheduleToDB = async (
  //   schedule: MonthlySchedule,
  //   bond: Bond,
  //   nids: string[]
  // ) => {
  //   let i = 0;
  //   schedule.daysInMonth.forEach(async (d) => {
  //     const time: string = d.time.toTimeString();
  //     const dayOfWeek: number = d.dayOfWeek;
  //     const weekOfMonth: number = d.weekOfMonth;
  //     try {
  //       await uploadScheduleToDB(db, ScheduleFrequency.MONTHLY, time, dayOfWeek, weekOfMonth, null, bond.bond_id, nids[i])
  //       i++;
  //     } catch (e) {
  //       console.error(e);
  //       throw new Error("writeMonthlyScheduleToDB() failed");
  //     }
  //   });
  // };

  // const writeYearlyScheduleToDB = async (
  //   schedule: YearlySchedule,
  //   bond: Bond,
  //   nids: string[]
  // ) => {
  //   let i = 0;
  //   schedule.datesInYear.forEach(async (d) => {
  //     const time = d.time.toTimeString();
  //     const date = d.date.toDateString();
  //     const nid = nids[i];
  //     const bid = bond.bond_id;
  //     try {
  //       await uploadScheduleToDB(db, ScheduleFrequency.YEARLY, time, null, null, date, bid, nid )
  //       i++;
  //     } catch (e) {
  //       console.error(e);
  //       throw new Error("writeYearlyScheduleToDB() failed");
  //     }
  //   });
  // };
  return (
    <ScheduleContext.Provider
      value={{
        createPotentialSchedule,
        potentialSchedule,
        generateSchedule,
        getNextToCall,
        callPerson,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
