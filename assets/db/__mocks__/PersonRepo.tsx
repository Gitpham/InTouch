import { testP1 } from "@/__mocks__/expo-sqlite";

const mockGetPerson = jest.fn().mockImplementation(() => {
    return testP1;
})

const getPerson = mockGetPerson;

export {
    getPerson,
    mockGetPerson,
}