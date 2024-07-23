import React from "react";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import {
  printPotentialSchedule,
  ScheduleContextProvider,
} from "@/context/ScheduleContext";
import ScheduleContextDummyComponent from "@/__dummyComponents/ScheduleContextDummyComponent";
import { testDailySchedule } from "@/__dummyComponents/ScheduleContextMockData";
import { mockGetPersonsOfBondDB } from "@/assets/db/__mocks__/PersonBondRepo";
import { mockGetAllAsyncPersonBond, testPersonBondList } from "@/__mocks__/expo-sqlite";
import { getPersonsOfBondDB } from "@/assets/db/PersonBondRepo";
import { updateBond } from "@/assets/db/BondRepo";
import * as SQLite from "expo-sqlite";

jest.mock("@/assets/db/PersonBondRepo")
jest.mock("@/assets/db/PersonRepo")

// const mockGPOB = jest.fn().mockImplementation((db, num) => testPersonBondList);
// const mockUpdatePersonBond = jest.fn();
// jest.mock("@/assets/db/PersonBondRepo", () => ({
//   getPersonsOfBondDB: mockGPOB,
//   updatePersonBond: mockUpdatePersonBond,
// }))


describe("ScheduleContext integration tests", () => {
  it("calling createPotentialSchedule() with a daily schedule should set the potential schedule to the daily schedule  ", async () => {
    //ARRANGE
    const expected = printPotentialSchedule(testDailySchedule);

    jest.useFakeTimers();
    render(<ScheduleContextDummyComponent></ScheduleContextDummyComponent>, {
      wrapper: ScheduleContextProvider,
    });
    await waitFor(() => {
      expect(screen.getByTestId("potentialSchedule").props.children).toBe(""); // Assuming peopleList is not empty
    });

    await userEvent.press(screen.getByTestId("createPotentialDailySchedule"));
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByTestId("potentialSchedule").props.children).toBe(
        expected
      ); // Assuming peopleList is not empty
    });
  });

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

    expect(getPersonsOfBondDB).toHaveBeenCalled();



  });
});
