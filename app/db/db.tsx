import * as SQLite from 'expo-sqlite';
import { SQLiteAnyDatabase } from 'expo-sqlite/build/NativeStatement';



export const connectToDatabase = async () => {

    const db = await SQLite.openDatabaseAsync("InTouchDB_1");
    console.log("Successfully opened db");
    return db
  }

  export const createTables = async (db: SQLite.SQLiteDatabase) => {
    const groupQuery = `
        CREATE TABLE IF NOT EXISTS bond (
            bond_id INTEGER PRIMARY KEY AUTOINCREMENT,
            bondName TEXT NOT NULL UNIQUE
            );
            `


    const personQuery = `
        CREATE TABLE IF NOT EXISTS person (
            person_id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT,
            phoneNumber TEXT NOT NULL UNIQUE
            );
            `

    

    const personBondQuery = `
        CREATE TABLE IF NOT EXISTS person_bond (
            person_id INTEGER,
            bond_id INTEGER,
            PRIMARY KEY (person_id, bond_id),
            FOREIGN KEY (person_id)
                REFERENCES person (person_id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION
            FOREIGN KEY (bond_id)
                REFERENCES bond (bond_id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION
        );
    `

    try {
        await db.execAsync(personQuery);
        // console.log("person table")
        await db.execAsync(groupQuery);
        // console.log("group table")
        await db.execAsync(personBondQuery);
        // console.log("personGroup")
    } catch (error) {
        console.error(error);
        throw Error(`failed to create tables`)
    }
  }

  export const getTableNames = async (db: SQLite.SQLiteDatabase): Promise<string[]> => {
    try {
        const tableNames: string[] = [];
        const results = await db.getAllAsync(
            "SELECT name FROM sqlite_master WHERE type ='table' and name NOT LIKE 'sqlite_%'"
        )

        const results2 = await db.getAllAsync("PRAGMA table_info(bond);")
        console.log("table columns", results2)

        results?.forEach( result => {
            // // console.log(result)
            // console.log(result)
            // for (let index = 0; index < results)
            interface table {
                name: string
            }
            let r = result as table
            
            // console.log(r.name)
            tableNames.push(r.name as string)

        })
        // console.log("tablename", tableNames)
        return tableNames
        
    } catch (error) {
        console.error(error);
        throw Error("Failed to get table names from database")
    }
  }

  export type Table = "person" | "bond" | "person_bond";

  export const removeTable = async (db: SQLite.SQLiteDatabase, tableName: Table) => {
    const query = `DROP TABLE IF EXISTS ${tableName}`;
    try {
        await db.execAsync(query)
    } catch (error) {
        console.error(error);
        throw Error(`failed to drop table ${tableName}`)
    }
    
  }

  //test