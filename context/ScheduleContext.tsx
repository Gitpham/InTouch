import {
  isDailySchedule,
  isWeeklySchedule,
  Schedule,
  WeeklySchedule,

} from "@/constants/types";
import { createContext, useState } from "react";
import React from "react";


//TYPE
type ScheduleContextType = {
  createPotentialSchedule: (s: Schedule) => void;
  potentialSchedule: Schedule;
  hasEditedSchedule: boolean;
  markHasEditedSchedule: (s: boolean) => void;
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
      time: undefined
    }
  }
});

export const ScheduleContextProvider: React.FC<{
  children: React.ReactNode;
  // eslint-disable-next-line react/prop-types
}> = ({ children }) => {
  //STATE VARIABLES
  const [potentialSchedule, setPotentialSchedule] = useState<Schedule>();
  const [hasEditedSchedule, setHasEditedSchedule] = useState(false);


  const markHasEditedSchedule = (bool: boolean) => {
    setHasEditedSchedule(bool);
  }

  const createPotentialSchedule = async (s: Schedule) => {
    await setPotentialSchedule(s);
  };


  return (
    <ScheduleContext.Provider
      value={{
        createPotentialSchedule,
        potentialSchedule,
        markHasEditedSchedule,
        hasEditedSchedule
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
