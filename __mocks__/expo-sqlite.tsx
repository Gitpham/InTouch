import { Person } from "@/constants/types";



export const testP1: Person = {
    firstName: "P1",
    lastName: "P1_lastName",
    phoneNumber: "111-111-1111",
    person_id: "1",
  };

export const testP2: Person = {
    firstName: "P2",
    lastName: "P2_lastName",
    phoneNumber: "111-111-1112",
    person_id: "2",
  };

export const testPersonList: Person[] = [testP1, testP2];

export const mockExecuteAsync = jest.fn();
export const mockFinalizeAsync = jest.fn();
export const mockGetAllAsync = jest.fn().mockResolvedValue(testPersonList);




const mockStatement = {
    executeAsync: mockExecuteAsync,
    finalizeAsync: mockFinalizeAsync,
}

export const mockPrepareAsync= jest.fn(() => mockStatement)

const mockDatabase = {
    prepareAsync: mockPrepareAsync,
    getAllAsync: mockGetAllAsync
}

export const openDatabaseAsync = jest.fn(() => mockDatabase);
export const SQLiteDatabase = jest.fn(() => mockDatabase);


