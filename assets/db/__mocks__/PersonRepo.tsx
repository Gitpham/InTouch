import { testP1 } from "@/__mocks__/expo-sqlite";

const mockGetPerson = jest.fn().mockImplementation((db, pid ) => {
    console.log("mockGetPerson")
    console.log("pid", pid)
    return testP1;
})

const getPerson = mockGetPerson;

export {
    getPerson,
    mockGetPerson,
}