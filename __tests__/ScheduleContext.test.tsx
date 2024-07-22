import React from "react";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import { printPotentialSchedule, ScheduleContextProvider } from "@/context/scheduleContext";
import ScheduleContextDummyComponent from "@/__dummyComponents/ScheduleContextDummyComponent";
import { testDailySchedule } from "@/__dummyComponents/ScheduleContextMockData";


describe("ScheduleContext integration tests", () => {
    it("calling createPotentialSchedule() with a daily schedule should set the potential schedule to the daily schedule  ", async () => {
        //ARRANGE
     

        const expected = printPotentialSchedule(testDailySchedule);

        jest.useFakeTimers();
        render(<ScheduleContextDummyComponent></ScheduleContextDummyComponent>, {wrapper: ScheduleContextProvider});
        await waitFor(() => {
            expect(
              screen.getByTestId("potentialSchedule").props.children
            ).toBe(""); // Assuming peopleList is not empty
          });

          await userEvent.press(screen.getByTestId("createPotentialDailySchedule"));
          jest.advanceTimersByTime(500);




          await waitFor(() => {
            expect(
              screen.getByTestId("potentialSchedule").props.children
            ).toBe(expected); // Assuming peopleList is not empty
          });


    })




})