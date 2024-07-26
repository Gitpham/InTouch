import * as SQLite from "expo-sqlite";

export async function uploadScheduleToDB(db: SQLite.SQLiteDatabase, 
    type: string,
    time: string, 
    weekDay: number | null, 
    weekOfMonth: number | null,
    date: string | null,
    bid: number, 
    nid: number){

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
        nid.toString()
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