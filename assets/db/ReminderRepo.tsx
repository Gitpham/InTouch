import { Reminder } from "@/constants/types";
import * as SQLite from "expo-sqlite";

export const addReminder = async (db: SQLite.SQLiteDatabase, reminder: Reminder) => {

    // Extract date from date object
    let date = reminder.date
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    const statement = await db.prepareAsync(`INSERT INTO reminder (reminder_id, person_id, bond_id, reminder, date) VALUES (?, ?, ?, ?, ?)`)
    const value: string[] = [`${reminder.reminder_id}`, `${reminder.person_id}`, null, reminder.reminder, formattedDate]

    try {
        return await statement.executeAsync(value);

    } catch (error) {
        console.error(error);
        throw Error("failed to upload person")
    } finally {
        statement.finalizeAsync()
    }
}

export const deleteReminder = async (db: SQLite.SQLiteDatabase, reminder_id: number) => {

    const statement = await db.prepareAsync(`
       DELETE FROM reminder
      WHERE reminder_id = ?
        `);

    const value: string[] = [reminder_id.toString()]

    try {
        return await statement.executeAsync(value)
    } catch (error) {
        console.error(error)
        throw Error("Failed to delete person")
    } finally {
        // console.log("finalize updatePerson async")
        statement.finalizeAsync()
    }
}


export const getAllReminders = async (db: SQLite.SQLiteDatabase) => {
    try {
        return await db.getAllAsync<Reminder>(`SELECT * FROM reminder`)
    } catch (error) {
        console.error(error)
        throw Error("Failed to getAllReminders()")
    }
}
