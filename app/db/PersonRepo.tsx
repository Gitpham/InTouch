import * as SQLite from "expo-sqlite";


export type Person = {
    firstName: string,
    lastName: string,
    phoneNumber: string,
}

export const addPerson = async (db: SQLite.SQLiteDatabase, person:Person) =>{


    const statement = await db.prepareAsync(`INSERT INTO person (firstName, lastName, phoneNumber) VALUES (?, ?, ?)`)

    const value: string[] = [person.firstName, person.lastName, person.phoneNumber];

    try {
        console.log("add person")
        return await statement.executeAsync(value);

    } catch (error) {
        console.error(error);
        throw Error("failed to upload person")
    } finally {
        console.log("finalize person async")
        statement.finalizeAsync()
    }

}

export const getAllPersons = async (db: SQLite.SQLiteDatabase) =>{

    const people = await db.getAllAsync(`SELECT * FROM person`)
    // const people 
    console.log("All persons in person", people)

    return null;
}

