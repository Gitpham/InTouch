import { Bond, Person } from "@/constants/types";

const testP1: Person = {
  firstName: "P1",
  lastName: "P1_lastName",
  phoneNumber: "111-111-1111",
  person_id: 1,
};

const testP2: Person = {
  firstName: "P2",
  lastName: "P2_lastName",
  phoneNumber: "111-111-1112",
  person_id: 2,
};

const testP3: Person = {
  firstName: "P3",
  lastName: "P3_lastName",
  phoneNumber: "111-111-1112",
  person_id: 3,
};

const testB1: Bond = {
  bondName: "family",
  bond_id: 1,
  schedule: "weekly",
  typeOfCall: "group",
};

const testB2: Bond = {
  bondName: "friends",
  bond_id: 2,
  schedule: "monthly",
  typeOfCall: "individual",
};

const testB3: Bond = {
  bondName: "friends",
  bond_id: 3,
  schedule: "monthly",
  typeOfCall: "individual",
};

const testB6: Bond = {
  bondName: "friends",
  bond_id: 6,
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
  { bond_id: 6, person_id: 2 },
  { bond_id: 6, person_id: 4 },
  { bond_id: 6, person_id: 5 },
  { bond_id: 6, person_id: 6 },
];

const testPersonBondList_NoneMarked = [
  {bond_id: 1, person_id: 1, nextToCall: 0},
  {bond_id: 1, person_id: 2, nextToCall: 0},
  {bond_id: 1, person_id: 3, nextToCall: 0},
]

const mockExecuteAsync = jest.fn();
const mockFinalizeAsync = jest.fn();
const mockGetAllAsync = jest.fn().mockImplementation((sql: string) => {
  if (sql == `SELECT * FROM person`) {
    return Promise.resolve(testPersonList);
  }

  if (sql == `SELECT * FROM bond`) {
    return Promise.resolve(testBondList);
  }

  if (
    sql ==
    `SELECT *
            FROM person_bond
            `
  ) {
    return Promise.resolve(testPersonBondList);
  }

  if (sql == `
        SELECT * FROM person_bond
        WHERE bond_id = ?
         ;`) {
          return Promise.resolve(testPersonBondList_NoneMarked)
         }

  throw Error("Does not recognize sql command");
});

const mockStatement = {
  executeAsync: mockExecuteAsync,
  finalizeAsync: mockFinalizeAsync,
  getAllAsync: mockGetAllAsync,
};

const mockPrepareAsync = jest.fn(() => mockStatement);

const mockDatabase = {
  prepareAsync: mockPrepareAsync,
  getAllAsync: mockGetAllAsync,
};

const openDatabaseAsync = jest.fn(() => mockDatabase);
const SQLiteDatabase = jest.fn(() => mockDatabase);
const useSQLiteContext = jest.fn(() => mockDatabase);

const mockUseSQLiteContext = jest.fn(() => mockDatabase);


export {
  mockDatabase,
  testBondList,
  testPersonList,
  testPersonBondList,
  testP1,
  testP2,
  testP3,
  testB1,
  testB2,
  testB3,
  testB6,
  mockUseSQLiteContext,
  openDatabaseAsync,
  SQLiteDatabase,
  useSQLiteContext,
  mockPrepareAsync,
  mockGetAllAsync,
  mockFinalizeAsync,
  mockExecuteAsync,
};
