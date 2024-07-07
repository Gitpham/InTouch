import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { StandardButton } from "@/components/ButtonStandard";
import { Person } from "@/constants/types";

export default function PeopleScreen() {
  const { peopleList } = useContext(InTouchContext);

  const onPersonPress = () => {
    router.navigate({pathname: "../personScreen"} )
  }


  const renderContacts = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <Pressable onPress={onPersonPress}>

        <ListItem.Content id={item.id}>
          <ListItem.Title>
            {item.firstName} {item.lastName}
          </ListItem.Title>
          <ListItem.Title>
            Phone Number: {item.phoneNumber} id: {item.id}
          </ListItem.Title>
        </ListItem.Content>
        </Pressable>

      </ListItem>
    );
  };
  return (
    <SafeAreaView style={styles.stepContainer}>
      <View style = {styles.centeredView}><ThemedText type="title" style = {styles.title}> People Screen </ThemedText></View>

      <FlatList
        data={peopleList}
        renderItem={renderContacts}
        keyExtractor={(item) => item.id}
      />

      <StandardButton 
       title="Add New Contact"
       onPress={() => router.push("../addMemberScreen")}/>

    </SafeAreaView>
  );
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
  stepContainer: {
    flex: 1,
    backgroundColor: "white",
    gap: 8,
    marginBottom: 8,
    flexDirection: "column",
    paddingTop: 50,
    justifyContent: "center",
  },
  centeredView: {
    alignItems: "center",
  },
});
