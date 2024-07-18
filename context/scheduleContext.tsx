import { Bond, isDailySchedule, isWeeklySchedule, Person, Schedule, ScheduleFrequency } from "@/constants/types";
import { createContext, useState } from "react";
import React from "react";
import { scheduleDailyNotification, scheduleWeeklyNotification } from "./notifications";

type ScheduleContextType= {
  createPotentialSchedule: (s: Schedule) => void,
  potentialSchedule: Schedule,
  generateSchedule: ( b: Bond) => void,
}



export const ScheduleContext = createContext<ScheduleContextType>({
  createPotentialSchedule: function (s: Schedule): void {
    throw new Error("Function not implemented.");
  },
  potentialSchedule: {
    schedule: {
      time: undefined
    }
  },
  generateSchedule: function (b: Bond): void {
    throw new Error("Function not implemented.");
  }
});

export const ScheduleContextProvider: React.FC<{
  children: React.ReactNode;
  // eslint-disable-next-line react/prop-types
}> = ({ children }) => {


    //STATE VARIABLES
  const [potentialSchedule, setPotentialSchedule] =useState<Schedule>({schedule: {time: new Date()}});



  const createPotentialSchedule = (s: Schedule) =>  {
    setPotentialSchedule(s);
}

  const generateSchedule = (bond: Bond) => {
    if (isDailySchedule(potentialSchedule)) {
      scheduleDailyNotification(potentialSchedule, bond);
    } else if (isWeeklySchedule(potentialSchedule)) {
      scheduleWeeklyNotification(potentialSchedule, bond);
    } 

  }

return <ScheduleContext.Provider value={{createPotentialSchedule, potentialSchedule, generateSchedule}}>
  {children}
</ScheduleContext.Provider>


}


