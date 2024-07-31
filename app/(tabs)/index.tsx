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
import { styles } from "@/constants/Stylesheet"

export default function homeScreen() {
  const { bondList, bondPersonMap } = useContext(InTouchContext);

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
          My Groups
        </ThemedText>
      </View>

      <FlatList
        data={bondList}
        renderItem={renderBonds}
        keyExtractor={(item) => item.bond_id.toString()}
      />

      <StandardButton
      title={"+Add Group"}
      onPress={() => router.push("../createGroupScreen")}>
      </StandardButton>

    </SafeAreaView>
  );
}
