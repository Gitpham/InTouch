import {  InTouchContextProvider } from "@/context/InTouchContext";
import React  from "react";
import { render, screen, waitFor } from '@testing-library/react-native';
import InTouchContextDummyComponent from "@/__dummyComponents/InTouchContextDummyComponent";
import { mockExecuteAsync, mockFinalizeAsync, mockGetAllAsync, mockPrepareAsync, testBondList, testPersonBondList, testPersonList } from "@/__mocks__/expo-sqlite";
import { bondPersonMap_test, personBondMap_test } from "@/__dummyComponents/InTouchContextMockData";
describe("integration tests for InTouchContext", () => {


    beforeEach(() => {

        mockExecuteAsync.mockClear();
        mockFinalizeAsync.mockClear();
        mockGetAllAsync.mockClear();
        mockPrepareAsync.mockClear();
    })

    it("upon rendering, InTouchContextProvider should have peopleList intitialized ", async () => {

        const comp = render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {wrapper: InTouchContextProvider})

        await waitFor(() => {
            expect(screen.getByTestId("peopleList").props.children.length).toBeGreaterThan(0); // Assuming peopleList is not empty
        });

        const peopleListElement = screen.getByTestId("peopleList");
        const expectedValue = testPersonList.map((p) => `${p.firstName} ${p.lastName} ${p.phoneNumber} ${p.person_id}`).join(', ')
        expect(peopleListElement.props.children).toEqual(expectedValue)
    })

    it("upon rendering, InTouchContextProvider should have bondList intitialized ", async () => {

        const comp = render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {wrapper: InTouchContextProvider})

        await waitFor(() => {
            expect(screen.getByTestId("bondList").props.children.length).toBeGreaterThan(0); // Assuming peopleList is not empty
        });

        const bondListElement = screen.getByTestId("bondList");
        const expectedValue = testBondList.map((p) => `${p.bondName} ${p.schedule} ${p.typeOfCall} ${p.bond_id}`).join(', ')

        expect(bondListElement.props.children).toEqual(expectedValue)
    })

    it("upon rendering, InTouchContextProvider should have personBondMap intitialized ", async () => {

        const comp = render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {wrapper: InTouchContextProvider})

        await waitFor(() => {
            expect(screen.getByTestId("personBondMap").props.children.length).toBeGreaterThan(0); // Assuming peopleList is not empty
        });

        const personBondListElement = screen.getByTestId("personBondMap");
        const expectedValue = personBondMap_test;
        expect(personBondListElement.props.children).toEqual(expectedValue)
    })

    it("upon rendering, InTouchContextProvider should have bondPersonMap intitialized ", async () => {

        const comp = render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {wrapper: InTouchContextProvider})

        await waitFor(() => {
            expect(screen.getByTestId("bondPersonMap").props.children.length).toBeGreaterThan(0); // Assuming peopleList is not empty
        });

        const bondPersonListElement = screen.getByTestId("bondPersonMap");
        const expectedValue = bondPersonMap_test
        expect(bondPersonListElement.props.children).toEqual(expectedValue)
    })

    





})