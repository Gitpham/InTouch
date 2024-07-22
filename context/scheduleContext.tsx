import { Bond, isDailySchedule, isWeeklySchedule, Person, Schedule, ScheduleFrequency } from "@/constants/types";
import { createContext, useState } from "react";
import React from "react";
import { scheduleDailyNotification, scheduleWeeklyNotification } from "./notifications";

//TYPE
type ScheduleContextType= {
  createPotentialSchedule: (s: Schedule) => void,
  potentialSchedule: Schedule,
  generateSchedule: ( b: Bond) => void,
}


//DECLARATION
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
  const [potentialSchedule, setPotentialSchedule] =useState<Schedule>();
  const [notificationIDs, setNotificationIDs] = useState<string[]>([]);



  const createPotentialSchedule = async (s: Schedule) =>  {
    await setPotentialSchedule(s);
}

  const generateSchedule = async (bond: Bond) => {

    if (potentialSchedule == undefined){
      throw Error("generateSchedule(): potenialScheudle is undefined")
    }

    if (isDailySchedule(potentialSchedule.schedule)) {
     const id: string = await scheduleDailyNotification(potentialSchedule, bond);
     setNotificationIDs((nIds) => {
      return [...nIds, id]
     })
     
    } else if (isWeeklySchedule(potentialSchedule.schedule)) {
      scheduleWeeklyNotification(potentialSchedule, bond);
    } 

  }

return <ScheduleContext.Provider value={{createPotentialSchedule, potentialSchedule, generateSchedule}}>
  {children}
</ScheduleContext.Provider>


}


