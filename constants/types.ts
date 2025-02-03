export type Bond = {
    bondName: string,
    bond_id?: number,
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
    reminder_id?: number
    person_id?: number;
    bond_id?: number;
    reminder: string;
    date: string;
    owner: string;
}

export function formatDate(date: Date) {
    console.log(typeof(date))
    const day = String(date.getDay()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`
}

export const trimName = (person: Person) => {
    if (person) {let name = person.firstName.trim();
    if (person.lastName) {
      name += " ";
      name += person.lastName.trim();
    }
    return name;
  }
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
   isWeekAndDay: boolean
   daysInMonth: DayOfMonth[] | DateAndTime[]
}

export function isDayOfMonth(obj: any): obj is DayOfMonth{
    return ((typeof obj.weekOfMonth == "number") && (typeof obj.dayOfWeek == "number") && (obj.time instanceof Date))
}

export function isMonthlySchedule(obj: any): obj is MonthlySchedule {

   if (obj.daysInMonth != undefined) {
    obj.daysInMonth.forEach(d => {
        if (!isDayOfMonth(d) && !isDateAndTime(d)){
            return false;
        }
    })
    return true;
   }
   return false;
}

export type DateAndTime = {
    date: Date,
    time: Date,
}

export function isDateAndTime(obj: any): obj is DateAndTime {
    return ((obj.date instanceof Date) && (obj.time instanceof Date))
}
export type YearlySchedule = {
    datesInYear: Set<DateAndTime
>
}

export function isYearlySchedule(obj: any): obj is YearlySchedule {
    if (!(obj.datesInYear instanceof Set)){
        return false;
    }
    if (obj.datesInYear.size < 1) {
        return false;
    }

    obj.datesInYear.forEach(d => {
        if (!isDateAndTime(d)){
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
    notification_id: string,
    bond_id: number,
}

export const CountryCodeList = [
    'AF', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB',
    'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW', 'BV', 'BR', 'IO', 'VG', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM',
    'CA', 'CV', 'BQ', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CK', 'CR', 'HR', 'CU', 'CW', 'CY', 'CZ',
    'CD', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF',
    'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT',
    'HM', 'HN', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'CI', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE',
    'XK', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML',
    'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP',
    'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'KP', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE',
    'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'CG', 'RO', 'RU', 'RW', 'RE', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS',
    'SM', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'KR', 'SS', 'ES', 'LK', 'SD',
    'SR', 'SJ', 'SE', 'CH', 'SY', 'ST', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC',
    'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'VI', 'UY', 'UZ', 'VU', 'VA', 'VE', 'VN', 'WF', 'EH', 'YE', 'ZM', 'ZW',
    'KI', 'HK', 'AX',
  ] as const;
  
  export type CountryCode = (typeof CountryCodeList)[number]
