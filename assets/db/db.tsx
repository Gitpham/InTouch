import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

export const loadDB = async () => {
    try {
      const dbName = "Test_DataBase_7.db";
      const dbAsset = require("../Test_DataBase_7.db");
      const dbUri = Asset.fromModule(dbAsset).uri;
      const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  

      const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
      console.log("(a) fileINFO: ", fileInfo)
  
      if (!fileInfo.exists) {


        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}SQLite`
          // { intermediates: true }
        );
        console.log("b")
        await FileSystem.downloadAsync(dbUri, dbFilePath);
        console.log("c")

      }
    } catch (e) {
      console.error(e);
      console.log("failed to loadDB()");
    }
  };


export const clearDB = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.execAsync('DELETE FROM person;');
    await db.execAsync('DELETE FROM bond;');
    await db.execAsync('DELETE FROM person_bond;');

  } catch (e) {
    console.error(e);
    throw Error ("failed to clearDB()")
  }
}




export const createDB = async (db: SQLite.SQLiteDatabase) => {
  const groupQuery = `
        CREATE TABLE IF NOT EXISTS bond (
            bond_id INTEGER PRIMARY KEY,
            bondName TEXT NOT NULL UNIQUE,
            schedule TEXT,
            type_of_call TEXT
            );
            `;

  const personQuery = `
        CREATE TABLE IF NOT EXISTS person (
            person_id INTEGER PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT,
            phoneNumber TEXT NOT NULL UNIQUE
            );
            `;

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
    `;

  const reminderQuery = `
        CREATE TABLE IF NOT EXISTS reminder (
            reminder_id INTEGER,
            person_id INTEGER NULL,
            bond_id INTEGER NULL,
            reminder TEXT,
            date DATE,
            PRIMARY KEY (reminder_id),
            FOREIGN KEY (person_id)
                REFERENCES person (person_id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION
            FOREIGN KEY (bond_id)
                REFERENCES bond (bond_id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION
        );
  `;


  try {
    console.log("creating db: ", db.databaseName)
    await db.execAsync('PRAGMA foreign_keys = ON');
    await db.execAsync(personQuery);
    // console.log("person table")
    await db.execAsync(groupQuery);
    // console.log("group table")
    await db.execAsync(personBondQuery);
    // console.log("personGroup")
    await db.execAsync(reminderQuery);
  } catch (error) {
    console.error(error);
    throw Error(`failed to create tables`);
  }
};

//kj

export const getTableNames = async (
  db: SQLite.SQLiteDatabase
): Promise<string[]> => {
  try {
    const tableNames: string[] = [];
    const results = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type ='table' and name NOT LIKE 'sqlite_%'"
    );

    // const results2 = await db.getAllAsync("PRAGMA table_info(bond);");
    // console.log("table columns", results2);

    results?.forEach((result) => {
      // // console.log(result)
      // console.log(result)
      // for (let index = 0; index < results)
      interface table {
        name: string;
      }
      const r = result as table;

      // console.log(r.name)
      tableNames.push(r.name as string);
    });
    console.log("tablename", tableNames)
    return tableNames;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};

export type Table = "person" | "bond" | "person_bond" | "reminder";

export const removeTable = async (
  db: SQLite.SQLiteDatabase,
  tableName: Table
) => {
  const query = `DROP TABLE IF EXISTS ${tableName}`;
  try {
    await db.execAsync(query);
  } catch (error) {
    console.error(error);
    throw Error(`failed to drop table ${tableName}`);
  }
};

//test
