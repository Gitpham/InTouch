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
export async function uploadMonthlyScheduleDB(db: SQLite.SQLiteDatabase, time: string, dayOfWeek: number, weekOfMonth: number, nid: string, bid: number){
    const statement =
    await db.prepareAsync(`INSERT INTO monthlySchedule (time, dayOfWeek, weekOfMonth, notification_id, bond_id)
         VALUES (?, ?, ?, ?);`);

    const value: string[] = [time, dayOfWeek.toString(), weekOfMonth.toString(), nid, bid.toString()];
  try {
    return await statement.executeAsync(value);
  } catch (error) {
    console.error(error);
    throw Error("uploadMonthlyScheduleDB() failed");
  } finally {
    statement.finalizeAsync();
  }
}

export const deleteMonthlyScheduleDB = async (db: SQLite.SQLiteDatabase, bid: number) => {
    const statement = await db.prepareAsync(`
         DELETE FROM monthlySchedule
        WHERE bond_id = ?
          `);
  
      const value: string[] = [bid.toString()]
      
      try {
          return await statement.executeAsync(value)
      } catch (error) {
          console.error(error)
          throw Error("deleteMonthlyScheduleDB() Failed")
      } finally {
          // console.log("finalize updatePerson async")
          statement.finalizeAsync()
      }
    }

    export const getMonthlyScheduleDB = async (db: SQLite.SQLiteDatabase, bid: number) => {
        const statement = await db.prepareAsync(`SELECT * FROM monthlySchedule WHERE bond_id = ?;`)
        const value: string[] = [bid.toString()]
        try {
            const result = await statement.executeAsync(value);
            return await result.getFirstAsync();
        } catch (error) {
            console.error(error)
            throw Error("getMonthlySchedule() failed")
        }
    }
    