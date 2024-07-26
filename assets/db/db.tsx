import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

export const loadDB = async () => {
  try {
    const dbName = "Test_DataBase_7.db";
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dbAsset = require("../Test_DataBase_7.db");
    const dbUri = Asset.fromModule(dbAsset).uri;
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    console.log("(a) fileINFO: ", fileInfo);

    if (!fileInfo.exists) {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite`
        // { intermediates: true }
      );
      console.log("b");
      await FileSystem.downloadAsync(dbUri, dbFilePath);
      console.log("c");
    }
  } catch (e) {
    console.error(e);
    console.log("failed to loadDB()");
  }
};

export const clearDB = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.execAsync("DELETE FROM person;");
    await db.execAsync("DELETE FROM bond;");
    await db.execAsync("DELETE FROM person_bond;");
  } catch (e) {
    console.error(e);
    throw Error("failed to clearDB()");
  }
};

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
            nextToCall INTEGER DEFAULT 0,
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
                ON UPDATE NO ACTION);`;

  const scheduleQuery = `
                CREATE TABLE IF NOT EXISTS schedule (
                    notification_id INTEGER,
                    bond_id INTEGER,
                    type TEXT,
                    time TEXT DEFAULT NULL,
                    weekDay INTEGER DEFAULT NULL,
                    weekOfMonth INTEGER DEFAULT NULL,
                    date TEXT DEFAULT NULL,
                    PRIMARY KEY (notification_id),
                    FOREIGN KEY (bond_id)
                        REFERENCES bond (bond_id)
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION
                );`;

  // const notificationQuery = `
  //       CREATE TABLE IF NOT EXISTS notifications (
  //           notification_id INTEGER,
  //           bond_id INTEGER,
  //           PRIMARY KEY (notification_id),
  //           FOREIGN KEY (bond_id)
  //               REFERENCES bond (bond_id)
  //               ON DELETE CASCADE
  //               ON UPDATE NO ACTION
  //       );`;

  // const dailyQuery = `
  //       CREATE TABLE IF NOT EXISTS dailySchedule (
  //           time TEXT,
  //           bond_id INTEGER,
  //           notification_ID TEXT,
  //           PRIMARY KEY (notification_ID),
  //           FOREIGN KEY (bond_id)
  //               REFERENCES bond (bond_id)
  //               ON DELETE CASCADE
  //               ON UPDATE NO ACTION
  //       );
  //   `;

  // const weeklyQuery = `
  //       CREATE TABLE IF NOT EXISTS weeklySchedule (
  //           time TEXT,
  //           dayOfWeek INTEGER,
  //           bond_id INTEGER,
  //           notification_ID TEXT,
  //           PRIMARY KEY (notification_ID),
  //           FOREIGN KEY (bond_id)
  //               REFERENCES bond (bond_id)
  //               ON DELETE CASCADE
  //               ON UPDATE NO ACTION
  //       );
  //   `;

  // const monthlyQuery = `
  //       CREATE TABLE IF NOT EXISTS monthlySchedule (
  //           time TEXT,
  //           dayOfWeek INTEGER,
  //           weekOfMonth INTEGER,
  //           bond_id INTEGER,
  //           notification_ID TEXT,
  //           PRIMARY KEY (notification_ID),
  //           FOREIGN KEY (bond_id)
  //               REFERENCES bond (bond_id)
  //               ON DELETE CASCADE
  //               ON UPDATE NO ACTION
  //       );
  //   `;

  // const yearlyQuery = `
  //       CREATE TABLE IF NOT EXISTS yearlySchedule (
  //           time TEXT,
  //           date TEXT,
  //           bond_id INTEGER,
  //           notification_ID TEXT,
  //           PRIMARY KEY (notification_ID),
  //           FOREIGN KEY (bond_id)
  //               REFERENCES bond (bond_id)
  //               ON DELETE CASCADE
  //               ON UPDATE NO ACTION
  //       );
  //   `;

  try {
    await db.execAsync("PRAGMA foreign_keys = ON");
    await db.execAsync(personQuery);
    await db.execAsync(groupQuery);
    await db.execAsync(personBondQuery);
    await db.execAsync(reminderQuery);
    await db.execAsync(scheduleQuery)
    // await db.execAsync(notificationQuery);
    // await db.execAsync(dailyQuery);
    // await db.execAsync(weeklyQuery);
    // await db.execAsync(monthlyQuery);
    // await db.execAsync(yearlyQuery);
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
    results?.forEach((result) => {
      interface table {
        name: string;
      }
      const r = result as table;
      tableNames.push(r.name as string);
    });
    console.log("tablename", tableNames);
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
