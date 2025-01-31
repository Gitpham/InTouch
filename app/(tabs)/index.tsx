import { ThemedText } from "@/components/ThemedText";
import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListItem } from "@rneui/themed";
import { View, FlatList, Pressable } from "react-native";
import { router, useFocusEffect } from "expo-router";
import {
  AddButton
} from "@/components/ButtonStandard";
import { Bond } from "@/constants/types";
import { styles } from "@/constants/Stylesheet";
import { ScheduleContext } from "@/context/ScheduleContext";
import { Divider } from "@rneui/base";
import { getAllBonds } from "@/assets/db/BondRepo";
import { useSQLiteContext } from "expo-sqlite";

export default function homeScreen() {
 
  const { createPotentialSchedule } = useContext(ScheduleContext);

  const db = useSQLiteContext();
  const [bondList, setBondList] = useState<Bond[]>();
  useFocusEffect(

      useCallback(() => {
        const fetchData = async () => {
          const pList = await getAllBonds(db)
          setBondList(pList);
        }
        fetchData();
      }, [])
    );


  function onBondPress(bond: Bond) {
    router.navigate({
      pathname: "../groupScreen",
      params: { id: `${bond.bond_id}` },
    });
  }

  const renderBonds = ({ item }: { item: Bond }) => {
    return (
      <Pressable onPress={() => onBondPress(item)}>
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
        <ThemedText style={{ ...styles.title }} type="title">
          My Bonds
        </ThemedText>
      </View>
      <Divider
        inset={true}
        insetType="middle"
        style={{ borderWidth: 2, borderColor: "forestgreen" }}
      ></Divider>

      <FlatList
        data={bondList}
        renderItem={renderBonds}
        keyExtractor={(item) => item.bond_id.toString()}
      />

      <AddButton
        color={"forestgreen"}
        title={"New Bond"}
        onPress={() => {
          createPotentialSchedule(undefined);
          router.push("../createGroupScreen");
        }}
      />
    </SafeAreaView>
  );
}
