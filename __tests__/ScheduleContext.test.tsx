import React from "react";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import { ScheduleContextProvider } from "@/context/ScheduleContext";
import ScheduleContextDummyComponent from "@/__dummyComponents/ScheduleContextDummyComponent";
import {
  getPersonsOfBondDB,
  updatePersonBond,
} from "@/assets/db/PersonBondRepo";
import { mockUseSQLiteContext } from "@/__mocks__/expo-sqlite";
import { Person } from "@/constants/types";
import { getPerson } from "@/assets/db/PersonRepo";
// import { mockGetPersonsOfBondDB, mockUpdatePersonBond } from "@/assets/db/__mocks__/PersonBondRepo";

jest.mock("@/assets/db/PersonRepo", () => {
  const testPerson: Person = {
    firstName: "a",
    lastName: "a",
    phoneNumber: "a",
    person_id: 1,
  };
  const mockGetPerson = jest.fn().mockImplementation(() => {
    return testPerson;
  });

  return {
    getPerson: mockGetPerson,
  };
});

jest.mock("@/assets/db/PersonBondRepo", () => {

  const pbList0 = [
    { bond_id: 1, person_id: 1, nextToCall: 0 },
  ];

  const pbList = [
    { bond_id: 1, person_id: 1, nextToCall: 0 },
    { bond_id: 1, person_id: 2, nextToCall: 0 },
    { bond_id: 1, person_id: 3, nextToCall: 0 },
  ];

  const pbList2 = [
    { bond_id: 2, person_id: 1, nextToCall: 0 },
    { bond_id: 2, person_id: 2, nextToCall: 1 },
    { bond_id: 2, person_id: 3, nextToCall: 0 },
  ];

  const pbList3 = [
    { bond_id: 3, person_id: 1, nextToCall: 0 },
    { bond_id: 3, person_id: 2, nextToCall: 0 },
    { bond_id: 3, person_id: 3, nextToCall: 1 },
  ];


  const mockGetPersonsOfBondDB = jest.fn().mockImplementation((db, bondID) => {

    if (bondID == 0) {
      return pbList0;
    } else if (bondID == 1) {
      return pbList;
    } else if (bondID == 2) {
      return pbList2;
    }  else if (bondID == 3) {
      return pbList3;
    }
    throw Error("User did not specify a valid bondID");
  });

  const mockUpdatePersonBond = jest.fn(() => {
  });
  return {
    getPersonsOfBondDB: mockGetPersonsOfBondDB,
    updatePersonBond: mockUpdatePersonBond,
  };
});

// jest.mock("@/assets/db/PersonBondRepo");
// jest.mock("@/assets/db/PersonRepo")

describe("ScheduleContext integration tests", () => {
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

  describe("getNextToCall()", () => {

    describe("bond of 1 unmarkd member", () => {
      it('should return the member', async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_noneMarked_sizeOne").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("getNextToCall_noneMarked_sizeOne"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_noneMarked_sizeOne").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList0 = [
          { bond_id: 1, person_id: 1, nextToCall: 0 },
        ];
      

        const db = mockUseSQLiteContext();
        expect(getPerson).toHaveBeenCalledWith(db, pbList0[0].person_id);
      })

      it('should mark the member', async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_noneMarked_sizeOne").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("getNextToCall_noneMarked_sizeOne"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_noneMarked_sizeOne").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList0 = [
          { bond_id: 1, person_id: 1, nextToCall: 0 },
        ];
      

        const db = mockUseSQLiteContext();
        expect(updatePersonBond).toHaveBeenCalledWith(db, pbList0[0].person_id, pbList0[0].bond_id, 1);
      })

      it('should NOT unmark the member', async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_noneMarked_sizeOne").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("getNextToCall_noneMarked_sizeOne"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_noneMarked_sizeOne").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList0 = [
          { bond_id: 1, person_id: 1, nextToCall: 0 },
        ];
      

        const db = mockUseSQLiteContext();
        expect(updatePersonBond).not.toHaveBeenCalledWith(db, pbList0[0].person_id, pbList0[0].bond_id, 0);

      })


    })
    describe("bond of 3 unmarked members", () => {
      it("should call getPerson(db, members[0].person_id)", async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_noneMarked").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("getNextToCall_noneMarked"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_noneMarked").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList = [
          { bond_id: 1, person_id: 1, nextToCall: 0 },
          { bond_id: 1, person_id: 2, nextToCall: 0 },
          { bond_id: 1, person_id: 3, nextToCall: 0 },
        ];

        const db = mockUseSQLiteContext();
        expect(getPerson).toHaveBeenCalledWith(db, pbList[0].person_id);
      });

      it("should set the second member to nextToCall", async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_noneMarked").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("getNextToCall_noneMarked"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_noneMarked").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList = [
          { bond_id: 1, person_id: 1, nextToCall: 0 },
          { bond_id: 1, person_id: 2, nextToCall: 0 },
          { bond_id: 1, person_id: 3, nextToCall: 0 },
        ];

        const db = mockUseSQLiteContext();
        expect(updatePersonBond).toHaveBeenCalledWith(
          db,
          pbList[1].person_id,
          pbList[1].bond_id,
          1
        );
      });
    });

    describe("bond of 3 members, 2nd marked", () => {
      it("should return the 2nd member", async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_marked").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("getNextToCall_marked"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_marked").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList2 = [
          { bond_id: 2, person_id: 1, nextToCall: 0 },
          { bond_id: 2, person_id: 2, nextToCall: 1 },
          { bond_id: 2, person_id: 3, nextToCall: 0 },
        ];

        const db = mockUseSQLiteContext();
        expect(getPerson).toHaveBeenCalledWith(db, pbList2[1].person_id);
      });

      it("should call mark the 3rd member as NextToCall", async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_marked").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("getNextToCall_marked"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_marked").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList2 = [
          { bond_id: 2, person_id: 1, nextToCall: 0 },
          { bond_id: 2, person_id: 2, nextToCall: 1 },
          { bond_id: 2, person_id: 3, nextToCall: 0 },
        ];

        const db = mockUseSQLiteContext();
        expect(updatePersonBond).toHaveBeenCalledWith(
          db,
          pbList2[2].person_id,
          pbList2[2].bond_id,
          1
        );
      });

      it("should set the second member's nextToCall to 0", async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_marked").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("getNextToCall_marked"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_marked").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList2 = [
          { bond_id: 2, person_id: 1, nextToCall: 0 },
          { bond_id: 2, person_id: 2, nextToCall: 1 },
          { bond_id: 2, person_id: 3, nextToCall: 0 },
        ];

        const db = mockUseSQLiteContext();
        expect(updatePersonBond).toHaveBeenCalledWith(
          db,
          pbList2[1].person_id,
          pbList2[1].bond_id,
          0
        );
      });
    });


    describe("bond of 3 members, 3rd marked", () => {

      it("should return the 3rd member", async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_lastMarked").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("nextToCall_lastMarked"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_lastMarked").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList3 = [
          { bond_id: 3, person_id: 1, nextToCall: 0 },
          { bond_id: 3, person_id: 2, nextToCall: 0 },
          { bond_id: 3, person_id: 3, nextToCall: 1 },
        ];

        const db = mockUseSQLiteContext();
        expect(getPerson).toHaveBeenCalledWith(db, pbList3[2].person_id);

      })

      it("should mark the 1st member", async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_lastMarked").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("nextToCall_lastMarked"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_lastMarked").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList3 = [
          { bond_id: 3, person_id: 1, nextToCall: 0 },
          { bond_id: 3, person_id: 2, nextToCall: 0 },
          { bond_id: 3, person_id: 3, nextToCall: 1 },
        ];

        const db = mockUseSQLiteContext();
        expect(updatePersonBond).toHaveBeenCalledWith(  db,
          pbList3[0].person_id,
          pbList3[0].bond_id,
          1);
      })

      it("should unmark the 3rd member", async () => {
        jest.useFakeTimers();
        render(
          <ScheduleContextDummyComponent></ScheduleContextDummyComponent>,
          {
            wrapper: ScheduleContextProvider,
          }
        );
        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_lastMarked").props.children.length
          ).toBeGreaterThan(0);
        });

        await userEvent.press(screen.getByTestId("nextToCall_lastMarked"));
        jest.advanceTimersByTime(500);

        await waitFor(() => {
          expect(
            screen.getByTestId("nextToCall_lastMarked").props.children.length
          ).toBeGreaterThan(0);
        });

        const pbList3 = [
          { bond_id: 3, person_id: 1, nextToCall: 0 },
          { bond_id: 3, person_id: 2, nextToCall: 0 },
          { bond_id: 3, person_id: 3, nextToCall: 1 },
        ];

        const db = mockUseSQLiteContext();
        expect(updatePersonBond).toHaveBeenCalledWith(  db,
          pbList3[2].person_id,
          pbList3[2].bond_id,
          0);
      })
    })




  });
});
