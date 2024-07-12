import { Person, Bond, BondPerson } from "@/constants/types";
import * as SQLite from "expo-sqlite";


export const addPersonBond = async (db: SQLite.SQLiteDatabase, person_id: number, bond_id: number) => {

    const statement = await db.prepareAsync(`INSERT INTO person_bond (person_id, bond_id) VALUES (?, ?)`)

    const value: string[] = [person_id.toString(), bond_id.toString()];

    try {
        return await statement.executeAsync(value);

    } catch (error) {
        console.error(error);
        throw Error("addPersonBond(): failed to add group member")
    } finally {
        statement.finalizeAsync()
    }

}

export const deletePersonBond = async (db: SQLite.SQLiteDatabase, person: Person, bond: Bond) => {

    const statement = await db.prepareAsync(`
       DELETE FROM person_bond
        WHERE person_id = ? & bond_id = ?
        `);

    const value: string[] = [person.person_id.toString(), bond.bond_id.toString()]

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



export const getAllPersonBonds = async (db: SQLite.SQLiteDatabase) => {

    try {
        return await db.getAllAsync<BondPerson>(
            `SELECT *
            FROM person_bond
            `);
    } catch (error) {
        console.error(error)
        throw Error("Failed to get all Person Bonds")
    } 
}