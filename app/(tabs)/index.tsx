import { ThemedText } from "@/components/ThemedText";
import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListItem } from "@rneui/themed";
import { View, FlatList, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import {
  AddBondButton,
  AddBondtButton,
  AddButton,
  AddContactButton,
  StandardButton,
} from "@/components/ButtonStandard";
import { Bond } from "@/constants/types";
import { styles } from "@/constants/Stylesheet";
import { ScheduleContext } from "@/context/ScheduleContext";
import { Divider } from "@rneui/base";
import { useSQLiteContext } from "expo-sqlite";
import { getAllBonds } from "@/assets/db/BondRepo";

export default function homeScreen() {
  const db = useSQLiteContext();
  let bondList;
  
  let hasRendered = false;
   useEffect(() => {
      const initalize = async () => {
        if (!hasRendered) {
          try {
            bondList = await getAllBonds(db);
            hasRendered = true;
          } catch (error) {
            console.error(error);
            throw Error("failed to initialize db");
          }
        }
      };
  
      initalize();
    }, []);


  // const { bondList } = useContext(InTouchContext);
  const { createPotentialSchedule } = useContext(ScheduleContext);

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
