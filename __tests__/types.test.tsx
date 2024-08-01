import { DateAndTime, isYearlySchedule, YearlySchedule } from "@/constants/types"

describe(" isType() fcns", () => {

    describe("isYearlySchedule()", () => {

        it("isYearlySchedule() should return true for a yearlySchedule of size 1", () => {
            const d: DateAndTime = {
                date: new Date(),
                time: new Date(),
            }
            const ys: YearlySchedule = {
                datesInYear: new Set([d])
            }

            expect(isYearlySchedule(ys)).toBeTruthy();
        })

        it("isYearlySchedule() should return true for a yearlySchedule of size 2", () => {
            const d1: DateAndTime = {
                date: new Date(),
                time: new Date(),
            }

            const d2: DateAndTime = {
                date: new Date(),
                time: new Date(),
            }
            const ys: YearlySchedule = {
                datesInYear: new Set([d1, d2])
            }

            expect(isYearlySchedule(ys)).toBeTruthy();
        })

        it("isYearlySchedule() should return false for a yearlySchedule of size 0", () => {
            const ys: YearlySchedule = {
                datesInYear: new Set([])
            }
            expect(isYearlySchedule(ys)).toBeFalsy();
        })
    })



})