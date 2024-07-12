import { InTouchContext } from "@/context/InTouchContext";
import { useContext,  } from "react";
import { View, Text, Button, Pressable} from "react-native";
import React from "react";
import { testP1 } from "@/__mocks__/expo-sqlite";
// import { Button } from "@rneui/themed";


export default function InTouchContextDummyComponent () {
    const {
        peopleList,
        bondList,
        personBondMap,
        bondPersonMap,
        createPerson,
        // removePerson,
        // createBond,
        // removeBond,
        // createBondMember,
        // removeBondMember,
        // getBondPersonMap,
        // getPersonBondMap,
        // getBondsOfPerson,
    } = useContext(InTouchContext)

    const people = peopleList.map((p) => `${p.firstName} ${p.lastName} ${p.phoneNumber} ${p.person_id}`);
    const bonds = bondList.map((b) => `${b.bondName} ${b.schedule} ${b.typeOfCall} ${b.bond_id}`) 


    const pbIter = personBondMap.entries()
    const personBonds: string[] = [];
    personBondMap.forEach(() => personBonds.push(pbIter.next().value));

    const bpIter = bondPersonMap.entries();
    const bondPersons: string[] = [];
    bondPersonMap.forEach(() => bondPersons.push(bpIter.next().value))
    

    function onCreatePersonPress():void {
        createPerson(testP1);
    }

    return(
        <View>
            <Text testID="peopleList">{people.join(', ')}</Text>
            <Text testID="bondList">{bonds.join(', ')}</Text>
            <Text testID="personBondMap">{personBonds}</Text>
            <Text testID="bondPersonMap">{bondPersons}</Text>
            <Pressable testID="createPerson" onPress={onCreatePersonPress}>
                <Text>CreatePerson</Text>
            </Pressable>
        </View>
    );
}