/* eslint-disable react/react-in-jsx-scope */
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable, } from "react-native";
import { ListItem } from "@rneui/themed";
import { useContext, } from "react";
import { router } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { StandardButton } from "@/components/ButtonStandard";
import { Person } from "@/constants/types";
import { View } from "react-native"
import { styles } from "@/constants/Stylesheet"

export default function PeopleScreen() {
  const { peopleList } = useContext(InTouchContext);

  function onPersonPress (person_id: number) {
    router.navigate({pathname: "../personScreen", params: {id: `${person_id}`} })
  }


  const renderContacts = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <Pressable onPress={() => onPersonPress(item.person_id as number)}>

        <ListItem.Content id={item.person_id?.toString()}>
          <ListItem.Title>
            {item.firstName} {item.lastName}
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
        keyExtractor={(item) => (item.person_id as number).toString()}
      />

      <StandardButton 
       title="Add New Contact"
       onPress={() => router.navigate({pathname: "../addMemberScreen", params: {bond_id: -1}})}/>

    </SafeAreaView>
  );
}
