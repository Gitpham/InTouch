import { DailySchedule, Schedule } from "@/constants/types";

const testDateString = "1995-12-17T03:24:00";

const testDate: Date = new Date(testDateString)
const testDaily: DailySchedule = {
    time: testDate
}
const testDailySchedule: Schedule = {
    schedule: testDaily
}

export {
   testDaily, testDailySchedule
}