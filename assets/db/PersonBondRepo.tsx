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

    const value: string[] = [(person.person_id as number).toString(), bond.bond_id.toString()]

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

export const updatePersonBond = async (db: SQLite.SQLiteDatabase, pID: number, bID: number, isNextToCall: number) => {
    const statement = await db.prepareAsync(`
        UPDATE person_bond
        SET nextToCall = ?
        WHERE person_id = ? AND bond_id = ?;
        `);

    const value: string[] = [isNextToCall.toString(), pID.toString(), bID.toString()];
    try {
        return await statement.executeAsync(value)
    } catch (error) {
        console.error(error)
        throw Error("Failed to update personBond")
    } finally {
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

export const getPersonsOfBondDB = async (db: SQLite.SQLiteDatabase, bond: Bond) => {
    const statement = await db.prepareAsync(`
        SELECT * FROM person_bond
        WHERE bond_id = ?
         ;`);

    const value: string[] = [bond.bond_id.toString()]
    try {
        const result =  await statement.executeAsync<BondPerson>(value);
        const rows = await result.getAllAsync();
        return rows;

    } catch (e) {
        console.error(e);
        throw Error("getPersonsOfBondDB: failed to get persons of Bond")
    } finally {
        await statement.finalizeAsync();
    }
}