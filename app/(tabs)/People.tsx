import { ThemedText } from "@/components/ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from 'react-native';
import { Button } from "@rneui/themed";
import * as SQLite from 'expo-sqlite'
import { Person, getAllPersons } from "../db/PersonRepo";


export default function PeopleScreen() {

     const db = SQLite.useSQLiteContext()

     const showPeople = async () => {
          console.log("showPeople")
          const people = await getAllPersons(db)
          console.log(people)
     }

     // const testPerson: Person = {
     //      firstName: "Alex", 
     //      lastName: "Aaron", 
     //      phoneNumber: "111-111-1111"
     // }

     // const addPerson =  async () => {
     //      console.log("add Person")
     //      const people = await getAllPersons(db)
     //      console.log(people)
     // }

     


       return (
        <SafeAreaView style = {styles.stepContainer}>
             <ThemedText type= 'title'> People Screen </ThemedText>
             <Button
              title="Add New Contact"
              onPress={showPeople}
              buttonStyle={styles.button}
              titleStyle={styles.title}
            />
        </SafeAreaView>

       )
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
       paddingTop: 50,
       justifyContent: 'center'
     },
     centeredView : {
         alignItems: "center"
     }
   });