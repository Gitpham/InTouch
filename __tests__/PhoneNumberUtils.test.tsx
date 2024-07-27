import { validateAndFormatPhoneNumber } from "@/context/PhoneNumberUtils";

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