import { ThemedText } from "@/components/ThemedText";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {  ListItem } from "@rneui/themed";
import {  View, FlatList, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { AddBondButton, AddBondtButton, AddButton, AddContactButton, StandardButton } from "@/components/ButtonStandard";
import { Bond } from "@/constants/types";
import { styles } from "@/constants/Stylesheet"
import { ScheduleContext } from "@/context/ScheduleContext";

export default function homeScreen() {
  const { bondList } = useContext(InTouchContext);
  const {createPotentialSchedule} = useContext(ScheduleContext)

  function onBondPress (bond: Bond) {
    router.navigate({pathname: "../groupScreen", params: {id: `${bond.bond_id}`} })
  }

  const renderBonds = ({ item }: { item: Bond }) => {
    return (
      <Pressable onPress = {() => onBondPress(item)}>
      <ListItem bottomDivider>
        <ListItem.Content id={item.bond_id.toString()}>
          <ListItem.Title>{item.bondName} </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.stepContainer}>
      <View style={styles.centeredView}>
        <ThemedText style={styles.title} type="title">
          My Bonds
        </ThemedText>
      </View>

      <FlatList
        data={bondList}
        renderItem={renderBonds}
        keyExtractor={(item) => item.bond_id.toString()}
      />

  

      <AddButton color={'forestgreen'}
      title={"New Bond"} onPress={() => {
        createPotentialSchedule(undefined)
        router.push("../createGroupScreen")}
        }/>

     

    </SafeAreaView>
  );
}
