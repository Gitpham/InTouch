import { mockDatabase } from "@/__mocks__/expo-sqlite";
import { uploadScheduleToDB } from "@/assets/db/ScheduleRepo";
import { Bond, DailySchedule, DateInYear, DayOfMonth, MonthlySchedule, ScheduleFrequency, WeeklySchedule, YearlySchedule } from "@/constants/types";
import { writeDailyScheduleToDB, writeMonthlyScheduleToDB, writeWeeklyScheduleToDB, writeYearlyScheduleToDB } from "@/context/ScheduleUtils";
import * as SQlite from "expo-sqlite";

jest.mock("@/assets/db/ScheduleRepo", () => {
  const mockUploadScheduleToDB = jest.fn().mockImplementation(() => {
    return Promise.resolve();
  });
  return {
    uploadScheduleToDB: mockUploadScheduleToDB,
  };
});

describe("ScheduleUtils: ", () => {
    let db;
  beforeEach(() => {
    jest.clearAllMocks();
    db = mockDatabase
  });

  describe("writeWeeklyScheduleToDB() ", () => {
    describe("smoke tests: should call uploadSchduleToDB correct number of times: ", () => {
      it("should call uploadScheduleToDB() 0x when daysOfWeek is size 0", () => {
        const schedule: WeeklySchedule = {
          monday: undefined,
          tuesday: undefined,
          wednesday: undefined,
          thursday: undefined,
          friday: undefined,
          saturday: undefined,
          sunday: undefined,
        };
        const bond: Bond = {
          bondName: "",
          bond_id: 0,
          schedule: "",
          typeOfCall: "",
        };
        const nids: string[] = [];
        writeWeeklyScheduleToDB(schedule, bond, nids, db);
        expect(uploadScheduleToDB).not.toHaveBeenCalled();
      });

      it("should call uploadScheduleToDB() 1x when daysOfWeek is size 1", () => {
        const schedule: WeeklySchedule = {
          monday: new Date(),
          tuesday: undefined,
          wednesday: undefined,
          thursday: undefined,
          friday: undefined,
          saturday: undefined,
          sunday: undefined,
        };
        const bond: Bond = {
          bondName: "",
          bond_id: 0,
          schedule: "",
          typeOfCall: "",
        };
        const nids = ["1"];
        writeWeeklyScheduleToDB(schedule, bond, nids, db);
        expect(uploadScheduleToDB).toHaveBeenCalledTimes(1);
      });

      it("should call uploadScheduleToDB() 7x when daysOfWeek is size 7", async () => {
        const schedule: WeeklySchedule = {
          monday: new Date(),
          tuesday: new Date(),
          wednesday: new Date(),
          thursday: new Date(),
          friday: new Date(),
          saturday: new Date(),
          sunday: new Date(),
        };
        const bond: Bond = {
          bondName: "",
          bond_id: 1,
          schedule: "",
          typeOfCall: "",
        };
        const nids = ["1", "2", "3", "4", "5", "6", "7"];
        await writeWeeklyScheduleToDB(schedule, bond, nids, db);
        expect(uploadScheduleToDB).toHaveBeenCalledTimes(7);
      });
    });

    describe("should call uploadScheduleToDB() with correct parameters", () => {
      it("should call uploadScheduleToDB() with 'db, weekly, curren time, monday, null, null 1, a'", async () => {
        const currTime = new Date();
        const schedule: WeeklySchedule = {
          monday: currTime,
          tuesday: undefined,
          wednesday: undefined,
          thursday: undefined,
          friday: undefined,
          saturday: undefined,
          sunday: undefined,
        };
        const bond: Bond = {
          bondName: "",
          bond_id: 1,
          schedule: "",
          typeOfCall: "",
        };
        const nids = ["a"];
        await writeWeeklyScheduleToDB(schedule, bond, nids, db);
        expect(uploadScheduleToDB).toHaveBeenCalledTimes(1);
        expect(uploadScheduleToDB).toHaveBeenCalledWith(
          db,
          ScheduleFrequency.WEEKLY,
          currTime.toTimeString(),
          2,
          null,
          null,
          bond.bond_id,
          nids[0]
        );
      });

      it("should call uploadScheduleToDB() twice with correct argumets", async () => {
        const currTime = new Date();
        const schedule: WeeklySchedule = {
          monday: currTime,
          tuesday: undefined,
          wednesday: undefined,
          thursday: undefined,
          friday: currTime,
          saturday: undefined,
          sunday: undefined,
        };
        const bond: Bond = {
          bondName: "",
          bond_id: 1,
          schedule: "",
          typeOfCall: "",
        };
        const nids = ["a", "b"];
        await writeWeeklyScheduleToDB(schedule, bond, nids, db);
        expect(uploadScheduleToDB).toHaveBeenCalledTimes(2);
        expect(uploadScheduleToDB).toHaveBeenCalledWith(
          db,
          ScheduleFrequency.WEEKLY,
          currTime.toTimeString(),
          2,
          null,
          null,
          bond.bond_id,
          nids[0]
        );
        expect(uploadScheduleToDB).toHaveBeenCalledWith(
          db,
          ScheduleFrequency.WEEKLY,
          currTime.toTimeString(),
          6,
          null,
          null,
          bond.bond_id,
          nids[1]
        );
      });
    });
  });


  describe("writeDailyScheduleToDB(): ", () => {

    it("given a daily schedule at currtime, it should call uploadScheduleToDB() with correct arguments", async () => {
        const currTime = new Date();
        const schedule: DailySchedule = {
            time: currTime
        }
        const bond: Bond = {
          bondName: "",
          bond_id: 1,
          schedule: "",
          typeOfCall: "",
        };
        const nid = "a";
        await writeDailyScheduleToDB(schedule, bond, nid, db);
        expect(uploadScheduleToDB).toHaveBeenCalledTimes(1)
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.DAILY, currTime.toTimeString(), null, null, null, bond.bond_id, nid)
    })
  })

  describe("writeMonthlyScheduleToDB(): ", () => {

    it("calling with a monthlySchedule with 1 day should call uploadScheduleToDB() 1x", async () => {
        const currTime = new Date();
    
        const dayInMonth: DayOfMonth = {
            weekOfMonth: 1,
            dayOfWeek: 1,
            time: currTime
        }
        const schedule: MonthlySchedule = {
            daysInMonth: [dayInMonth]
        }
        const bond: Bond = {
          bondName: "",
          bond_id: 1,
          schedule: "",
          typeOfCall: "",
        };
        const nids = ["a"];

        await writeMonthlyScheduleToDB(schedule, bond, nids, db);
        expect(uploadScheduleToDB).toHaveBeenCalledTimes(1);
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.MONTHLY, currTime.toTimeString(), 1, 1, null, bond.bond_id, nids[0])

    })

    it("calling with a monthlySchedule with 7 day should call uploadScheduleToDB() 7x", async () => {
        const time1 = new Date("1995-12-17T03:24:00")
        const time2 = new Date("1995-12-17T05:30:00")

        const day1: DayOfMonth = {
            weekOfMonth: 1,
            dayOfWeek: 1,
            time: time1
        }
        const day2: DayOfMonth = {
            weekOfMonth: 2,
            dayOfWeek: 1,
            time: time1
        }
        const day3: DayOfMonth = {
            weekOfMonth: 3,
            dayOfWeek: 1,
            time: time1
        }
        const day4: DayOfMonth = {
            weekOfMonth: 4,
            dayOfWeek: 1,
            time: time1
        }
        const day5: DayOfMonth = {
            weekOfMonth: 1,
            dayOfWeek: 2,
            time: time2
        }
        const day6: DayOfMonth = {
            weekOfMonth: 1,
            dayOfWeek: 3,
            time: time2
        }
        const day7: DayOfMonth = {
            weekOfMonth: 1,
            dayOfWeek: 4,
            time: time2
        }
        const schedule: MonthlySchedule = {
            daysInMonth: [day1, day2, day3, day4, day5, day6, day7]
        }
        const bond: Bond = {
          bondName: "",
          bond_id: 1,
          schedule: "",
          typeOfCall: "",
        };
        const nids = ["a", "b", "c", "d", "e", "f", "g"];

        await writeMonthlyScheduleToDB(schedule, bond, nids, db);
        expect(uploadScheduleToDB).toHaveBeenCalledTimes(7);
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.MONTHLY, time1.toTimeString(), day1.dayOfWeek, day1.weekOfMonth, null, bond.bond_id, nids[0])
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.MONTHLY, time1.toTimeString(), day2.dayOfWeek, day2.weekOfMonth, null, bond.bond_id, nids[1])
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.MONTHLY, time1.toTimeString(), day3.dayOfWeek, day3.weekOfMonth, null, bond.bond_id, nids[2])
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.MONTHLY, time1.toTimeString(), day4.dayOfWeek, day4.weekOfMonth, null, bond.bond_id, nids[3])
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.MONTHLY, time2.toTimeString(), day5.dayOfWeek, day5.weekOfMonth, null, bond.bond_id, nids[4])
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.MONTHLY, time2.toTimeString(), day6.dayOfWeek, day6.weekOfMonth, null, bond.bond_id, nids[5])
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.MONTHLY, time2.toTimeString(), day7.dayOfWeek, day7.weekOfMonth, null, bond.bond_id, nids[6])
    })

  })


  describe("writeYearlyScheduleToDB(): ", () => {

    it("should call uploadScheduleToDB() 1x for yearlySchedule with 1 date", async () => {
        const date1 = new Date("1995-12-17T03:24:00")
    
        const dateInYear: DateInYear = {
            date: date1,
            time: date1
        }
        const schedule:YearlySchedule = {
            datesInYear: new Set([dateInYear])
        }
        const bond: Bond = {
          bondName: "",
          bond_id: 1,
          schedule: "",
          typeOfCall: "",
        };
        const nids = ["a"];
        await writeYearlyScheduleToDB(schedule, bond, nids, db)
        expect(uploadScheduleToDB).toHaveBeenCalledTimes(1)
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.YEARLY, date1.toTimeString(), null, null, date1.toDateString(), bond.bond_id, nids[0] )
    })

    it("should call uploadScheduleToDB() xx for yearlySchedule with 3 dates", async () => {
        const date1 = new Date("1995-12-17T03:24:00")
        const date2 = new Date("1995-12-17T09:30:00")
        const date3 = new Date("2000-12-17T10:30:00")

        const dateInYear1: DateInYear = {
            date: date1,
            time: date1
        }

        const dateInYear2: DateInYear = {
            date: date2,
            time: date2
        }

        const dateInYear3: DateInYear = {
            date: date3,
            time: date3
        }
        const schedule:YearlySchedule = {
            datesInYear: new Set([dateInYear1, dateInYear2, dateInYear3])
        }
        const bond: Bond = {
          bondName: "",
          bond_id: 1,
          schedule: "",
          typeOfCall: "",
        };
        const nids = ["a", "b", "c"];
        await writeYearlyScheduleToDB(schedule, bond, nids, db)
        expect(uploadScheduleToDB).toHaveBeenCalledTimes(3)
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.YEARLY, date1.toTimeString(), null, null, date1.toDateString(), bond.bond_id, nids[0] )
        expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.YEARLY, date2.toTimeString(), null, null, date2.toDateString(), bond.bond_id, nids[1] )
        // expect(uploadScheduleToDB).toHaveBeenCalledWith(db, ScheduleFrequency.YEARLY, date3.toTimeString(), null, null, date3.toDateString(), bond.bond_id, nids[2] )
    })

  })

});
