import { getBond } from "@/assets/db/BondRepo";
import { getPerson } from "@/assets/db/PersonRepo";
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