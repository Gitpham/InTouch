import { getBond } from "@/assets/db/BondRepo";
import { getPerson } from "@/assets/db/PersonRepo";
import { addReminder } from "@/assets/db/ReminderRepo";
import { Reminder } from "@/constants/types";
import { SQLiteDatabase } from "expo-sqlite";

export async function getReminderName(db: SQLiteDatabase, reminder: Reminder) {
    let isBond = false; 
    if (reminder.bond_id) {
          isBond = true;
    }
    
    // Bond reminder
    if (isBond) {
      const bond = await getBond(db, reminder.bond_id as number);
      return bond?.bondName;
    } else {
      const person = await getPerson(db, reminder.person_id as number);
      return (`${person?.firstName} ${person?.lastName}` )
    }

}

export async function createReminderUtil(db: SQLiteDatabase, reminder: string, person_id: number, bond_id: number) {
    const date = new Date;
    // Extract date from date object
    const day = String(date.getDay()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    if (!person_id && !bond_id) {
      throw Error("person_id or bond_id must be provided");
    }

    let reminderToAdd : Reminder;

    if (bond_id === -1) {
      const personOwner = await getPerson(db, person_id);
      const ownerName = `${personOwner?.firstName} ${personOwner?.lastName}`
      reminderToAdd = {reminder_id: undefined, person_id: person_id, reminder: reminder, date: formattedDate, owner: ownerName }
    }
    else {
      const bondOwner = await getBond(db, bond_id);
      const ownerName = `${bondOwner?.bondName}`
      reminderToAdd = {reminder_id: undefined, bond_id: bond_id, reminder: reminder, date:formattedDate, owner: ownerName}
    }

    try {
      console.log("aboout to addReminder()");
      await addReminder(db, reminderToAdd)
    } catch (e) {
      console.error(e);
      throw new Error("createReminder(): Failed to create reminder")
    }

  }