import { Bond, DailySchedule, DayOfMonth, MonthlySchedule, WeeklySchedule } from "@/constants/types"
import { notificationContentDaily, notificationContentMonthly, notificationContentWeekly, scheduleDailyNotification, scheduleMonthlyNotification, scheduleWeeklyNotification } from "@/context/NotificationUtils"
import {scheduleNotificationAsync, DailytriggerInput, WeeklyTriggerInput, CalendarTriggerInput} from "expo-notifications";

jest.mock("expo-notifications", () => {
    const mockScheduleNotificationAsync = jest.fn().mockImplementation(() => {
        return "a";
    });
    return {
        scheduleNotificationAsync: mockScheduleNotificationAsync,
    }

})

beforeEach(() => {
    jest.clearAllMocks();
})

describe("NotificationUtils: ", () => {

    describe("scheduleDailyNotification(): ", () => {

        it("should call Notifications.scheduleNotificationAsync 1x with correct args", async () => {
            const date = new Date("1995-12-17T09:30:00")
            const schedule: DailySchedule = {
                time: date
            }
            const bond: Bond = {
                bondName: "A",
                bond_id: 1,
                schedule: "Daily",
                typeOfCall: "Individual",
              };

            const expectedTrigger: DailytriggerInput = {
                hour: date.getHours(),
                minute: date.getMinutes(),
                repeats: true
            }

            const expectedContent = notificationContentDaily(bond);

            await scheduleDailyNotification(schedule, bond)
            expect(scheduleNotificationAsync).toHaveBeenCalled()
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger} )
        })

    })

    describe("scheduleWeeklyNotification: ", () => {

        it("it should call Notification.scheduleNotificationAsync 1x for 1 day checked ", async () => {
            const date = new Date("1995-12-17T09:30:00")
            const schedule: WeeklySchedule = {
                monday: date,
                tuesday: undefined,
                wednesday: undefined,
                thursday: undefined,
                friday: undefined,
                saturday: undefined,
                sunday: undefined
            }
            const bond: Bond = {
                bondName: "A",
                bond_id: 1,
                schedule: "Weekly",
                typeOfCall: "Individual",
              };

            const expectedTrigger: WeeklyTriggerInput = {
                weekday: 2,
                hour: date.getHours(),
                minute: date.getMinutes(),
                repeats: true
            }
            const expectedContent = notificationContentWeekly(bond);
            await scheduleWeeklyNotification(schedule, bond)
            expect(scheduleNotificationAsync).toHaveBeenCalledTimes(1)
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger})
        })

        it("it should call Notification.scheduleNotificationAsync 7x for 7 days checked ", async () => {
            const date = new Date("1995-12-17T09:30:00")
            const date1 = new Date("1995-12-17T10:30:00")
            const date2 = new Date("1995-12-17T11:30:00")
            const date3 = new Date("2000-12-17T09:30:00")
            const date4 = new Date("1995-11-17T09:30:00")
            const date5 = new Date("1995-12-17T02:30:00")
            const date6 = new Date("1997-12-17T09:30:00")
            const schedule: WeeklySchedule = {
                monday: date,
                tuesday: date1,
                wednesday: date2,
                thursday: date3,
                friday: date4,
                saturday: date5,
                sunday: date6
            }
            const bond: Bond = {
                bondName: "A",
                bond_id: 1,
                schedule: "Weekly",
                typeOfCall: "Individual",
              };

            const expectedTrigger: WeeklyTriggerInput = {
                weekday: 2,
                hour: date.getHours(),
                minute: date.getMinutes(),
                repeats: true
            }

            const expectedTrigger1: WeeklyTriggerInput = {
                weekday: 3,
                hour: date1.getHours(),
                minute: date1.getMinutes(),
                repeats: true
            }

            const expectedTrigger2: WeeklyTriggerInput = {
                weekday: 4,
                hour: date2.getHours(),
                minute: date2.getMinutes(),
                repeats: true
            }

            const expectedTrigger3: WeeklyTriggerInput = {
                weekday: 5,
                hour: date3.getHours(),
                minute: date3.getMinutes(),
                repeats: true
            }

            const expectedTrigger4: WeeklyTriggerInput = {
                weekday: 6,
                hour: date4.getHours(),
                minute: date4.getMinutes(),
                repeats: true
            }

            const expectedTrigger5: WeeklyTriggerInput = {
                weekday: 7,
                hour: date5.getHours(),
                minute: date5.getMinutes(),
                repeats: true
            }

            const expectedTrigger6: WeeklyTriggerInput = {
                weekday: 1,
                hour: date6.getHours(),
                minute: date6.getMinutes(),
                repeats: true
            }
            const expectedContent = notificationContentWeekly(bond);
            await scheduleWeeklyNotification(schedule, bond)
            expect(scheduleNotificationAsync).toHaveBeenCalledTimes(7)
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger})
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger1})
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger2})
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger3})
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger4})
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger5})
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger6})


        })






    })

    describe("scheduleMonthlyNotification: ", () => {

        it("should call scheduleNotificationAsync 1x for MonthlySchedule with 1 date", async () => {
            const date = new Date("1995-12-17T09:30:00")
            const dom: DayOfMonth = {
                weekOfMonth: 1,
                dayOfWeek: 1,
                time: date
            }
            const schedule: MonthlySchedule = {
                daysInMonth: [dom]
            }
            const bond: Bond = {
                bondName: "a",
                bond_id: 1,
                schedule: "a",
                typeOfCall: "Monthly"
            }
            const expectedContent = notificationContentMonthly(bond);
            const expectedTrigger: CalendarTriggerInput = {
                weekOfMonth: dom.weekOfMonth,
                 weekday: dom.dayOfWeek,
                hour: dom.time.getHours(),
                minute: dom.time.getMinutes(),
                repeats: true,
            }

            await scheduleMonthlyNotification(schedule,bond)
            expect(scheduleNotificationAsync).toHaveBeenCalledTimes(1)
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger})
            
        })

        it("should call scheduleNotificationAsync 3x for MonthlySchedule with 3 dates", async () => {
            const date = new Date("1995-12-17T09:30:00")
            const date1 = new Date("1995-14-17T09:30:00")
            const date2 = new Date("1995-15-17T10:30:00")

            const dom: DayOfMonth = {
                weekOfMonth: 1,
                dayOfWeek: 1,
                time: date
            }
            const dom1: DayOfMonth = {
                weekOfMonth: 2,
                dayOfWeek: 2,
                time: date1
            }
            const dom2: DayOfMonth = {
                weekOfMonth: 3,
                dayOfWeek: 3,
                time: date2
            }
            const schedule: MonthlySchedule = {
                daysInMonth: [dom, dom1, dom2]
            }
            const bond: Bond = {
                bondName: "a",
                bond_id: 1,
                schedule: "a",
                typeOfCall: "Monthly"
            }
            const expectedContent = notificationContentMonthly(bond);
            const expectedTrigger: CalendarTriggerInput = {
                weekOfMonth: dom.weekOfMonth,
                 weekday: dom.dayOfWeek,
                hour: dom.time.getHours(),
                minute: dom.time.getMinutes(),
                repeats: true,
            }
            const expectedTrigger1: CalendarTriggerInput = {
                weekOfMonth: dom1.weekOfMonth,
                 weekday: dom1.dayOfWeek,
                hour: dom1.time.getHours(),
                minute: dom1.time.getMinutes(),
                repeats: true,
            }
            const expectedTrigger2: CalendarTriggerInput = {
                weekOfMonth: dom2.weekOfMonth,
                 weekday: dom2.dayOfWeek,
                hour: dom2.time.getHours(),
                minute: dom2.time.getMinutes(),
                repeats: true,
            }

            await scheduleMonthlyNotification(schedule,bond)
            expect(scheduleNotificationAsync).toHaveBeenCalledTimes(3)
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger})
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger1})
            expect(scheduleNotificationAsync).toHaveBeenCalledWith({content: expectedContent, trigger: expectedTrigger2})

            
        })



    })




})