import * as SQLite from "expo-sqlite";


export type Bond = {
    bondName: string,
    id: string,
    schedule: string, 
    typeOfCall: string,
}

export const addBond = async (db: SQLite.SQLiteDatabase, bond:Bond) =>{

    const statement = await db.prepareAsync(`INSERT INTO bond (bondName) VALUES (?)`)

    const value: string[] = [bond.bondName];

    try {
        console.log("add bond")
        return await statement.executeAsync(value);

    } catch (error) {
        console.error(error);
        throw Error("failed to upload bond")
    } finally {
        console.log("finalize bond async")
        statement.finalizeAsync()
    }

}

export const updateBond = async (db: SQLite.SQLiteDatabase, updatedBond: Bond) => {
    const statement = await db.prepareAsync(`
        UPDATE bond 
        SET bondName = ?
        WHERE bond_id = ?
        `);

    const value: string[] = [updatedBond.bondName, updatedBond.id]
    
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
      WHERE id = ?
        `);

    const value: string[] = [bond.id]
    
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



export const getAllBonds = async (db: SQLite.SQLiteDatabase) =>{

    const bonds = await db.getAllAsync<Bond>(`SELECT * FROM bond`)
    // const people 
    console.log("All persons in person", bonds)

    return bonds;
}

