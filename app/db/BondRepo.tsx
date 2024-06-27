import * as SQLite from "expo-sqlite";


export type Bond = {
    bondName: string,
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

export const getAllBonds = async (db: SQLite.SQLiteDatabase) =>{

    const bonds = await db.getAllAsync(`SELECT * FROM bond`)
    // const people 
    console.log("All persons in person", bonds)

    return bonds;
}

