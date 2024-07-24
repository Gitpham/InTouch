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

export function personToString(person: Person): string { 
    return "" + person.firstName + " " + person.lastName + " " + person.phoneNumber + " " + person.person_id
}

export type BondPerson = {
    person_id: number;
    bond_id: number;
    nextToCall: number;
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
    try {
        return (obj.time instanceof Date)
    } catch (e) {
        return false;
    }
}

export function isWeeklySchedule(obj: any): obj is WeeklySchedule {
    try {
        return (((typeof obj.monday == "undefined") || (obj.monday instanceof Date))
        && ((typeof obj.tuesday == "undefined") || (obj.tuesday instanceof Date))
        && ((typeof obj.wednesday == "undefined") || (obj.wednesday instanceof Date))
        && ((typeof obj.thursday == "undefined") || (obj.thursday instanceof Date))
        && ((typeof obj.friday == "undefined") || (obj.friday instanceof Date))
        && ((typeof obj.saturday == "undefined") || (obj.saturday instanceof Date))
        && ((typeof obj.sunday == "undefined") || (obj.sunday instanceof Date)))
    } catch (e) {
        return false;
    }
    
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

export type DayOfMonth = {
    weekOfMonth: number,
    dayOfWeek: number,
    time: Date,
}


export type MonthlySchedule = {
   daysInMonth: DayOfMonth[]
}

export function isMonthlySchedule(obj: any): obj is MonthlySchedule {
    return ((typeof obj.weekOfMonth[0] == "number") && (obj.daysOfWeek[0] instanceof Set) && (obj.time[0][0] instanceof Set))
}

export type YearlySchedule = {
    dates: Set<Date>
}
  
export type Schedule = {
    schedule: DailySchedule | WeeklySchedule | MonthlySchedule
  };