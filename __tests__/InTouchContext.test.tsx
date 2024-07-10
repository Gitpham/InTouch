import {  InTouchContextProvider } from "@/context/InTouchContext";
import React  from "react";
import { render, screen, waitFor } from '@testing-library/react-native';
import InTouchContextDummyComponent from "@/__dummyComponents/InTouchContextDummyComponent";
import { mockExecuteAsync, mockFinalizeAsync, mockGetAllAsync, mockPrepareAsync } from "@/__mocks__/expo-sqlite";
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
        const expectedValue = "P1 P1_lastName 111-111-1111 1, P2 P2_lastName 111-111-1112 2";

        expect(peopleListElement.props.children).toEqual(expectedValue)
    })

    it("upon rendering, InTouchContextProvider should have bondList intitialized ", async () => {

        const comp = render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {wrapper: InTouchContextProvider})

        await waitFor(() => {
            expect(screen.getByTestId("bondList").props.children.length).toBeGreaterThan(0); // Assuming peopleList is not empty
        });

        const bondListElement = screen.getByTestId("bondList");
        const expectedValue = "family weekly group 1, friends monthly individual 2";

        expect(bondListElement.props.children).toEqual(expectedValue)
    })

    it("upon rendering, InTouchContextProvider should have personBondMap intitialized ", async () => {

        const comp = render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {wrapper: InTouchContextProvider})

        await waitFor(() => {
            expect(screen.getByTestId("personBondMap").props.children.length).toBeGreaterThan(0); // Assuming peopleList is not empty
        });

        const personBondListElement = screen.getByTestId("personBondMap");
        const expectedValue = [
            [1, new Set([1, 2])],
            [4, new Set([3, 6])],
            [2, new Set([6])],
            [5, new Set([6])],
            [6, new Set([6])]
        ];
        expect(personBondListElement.props.children).toEqual(expectedValue)
    })

    it("upon rendering, InTouchContextProvider should have bondPersonMap intitialized ", async () => {

        const comp = render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {wrapper: InTouchContextProvider})

        await waitFor(() => {
            expect(screen.getByTestId("bondPersonMap").props.children.length).toBeGreaterThan(0); // Assuming peopleList is not empty
        });

        const bondPersonListElement = screen.getByTestId("bondPersonMap");
        const expectedValue =[[1, new Set ([1])], [2, new Set ([1])], [3, new Set([4])], [6, new Set([2,6])]]
        expect(bondPersonListElement.props.children).toEqual(expectedValue)
    })

    





})