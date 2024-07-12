import { Bond, Person } from "@/constants/types";
import { openDatabaseAsync } from "expo-sqlite";
import {
  mockExecuteAsync,
  mockFinalizeAsync,
  mockPrepareAsync,
  testPersonBondList,
} from "@/__mocks__/expo-sqlite";
import {
  addPersonBond,
  deletePersonBond,
  getAllPersonBonds,
} from "@/assets/db/PersonBondRepo";

jest.mock("expo-sqlite");

describe("PersonBondRepo Unit Tests", () => {
  beforeEach(() => {
    mockExecuteAsync.mockClear();
    mockFinalizeAsync.mockClear();
    mockPrepareAsync.mockClear();
  });

  it("addPersonBond() should call the db with the correct sql", async () => {
    const b: Bond = {
      bondName: "b",
      typeOfCall: "group",
      bond_id: 1,
      schedule: "weekly",
    };

    const p: Person = {
      firstName: "Phoenix",
      lastName: "Pham",
      phoneNumber: "111-111-1111",
      person_id: 1,
    };

    const expectedStatement = `INSERT INTO person_bond (person_id, bond_id) VALUES (?, ?)`;
    const expectedValue = [p.person_id.toString(), b.bond_id.toString()];

    const db = await openDatabaseAsync("name");

    await addPersonBond(db, p.person_id, b.bond_id);

    expect(mockPrepareAsync).toHaveBeenCalledWith(expectedStatement);
    expect(mockExecuteAsync).toHaveBeenCalledWith(expectedValue);
    expect(mockFinalizeAsync).toHaveBeenCalled();
  });

  it("deletePersonBond() should call the db with the correct sql", async () => {
    const b: Bond = {
      bondName: "b",
      typeOfCall: "group",
      bond_id: "1",
      schedule: "weekly",
    };

    const p: Person = {
      firstName: "Phoenix",
      lastName: "Pham",
      phoneNumber: "111-111-1111",
      person_id: "1",
    };

    const expectedStatement = `
       DELETE FROM person_bond
        WHERE person_id = ? & bond_id = ?
        `;
    const expectedValue = [p.person_id, b.bond_id];

    const db = await openDatabaseAsync("name");

    await deletePersonBond(db, p, b);

    expect(mockPrepareAsync).toHaveBeenCalledWith(expectedStatement);
    expect(mockExecuteAsync).toHaveBeenCalledWith(expectedValue);
    expect(mockFinalizeAsync).toHaveBeenCalled();
  });

  it("getAllPersonBonds() should return an array of {person_id, bond_id}'s", async () => {
    const db = await openDatabaseAsync("name");
    const v = await getAllPersonBonds(db);
    expect(v).toBe(testPersonBondList);
  });
});
