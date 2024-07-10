/* eslint-disable react/react-in-jsx-scope */
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { ListItem } from "@rneui/themed";
import { useContext, } from "react";
import { router } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { StandardButton } from "@/components/ButtonStandard";
import { Person } from "@/constants/types";
import { View } from "react-native"

export default function PeopleScreen() {
  const { peopleList } = useContext(InTouchContext);

  function onPersonPress (person_id: number) {
    router.navigate({pathname: "../personScreen", params: {id: `${person_id}`} })
  }


  const renderContacts = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <Pressable onPress={() => onPersonPress(item.person_id)}>

        <ListItem.Content id={item.person_id.toString()}>
          <ListItem.Title>
            {item.firstName} {item.lastName}
          </ListItem.Title>
          <ListItem.Title>
            Phone Number: {item.phoneNumber} id: {item.person_id.toString()}
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
        keyExtractor={(item) => item.person_id.toString()}
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
