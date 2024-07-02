import { ThemedText } from "@/components/ThemedText";
import React, { useState, useEffect, useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, Dialog, ListItem } from "@rneui/themed";
import { StyleSheet, View, FlatList } from "react-native";
import { router } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { StandardButton } from "@/components/ButtonStandard";
import { Bond } from "@/constants/types";

export default function homeScreen() {
  const { bondList } = useContext(InTouchContext);

  const renderBonds = ({ item }: { item: Bond }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content id={item.id}>
          <ListItem.Title>{item.bondName} </ListItem.Title>
        </ListItem.Content>
      </ListItem>
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
        keyExtractor={(item) => item.id}
      />

      <StandardButton
      title={"+Add Group"}
      onPress={() => router.push("./createGroupScreen")}>

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
