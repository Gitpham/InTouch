import * as SQLite from "expo-sqlite";

/**
 * 
 * @param db 
 * @param time 
 * @param day 1 = sunday 7 = saturday
 * @param nid 
 * @param bid 
 * @returns 
 */
export async function uploadYearlyScheduleDB(db: SQLite.SQLiteDatabase, time: string, date: string, nid: string, bid: number){
    const statement =
    await db.prepareAsync(`INSERT INTO yearlySchedule (time, date, notification_id, bond_id)
         VALUES (?, ?, ?, ?);`);

    const value: string[] = [time, date.toString(), nid, bid.toString()];
  try {
    return await statement.executeAsync(value);
  } catch (error) {
    console.error(error);
    throw Error("uploadYearlyScheduleDB() failed");
  } finally {
    statement.finalizeAsync();
  }
}

export const deleteYearlyScheduleDB = async (db: SQLite.SQLiteDatabase, bid: number) => {
    const statement = await db.prepareAsync(`
         DELETE FROM yearlySchedule
        WHERE bond_id = ?
          `);
  
      const value: string[] = [bid.toString()]
      
      try {
          return await statement.executeAsync(value)
      } catch (error) {
          console.error(error)
          throw Error("deleteYearlyScheduleDB() Failed")
      } finally {
          // console.log("finalize updatePerson async")
          statement.finalizeAsync()
      }
    }

    export const getMonthlyScheduleDB = async (db: SQLite.SQLiteDatabase, bid: number) => {
        const statement = await db.prepareAsync(`SELECT * FROM yearlySchedule WHERE bond_id = ?;`)
        const value: string[] = [bid.toString()]
        try {
            const result = await statement.executeAsync(value);
            return await result.getFirstAsync();
        } catch (error) {
            console.error(error)
            throw Error("getYearlySchedule() failed")
        }
    }
    