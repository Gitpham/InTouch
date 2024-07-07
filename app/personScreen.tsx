import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native"
import { Card } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";


export default function PersonScreen() {
       return (
        <SafeAreaView style = {styles.stepContainer}>
             <View style = {styles.centeredView}><ThemedText type= 'title' style = {styles.title}> Person Screen </ThemedText></View>
             <Card>
               <Card.Title>Person: </Card.Title>
             </Card>
        </SafeAreaView>

       )
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
  },
  centeredView: {
    alignItems: "center",
  },
});