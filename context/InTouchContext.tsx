import { createContext, useState } from "react";
import React from "react";
type InTouchContextType = {
  tempBondMembers: Set<number>;
  addTempBondMember: (personID: number) => void;
  clearTempBondMembers: () => void;
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

  return (
    <>
      <InTouchContext.Provider
        value={{
          tempBondMembers,
          addTempBondMember,
          clearTempBondMembers,
        }}
      >
        {children}
      </InTouchContext.Provider>
    </>
  );
};
