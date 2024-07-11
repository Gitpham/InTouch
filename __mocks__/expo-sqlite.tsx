import { Bond, Person } from "@/constants/types";

 const testP1: Person = {
  firstName: "P1",
  lastName: "P1_lastName",
  phoneNumber: "111-111-1111",
  person_id: "1",
};

 const testP2: Person = {
  firstName: "P2",
  lastName: "P2_lastName",
  phoneNumber: "111-111-1112",
  person_id: "2",
};

const testB1: Bond = {
  bondName: "family",
  bond_id: "1",
  schedule: "weekly",
  typeOfCall: "group",
};

const testB2: Bond = {
  bondName: "friends",
  bond_id: "2",
  schedule: "monthly",
  typeOfCall: "individual",
};

const testBondList: Bond[] = [testB1, testB2];

const testPersonList: Person[] = [testP1, testP2];

const testPersonBondList = [
  { bond_id: 1, person_id: 1 },
  { bond_id: 1, person_id: 1 },
  { bond_id: 2, person_id: 1 },
  { bond_id: 3, person_id: 4 },
  { bond_id: null, person_id: null },
  { bond_id: null, person_id: null },
  { bond_id: null, person_id: null },
  { bond_id: null, person_id: null },
  { bond_id: 6, person_id: 2 },
  { bond_id: 6, person_id: 4 },
  { bond_id: 6, person_id: 5 },
  { bond_id: 6, person_id: 6 },
];

const mockExecuteAsync = jest.fn();
const mockFinalizeAsync = jest.fn();
const mockGetAllAsync = jest.fn().mockImplementation((sql: string) => {
  if (sql == `SELECT * FROM person`) {
    return Promise.resolve(testPersonList);
  }

  if (sql == `SELECT * FROM bond`) {
    return Promise.resolve(testBondList);
  }

  if (sql == `SELECT *
            FROM person_bond
            `){
    return Promise.resolve(testPersonBondList);
  }

  throw Error("Does not recognize sql command")
});

const mockStatement = {
  executeAsync: mockExecuteAsync,
  finalizeAsync: mockFinalizeAsync,
};

const mockPrepareAsync = jest.fn(() => mockStatement);

const mockDatabase = {
  prepareAsync: mockPrepareAsync,
  getAllAsync: mockGetAllAsync,
};

const openDatabaseAsync = jest.fn(() => mockDatabase);
const SQLiteDatabase = jest.fn(() => mockDatabase);
const useSQLiteContext = jest.fn(() => mockDatabase)

export {testBondList, testPersonList, testPersonBondList, openDatabaseAsync, SQLiteDatabase, useSQLiteContext, mockPrepareAsync, mockGetAllAsync, mockFinalizeAsync, mockExecuteAsync}
