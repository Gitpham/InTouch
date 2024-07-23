import React from "react";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import {
  ScheduleContextProvider,
} from "@/context/ScheduleContext";
import ScheduleContextDummyComponent from "@/__dummyComponents/ScheduleContextDummyComponent";
import { getPersonsOfBondDB, updatePersonBond } from "@/assets/db/PersonBondRepo";
import { testP1 } from "@/__mocks__/expo-sqlite";
import { Person } from "@/constants/types";
// import { mockGetPersonsOfBondDB, mockUpdatePersonBond } from "@/assets/db/__mocks__/PersonBondRepo";

jest.mock("@/assets/db/PersonRepo", () => {
  const testPerson: Person = {
    firstName: "a",
    lastName: "a",
    phoneNumber: "a",
    person_id: 1
  }
  const mockGetPerson= jest.fn().mockImplementationOnce(() => {
    console.log("this: mockGetPerson")
    return testPerson;
  })

  return {
    getPerson: mockGetPerson
  }
})

jest.mock("@/assets/db/PersonBondRepo", () => {
  const pbList = [
    {bond_id: 1, person_id: 1, nextToCall: 0},
    {bond_id: 1, person_id: 2, nextToCall: 0},
    {bond_id: 1, person_id: 3, nextToCall: 0},
  ]
  const mockGetPersonsOfBondDB = jest.fn().mockImplementation(() => {
    console.log("this: mockGetPersonOfBondDB")
    return pbList
  });
  const mockUpdatePersonBond = jest.fn(() => {console.log("this: mockUpdatePB")})
  return {
    getPersonsOfBondDB: mockGetPersonsOfBondDB,
    updatePersonBond: mockUpdatePersonBond,
  }
})


describe("ScheduleContext integration tests", () => {

  // beforeEach(() => {
  //   mockUpdatePersonBond.mockClear();
  //   mockGetPersonsOfBondDB.mockClear();
  // })
  // it("calling createPotentialSchedule() with a daily schedule should set the potential schedule to the daily schedule  ", async () => {


  //   //ARRANGE
  //   const expected = printPotentialSchedule(testDailySchedule);

  //   jest.useFakeTimers();
  //   render(<ScheduleContextDummyComponent></ScheduleContextDummyComponent>, {
  //     wrapper: ScheduleContextProvider,
  //   });
  //   await waitFor(() => {
  //     expect(screen.getByTestId("potentialSchedule").props.children).toBe(""); // Assuming peopleList is not empty
  //   });

  //   await userEvent.press(screen.getByTestId("createPotentialDailySchedule"));
  //   jest.advanceTimersByTime(500);

  //   await waitFor(() => {
  //     expect(screen.getByTestId("potentialSchedule").props.children).toBe(
  //       expected
  //     ); // Assuming peopleList is not empty
  //   });
  // });

  it("calling getNextToCall() for a bond with 3 unmarked members should return the first and mark the second", async () => {
   
    jest.useFakeTimers();
    render(<ScheduleContextDummyComponent></ScheduleContextDummyComponent>, {
      wrapper: ScheduleContextProvider,
    });
    await waitFor(() => {
      expect(screen.getByTestId("nextToCall").props.children.length).toBeGreaterThan(0)
    });


    await userEvent.press(screen.getByTestId("getNextToCall"));
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByTestId("nextToCall").props.children.length).toBeGreaterThan(0)
    });

    const nextToCallEl = screen.getByTestId("nextToCall").props.children

    expect(updatePersonBond).toHaveBeenCalledWith("");
  });
});
