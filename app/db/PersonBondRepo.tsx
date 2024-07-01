import * as SQLite from "expo-sqlite";
import { Bond } from "./BondRepo";
import { Person } from "./PersonRepo";

export const addGroupMember = async (db: SQLite.SQLiteDatabase, person: Person, bond: Bond) => {

    const statement = await db.prepareAsync(`INSERT INTO person_bond (person_id, bond_id) VALUES (?, ?)`)

    const value: string[] = [person.id, bond.id];

    try {
        console.log("adding group member")
        return await statement.executeAsync(value);

    } catch (error) {
        console.error(error);
        throw Error("failed to add group member")
    } finally {
        statement.finalizeAsync()
    }

}

export const deleteGroupMember = async (db: SQLite.SQLiteDatabase, person: Person, bond: Bond) => {

    const statement = await db.prepareAsync(`
       DELETE FROM person_bond
        WHERE person_id = ? & bond_id = ?
        `);

    const value: string[] = [person.id, bond.id]

    try {
        console.log('removing group member')
        return await statement.executeAsync(value)
    } catch (error) {
        console.error(error)
        throw Error("Failed to delete person")
    } finally {
        // console.log("finalize updatePerson async")
        statement.finalizeAsync()
    }
}



export const getAllGroupMembers = async (db: SQLite.SQLiteDatabase, bond: Bond) => {

    const statement = await db.prepareAsync(
        `SELECT person.firstName, person.lastName, person.phoneNumber, person.id
        FROM person 
        INNER JOIN person_bond 
        WHERE person_bond.group_id = ?
        `);
    
    const value: string[] = [bond.id]

    try {
        console.log('fetching bond members')
        return await statement.executeAsync<Person>(value)
    } catch (error) {
        console.error(error)
        throw Error("Failed to fetch bond")
    } finally {
        statement.finalizeAsync()
    }
}