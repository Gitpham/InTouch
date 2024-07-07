import { ThemedText } from "@/components/ThemedText";
import React, { useState, useEffect, useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, Dialog, ListItem } from "@rneui/themed";
import { StyleSheet, View, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { StandardButton } from "@/components/ButtonStandard";
import { Bond } from "@/constants/types";

export default function homeScreen() {
  const { bondList } = useContext(InTouchContext);

  function onBondPress (bond_id: string) {
    router.navigate({pathname: "../groupScreen", params: {id: `${bond_id}`} })
  }

  const renderBonds = ({ item }: { item: Bond }) => {
    return (
      <Pressable onPress = {() => onBondPress(item.bond_id)}>
      <ListItem bottomDivider>
        <ListItem.Content id={item.bond_id}>
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
          My Groups
        </ThemedText>
      </View>

      <FlatList
        data={bondList}
        renderItem={renderBonds}
        keyExtractor={(item) => item.bond_id}
      />

      <StandardButton
      title={"+Add Group"}
      onPress={() => router.push("../createGroupScreen")}>
      </StandardButton>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "black",
  },
  items: {
    color: "black",
    margin: 25,
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
});
