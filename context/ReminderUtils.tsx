import { Bond, Person, Reminder } from "@/constants/types";

export function getReminderName(reminder: Reminder, bondList: Bond[], peopleList: Person[]) {
    let toBeReturned = ""
    let isBond = false; 
    if (reminder.bond_id) {
          isBond = true;
    }
    
    // Bond reminder
    if (isBond) {
      for (const bond of bondList) {
        if (bond.bond_id === reminder.bond_id) {
          toBeReturned = bond.bondName;
          return toBeReturned;
        }
      }
    }
    // Person Reminder
    else {
      for (const person of peopleList) {
        if (person.person_id === reminder.person_id) {
          if (person.lastName != undefined) {
           return toBeReturned = person.firstName + " " + person.lastName?.trim()
          }
          return person.firstName
        }
      }
    }

    return toBeReturned;
}