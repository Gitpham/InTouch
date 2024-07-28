import { mockDatabase } from "@/__mocks__/expo-sqlite";
import { uploadScheduleToDB } from "@/assets/db/ScheduleRepo";
import { Bond, WeeklySchedule } from "@/constants/types";
import { writeWeeklyScheduleToDB } from "@/context/ScheduleUtils";
import * as SQlite from "expo-sqlite";

jest.mock("@/assets/db/ScheduleRepo", () => {
    const mockUploadScheduleToDB = jest.fn().mockImplementation(() => {
        return Promise.resolve()
    })
    return {
        uploadScheduleToDB: mockUploadScheduleToDB,
    };
});



describe("ScheduleUtils: ", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("writeWeeklyScheduleToDB() ", () => {

        it("should call uploadScheduleToDB() 0x when daysOfWeek is size 0", () => {
            const db = mockDatabase
            const schedule: WeeklySchedule = {
                monday: undefined,
                tuesday: undefined,
                wednesday: undefined,
                thursday: undefined,
                friday: undefined,
                saturday: undefined,
                sunday: undefined
            }
            const bond: Bond = {
                bondName: "",
                bond_id: 0,
                schedule: "",
                typeOfCall: ""
            }
            const nids: string[] = []
            writeWeeklyScheduleToDB(schedule, bond, nids, db)
            expect(uploadScheduleToDB).not.toHaveBeenCalled()
        })

        it("should call uploadScheduleToDB() 1x when daysOfWeek is size 1", () => {
            const db = mockDatabase
            const schedule: WeeklySchedule = {
                monday: new Date(),
                tuesday: undefined,
                wednesday: undefined,
                thursday: undefined,
                friday: undefined,
                saturday: undefined,
                sunday: undefined
            }
            const bond: Bond = {
                bondName: "",
                bond_id: 0,
                schedule: "",
                typeOfCall: ""
            }
            const nids = ["1"]
            writeWeeklyScheduleToDB(schedule, bond, nids, db)
            expect(uploadScheduleToDB).toHaveBeenCalledTimes(1);
        })

        it("should call uploadScheduleToDB() 7x when daysOfWeek is size 7", async () => {
            const db = mockDatabase
            const schedule: WeeklySchedule = {
                monday: new Date(),
                tuesday: new Date(),
                wednesday: new Date(),
                thursday: new Date(),
                friday: new Date(),
                saturday: new Date(),
                sunday: new Date()
            }
            const bond: Bond = {
                bondName: "",
                bond_id: 1,
                schedule: "",
                typeOfCall: ""
            }
            const nids = ["1", "2", "3", "4", "5", "6", "7"]
            await writeWeeklyScheduleToDB(schedule, bond, nids, db)
            expect(uploadScheduleToDB).toHaveBeenCalledTimes(7);
        })




    })




})