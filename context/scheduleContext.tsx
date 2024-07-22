import { Bond, BondPerson, isDailySchedule, isWeeklySchedule, Person, Schedule, ScheduleFrequency } from "@/constants/types";
import { createContext, useState } from "react";
import React from "react";
import { scheduleDailyNotification, scheduleWeeklyNotification } from "./notifications";
import { getPersonsOfBondDB, updatePersonBond } from "@/assets/db/PersonBondRepo";
import { useSQLiteContext } from "expo-sqlite";
import { getPerson } from "@/assets/db/PersonRepo";

//TYPE
type ScheduleContextType= {
  createPotentialSchedule: (s: Schedule) => void,
  potentialSchedule: Schedule,
  generateSchedule: ( b: Bond) => void,
  getNextToCall: (bond: Bond)=> Promise<Person>,

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
  },
  getNextToCall: function (b: Bond): Promise<Person> {
    throw new Error("Function not implemented.");
  },
});

export const ScheduleContextProvider: React.FC<{
  children: React.ReactNode;
  // eslint-disable-next-line react/prop-types
}> = ({ children }) => {


    //STATE VARIABLES
  const db = useSQLiteContext();
  const [potentialSchedule, setPotentialSchedule] =useState<Schedule>();
  const [notificationIDs, setNotificationIDs] = useState<string[]>([]);


  /**
   * Finds the next person in bond to call. Then updates who's next to call. 
   * 
   * If there is no next person to call, it marks the first personBond in the list. 
   * @param bond 
   */
  const getNextToCall = async (bond: Bond): Promise<Person> =>{
    try {
      const members: BondPerson[] = await getPersonsOfBondDB(db, bond);

      // IF SOMEBODY IS MARKED AND IS NOT END
      for(let i = 0; i < members.length; i++){
        if(members[i].nextToCall == 1){
          const persToCall = await getPerson(db, members[i].person_id);
          await updatePersonBond(db, members[i].person_id, members[i].bond_id, 0);

          if (i+1 < members.length){
            await updatePersonBond(db, members[i+1].person_id, members[i+1].bond_id, 0);
            return persToCall as Person;
         }

         // wraps around
          await updatePersonBond(db, members[0].person_id, members[0].bond_id, 1)
          return persToCall as Person;
         
        }
      }

      // If there is no member markd
      const firstToCall: Person = await getPerson(db, members[0].person_id) as Person;

      if (members.length == 1) {
        await updatePersonBond(db, members[0].person_id, members[0].bond_id, 1)
        return firstToCall;
      }

      await updatePersonBond(db, members[1].person_id, members[1].bond_id, 1)
      return firstToCall;

     
    } catch (e) {
      console.error("getNextToCallInBond(): failed to call getPersonsOfBondDB");
    }
  }



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

return <ScheduleContext.Provider value={{createPotentialSchedule, potentialSchedule, generateSchedule, getNextToCall}}>
  {children}
</ScheduleContext.Provider>


}


