
const testPersonBondList_NoneMarked = [
    {bond_id: 1, person_id: 1, nextToCall: 0},
    {bond_id: 1, person_id: 2, nextToCall: 0},
    {bond_id: 1, person_id: 3, nextToCall: 0},
  ]
const mockUpdatePersonBond = jest.fn();
const mockGetPersonsOfBondDB = jest.fn().mockImplementation((id) => {
    return testPersonBondList_NoneMarked;
});
const updatePersonBond = mockUpdatePersonBond;
const getPersonsOfBondDB = mockGetPersonsOfBondDB;


export {
    mockUpdatePersonBond,
    mockGetPersonsOfBondDB,
    updatePersonBond,
    getPersonsOfBondDB
}
