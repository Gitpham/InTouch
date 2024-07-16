import { InTouchContext } from "@/context/InTouchContext";
import { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import React from "react";
import { testB1, testB2,  testB6, testP1, testP2 } from "@/__mocks__/expo-sqlite";
// import { Button } from "@rneui/themed";

export default function InTouchContextDummyComponent() {
  const {
    peopleList,
    bondList,
    personBondMap,
    bondPersonMap,
    createPerson,
    removePerson,
    createBond,
    removeBond,
    createBondMember,
    removeBondMember,
    // getBondPersonMap,
    // getPersonBondMap,
    // getBondsOfPerson,
  } = useContext(InTouchContext);

  const people = peopleList.map(
    (p) => `${p.firstName} ${p.lastName} ${p.phoneNumber} ${p.person_id}`
  );
  const bonds = bondList.map(
    (b) => `${b.bondName} ${b.schedule} ${b.typeOfCall} ${b.bond_id}`
  );

  const pbIter = personBondMap.entries();
  const personBonds: string[] = [];
  personBondMap.forEach(() => personBonds.push(pbIter.next().value));

  const bpIter = bondPersonMap.entries();
  const bondPersons: string[] = [];
  bondPersonMap.forEach(() => bondPersons.push(bpIter.next().value));

  function onCreatePersonPress(): void {

    createPerson(testP1);
  }

  function onRemovePersonPress(): void {
    // console.log("onRemovePersonPress() testP1: ", testP1 )
    removePerson(testP1);
  }

  function onCreateBondPress(): void {
    createBond(testB2);
  }

  function onRemoveBondPress(): void {
    removeBond(testB1);
  }

  function onCreateBondMemberPress(): void {
    const personID: Set<number> = new Set([1])
    const bondID: number = 3;
    createBondMember(personID, bondID);
  }

  function onCreateBondMultipleMemberPress(): void {
    const personIDs: Set<number> = new Set([1, 2, 3])
    const bondID: number = 3;
    createBondMember(personIDs, bondID);
  }

  function onRemoveBondMemberPress(): void {
    removeBondMember(testB6, testP2);
  }


  return (
    <View>
      <Text testID="peopleList">{people.join(", ")}</Text>
      <Text testID="bondList">{bonds.join(", ")}</Text>
      <Text testID="personBondMap">{personBonds}</Text>
      <Text testID="bondPersonMap">{bondPersons}</Text>
      <Pressable testID="createPerson" onPress={onCreatePersonPress}>
        <Text>CreatePerson</Text>
      </Pressable>
      <Pressable testID="removePerson" onPress={onRemovePersonPress}>
        <Text>RemovePerson</Text>
      </Pressable>

      <Pressable testID="createBond" onPress={onCreateBondPress}>
        <Text>CreateBond</Text>
      </Pressable>

      <Pressable testID="removeBond" onPress={onRemoveBondPress}>
        <Text>RemoveBond</Text>
      </Pressable>

      <Pressable testID="createBondMember" onPress={onCreateBondMemberPress}>
        <Text>createBondMember</Text>
      </Pressable>

      <Pressable testID="createMultipleBondMembers" onPress={onCreateBondMultipleMemberPress}>
        <Text>createMultipleBondMembers</Text>
      </Pressable>

      <Pressable testID="removeBondMember" onPress={onRemoveBondMemberPress}>
        <Text>removeBondMember</Text>
      </Pressable>

    </View>
  );
}
