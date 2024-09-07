/* eslint-disable react/react-in-jsx-scope */
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable } from "react-native";
import { Divider, ListItem } from "@rneui/themed";
import { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { InTouchContext } from "@/context/InTouchContext";
import { AddButton, } from "@/components/ButtonStandard";
import { Person } from "@/constants/types";
import { View, Text } from "react-native";
import { styles } from "@/constants/Stylesheet";

export default function PeopleScreen() {
  const { peopleList } = useContext(InTouchContext);
  const [ sortedList, changeSortedList ] = useState<Array<Person>>([]);

  useEffect(() => {
    const sortedPeopleList: Array<Person> = peopleList.sort((a,b) => {
      let aName = a.lastName;
      let bName = b.lastName;
      if (!a.lastName) {
        aName = a.firstName;
      }
      if (!b.lastName) {
        bName = b.firstName;
      }
      return aName.toLowerCase().localeCompare(bName.toLowerCase())
    })
    changeSortedList(sortedPeopleList);
  },[peopleList]);

  function onPersonPress(person_id: number) {
    router.navigate({
      pathname: "../personScreen",
      params: { id: `${person_id}` },
    });
  }

  const renderContacts = ({ item }: { item: Person }) => {
    return (
      <ListItem bottomDivider>
        <Pressable onPress={() => onPersonPress(item.person_id as number)}>
          <ListItem.Content id={item.person_id?.toString()}>
          <Pressable onPress={() => onPersonPress(item.person_id as number)}>
                {item.lastName ? (
                  <Text style={{ fontSize: 16}}>
                    {item.firstName} <Text style={{ fontWeight: 'bold' }}>{item.lastName}</Text>
                  </Text>
                ) : (
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.firstName}</Text>
                )}
          </Pressable>
          </ListItem.Content>
        </Pressable>
      </ListItem>
    );
  };

  return (
    <SafeAreaView style={styles.stepContainer}>
      <View style={styles.centeredView}>
        <ThemedText type="title" style={styles.title}>
          {" "}
          inTouch Contacts{" "}
        </ThemedText>
  
      </View>
      <Divider
        inset={true}
        insetType="middle"
        style={{ borderWidth: 2, borderColor: "darkorchid" }}
      ></Divider>

      <FlatList
        data={peopleList}
        renderItem={renderContacts}
        keyExtractor={(item) => (item.person_id as number).toString()}
      />

      <AddButton
      color={'darkorchid'}
        title="New Contact"
        onPress={() =>
          router.navigate({
            pathname: "../addMemberScreen",
            params: { bond_id: -1 },
          })
        }
      />
    </SafeAreaView>
  );
}
