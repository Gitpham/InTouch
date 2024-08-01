import { mockDatabase } from "@/__mocks__/expo-sqlite";
import { getNextToCallUtil, validateAndFormatPhoneNumber } from "@/context/PhoneNumberUtils";
import { getPersonsOfBondDB } from "@/assets/db/PersonBondRepo";
import { BondPerson } from "@/constants/types";
jest.mock("@/assets/db/PersonBondRepo", () => {
    const mockGetPersonsOfBondDB = jest.fn().mockImplementation(() => {
        const bp: BondPerson = {
            person_id: 1,
            bond_id: 1,
            nextToCall: 0
        }
        return bp;
    })

    return {
        getPersonsOfBondDB: mockGetPersonsOfBondDB
    }
} )


beforeEach(() => {
    jest.clearAllMocks()
})

describe("PhoneNumber Utils", () => {

    it("validateAndFormatPhoneNumber() should take an unformatted 10 digit number and reformat it in NA standards", () => {
        const testNumber = "612 812 3740";
        const expected = "+16128123740";
        const actual = validateAndFormatPhoneNumber(testNumber);

        expect(actual).toEqual(expected);
    })

    it("validateAndFormatPhoneNumber() should throw error if number is != 12 digits", () => {
        const testNumber = "612";
        expect(() => validateAndFormatPhoneNumber(testNumber)).toThrow()
    })

 


})