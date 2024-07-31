import * as SQLite from "expo-sqlite";

export async function uploadNotificationDB(
  db: SQLite.SQLiteDatabase,
  bid: number,
  nid: string
) {
  const statement =
    await db.prepareAsync(`INSERT INTO notifications (notification_id, bond_id)
         VALUES (?, ?);`);

  const bidString = bid.toString();
  const value: string[] = [nid, bidString];
  try {
    return await statement.executeAsync(value);
  } catch (error) {
    console.error(error);
    throw Error("uploadNotificationDB() failed");
  } finally {
    statement.finalizeAsync();
  }
}

export const clearNotificationsDB = async (
  db: SQLite.SQLiteDatabase,
  bid: number
) => {
  const statement = await db.prepareAsync(`
         DELETE FROM notifications
        WHERE bond_id = ?
          `);

  const value: string[] = [bid.toString()];

  try {
    return await statement.executeAsync(value);
  } catch (error) {
    console.error(error);
    throw Error("clearNoticitionsDB() Failed");
  } finally {
    // console.log("finalize updatePerson async")
    statement.finalizeAsync();
  }
};

export const getNotificationsForBondDB = async (
  db: SQLite.SQLiteDatabase,
  bid: number
) => {
  const statement = await db.prepareAsync(
    `SELECT * FROM notifications WHERE bond_id = ?;`
  );
  const value: string[] = [bid.toString()];
  try {
    const result = await statement.executeAsync(value);
    return await result.getFirstAsync();
  } catch (error) {
    console.error(error);
    throw Error("getNotifications() failed");
  }
};
