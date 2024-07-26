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
export async function uploadWeeklyScheduleDB(db: SQLite.SQLiteDatabase, time: string, dayOfWeek: number, nid: string, bid: number){
    const statement =
    await db.prepareAsync(`INSERT INTO weeklySchedule (time, dayOfWeek, notification_id, bond_id)
         VALUES (?, ?, ?, ?);`);

    const value: string[] = [time, dayOfWeek.toString(), nid, bid.toString()];
  try {
    return await statement.executeAsync(value);
  } catch (error) {
    console.error(error);
    throw Error("uploadWeeklyScheduleDB() failed");
  } finally {
    statement.finalizeAsync();
  }
}

export const deleteWeeklyScheduleDB = async (db: SQLite.SQLiteDatabase, bid: number) => {
    const statement = await db.prepareAsync(`
         DELETE FROM weeklySchedule
        WHERE bond_id = ?
          `);
  
      const value: string[] = [bid.toString()]
      
      try {
          return await statement.executeAsync(value)
      } catch (error) {
          console.error(error)
          throw Error("deleteWeeklyScheduleDB() Failed")
      } finally {
          // console.log("finalize updatePerson async")
          statement.finalizeAsync()
      }
    }

    export const getWeeklyScheduleDB = async (db: SQLite.SQLiteDatabase, bid: number) => {
        const statement = await db.prepareAsync(`SELECT * FROM weeklySchedule WHERE bond_id = ?;`)
        const value: string[] = [bid.toString()]
        try {
            const result = await statement.executeAsync(value);
            return await result.getFirstAsync();
        } catch (error) {
            console.error(error)
            throw Error("getWeeklySchedule() failed")
        }
    }
    