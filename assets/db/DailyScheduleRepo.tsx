import * as SQLite from "expo-sqlite";



export async function uploadDailyScheduleDB(db: SQLite.SQLiteDatabase, time: string, nid: string, bid: number){
    const statement =
    await db.prepareAsync(`INSERT INTO dailySchedule (time, notification_id, bond_id)
         VALUES (?, ?, ?);`);

    const bidString = bid.toString()
    const value: string[] = [time, nid, bidString];
  try {
    return await statement.executeAsync(value);
  } catch (error) {
    console.error(error);
    throw Error("uploadDailyScheduleDB() failed");
  } finally {
    statement.finalizeAsync();
  }
}

export const deleteDailyScheduleDB = async (db: SQLite.SQLiteDatabase, bid: number) => {
    const statement = await db.prepareAsync(`
         DELETE FROM dailySchedule
        WHERE bond_id = ?
          `);
  
      const value: string[] = [bid.toString()]
      
      try {
          return await statement.executeAsync(value)
      } catch (error) {
          console.error(error)
          throw Error("deleteDailyScheduleDB() Failed")
      } finally {
          // console.log("finalize updatePerson async")
          statement.finalizeAsync()
      }
    }

    export const getDailyScheduleDB = async (db: SQLite.SQLiteDatabase, bid: number) => {
        const statement = await db.prepareAsync(`SELECT * FROM dailySchedule WHERE bond_id = ?;`)
        const value: string[] = [bid.toString()]
        try {
            const result = await statement.executeAsync(value);
            return await result.getFirstAsync();
        } catch (error) {
            console.error(error)
            throw Error("getDailySchedule() failed")
        }
    }
    