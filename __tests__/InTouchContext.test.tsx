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
  testB2,
  testB6,
  testBondList,
  testP1,
  testP2,
  testPersonList,
} from "@/__mocks__/expo-sqlite";
import { Bond, Person } from "@/constants/types";
describe("integration tests for InTouchContext", () => {
  let expectedPersonBondHash: string[];
  let expectedBondPersonHash: string[];
  const pbHash: Map<number, Set<number>> = new Map();
  const bpHash: Map<number, Set<number>> = new Map();

  beforeEach(() => {
    pbHash.set(1, new Set([1, 2]));
    pbHash.set(4, new Set([3, 6]));
    pbHash.set(2, new Set([6]));
    pbHash.set(5, new Set([6]));
    pbHash.set(6, new Set([6]));
    const pbIter = pbHash.entries();
    expectedPersonBondHash = [];
    pbHash.forEach(() => expectedPersonBondHash.push(pbIter.next().value));

    bpHash.set(1, new Set([1]));
    bpHash.set(2, new Set([1]));
    bpHash.set(3, new Set([4]));
    bpHash.set(6, new Set([2, 4, 5, 6]));
    const bpIter = bpHash.entries();
    expectedBondPersonHash = [];
    bpHash.forEach(() => expectedBondPersonHash.push(bpIter.next().value));
    mockExecuteAsync.mockClear();
    mockFinalizeAsync.mockClear();
    mockGetAllAsync.mockClear();
    mockPrepareAsync.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
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
    const expectedValue = expectedPersonBondHash;
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
    const expectedValue = expectedBondPersonHash;
    expect(bondPersonListElement.props.children).toEqual(expectedValue);
  });

  describe("people", () => {
    it("calling createPerson() with a valid person should write to the db with the correct sql", async () => {
      jest.useFakeTimers();
      const expected = [
        "3",
        testP1.firstName,
        testP1.lastName,
        testP1.phoneNumber,
      ];
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });
      await waitFor(() => {
        expect(
          screen.getByTestId("createPerson").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      await userEvent.press(screen.getByTestId("createPerson"));
      jest.advanceTimersByTime(500);
      expect(mockExecuteAsync).toHaveBeenCalledWith(expected);
    });

    it("calling createPerson() with a valid person should add a person to the peopleList state variable", async () => {
      jest.useFakeTimers();
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
      jest.advanceTimersByTime(500);

      //check that peopleList is updated

      const newExpectedList = testPersonList;
      const addPerson: Person = { ...testP1, person_id: 3 };
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
      jest.useFakeTimers();
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
      jest.advanceTimersByTime(500);
      expect(mockExecuteAsync).toHaveBeenCalledWith(expected);
    });

    it("calling removePerson() with a valid person should remove a person from the peopleList state variable", async () => {
      jest.useFakeTimers();
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
        ).toBeGreaterThan(0);
      });

      let peopleListElement = screen.getByTestId("peopleList");
      expect(peopleListElement.props.children).toEqual(expectedValue);

      //call removePerson()
      await waitFor(() => {
        expect(
          screen.getByTestId("removePerson").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      await userEvent.press(screen.getByTestId("removePerson"));
      jest.advanceTimersByTime(500);

      //check that peopleList is updated
      const newExpectedList = testPersonList.filter((p) => p.person_id != 1);
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
  });

  describe("Bond functions", () => {
    it("calling createBond() with a valid bond should write to the db with the correct sql", async () => {
      //ARRANGE
      jest.useFakeTimers();
      const expected = [
        "3",
        testB2.bondName,
        testB2.schedule,
        testB2.typeOfCall,
      ];
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      //ACT
      await waitFor(() => {
        expect(
          screen.getByTestId("createBond").props.children.length
        ).toBeGreaterThan(0);
      });
      await userEvent.press(screen.getByTestId("createBond"));
      jest.advanceTimersByTime(500);

      //ASSERT
      expect(mockExecuteAsync).toHaveBeenCalledWith(expected);
      jest.useRealTimers();
    });

    it("calling createBond() with a valid bond should add a bond to the bondList state variable", async () => {
      //CHECKS DEFAULT VALUE OF BOND LIST
      jest.useFakeTimers();
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });
      await waitFor(() => {
        expect(
          screen.getByTestId("bondList").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      let bondListElement = screen.getByTestId("bondList");
      const expectedValue = testBondList
        .map((p) => `${p.bondName} ${p.schedule} ${p.typeOfCall} ${p.bond_id}`)
        .join(", ");
      expect(bondListElement.props.children).toEqual(expectedValue);

      //call createBond()
      await waitFor(() => {
        expect(
          screen.getByTestId("createBond").props.children.length
        ).toBeGreaterThan(0);
      });

      await userEvent.press(screen.getByTestId("createBond"));
      jest.advanceTimersByTime(500);

      //check that bondList is updated

      const newExpectedList = testBondList;
      const addBond: Bond = { ...testB2, bond_id: 3 };
      newExpectedList.push(addBond);
      const newExpectedValue = newExpectedList
        .map((b) => `${b.bondName} ${b.schedule} ${b.typeOfCall} ${b.bond_id}`)
        .join(", ");

      await waitFor(() => {
        expect(
          screen.getByTestId("bondList").props.children.length
        ).toBeGreaterThan(0);
      });

      bondListElement = screen.getByTestId("bondList");
      expect(bondListElement.props.children).toEqual(newExpectedValue);
      jest.useRealTimers();
    });

    it("calling removeBond() with a valid bond should remove a bond from the bondList state variable", async () => {
      jest.useFakeTimers();

      //CHECKS DEFAULT VALUE OF BOND LIST
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      await waitFor(() => {
        expect(
          screen.getByTestId("bondList").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      let bondListElement = screen.getByTestId("bondList");
      const expectedValue = testBondList
        .map((p) => `${p.bondName} ${p.schedule} ${p.typeOfCall} ${p.bond_id}`)
        .join(", ");

      expect(bondListElement.props.children).toEqual(expectedValue);

      //call removeBond()
      await waitFor(() => {
        expect(
          screen.getByTestId("removeBond").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      await userEvent.press(screen.getByTestId("removeBond"));
      jest.advanceTimersByTime(500);

      //check that peopleList is updated
      const newExpectedList = testBondList.filter((p) => p.bond_id != 1);
      const newExpectedValue = newExpectedList
        .map((p) => `${p.bondName} ${p.schedule} ${p.typeOfCall} ${p.bond_id}`)
        .join(", ");

      await waitFor(() => {
        expect(
          screen.getByTestId("bondList").props.children.length
        ).toBeGreaterThan(0);
      });

      bondListElement = screen.getByTestId("bondList");
      expect(bondListElement.props.children).toEqual(newExpectedValue);
      jest.useRealTimers();
    });
  });

  describe("personBond functions", () => {
    it("initializeBondMemberMaps() should return a hashMap where the keys are person_ids and the values are sets of bond_ids", async () => {
      //ARRANGE
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });
      await waitFor(() => {
        expect(
          screen.getByTestId("personBondMap").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      //ACT
      //ASSERT
      const personBondMapElement =
        screen.getByTestId("personBondMap").props.children;
      expect(personBondMapElement).toEqual(expectedPersonBondHash);
    });

    it("upon rendering, initializeBondMembersMaps() should return a hashMap where the keys are bond_ids and the values are sets of person_ids", async () => {
      //ARRANGE
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });
      await waitFor(() => {
        expect(
          screen.getByTestId("bondPersonMap").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      //ACT
      //ASSERT
      const bondPersonMapElement =
        screen.getByTestId("bondPersonMap").props.children;
      expect(bondPersonMapElement).toEqual(expectedBondPersonHash);
    });

    it("createBondMember(1, 3) should write to the personBond table with the correct sql", async () => {
      //ARRANGE
      jest.useFakeTimers();
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      await waitFor(() => {
        expect(
          screen.getByTestId("createBondMember").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      //ACT
      await userEvent.press(screen.getByTestId("createBondMember"));
      jest.advanceTimersByTime(500);

      //ASSERT
      const bondID = "1";
      const personID = "3";
      const expectedValue: string[] = [bondID, personID];
      expect(mockExecuteAsync).toHaveBeenCalledWith(expectedValue);
    });

    it("createBondMember(1, 3) should update the personBond hash", async () => {
      //ARRANGE
      jest.useFakeTimers();
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      const bondIdSet: Set<number> = pbHash.get(1) as Set<number>;
      bondIdSet.add(3);
      pbHash.set(1, bondIdSet);

      const pbIter = pbHash.entries();
      expectedPersonBondHash = [];
      pbHash.forEach(() => expectedPersonBondHash.push(pbIter.next().value));

      await waitFor(() => {
        expect(
          screen.getByTestId("personBondMap").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      //ACT
      await userEvent.press(screen.getByTestId("createBondMember"));

      jest.advanceTimersByTime(500);
      await waitFor(() => {
        expect(
          screen.getByTestId("personBondMap").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      //ASSERT
      const personBondElement =
        screen.getByTestId("personBondMap").props.children;

      // console.log("personBondElement: ", personBondElement)
      expect(personBondElement).toEqual(expectedPersonBondHash);
    });

    it("createBondMember(1, 3) should update the bondPerson hash", async () => {
      //ARRANGE
      jest.useFakeTimers();
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      const personIdSet: Set<number> = bpHash.get(3) as Set<number>;
      personIdSet.add(1);
      bpHash.set(3, personIdSet);

      const bpIter = bpHash.entries();
      expectedBondPersonHash = [];
      pbHash.forEach(() => expectedBondPersonHash.push(bpIter.next().value));

      await waitFor(() => {
        expect(
          screen.getByTestId("bondPersonMap").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      //ACT
      await userEvent.press(screen.getByTestId("createBondMember"));

      jest.advanceTimersByTime(500);
      await waitFor(() => {
        expect(
          screen.getByTestId("bondPersonMap").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      //ASSERT
      const bondPersonElement =
        screen.getByTestId("bondPersonMap").props.children;
      expect(bondPersonElement).toEqual(expectedBondPersonHash);
    });

    it("createBondMember(3, [1, 2, 3]) should write to the personBond table with the correct sql", async () => {
      //ARRANGE
      jest.useFakeTimers();
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      await waitFor(() => {
        expect(
          screen.getByTestId("createMultipleBondMembers").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      //ACT
      await userEvent.press(screen.getByTestId("createMultipleBondMembers"));
      jest.advanceTimersByTime(500);

      //ASSERT

      const expectedValue_1: string[] = ["1", "3"];
      const expectedValue_2: string[] = ["2", "3"];
      const expectedValue_3: string[] = ["3", "3"];

      expect(mockExecuteAsync).toHaveBeenCalledWith(expectedValue_1);
      expect(mockExecuteAsync).toHaveBeenCalledWith(expectedValue_2);
      expect(mockExecuteAsync).toHaveBeenCalledWith(expectedValue_3);
    });

    it("createBondMember(3, [1,2,3]) should update the personBond hash", async () => {
      //ARRANGE
      jest.useFakeTimers();
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      await waitFor(() => {
        expect(
          screen.getByTestId("personBondMap").props.children.length
        ).toBeGreaterThan(0);
      });

      //CHECK that personBondMap is equal to default expected value

      let personBondElement =
        screen.getByTestId("personBondMap").props.children;
      expect(personBondElement).toEqual(expectedPersonBondHash);

      //CREATE NEW EXPECTED personBondMap

      let bondIdSet: Set<number> = pbHash.get(1) as Set<number>;
      bondIdSet.add(3);
      pbHash.set(1, bondIdSet);

      bondIdSet = pbHash.get(2) as Set<number>;
      bondIdSet.add(3);
      pbHash.set(2, bondIdSet);

      bondIdSet = new Set();
      bondIdSet.add(3);
      pbHash.set(3, bondIdSet);

      const pbIter = pbHash.entries();
      expectedPersonBondHash = [];
      pbHash.forEach(() => expectedPersonBondHash.push(pbIter.next().value));

      //ACT
      await userEvent.press(screen.getByTestId("createMultipleBondMembers"));
      jest.advanceTimersByTime(500);
      await waitFor(() => {
        expect(
          screen.getByTestId("personBondMap").props.children.length
        ).toBeGreaterThan(0);
      });

      //ASSERT
      personBondElement = screen.getByTestId("personBondMap").props.children;
      expect(personBondElement).toEqual(expectedPersonBondHash);
    });

    it("createBondMember(3, [1, 2, 3]) should update the bondPerson hash", async () => {
      //ARRANGE
      jest.useFakeTimers();
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      await waitFor(() => {
        expect(
          screen.getByTestId("bondPersonMap").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      // CREATE NEW EXPECTD BP HASH
      let personIdSet: Set<number> = bpHash.get(3) as Set<number>;
      personIdSet.add(1);
      bpHash.set(3, personIdSet);

      personIdSet = bpHash.get(3) as Set<number>;
      personIdSet.add(2);
      bpHash.set(3, personIdSet);

      personIdSet = bpHash.get(3) as Set<number>;
      personIdSet.add(3);
      bpHash.set(3, personIdSet);

      const bpIter = bpHash.entries();
      expectedBondPersonHash = [];
      pbHash.forEach(() => expectedBondPersonHash.push(bpIter.next().value));

      //ACT
      await userEvent.press(screen.getByTestId("createMultipleBondMembers"));

      jest.advanceTimersByTime(500);
      await waitFor(() => {
        expect(
          screen.getByTestId("bondPersonMap").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      //ASSERT
      const bondPersonElement =
        screen.getByTestId("bondPersonMap").props.children;
      expect(bondPersonElement).toEqual(expectedBondPersonHash);
    });

    it("removeBondMember(6, 1) should update the bondPerson hash", async () => {
      //ARRANGE

      // MANUALLY REMOVE BOND MEMBER FORM BONDPERSONHASH
      const personIdSet: Set<number> = bpHash.get(
        testB6.bond_id
      ) as Set<number>;
      personIdSet.delete(testP2.person_id as number);
      bpHash.set(testB6.bond_id, personIdSet);

      const bpIter = bpHash.entries();
      expectedBondPersonHash = [];
      bpHash.forEach(() => expectedBondPersonHash.push(bpIter.next().value));

      jest.useFakeTimers();
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      await waitFor(() => {
        expect(
          screen.getByTestId("bondPersonMap").props.children.length
        ).toBeGreaterThan(0);
      });

      //ACT
      await userEvent.press(screen.getByTestId("removeBondMember"));
      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(
          screen.getByTestId("bondPersonMap").props.children.length
        ).toBeGreaterThan(0); // Assuming peopleList is not empty
      });

      //ASSERT
      const bondPersonElement =
        screen.getByTestId("bondPersonMap").props.children;

      expect(bondPersonElement).toEqual(expectedBondPersonHash);
    });

    it("tempBondMembers should be initialized to empty", async () => {
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      await waitFor(() => {
        expect(screen.getByTestId("tempBondMembers").props.children).toEqual(
          []
        ); // Assuming peopleList is not empty
      });

      const tmListElement =
        screen.getByTestId("tempBondMembers").props.children;
      const expectedValue: number[] = [];
      expect(tmListElement).toEqual(expectedValue);
    });

    it("addTempBondMembers should add to tempBondMember set", async () => {
      jest.useFakeTimers();
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      await waitFor(() => {
        expect(screen.getByTestId("tempBondMembers").props.children).toEqual(
          []
        ); // Assuming peopleList is not empty
      });

      //ACT
      await userEvent.press(screen.getByTestId("addTempBondMember"));
      jest.advanceTimersByTime(500);

      const tempBondMemberElement =
        screen.getByTestId("tempBondMembers").props.children;
      const expectedValue: number[] = [1];
      expect(tempBondMemberElement).toEqual(expectedValue);
    });

    it("clearTempBondMembers should clear to tempBondMember set", async () => {
      jest.useFakeTimers();
      render(<InTouchContextDummyComponent></InTouchContextDummyComponent>, {
        wrapper: InTouchContextProvider,
      });

      await waitFor(() => {
        expect(screen.getByTestId("tempBondMembers").props.children).toEqual(
          []
        ); 
      });

      //add 1 person to set
      await userEvent.press(screen.getByTestId("addTempBondMember"));
      jest.advanceTimersByTime(500);

      //clear set

      await userEvent.press(screen.getByTestId("clearTempBondMember"));
      jest.advanceTimersByTime(500);

      const tempBondMemberElement =
        screen.getByTestId("tempBondMembers").props.children;
      const expectedValue: number[] = [];
      expect(tempBondMemberElement).toEqual(expectedValue);
    });
  });
});
