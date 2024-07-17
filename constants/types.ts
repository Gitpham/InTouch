export type Bond = {
    bondName: string,
    bond_id: number,
    schedule: string, 
    typeOfCall: string,
}

export type Person = {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    person_id: number | undefined,
}

export type BondPerson = {
    person_id: number;
    bond_id: number;
  }

export enum ScheduleFrequency {
    DAILY= "daily",
    WEEKLY= "weekly",
    MONTHLY= "monthly",
    YEARLY= "yearly",
  }
  
export type Schedule = {
    scheduleType: ScheduleFrequency;
    dates: Date[];
    persons: Person[] | undefined;
  };