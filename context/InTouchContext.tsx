import { Bond, addBond, deleteBond, getAllBonds } from "@/app/db/BondRepo";
import { addBondMember, deleteBondMember } from "@/app/db/PersonBondRepo";
import { Person, addPerson, deletePerson, getAllPersons } from "@/app/db/PersonRepo";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useEffect, useState } from "react";

export const inTouchContext = createContext({});

const inTouchContextProvider = ({children}) => {
    const [peopleList, setPeopleList] = useState<Person[]>([]);
    const [bondList, setBondList] = useState<Bond[]>([]);
    const [personBondList, setPersonBondList] = useState<Bond[]>([]);
    const [bondPersonList, setBondPersonList] = useState<Bond[]>([]);

    const db = useSQLiteContext();

    async function initializePeopleList() {
        try {
            const initialized_peopleList = await getAllPersons(db);
            setPeopleList(initialized_peopleList);
        }
        catch (e) {
            console.error(e)
            throw Error("Could not fetch people");
        }

    async function initializeBondList() {
        try {
            const initialized_bond_list = await getAllBonds(db);
            setBondList(initialized_bond_list);
        }
        catch (e) {
            console.error(e)
            throw Error("Could not fetch bond");
        }
    }

    async function createPerson(person: Person) {
        try {
            await addPerson(db, person);
            setPeopleList([...peopleList, person])
        }
        catch (e) {
            console.error(e);
            throw Error("Could not create person");
        }
    }

    async function removePerson(person: Person) {
        try {
            await deletePerson(db, person);
            setPeopleList(peopleList.filter(item => item.id != person.id));
        }
        catch (e) {
            console.error(e);
            throw Error("Could not remove person");
        }
    }

    async function createBond(bond: Bond) {
        try {
            await addBond(db, bond);
            setBondList([...bondList, bond])
        }
        catch (e) {
            console.error(e);
            throw Error("Could not create bond");
        }     
    }

    async function removeBond (bond: Bond) {
        try {
            await deleteBond(db, bond);
            setBondList(bondList.filter(item => item.id != bond.id))
        }
        catch (e) {
            console.error(e);
            throw Error("Could not remove bond");
        }     
    }

    async function createBondMember(bond: Bond, person: Person) {
        try {
            await addBondMember(db, person, bond);
        }
        catch (e) {
            console.error(e);
            throw Error("Could not create bond member");
        }     
    }

    async function removeBondMember(bond: Bond, person: Person) {
        try {
            await deleteBondMember(db, person, bond);
        }
        catch (e) {
            console.error(e);
            throw Error("Could not delete bond member");
        }     
    }

    // Initializes user's people list and bond list upon initial render
    useEffect(() => {
        initializePeopleList();
        initializeBondList();
    }, [])

    }
} 