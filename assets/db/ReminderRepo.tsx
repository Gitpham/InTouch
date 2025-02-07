import { Reminder } from "@/constants/types";
import * as SQLite from "expo-sqlite";

export const addReminder = async (db: SQLite.SQLiteDatabase, reminder: Reminder) => {

    const statement = await db.prepareAsync(`INSERT INTO reminder (person_id, bond_id, reminder, date, owner) VALUES (?, ?, ?, ?, ?)`)
    let value : string[];
    console.log("addReminder after statement")
   
    if (!reminder.bond_id) {
        value = [ `${reminder.person_id}`, null, reminder.reminder, reminder.date, reminder.owner]
    }
    else {
        value = [null, `${reminder.bond_id}`, reminder.reminder, reminder.date, reminder.owner]
    }

    try {
        return await statement.executeAsync(value);

    } catch (error) {
        console.error(error);
        throw Error("addReminder(): failed to upload reminder")
    } finally {
        statement.finalizeAsync()
    }
}

export const deleteReminder = async (db: SQLite.SQLiteDatabase, reminder_id: number) => {
    // needed because PRAGMA foreing_keys = ON only happens at runtime
    await db.execAsync('PRAGMA foreign_keys = ON');
    
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

export const getRemindersOfPersonDB = async (db: SQLite.SQLiteDatabase, pid: number) : Promise<Reminder[]> => {
    const statement = await db.prepareAsync(`
        SELECT * FROM reminder
        WHERE person_id = ?
         ;`);

    const value: string[] = [pid.toString()]
    try {
        const result =  await statement.executeAsync<Reminder>(value);
        const rows = await result.getAllAsync<Reminder>(value);
        return rows;

    } catch (e) {
        console.error(e);
        throw Error("getRemindersOfPerson: failed")
    } finally {
        await statement.finalizeAsync();
    }
}

export const getRemindersOfBondDB = async (db: SQLite.SQLiteDatabase, bid: number) : Promise<Reminder[]> => {
    const statement = await db.prepareAsync(`
        SELECT * FROM reminder
        WHERE bond_id = ?
         ;`);

    const value: string[] = [bid.toString()]
    try {
        const result =  await statement.executeAsync<Reminder>(value);
        const rows = await result.getAllAsync<Reminder>(value);
        return rows;

    } catch (e) {
        console.error(e);
        throw Error("getRemindersOfBondDB(): failed to get reminders of Bond")
    } finally {
        await statement.finalizeAsync();
    }
}
