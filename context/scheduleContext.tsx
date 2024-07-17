import { Person } from "@/constants/types";
import { createContext, useState } from "react";
import React from "react";

enum ScheduleFrequency {
  DAILY,
  WEEKLY,
  MONTHLY,
  YEARLY,
}

type PotentialSchedule = {
  scheduleType: ScheduleFrequency;
  dates: Date[];
};

export const ScheduleContext = createContext(null);

export const SceduleContextProvider: React.FC<{
  children: React.ReactNode;
  // eslint-disable-next-line react/prop-types
}> = ({ children }) => {

    //STATE VARIABLES
  const [potentialSchedule, setPotentialSchedule] =
    useState<PotentialSchedule>();



  const createPotentialSchedule(scheduleType: ScheduleFrequency, dates: Date[]) =>  {
    const pSchedule: PotentialSchedule = {
      scheduleType: scheduleType,
      dates: dates,
    };
    setPotentialSchedule(pSchedule);
}

    const generateLineup(people: Person[], startPerson: Person) => {
        const lineUp: Person[] = [];
        


    }

}


