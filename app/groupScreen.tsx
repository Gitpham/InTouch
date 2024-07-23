import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, FlatList, Pressable, ScrollView, View } from "react-native"
import { Card, ListItem, Button } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { InTouchContext } from "@/context/InTouchContext";
import { Bond, Person } from "@/constants/types";
import { router } from "expo-router";
import React from "react";
import { StandardButton } from "@/components/ButtonStandard";

export default function groupScreen() {

  const {bondList, getMembersOfBond, removeBond, bondPersonMap } = useContext(InTouchContext)
  const localParams = useLocalSearchParams();
  const [bond, setBond] = useState<Bond>()
  const [members, setMembers] = useState<Array<Person>>();

  useEffect(() => {
    const bondId: number = +localParams.id;
    let bond_index = bondList.findIndex(item => item.bond_id === bondId)
    if (bond_index !== -1) {
      const b: Bond = bondList[bond_index];
      setBond(b);
      const p = getMembersOfBond(b);
      setMembers(p)
    }
  }, [bondPersonMap])

  const renderMembers = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content id={item.person_id.toString()}>
        <View style = {styles.rowOrientation}>
          <View style = {styles.nameContainer}>
            <Pressable onPress = {() => {router.navigate({pathname: "./personScreen", params: {id: `${item.person_id}`}})}}>
              <ListItem.Title>
                {item.firstName} {item.lastName}
              </ListItem.Title>
            </Pressable>
          </View>
          <Pressable
            onPress = {() => console.log("delete!")}
          >
            <ThemedText>Delete</ThemedText>
          </Pressable>
          </View>
        </ListItem.Content>


      </ListItem>
    );
  }

  const deleteBond = () => {
    if (bond) {
    removeBond(bond);
    }
    
    router.back();
  }

       return (
        <SafeAreaView style = {styles.stepContainer} >
          <ScrollView  nestedScrollEnabled={true}>
             <Card>
               <Card.Title>Name: {bond?.bondName}</Card.Title>
               <Card.Divider></Card.Divider>
               <ThemedText>Number: </ThemedText>
               {/* <ThemedText>{person?.phoneNumber}</ThemedText> */}
             </Card>

             <Card>
              <Card.Title>Reminders</Card.Title>
             </Card>

             <Card>
              <Card.Title>Members</Card.Title>
              <FlatList
                nestedScrollEnabled = {true}
                style = {styles.flatList}
                data = {members}
                renderItem = {renderMembers}
                keyExtractor={(item) => item.person_id.toString()}
                />
             </Card>

             <StandardButton
             title = "+Add Member"
             onPress = {() => {router.navigate({pathname: "./addMemberScreen", params: {bond_id : bond.bond_id, group_screen : 1}})}}
             />

             <Button
             title = "Delete"
             buttonStyle = {styles.redButton}
             titleStyle = {styles.redTitle}
              onPress = {() => deleteBond()}
             />


          </ScrollView>
        </SafeAreaView>

       )
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
  },
  title: {
    color: "black",
  },
  redButton: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 2,
  },
  redTitle: {
    color: "red",
  },
  stepContainer: {
    flex: 1,
    backgroundColor: "white",
    gap: 8,
    marginBottom: 8,
    flexDirection: "column",
    paddingTop: 50,
  },
  centeredView: {
    alignItems: "center",
  },
  flatList: {
    height: 200,
  },
  rowOrientation: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
    marginRight: 10, // Adds space between delete button and name
  },
});