import { Person } from "@/constants/types";
import { openDatabaseAsync } from "expo-sqlite";
import { addPerson, deletePerson, getAllPersons, updatePerson } from "@/assets/db/PersonRepo";
import { mockExecuteAsync, mockGetAllAsync, mockPrepareAsync, testPersonList } from "@/__mocks__/expo-sqlite";

jest.mock("expo-sqlite");

describe("PersonRepo unit tests", () => {
  beforeEach(() => {
    mockPrepareAsync.mockClear();
    mockExecuteAsync.mockClear();
    mockGetAllAsync.mockClear();
  });

  it("addPerson() should call db with the correct sql", async () => {
    const p: Person = {
      firstName: "Phoenix",
      lastName: "Pham",
      phoneNumber: "111-111-1111",
      person_id: "1",
    };

    const db = await openDatabaseAsync("name");

    await addPerson(db, p);
    expect(mockPrepareAsync).toHaveBeenCalledWith(
      "INSERT INTO person (firstName, lastName, phoneNumber) VALUES (?, ?, ?)"
    );
    expect(mockExecuteAsync).toHaveBeenCalledWith([
      p.firstName,
      p.lastName,
      p.phoneNumber,
    ]);
  });

  it("updatePerson() should call db with correct sql", async () => {
    const p: Person = {
      firstName: "Phoenix",
      lastName: "Pham",
      phoneNumber: "111-111-1111",
      person_id: "1",
    };

    const db = await openDatabaseAsync("name");
    await updatePerson(db, p);
    const expectedSql = `
        UPDATE person 
        SET firstName = ?, lastName = ?, phoneNumber = ?
        WHERE person_id = ?
        `;
    expect(mockPrepareAsync).toHaveBeenCalledWith(expectedSql);
    expect(mockExecuteAsync).toHaveBeenCalledWith([
      p.firstName,
      p.lastName,
      p.phoneNumber,
      p.person_id,
    ]);
  });

  it("deletePerson() should call with correct sql", async () => {
    const p: Person = {
      firstName: "Phoenix",
      lastName: "Pham",
      phoneNumber: "111-111-1111",
      person_id: "1",
    };

    const db = await openDatabaseAsync("name");
    await deletePerson(db, p);
    const expectedSql = `
       DELETE FROM person
      WHERE id = ?
        `;

    expect(mockPrepareAsync).toHaveBeenCalledWith(expectedSql);

    expect(mockExecuteAsync).toHaveBeenCalledWith([
      p.person_id,
    ]);
  });

  it("getAllPersons() should call with correct sql", async () => {
    const db = await openDatabaseAsync("name");
    const v = await getAllPersons(db)
    expect(mockGetAllAsync).toHaveBeenCalledWith(`SELECT * FROM person`)
    expect(v).toEqual(testPersonList)
  })
});
