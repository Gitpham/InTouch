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

export type Reminder = {
    reminder_id: number
    person_id?: number;
    bond_id?: number;
    reminder: string;
    date: string;
}

export function formatDate(date: Date) {
    console.log(typeof(date))
    const day = String(date.getDay()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`
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

        if (typeof obj.monday == "undefined" 
            && typeof obj.tuesday == "undefined"
            && typeof obj.wednesday == "undefined"
            && typeof obj.thursday == "undefined"
            && typeof obj.friday == "undefined"
            && typeof obj.saturday == "undefined"
            && typeof obj.sunday == "undefined"
         ) {
            return false
         }
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

export function isDayOfMonth(obj: any): obj is DayOfMonth{
    return ((typeof obj.weekOfMonth == "number") && (typeof obj.dayOfWeek == "number") && (obj.time instanceof Date))
}

export function isMonthlySchedule(obj: any): obj is MonthlySchedule {

   if (obj.daysInMonth != undefined) {
    obj.daysInMonth.forEach(d => {
        if (!isDayOfMonth(d)){
            return false;
        }
    })
    return true;
   }
   return false;
}

export type DateInYear = {
    date: Date,
    time: Date,
}

export function isDateInYear(obj: any): obj is DateInYear {
    return ((obj.date instanceof Date) && (obj.date instanceof obj.time))
}
export type YearlySchedule = {
    datesInYear: Set<DateInYear>
}

export function isYearlySchedule(obj: any): obj is YearlySchedule {
    console.log("isyearlySchedule")
    if (!(obj.datesInYear instanceof Set)){
        return false;
    }

    if (obj.datesInYear.size < 1) {
        return false;
    }

    obj.datesInYear.forEach(d => {
        if (!isDateInYear(d)){
            return false;
        }
    })
    return true;
}
  
export type Schedule = {
    schedule: DailySchedule | WeeklySchedule | MonthlySchedule | YearlySchedule
  };

export type Schedule_DB = {
    type: string,
    time: string,
    weekDay: number | null,
    weekOfMonth: number | null,
    date: string | null,
    nid: string,
    bid: number,
}
