import { Bond } from "@/constants/types";
import { openDatabaseAsync } from "expo-sqlite";
import {
  mockExecuteAsync,
  mockFinalizeAsync,
  mockGetAllAsync,
  mockPrepareAsync,
  testBondList,
} from "@/__mocks__/expo-sqlite";
import { addBond, deleteBond, getAllBonds, updateBond } from "@/assets/db/BondRepo";

jest.mock("expo-sqlite");

describe("BondRepo() unit tests", () => {
  beforeEach(() => {
    mockExecuteAsync.mockClear();
    mockFinalizeAsync.mockClear();
    mockPrepareAsync.mockClear();
  });

  it("calling addBond() with a bond should call db with correct sql", async () => {
    const b: Bond = {
      bondName: "b",
      typeOfCall: "group",
      bond_id: "",
      schedule: "weekly",
    };

    const db = await openDatabaseAsync("name");
    await addBond(db, b);
    expect(mockPrepareAsync).toHaveBeenCalledWith(
      `INSERT INTO bond (bondName, schedule, type_of_call)
         VALUES (?, ?, ?);`
    );

    expect(mockExecuteAsync).toHaveBeenCalledWith([
      b.bondName,
      b.schedule,
      b.typeOfCall,
    ]);

    expect(mockFinalizeAsync).toHaveBeenCalled();
  });

  it("calling updateBond() with a bond should call db with correct sql", async () => {
    const b: Bond = {
      bondName: "b",
      typeOfCall: "group",
      bond_id: 1,
      schedule: "weekly",
    };

    const expectedStatement = `
        UPDATE bond 
        SET bondName = ?, schedule = ?, type_of_call = ?
        WHERE bond_id = ?
        `;

    const expectedValues = [b.bondName, b.bond_id.toString()];

    const db = await openDatabaseAsync("name");
    await updateBond(db, b);
    expect(mockPrepareAsync).toHaveBeenCalledWith(expectedStatement);

    expect(mockExecuteAsync).toHaveBeenCalledWith(expectedValues);

    expect(mockFinalizeAsync).toHaveBeenCalled();
  });

  it("calling deleteBond() should call db with correct sql", async () => {

    const b: Bond = {
        bondName: "b",
        typeOfCall: "group",
        bond_id: "",
        schedule: "weekly",
      };
  
      const expectedStatement = `
       DELETE FROM bond
      WHERE bond_id = ?
        `;
  
      const expectedValues = [b.bond_id];
  
      const db = await openDatabaseAsync("name");
      await deleteBond(db, b);
      expect(mockPrepareAsync).toHaveBeenCalledWith(expectedStatement);
  
      expect(mockExecuteAsync).toHaveBeenCalledWith(expectedValues);
  
      expect(mockFinalizeAsync).toHaveBeenCalled();

  })

  it("getAllBonds() should call db with correct sql", async () => {
    const db = await openDatabaseAsync("name");
    const v = await getAllBonds(db)
    expect(mockGetAllAsync).toHaveBeenCalledWith(`SELECT * FROM bond`)
    expect(v).toEqual(testBondList)
  })


});
