export type Bond = {
    bondName: string,
    bond_id: number,
    schedule: string, 
    typeOfCall: string,
}

export type Person = {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    person_id: number | undefined,
}

export type BondPerson = {
    person_id: number;
    bond_id: number;
  }

export type Reminder = {
    reminder_id: number
    person_id?: number;
    bond_id?: number;
    reminder: string;
    date: string;
}

export function formatDate(date: Date) {
    console.log(typeof(date))
    const day = String(date.getDay()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`
}