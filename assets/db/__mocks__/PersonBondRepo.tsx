
const testPersonBondList_NoneMarked = [
    {bond_id: 1, person_id: 1, nextToCall: 0},
    {bond_id: 1, person_id: 2, nextToCall: 0},
    {bond_id: 1, person_id: 3, nextToCall: 0},
  ]
const mockUpdatePersonBond = jest.fn().mockImplementation(() => {
    return;
});
const mockGetPersonsOfBondDB = jest.fn().mockImplementation((id) => {
    return testPersonBondList_NoneMarked;
});
const updatePersonBond = mockUpdatePersonBond;
const getPersonsOfBondDB =  jest.fn().mockImplementation((id) => {
    return testPersonBondList_NoneMarked;
})


export {
    mockUpdatePersonBond,
    mockGetPersonsOfBondDB as getPersonsOfBondDB,
    updatePersonBond
}
