import { Person } from "@/constants/types";
import * as SQLite from "expo-sqlite";




// INSERT INTO person (firstName, lastName, phoneNumber) VALUES ('Aaron', 'Howitzer', '000-000-0003');


export const addPerson = async (db: SQLite.SQLiteDatabase, person: Person) => {

    const statement = await db.prepareAsync(`INSERT INTO person (person_id, firstName, lastName, phoneNumber) VALUES (?, ?, ?, ?)`)
    const value: string[] = [(person.person_id as number).toString(), person.firstName, person.lastName, person.phoneNumber];

    try {
        return await statement.executeAsync(value);

    } catch (error) {
        console.error(error);
        throw Error("failed to upload person")
    } finally {
        statement.finalizeAsync()
    }

}

export const updatePerson = async (db: SQLite.SQLiteDatabase, updatedPerson: Person) => {
    const statement = await db.prepareAsync(`
        UPDATE person 
        SET firstName = ?, lastName = ?, phoneNumber = ?
        WHERE person_id = ?
        `);

    const value: string[] = [updatedPerson.firstName, updatedPerson.lastName, updatedPerson.phoneNumber, updatedPerson.person_id.toString()]

    try {
        return await statement.executeAsync(value)
    } catch (error) {
        console.error(error)
        throw Error("Failed to update person")
    } finally {
        statement.finalizeAsync()
    }
}

export const deletePerson = async (db: SQLite.SQLiteDatabase, pid: number) => {

    const statement = await db.prepareAsync(`
       DELETE FROM person
      WHERE person_id = ?
        `);

    const value: string[] = [pid.toString()]

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



export const getAllPersons = async (db: SQLite.SQLiteDatabase) => {
    try {
        return await db.getAllAsync<Person>(`SELECT * FROM person`)
    } catch (error) {
        console.error(error)
        throw Error("getAllPersons(): Failed to getAllPersons()")
    }
}

export const getPerson = async (db: SQLite.SQLiteDatabase, pID: number) => {
    const statement = await db.prepareAsync(`SELECT * FROM person WHERE person_id = ?;`)
    const value: string[] = [pID.toString()]
    try {
        const result = await statement.executeAsync<Person>(value);
        return await result.getFirstAsync();
    } catch (error) {
        console.error(error)
        throw Error("Failed to getAllPersons()")
    }
}




