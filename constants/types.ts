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

export type DailySchedule = {
    time: Date
}

export function isDailySchedule(obj: any): obj is DailySchedule {
    return (obj.time instanceof Date);
}

export function isWeeklySchedule(obj: any): obj is WeeklySchedule {
    return (((typeof obj.monday == "undefined") || (obj.monday instanceof Date))
    && ((typeof obj.tuesday == "undefined") || (obj.tuesday instanceof Date))
    && ((typeof obj.wednesday == "undefined") || (obj.wednesday instanceof Date))
    && ((typeof obj.thursday == "undefined") || (obj.thursday instanceof Date))
    && ((typeof obj.friday == "undefined") || (obj.friday instanceof Date))
    && ((typeof obj.saturday == "undefined") || (obj.saturday instanceof Date))
    && ((typeof obj.sunday == "undefined") || (obj.sunday instanceof Date)))
}


export type WeeklySchedule = {
    monday: Date | undefined,
    tuesday: Date | undefined,
    wednesday: Date | undefined,
    thursday: Date | undefined,
    friday: Date | undefined,
    saturday: Date | undefined,
    sunday: Date | undefined,
}


export type MonthlySchedule = {
    //TODO: make this set maximum 28. 
    dates: Set<Date>
}

export type YearlySchedule = {
    dates: Set<Date>
}
  
export type Schedule = {
    schedule: DailySchedule | WeeklySchedule
  };