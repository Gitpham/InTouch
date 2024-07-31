import { Bond } from "@/constants/types";
import * as SQLite from "expo-sqlite";

export const addBond = async (db: SQLite.SQLiteDatabase, bond: Bond) => {
  const statement =
    await db.prepareAsync(`INSERT INTO bond (bond_id, bondName, schedule, type_of_call)
         VALUES (?, ?, ?, ?);`);

  const value: string[] = [bond.bond_id.toString(), bond.bondName, bond.schedule, bond.typeOfCall];

  try {
    return await statement.executeAsync(value);
  } catch (error) {
    console.error(error);
    throw Error("failed to upload bond");
  } finally {
    statement.finalizeAsync();
  }
};

export const updateBond = async (
  db: SQLite.SQLiteDatabase,
  updatedBond: Bond
) => {
  const statement = await db.prepareAsync(`
        UPDATE bond 
        SET bondName = ?, schedule = ?, type_of_call = ?
        WHERE bond_id = ?
        `);

    const value: string[] = [updatedBond.bondName, updatedBond.bond_id.toString()]
    
    try {
        return await statement.executeAsync(value)
    } catch (error) {
        console.error(error)
        throw Error("Failed to update bond")
    } finally {
        // console.log("finalize updatePerson async")
        statement.finalizeAsync()
    }
}

export const deleteBond = async (db: SQLite.SQLiteDatabase, bond: Bond) => {
  const statement = await db.prepareAsync(`
       DELETE FROM bond
      WHERE bond_id = ?
        `);

    const value: string[] = [bond.bond_id.toString()]
    
    try {
        return await statement.executeAsync(value)
    } catch (error) {
        console.error(error)
        throw Error("Failed to delete bond")
    } finally {
        // console.log("finalize updatePerson async")
        statement.finalizeAsync()
    }
  }


export const getAllBonds = async (db: SQLite.SQLiteDatabase) => {
  try { 
    return await db.getAllAsync<Bond>(`SELECT * FROM bond`);
  } catch (e) {
    console.error(e);
    throw new Error("getAllBonds() failed")
  }
};


export const getBond = async (db: SQLite.SQLiteDatabase, bid: number) => {
  try { 
    const statement = await db.prepareAsync(`SELECT * FROM bond
      WHERE bond_id = ?
      `);
    const value: string[] = [bid.toString()];
    const result = await statement.executeAsync(value);
    return result.getFirstAsync();
  } catch (e) {
    console.error(e);
    throw new Error("getAllBonds() failed")
  }

}