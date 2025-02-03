import {
  addPersonBond,

} from "@/assets/db/PersonBondRepo";

import { createContext, useState } from "react";
import React from "react";
type InTouchContextType = {
  tempBondMembers: Set<number>;
  addTempBondMember: (personID: number) => void;
  clearTempBondMembers: () => void;
  createBondMember: (person_ids: Set<number>, bondID: number) => Promise<void>;
};

/**
 * This is initalized with an empty InTouchContextType. These are essentailly placeholder functions that we replace
 * upon providing values to the InTouchContext.Provider
 */

export const InTouchContext = createContext<InTouchContextType>({
  
  tempBondMembers: new Set<number>(),
  addTempBondMember: function (personID: number): void {
    throw new Error("Function not implemented.");
  },
  clearTempBondMembers: function (): void {
    throw new Error("Function not implemented.");
  },
  createBondMember: function (person_ids: Set<number>, bondID: number): Promise<void> {
    throw new Error("Function not implemented.");
  }
});

export const InTouchContextProvider: React.FC<{
  children: React.ReactNode;
  // eslint-disable-next-line react/prop-types
}> = ({ children }) => {
  

  const [tempBondMembers, setTempBondMembers] = useState<Set<number>>(new Set<number>());




  function addTempBondMember(personID: number) {
    const newTempMembers = new Set<number>(tempBondMembers)
    newTempMembers.add(personID)
    setTempBondMembers(newTempMembers);
  }

  function clearTempBondMembers() {
    setTempBondMembers(new Set<number>())
  }

  async function createBondMember(person_ids: Set<number>, bond_id: number) {
    try {
      if (!bond_id) {
        throw Error("createBondMember(): bondID is undefined")
      }

      // setBondPersonMap(addToBondPersonMap(person_ids, bond_id));
      // setPersonBondMap(addToPersonBondMap(person_ids, bond_id));

      for (const pid of person_ids) {
        try {
        await addPersonBond(db, pid, bond_id);
        } catch (e) {
          console.error(e);
          throw new Error("creatBondMEmber(): failed for-loop calling addPersonBond")
        }
      }


    } catch (e) {
      console.error(e);
      throw Error("createBondMember(): Could not create bond member");
    }
  }


  // Initializes user's people list and bond list upon initial render

  return (
    <>
      <InTouchContext.Provider
        value={{
          tempBondMembers,
          createBondMember,
          addTempBondMember,
          clearTempBondMembers,
        
        }}
      >
        {children}
      </InTouchContext.Provider>
    </>
  );
};
