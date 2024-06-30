import { ThemedText } from "@/components/ThemedText";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { member, group } from "./createGroupModal";
import * as Contacts from 'expo-contacts';
import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite'
import { Person, addPerson, getAllPersons } from "./db/PersonRepo";
import { RefreshContactsContext} from "@/context/RefreshContactsContext";

export default function addMemberScreen() {

  // const {refreshContacts, setRefreshContacts} = useContext<ContactsContextType>(RefreshContactsContext)

    // Member information
    const [memberFirstName, setMemFirstName] = useState(""); 
    const [memberLastName, setMemLastName] = useState(""); 
    const [memberNumber, setMemNumber] = useState("");

    const {isRefreshingContacts} = useContext(RefreshContactsContext);
    const { refreshContacts} = useContext(RefreshContactsContext);


    const db = SQLite.useSQLiteContext();
    

    
    function addGroupMember() {
        member.firstName = memberFirstName;
        member.lastName = memberLastName;
        member.number = memberNumber;
        group.members.push(member);
  
      }

    

    async function importFromContacts() {

      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const person = await Contacts.presentContactPickerAsync()
        if (person) {
          const newContact: Person = {
            firstName: person?.firstName as string,
            lastName: person?.lastName as string,
            phoneNumber: person?.phoneNumbers?.[0]?.number as string,
            id: ""
          }
          await addPerson(db, newContact);
          // setRefreshContacts(true)
        } else {
          Alert.alert("unable to add from contacts")
        }
      };

      refreshContacts();
    }

    return (<SafeAreaView style = {styles.stepContainer}>
        <View style = {styles.centeredView}>
        <ThemedText type="subtitle" 
            style={styles.title}>
            Choose from InTouch contacts
        </ThemedText>

        

        <Button 
            title="Search Contacts (dummy button)" 
            buttonStyle={styles.button}
            titleStyle={styles.title}
        />
        <ThemedText type="subtitle" 
            style={styles.title}>
            Create new contact
        </ThemedText>
        </View>
        <Button 
            title="Create Contact Manually" 
            onPress={() => {router.push('/addMemberManualScreen');}}
            buttonStyle={styles.button}
            titleStyle={styles.title}
        />
        <Button
            title="Import from Contacts"
            onPress={importFromContacts}
            buttonStyle={styles.button}
            titleStyle={styles.title}
        />
  </SafeAreaView>)
}

const styles = StyleSheet.create({
    button: {
      margin: 10,
      backgroundColor: 'white',
      borderColor: 'black',
      borderWidth: 2, 
    },
    title: {
      color: "black",
   },
    stepContainer: {
      flex: 1,
      backgroundColor: 'white',
      gap: 8,
      marginBottom: 8,
      flexDirection: 'column',
      paddingTop: 50
    },
    centeredView : {
        alignItems: "center"
    }
  });
