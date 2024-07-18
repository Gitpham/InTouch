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
    reminder: String;
}