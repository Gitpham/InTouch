import { getAllBonds, addBond, deleteBond } from "@/assets/db/BondRepo";
import {
  addPersonBond,
  deletePersonBond,
  getAllPersonBonds,
} from "@/assets/db/PersonBondRepo";
import { getAllPersons, addPerson, deletePerson } from "@/assets/db/PersonRepo";
import { Person, Bond } from "@/constants/types";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useEffect, useState, ReactNode } from "react";

type InTouchContextType = {
  peopleList: Person[];
  bondList: Bond[];
  personBondMap: Map<Number, Set<Number>>;
  bondPersonMap: Map<Number, Set<Number>>;
  createPerson: (person: Person) => Promise<void>;
  removePerson: (person: Person) => Promise<void>;
  createBond: (bond: Bond) => Promise<void>;
  removeBond: (bond: Bond) => Promise<void>;
  createBondMember: (bond: Bond, person: Person) => Promise<void>;
  removeBondMember: (bond: Bond, person: Person) => Promise<void>;
};

/**
 * This is initalized with an empty InTouchContextType. These are essentailly placeholder functions that we replace
 * upon providing values to the InTouchContext.Provider
 */
export const InTouchContext = createContext<InTouchContextType>({
  peopleList: [],
  bondList: [],
  personBondMap: new Map<Number, Set<Number>>(),
  bondPersonMap:  new Map<Number, Set<Number>>(),
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
  createBondMember: function (bond: Bond, person: Person): Promise<void> {
    throw new Error("Function not implemented.");
  },
  removeBondMember: function (bond: Bond, person: Person): Promise<void> {
    throw new Error("Function not implemented.");
  }
});



export const InTouchContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [bondList, setBondList] = useState<Bond[]>([]);

  const [personBondMap, setPersonBondMap] = useState<Map<Number, Set<Number>>>(new Map<Number, Set<Number>>());

  const [bondPersonMap, setBondPersonMap] = useState<Map<Number, Set<Number>>>(new Map<Number, Set<Number>>());

  const db = useSQLiteContext();

  useEffect(() => {
    const initalize = async () => {
      try {
        await initializePeopleList();
        await initializeBondList();
        await initializePersonBondLists();
      } catch (error) {
        console.error(error);
        throw Error("failed to initialize db");
      }
    };

    initalize();
  }, [db]);

  async function initializePeopleList() {
    try {
      const initialized_peopleList = await getAllPersons(db);
      // console.log("initialized peopleList:", initialized_peopleList)
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
  async function initializePersonBondLists() {
    try {
      const dbBondPersonList = await getAllPersonBonds(db);
      console.log("personBond", dbBondPersonList);


      const peopleHash: Map<Number, Set<Number>> = new Map();

      console.log("init peopleHash")
      dbBondPersonList.forEach((p) => {
        let personId: Number = p.person_id as Number;
        let bondId: Number = p.bond_id as Number;
        if (!personId || !bondId ) {
          console.log("person or bond id is null");
          console.log("bond", bondId);
          console.log("person", personId)
          return;
        }

        if (peopleHash.has(personId)) {
          const groupIds: Set<Number> = peopleHash.get(personId) as Set<Number>;
          groupIds.add(bondId);
          peopleHash.set(personId, groupIds);
          return;
        }

        const pGroup: Set<Number> = new Set();
        pGroup.add(bondId);
        peopleHash.set(personId, pGroup);
        return;
      });


      setPersonBondMap(peopleHash);

      const bondHash: Map<Number, Set<Number>> = new Map();

      dbBondPersonList.forEach((p) => {
        let personId: Number = p.person_id as Number;
        let bondId: Number = p.bond_id as Number;

        if (!personId || !bondId ) {

          return;
        }

        if (bondHash.has(bondId)) {
          const personIds: Set<Number> = bondHash.get(bondId) as Set<Number>;
          personIds.add(bondId);
          bondHash.set(bondId, personIds);
          return;
        }

        const pIdSet: Set<Number> = new Set();
        pIdSet.add(personId);
        bondHash.set(bondId, pIdSet);
        return;
      });


      setBondPersonMap(bondHash);

      // console.log("People: BOnds")
      // const person_iter = peopleHash.entries();
      // peopleHash.forEach(() => {
      //   console.log(person_iter.next().value)
      // })

      // console.log("Bonds: people")
      // const bond_iter = bondHash.entries();
      // bondHash.forEach(() => {
      //   console.log(bond_iter.next().value)
      // })

      

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
      const toAddPerson: Person = { ...person, person_id: `${toAddPersonId}` };
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
    } catch (e) {
      console.error(e);
      throw Error("Could not remove bond");
    }
  }

  async function createBondMember(bond: Bond, person: Person) {
    try {
      await addPersonBond(db, person, bond);
    } catch (e) {
      console.error(e);
      throw Error("Could not create bond member");
    }
  }

  async function removeBondMember(bond: Bond, person: Person) {
    try {
      await deletePersonBond(db, person, bond);
    } catch (e) {
      console.error(e);
      throw Error("Could not delete bond member");
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
        }}
      >
        {children}
      </InTouchContext.Provider>
    </>
  );
};
