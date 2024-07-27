
const testPersonBondList_NoneMarked = [
    {bond_id: 1, person_id: 1, nextToCall: 0},
    {bond_id: 1, person_id: 2, nextToCall: 0},
    {bond_id: 1, person_id: 3, nextToCall: 0},
  ]
const mockUpdatePersonBond = jest.fn().mockImplementation(() => {
    return;
});
const mockGetPersonsOfBondDB = jest.fn().mockImplementation( (id) => {
    console.log("PersonBondRepoMock: mockGetPersonOfBondDB()")
    return testPersonBondList_NoneMarked;
});
const updatePersonBond = jest.fn(() => mockUpdatePersonBond);
const getPersonsOfBondDB =  mockGetPersonsOfBondDB;


export {
    updatePersonBond,
    getPersonsOfBondDB,
    mockUpdatePersonBond ,
    mockGetPersonsOfBondDB,
}
