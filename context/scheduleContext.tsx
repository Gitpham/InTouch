import { Person, Schedule, ScheduleFrequency } from "@/constants/types";
import { createContext, useState } from "react";
import React from "react";

type ScheduleContextType= {
  createPotentialSchedule: (frequency: ScheduleFrequency, dates: Date[]) => void,
}



export const ScheduleContext = createContext<ScheduleContextType>({
  createPotentialSchedule: function (frequency: ScheduleFrequency, dates: Date[]): void {
    throw new Error("Function not implemented.");
  }
});

export const ScheduleContextProvider: React.FC<{
  children: React.ReactNode;
  // eslint-disable-next-line react/prop-types
}> = ({ children }) => {


    //STATE VARIABLES
  const [potentialSchedule, setPotentialSchedule] =useState<Schedule>();



  const createPotentialSchedule= (frequency: ScheduleFrequency, dates: Date[]) =>  {
    const pSchedule: Schedule = {
      scheduleType: frequency,
      dates: dates,
      persons: undefined,
    };
    setPotentialSchedule(pSchedule);
}

return <ScheduleContext.Provider value={{createPotentialSchedule, potentialSchedule}}>
  {children}
</ScheduleContext.Provider>


}


