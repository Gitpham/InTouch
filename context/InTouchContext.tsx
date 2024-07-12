import { getAllBonds, addBond, deleteBond } from "@/assets/db/BondRepo";
import {
  addPersonBond,
  deletePersonBond,
  getAllPersonBonds,
} from "@/assets/db/PersonBondRepo";
import { getAllPersons, addPerson, deletePerson } from "@/assets/db/PersonRepo";
import { Person, Bond } from "@/constants/types";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useEffect, useState, } from "react";
import React from "react";
type InTouchContextType = {
  peopleList: Person[];
  bondList: Bond[];
  personBondMap: Map<number, Set<number>>;
  bondPersonMap: Map<number, Set<number>>;
  createPerson: (person: Person) => Promise<void>;
  removePerson: (person: Person) => Promise<void>;
  createBond: (bond: Bond) => Promise<void>;
  removeBond: (bond: Bond) => Promise<void>;
  createBondMember: (person_id: number, bond_id: number) => Promise<void>;
  removeBondMember: (bond: Bond, person: Person) => Promise<void>;
  getBondPersonMap: () => void;
  getPersonBondMap: () => void;
  getBondsOfPerson: (person: Person) => Array<Bond>;
  getMembersOfBond: (bond: Bond) => Array<Person>
};

/**
 * This is initalized with an empty InTouchContextType. These are essentailly placeholder functions that we replace
 * upon providing values to the InTouchContext.Provider
 */

export const InTouchContext = createContext<InTouchContextType>({
  peopleList: [],
  bondList: [],
  personBondMap: new Map<number, Set<number>>(),
  bondPersonMap: new Map<number, Set<number>>(),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /* eslint-disable @typescript-eslint/no-unused-vars */
  createPerson: function (person: Person): Promise<void> {
    throw new Error("Function not implemented.");
  },
  removePerson: function (person: Person): Promise<void> {
    throw new Error("Function not implemented.");
  },
  createBond: function (bond: Bond): Promise<void> {
    throw new Error("Function not implemented.");
  },
  removeBond: function (bond: Bond): Promise<void> {
    throw new Error("Function not implemented.");
  },
  createBondMember: function (person_id: number, bond_id: number): Promise<void> {
    throw new Error("Function not implemented.");
  },
  removeBondMember: function (bond: Bond, person: Person): Promise<void> {
    throw new Error("Function not implemented.");
  },
  getBondPersonMap: function (): void {
    throw new Error("Function not implemented.");
  },
  getPersonBondMap: function (): void {
    throw new Error("Function not implemented.");
  },
  getBondsOfPerson: function (person: Person): Array<Bond> {
    throw new Error("Function not implemented.");
  },
  getMembersOfBond: function (bond: Bond): Array<Person> {
    throw new Error("Function not implemented.");
  },

});

export const InTouchContextProvider: React.FC<{
  children: React.ReactNode;
// eslint-disable-next-line react/prop-types
}> = ({ children }) => {
  // Hashmaps for cross referencing groups and members

  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [bondList, setBondList] = useState<Bond[]>([]);

  const [personBondMap, setPersonBondMap] = useState<Map<number, Set<number>>>(
    new Map<number, Set<number>>()
  );

  const [bondPersonMap, setBondPersonMap] = useState<Map<number, Set<number>>>(
    new Map<number, Set<number>>()
  );

  let hasRendered = false;

  const db = useSQLiteContext();

  useEffect(() => {

    const initalize = async () => {

      if (!hasRendered) {
        try {
          await initializeBondList();
          await initializePeopleList();
          await initializePersonBondMaps();
          hasRendered = true;
        } catch (error) {
          console.error(error);
          throw Error("failed to initialize db");
        }

  
      }
    };

    initalize();
  }, []);

  async function initializePeopleList() {
    try {
      const initialized_peopleList = await getAllPersons(db);
      setPeopleList(initialized_peopleList);
    } catch (e) {
      console.error(e);
      throw Error("failed to initialize people list");
    }
  }

  async function initializeBondList() {
    try {
      const initialized_bond_list = await getAllBonds(db);
      setBondList(initialized_bond_list);
    } catch (e) {
      console.error(e);
      throw Error("Could not fetch bond");
    }
  }

  /**
   * creates a 2 local hashmaps for the bondmember lisst, A, B. A's keys are the person_id, values are the bonds
   * bonds associated with that person. B is vice versa.
   */
  async function initializePersonBondMaps() {
    try {
      const dbBondPersonList = await getAllPersonBonds(db);
      const peopleHash: Map<number, Set<number>> = new Map();

      dbBondPersonList.forEach((p) => {
        const personId: number = p.person_id as number;
        const bondId: number = p.bond_id as number;
        if (!personId || !bondId) {
          return;
        }

        if (peopleHash.has(personId)) {
          const groupIds: Set<number> = peopleHash.get(personId) as Set<number>;
          groupIds.add(bondId);
          peopleHash.set(personId, groupIds);
          return;
        }

        const pGroup: Set<number> = new Set();
        pGroup.add(bondId);
        peopleHash.set(personId, pGroup);
        return;
      });

      setPersonBondMap(peopleHash);

      const bondHash: Map<number, Set<number>> = new Map();

      dbBondPersonList.forEach((p) => {
        const personId: number = p.person_id as number;
        const bondId: number = p.bond_id as number;

        if (!personId || !bondId) {
          return;
        }

        if (bondHash.has(bondId)) {
          const personIds: Set<number> = bondHash.get(bondId) as Set<number>;
          personIds.add(bondId);
          bondHash.set(bondId, personIds);
          return;
        }

        const pIdSet: Set<number> = new Set();
        pIdSet.add(personId);
        bondHash.set(bondId, pIdSet);
        return;
      });

      setBondPersonMap(bondHash);
    } catch (e) {
      console.error(e);
      throw Error("Could not fetch all BondPersons");
    }
  }

  async function createPerson(person: Person) {
    try {
      await addPerson(db, person);
      // this assumes that all people in db have a id from 1 to size of table -1
      const toAddPersonId = peopleList.length + 1;
      const toAddPerson: Person = { ...person, person_id: toAddPersonId };
      setPeopleList([...peopleList, toAddPerson]);
    } catch (e) {
      console.error(e);
      throw Error("Could not create person");
    }
  }

  async function removePerson(person: Person) {
    try {
      await deletePerson(db, person);
      setPeopleList(
        peopleList.filter((item) => item.person_id != person.person_id)
      );

      personBondMap.delete(person.person_id);
      setPersonBondMap(personBondMap);

      bondPersonMap.forEach((value, key) => {
        if (value) {
        if (value.has(person.person_id)) {
          value.delete(person.person_id);
        }
      }
      });

      setBondPersonMap(bondPersonMap);

    } catch (e) {
      console.error(e);
      throw Error("Could not remove person");
    }
  }

  async function createBond(bond: Bond) {
    try {
      await addBond(db, bond);
      setBondList([...bondList, bond]);
    } catch (e) {
      console.error(e);
      throw Error("Could not create bond");
    }
  }

  async function removeBond(bond: Bond) {
    try {
      await deleteBond(db, bond);
      setBondList(bondList.filter((item) => item.bond_id != bond.bond_id));

      // Remove bond from bondPerson hash map
      bondPersonMap.delete(bond.bond_id);
      setBondPersonMap(bondPersonMap)

      // Remove all instances of bond within PersonBond hash map
      personBondMap.forEach((value, key) => {
        if (value.has(bond.bond_id)) {
          value.delete(bond.bond_id);
        }
      });

      setPersonBondMap(personBondMap);

    } catch (e) {
      console.error(e);
      throw Error("Could not remove bond");
    }
  }

  async function createBondMember(person_id: number, bond_id: number) {
    try {
      await addPersonBond(db, person_id, bond_id);
      const pID: number = person_id;
      const bID: number = bond_id;
      const bondHash = new Map(bondPersonMap);
      const personHash = new Map(personBondMap);

      // UPDATE PERSON-BOND MAP
      if (!personBondMap.has(pID)) {
        const bondIds: Set<number> = new Set();
        bondIds.add(bID);
        personHash.set(pID, bondIds);
      } else {
        const bondIds: Set<number> = personHash.get(pID) as Set<number>;
        bondIds.add(bID);
        personHash.set(pID, bondIds);
        setPersonBondMap(personHash);
      }

      //UDPATE BOND-PERSON MAP

      if (!bondPersonMap.has(bID)) {
        const personIds: Set<number> = new Set();
        personIds.add(pID);
        bondHash.set(bID, personIds);
      } else {
        const personIds: Set<number> = bondPersonMap.get(bID) as Set<number>;
        personIds.add(pID);
        bondHash.set(bID, personIds);
        setBondPersonMap(bondHash);
      }
    } catch (e) {
      console.error(e);
      throw Error("createBondMember(): Could not create bond member");
    }
  }

  function getPersonBondMap() {
    const iter = personBondMap.entries();
    console.log("personBondMap: ");
    personBondMap.forEach(() => {
      console.log(iter.next().value);
    });
  }

  function getBondPersonMap() {
    const iter = bondPersonMap.entries();
    console.log("bondPersonMap: ");
    bondPersonMap.forEach(() => {
      console.log(iter.next().value);
    });
  }

  async function removeBondMember(bond: Bond, person: Person) {
    try {
      await deletePersonBond(db, person, bond);
    } catch (e) {
      console.error(e);
      throw Error("Could not delete bond member");
    }
  }


  function getBondsOfPerson(person: Person): Array<Bond> {
    const personID = Number(person.person_id);
    try {
      const bondIDs = personBondMap.get(personID);
      const bonds = bondList.filter((b) => {
        const bID: number = Number(b.bond_id);
        if (bondIDs?.has(bID)) {
          return b;
        }
      });
      return bonds;
    } catch (e) {
      console.error(e);
      throw Error("getBondsOfPerson(): failed to get bonds of person");
    }
  }

  function getMembersOfBond(bond: Bond): Array<Person> {
    const bondID = Number(bond.bond_id);
    try {
      const personIDs = bondPersonMap.get(bondID);
      const persons = peopleList.filter((p) => {
        const pID: number = Number(p.person_id);
        if (personIDs?.has(pID)) {
          return p;
        }
      });
      return persons;
    } catch (e) {
      console.error(e);
      throw Error("getBondsOfPerson(): failed to get bonds of person");
    }
  }

  // Initializes user's people list and bond list upon initial render

  return (
    <>
      <InTouchContext.Provider
        value={{
          peopleList,
          bondList,
          personBondMap,
          bondPersonMap,
          createPerson,
          removePerson,
          createBond,
          removeBond,
          createBondMember,
          removeBondMember,
          getBondPersonMap,
          getPersonBondMap,
          getBondsOfPerson,
          getMembersOfBond
        }}
      >
        {children}
      </InTouchContext.Provider>
    </>
  );
};
