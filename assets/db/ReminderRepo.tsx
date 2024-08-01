import { Reminder } from "@/constants/types";
import * as SQLite from "expo-sqlite";

export const addReminder = async (db: SQLite.SQLiteDatabase, reminder: Reminder) => {


    const statement = await db.prepareAsync(`INSERT INTO reminder (reminder_id, person_id, bond_id, reminder, date) VALUES (?, ?, ?, ?, ?)`)
    let value : string[];
   
    if (!reminder.bond_id) {
        value = [`${reminder.reminder_id}`, `${reminder.person_id}`, null, reminder.reminder, reminder.date]
    }
    else {
        value = [`${reminder.reminder_id}`, null, `${reminder.bond_id}`, reminder.reminder, reminder.date]
    }

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


export const getAllReminders = async (db: SQLite.SQLiteDatabase) : Promise<Reminder[]> => {
    try {
        return await db.getAllAsync<Reminder>(`SELECT * FROM reminder`)
    } catch (error) {
        console.error(error)
        throw Error("Failed to getAllReminders()")
    }
}
