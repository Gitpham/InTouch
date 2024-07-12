import { InTouchContextProvider } from "@/context/InTouchContext";
import React from "react";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import InTouchContextDummyComponent from "@/__dummyComponents/InTouchContextDummyComponent";
import {
  mockExecuteAsync,
  mockFinalizeAsync,
  mockGetAllAsync,
  mockPrepareAsync,
  testBondList,
  testP1,
  testPersonList,
} from "@/__mocks__/expo-sqlite";
import {
  bondPersonMap_test,
  personBondMap_test,
} from "@/__dummyComponents/InTouchContextMockData";
import { Person } from "@/constants/types";
describe("integration tests for InTouchContext", () => {
  beforeEach(() => {
    mockExecuteAsync.mockClear();
    mockFinalizeAsync.mockClear();
    mockGetAllAsync.mockClear();
    mockPrepareAsync.mockClear();
  });

  it("upon rendering, InTouchContextProvider should have peopleList intitialized ", async () => {
    render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
      wrapper: InTouchContextProvider,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("peopleList").props.children.length
      ).toBeGreaterThan(0); // Assuming peopleList is not empty
    });

    const peopleListElement = screen.getByTestId("peopleList");
    const expectedValue = testPersonList
      .map(
        (p) => `${p.firstName} ${p.lastName} ${p.phoneNumber} ${p.person_id}`
      )
      .join(", ");
    expect(peopleListElement.props.children).toEqual(expectedValue);
  });

  it("upon rendering, InTouchContextProvider should have bondList intitialized ", async () => {
    render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
      wrapper: InTouchContextProvider,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("bondList").props.children.length
      ).toBeGreaterThan(0); // Assuming peopleList is not empty
    });

    const bondListElement = screen.getByTestId("bondList");
    const expectedValue = testBondList
      .map((p) => `${p.bondName} ${p.schedule} ${p.typeOfCall} ${p.bond_id}`)
      .join(", ");

    expect(bondListElement.props.children).toEqual(expectedValue);
  });

  it("upon rendering, InTouchContextProvider should have personBondMap intitialized ", async () => {
    render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
      wrapper: InTouchContextProvider,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("personBondMap").props.children.length
      ).toBeGreaterThan(0); // Assuming peopleList is not empty
    });

    const personBondListElement = screen.getByTestId("personBondMap");
    const expectedValue = personBondMap_test;
    expect(personBondListElement.props.children).toEqual(expectedValue);
  });

  it("upon rendering, InTouchContextProvider should have bondPersonMap intitialized ", async () => {
    render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
      wrapper: InTouchContextProvider,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("bondPersonMap").props.children.length
      ).toBeGreaterThan(0); // Assuming peopleList is not empty
    });

    const bondPersonListElement = screen.getByTestId("bondPersonMap");
    const expectedValue = bondPersonMap_test;
    expect(bondPersonListElement.props.children).toEqual(expectedValue);
  });

  describe("people", () => {

    it("calling createPerson() with a valid person should write to the db with the correct sql", async () => {
      const expected = [testP1.firstName, testP1.lastName, testP1.phoneNumber];
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });
      await waitFor(() => {
        expect(
          screen.getByTestId("createPerson").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      await userEvent.press(screen.getByTestId("createPerson"));
      expect(mockExecuteAsync).toHaveBeenCalledWith(expected);
    });

    it("calling createPerson() with a valid person should add a person to the peopleList state variable", async () => {
      //CHECKS DEFAULT VALUE OF PEOPLE LIST
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });
  
      const expectedValue = testPersonList
        .map(
          (p) => `${p.firstName} ${p.lastName} ${p.phoneNumber} ${p.person_id}`
        )
        .join(", ");


      await waitFor(() => {
        expect(
          screen.getByTestId("peopleList").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      let peopleListElement = screen.getByTestId("peopleList");
      expect(peopleListElement.props.children).toEqual(expectedValue);

      //call createPerson()
      await waitFor(() => {
        expect(
          screen.getByTestId("createPerson").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      await userEvent.press(screen.getByTestId("createPerson"));

      //check that peopleList is updated
      
      const newExpectedList = testPersonList;
      const addPerson: Person = {...testP1, person_id: 3}
      newExpectedList.push(addPerson);
      const newExpectedValue = newExpectedList
        .map(
          (p) => `${p.firstName} ${p.lastName} ${p.phoneNumber} ${p.person_id}`
        )
        .join(", ");

      await waitFor(() => {
        expect(
          screen.getByTestId("peopleList").props.children.length
        ).toBeGreaterThan(0); 
      });

      peopleListElement = screen.getByTestId("peopleList");
      expect(peopleListElement.props.children).toEqual(newExpectedValue);
    });


    it("calling removePerson() with a valid person should write to the db with the correct sql", async () => {
        const expected = ["1"];
        render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
          wrapper: InTouchContextProvider,
        });
        await waitFor(() => {
          expect(
            screen.getByTestId("removePerson").props.children.length
          ).toBeGreaterThan(0); // Assuming peopleList is not empty
        });
  
        await userEvent.press(screen.getByTestId("removePerson"));
        expect(mockExecuteAsync).toHaveBeenCalledWith(expected);
      });


  });



});
