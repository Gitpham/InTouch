import { getAllBonds, addBond, deleteBond } from "@/assets/db/BondRepo";
import {
  addPersonBond,
  deletePersonBond,
  getAllPersonBonds,
  getPersonsOfBondDB,
} from "@/assets/db/PersonBondRepo";
import { getAllPersons, addPerson, deletePerson } from "@/assets/db/PersonRepo";
import { Person, Bond, BondPerson } from "@/constants/types";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useEffect, useState } from "react";
import React from "react";
type InTouchContextType = {
  tempBondMembers: Set<number>;
  peopleList: Person[];
  bondList: Bond[];
  personBondMap: Map<number, Set<number>>;
  bondPersonMap: Map<number, Set<number>>;
  generatePersonId: () =>  number;
  addTempBondMember: (personID: number) => void;
  clearTempBondMembers: () => void;
  createPerson: (person: Person) => Promise<void>;
  removePerson: (person: Person) => Promise<void>;
  createBond: (bond: Bond) => Promise<void>;
  removeBond: (bond: Bond) => Promise<void>;
  createBondMember: (person_ids: Set<number>, bond_id: number) => Promise<void>;
  removeBondMember: (bond: Bond, person: Person) => Promise<void>;
  getBondPersonMap: () => void;
  getPersonBondMap: () => void;
  getBondsOfPerson: (person: Person) => Array<Bond>;
  getMembersOfBond: (bond: Bond) => Array<Person>;
  generateBondId: () => number;
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
  tempBondMembers: new Set<number>(),
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
  createBondMember: function (
    person_ids: Set<number>,
    bond_id: number
  ): Promise<void> {
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
  generateBondId: function (): number {
    throw new Error("Function not implemented.");
  },
  addTempBondMember: function (personID: number): void {
    throw new Error("Function not implemented.");
  },
  clearTempBondMembers: function (): void {
    throw new Error("Function not implemented.");
  },
  generatePersonId: function (): number {
    throw new Error("Function not implemented.");
  },
});

export const InTouchContextProvider: React.FC<{
  children: React.ReactNode;
  // eslint-disable-next-line react/prop-types
}> = ({ children }) => {
  // Hashmaps for cross referencing groups and members

  const [peopleList, setPeopleList] = React.useState<Person[]>([]);
  const [bondList, setBondList] = useState<Bond[]>([]);

  const [personBondMap, setPersonBondMap] = useState<Map<number, Set<number>>>(
    new Map<number, Set<number>>()
  );

  const [bondPersonMap, setBondPersonMap] = useState<Map<number, Set<number>>>(
    new Map<number, Set<number>>()
  );

  const [tempBondMembers, setTempBondMembers] = useState<Set<number>>(new Set<number>());

  function addTempBondMember(personID: number) {
    const newTempBondMembers = tempBondMembers;
    newTempBondMembers.add(personID);
    setTempBondMembers(newTempBondMembers);
  }

  function clearTempBondMembers() {
    setTempBondMembers(new Set<number>())
  }

  let hasRendered = false;

  const db = useSQLiteContext();

  useEffect(() => {
    const initalize = async () => {
      if (!hasRendered) {
        try {
          await initializeBondList();
          await initializePeopleList();
          await initializeBondMemberMaps();
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
  async function initializeBondMemberMaps() {
    try {
      const dbBondPersonList: BondPerson[] = await getAllPersonBonds(db);
      setPersonBondMap(initializePersonBondMap(dbBondPersonList));
      setBondPersonMap(initializeBondPersonMap(dbBondPersonList))
    } catch (e) {
      console.error(e);
      throw Error("Could not fetch all BondPersons");
    }
  }

  function initializePersonBondMap(dbBondPersonList: BondPerson[]):Map<number, Set<number>> {
    const personBondHash = new Map<number, Set<number>>();

    dbBondPersonList.forEach((p) => {
      const personId: number = p.person_id as number;
      const bondId: number = p.bond_id as number;
      if (!personId || !bondId) {
        return;
      }

      if (personBondHash.has(personId)) {
        const groupIds: Set<number> = personBondHash.get(personId) as Set<number>;
        groupIds.add(bondId);
        personBondHash.set(personId, groupIds);
        return;
      }

      const pGroup: Set<number> = new Set();
      pGroup.add(bondId);
      personBondHash.set(personId, pGroup);
      return;
    });
    return personBondHash;
  }

  function initializeBondPersonMap(dbBondPersonList: BondPerson[]):Map<number, Set<number>> {
    const bondPersonHash = new Map<number, Set<number>>();
    dbBondPersonList.forEach((p) => {
      if (!p.person_id || !p.bond_id) {
        return;
      }
      const personId: number = p.person_id as number;
      const bondId: number = p.bond_id as number;

      if (bondPersonHash.has(bondId)) {
        const personIdSet: Set<number> = bondPersonHash.get(bondId) as Set<number>;
        personIdSet.add(personId);
        bondPersonHash.set(bondId, personIdSet);
        return;
      }


      const newPersonIdSet: Set<number> = new Set();
      newPersonIdSet.add(personId);
      bondPersonHash.set(bondId, newPersonIdSet);
      return;
    });   
    return bondPersonHash;
  }


  function generatePersonId(): number {

    let person_id = 1;

    if (peopleList.length > 0) {
      person_id = peopleList[peopleList.length - 1].person_id as number + 1;
    }
    return person_id;
  }

  async function createPerson(person: Person) {
    try {
      const pid = generatePersonId();
      const personWithId: Person = {
        firstName: person.firstName,
        lastName: person.lastName,
        phoneNumber: person.phoneNumber,
        person_id: pid
      }
      await addPerson(db, personWithId);
      setPeopleList([...peopleList, personWithId]);
    } catch (e) {
      console.error(e);
      throw Error("Could not create person");
    }
  }

  async function removePerson(person: Person) {
    try {
      if (person.person_id == undefined) {
        throw new Error("person_id is falsy");
      }
      const personID: number = person.person_id as number;
      await deletePerson(db, person);

      //UPDATE PEOPLE LIST
      setPeopleList(peopleList.filter((item) => item.person_id != personID));

      //UPDATE BONDPERSON
      const bondsOfPerson: Set<number> = personBondMap.get(
        personID
      ) as Set<number>;

      if (bondsOfPerson){
        setBondPersonMap((prevMap) => {
          const newBondPersonMap = prevMap;
  
          bondsOfPerson.forEach((b) => {
            const updatedPersons: Set<number> = newBondPersonMap.get(
              b
            ) as Set<number>;
            updatedPersons.delete(personID);
            newBondPersonMap.set(b, updatedPersons);
          });
          return newBondPersonMap;
        });
      }
      
      //UPDATE PERSON BOND
      setPersonBondMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(personID);
        return newMap;
      });

     
    } catch (e) {
      console.error(e);
      throw Error("Could not remove person");
    }
  }

  function generateBondId(): number {
    let updatedBondID = 1;
    if (bondList.length > 0) {
      updatedBondID = bondList[bondList.length - 1].bond_id + 1;
    }
    return updatedBondID;
  }

  async function createBond(bond: Bond) {
    try {
      const bid = generateBondId();

      const bondWithId: Bond = {
        bondName: bond.bondName,
        schedule: bond.schedule,
        typeOfCall: bond.typeOfCall,
        bond_id: bid
      }
      await addBond(db, bondWithId);
      setBondList([...bondList, bondWithId]);
    } catch (e) {
      console.error(e);
      throw Error("Could not create bond");
    }
  }

  async function removeBond(bond: Bond) {
    try {
      if (!bond.bond_id) {
        throw Error("failed removeBond(). bond_id is undefined");
      }
      const bondID: number = bond.bond_id as number;

      await deleteBond(db, bond);
      setBondList(bondList.filter((item) => item.bond_id != bondID));

      // Remove bond from bondPerson hash map
      
      const personsOfBond: Set<number> = bondPersonMap.get(
        bondID
      ) as Set<number>;

      if (!personsOfBond){
        return;
      }

      setBondPersonMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(bondID);
        return newMap;
      });

     
      setPersonBondMap((prevMap) => {
        const newPersonBondMap = prevMap;
        personsOfBond.forEach((b) => {
          const updatedBonds: Set<number> = newPersonBondMap.get(
            b
          ) as Set<number>;
          updatedBonds.delete(bondID);
          newPersonBondMap.set(b, updatedBonds);
        });
        return newPersonBondMap;
      });
    } catch (e) {
      console.error(e);
      throw Error("Could not remove bond");
    }
  }

  async function createBondMember(person_ids: Set<number>, bond_id: number) {
    try {
      if (!bond_id) {
        throw Error("createBondMember(): bondID is undefined")
      }

      await setBondPersonMap(addToBondPersonMap(person_ids, bond_id));
      await setPersonBondMap(addToPersonBondMap(person_ids, bond_id));

      person_ids.forEach(async (person_id) => {
      await addPersonBond(db, person_id, bond_id);
      });

    } catch (e) {
      console.error(e);
      throw Error("createBondMember(): Could not create bond member");
    }
  }

  function addToPersonBondMap(person_ids: Set<number>, bondID: number): Map<number, Set<number>> {
    const personHash = new Map(personBondMap);
    // UPDATE PERSON-BOND MAP
    person_ids.forEach((personID) => {
      if (!personBondMap.has(personID)) {
      const bondIds: Set<number> = new Set();
      bondIds.add(bondID);
      personHash.set(personID, bondIds);
    } else {
      const bondIds: Set<number> = personHash.get(personID) as Set<number>;
      bondIds.add(bondID);
      personHash.set(personID, bondIds);
    }
  });
    return personHash;
  }

  function addToBondPersonMap(person_ids: Set<number>, bondID: number): Map<number, Set<number>> {
    const bondHash = new Map(bondPersonMap);

    if (bondPersonMap.has(bondID) == false) {
      const personIds = new Set([...person_ids])
      bondHash.set(bondID, personIds);
    } else {
      const personIds: Set<number> = new Set([...(bondPersonMap.get(bondID) as Set<number>), ...person_ids])
      bondHash.set(bondID, personIds);

    }
    return bondHash;
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
      setPersonBondMap(removeFromPersonBondMap(bond, person))
      setBondPersonMap(removeFromBondPersonMap(bond, person))
    } catch (e) {
      console.error(e);
      throw Error("Could not delete bond member");
    }
  }

  function removeFromPersonBondMap(bond: Bond, person: Person): Map<number, Set<number>> {

    const bondID: number = bond.bond_id;
    const personID: number = person.person_id as number;
    const personHash = new Map(personBondMap);
    // UPDATE PERSON-BOND MAP
    const bondIds: Set<number> = personHash.get(personID) as Set<number>;
    bondIds.delete(bondID);
    if (bondIds.size == 0) {
      personHash.delete(personID)
      return personHash;
    }
    personHash.set(personID, bondIds);
    return personHash;
  }

  function removeFromBondPersonMap(bond: Bond, person: Person): Map<number, Set<number>> {

    const bondID: number = bond.bond_id;
    const personID: number = person.person_id as number;
    const bondHash = new Map(bondPersonMap);

    // UPDATE PERSON-BOND MAP
    const personIds: Set<number> = bondHash.get(bondID) as Set<number>;
    personIds.delete(personID);


    if (personIds.size == 0) {
      bondHash.delete(bondID)
      return bondHash;
    }

    bondHash.set(bondID, personIds);
    return bondHash;
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
    const bondID = +bond.bond_id;
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
          tempBondMembers,
          peopleList,
          bondList,
          personBondMap,
          bondPersonMap,
          generatePersonId,
          createPerson,
          removePerson,
          createBond,
          removeBond,
          createBondMember,
          removeBondMember,
          getBondPersonMap,
          getPersonBondMap,
          getBondsOfPerson,
          getMembersOfBond,
          generateBondId,
          addTempBondMember,
          clearTempBondMembers,
        }}
      >
        {children}
      </InTouchContext.Provider>
    </>
  );
};
