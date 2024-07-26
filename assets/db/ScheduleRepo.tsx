import { Schedule_DB } from "@/constants/types";
import * as SQLite from "expo-sqlite";

export async function uploadScheduleToDB(db: SQLite.SQLiteDatabase, 
    type: string,
    time: string, 
    weekDay: number | null, 
    weekOfMonth: number | null,
    date: string | null,
    bid: number, 
    nid: string){

    const statement = await db.prepareAsync(`INSERT INTO schedule 
        (type, time, weekDay, weekOfMonth, date, bond_id, notification_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`)

    const weekDayV: string | null = weekDay ? weekDay.toString() : null;
    const weekOfMonthV: string | null = weekOfMonth ? weekOfMonth.toString() : null;
    const dateV: string | null = date ? date.toString() : null;

    const value = [
        type,
        time,
        weekDayV,
        weekOfMonthV,
        dateV,
        bid.toString(),
        nid,
    ];
    try {
        return await statement.executeAsync(value);
    } catch (error) {
        console.error(error);
        throw Error("uploadScheduleToDB(): failed to executeAsync()")
    } finally {
        statement.finalizeAsync()
    }
}

export const deleteScheduleByBond = async (db: SQLite.SQLiteDatabase, bid: number) => {

    const statement = await db.prepareAsync(`
       DELETE FROM schedule
      WHERE bond_id = ?
        `);

    const value: string[] = [bid.toString()]

    try {
        return await statement.executeAsync(value)
    } catch (error) {
        console.error(error)
        throw Error("deleteScheduleByBond(): Failed execAsync")
    } finally {
        statement.finalizeAsync()
    }
}

export const deleteScheduleByNotificationID = async (db: SQLite.SQLiteDatabase, nid: string) => {

    const statement = await db.prepareAsync(`
       DELETE FROM schedule
      WHERE notification_id = ?
        `);

    const value: string[] = [nid]

    try {
        return await statement.executeAsync(value)
    } catch (error) {
        console.error(error)
        throw Error("deleteScheduleByNotificationID(): Failed execAsync")
    } finally {
        statement.finalizeAsync()
    }
}


export const getScheduleOfBond = async (db: SQLite.SQLiteDatabase, bid: number) => {
    const statement = await db.prepareAsync(`SELECT * FROM schedule WHERE bond_id = ?;`)
    const value: string[] = [bid.toString()]
    try {
        const result = await statement.executeAsync<Schedule_DB>(value);
        return await result.getFirstAsync();
    } catch (error) {
        console.error(error)
        throw Error("Failed to getAllPersons()")
    }
}
