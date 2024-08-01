import { Reminder } from "@/constants/types";
import { openDatabaseAsync } from "expo-sqlite";
import { addReminder, deleteReminder, getAllReminders } from "@/assets/db/ReminderRepo";
import { mockExecuteAsync, mockGetAllAsync, mockPrepareAsync, testReminderList, reminderA1, reminderA3} from "@/__mocks__/expo-sqlite";

const now = new Date;
const reminderA4: Reminder = {
    date: now,
    reminder_id: 4,
    person_id: null,
    bond_id: 3,
    reminder: "Walk the dog"
  }

jest.mock("expo-sqlite");

describe("ReminderRepo unit tests", () => {
    beforeEach(() => {
      mockPrepareAsync.mockClear();
      mockExecuteAsync.mockClear();
      mockGetAllAsync.mockClear();
    });

    it("addReminder() should call db with the correct sql", async () => {
        const r: Reminder = reminderA4;
        const reminderID: string = r.reminder_id.toString();
    
        const db = await openDatabaseAsync("name")

        await addReminder(db, r);
        expect(mockPrepareAsync).toHaveBeenCalledWith(
          "INSERT INTO reminder (reminder_id, person_id, bond_id, reminder, date) VALUES (?, ?, ?, ?, ?)"
        );
        expect(mockExecuteAsync).toHaveBeenCalledWith([
            r.reminder_id.toString(),
            r.person_id,
            r.bond_id?.toString(),
            r.reminder,
            r.date
        ]);
      });

      it("deleteReminder() should call with correct sql", async () => {
        const r: Reminder = reminderA4;
    
        const db = await openDatabaseAsync("name");
        await deleteReminder(db, r.reminder_id);
        const expectedSql = `
       DELETE FROM reminder
      WHERE reminder_id = ?
        `;
    
        expect(mockPrepareAsync).toHaveBeenCalledWith(expectedSql);
    
        expect(mockExecuteAsync).toHaveBeenCalledWith([
          `${r.reminder_id}`
        ]);
      });


      it("getAllREmidners() should call with correct sql", async () => {
        const db = await openDatabaseAsync("name");
        const v = await getAllReminders(db)
        expect(mockGetAllAsync).toHaveBeenCalledWith(`SELECT * FROM reminder`)
        expect(v).toEqual(testReminderList)
      })

});