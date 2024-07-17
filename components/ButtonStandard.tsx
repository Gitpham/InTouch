import { Button } from "@rneui/themed";
import { router } from "expo-router";
import { StyleSheet} from "react-native";


export const StandardButton= ({title, onPress}) => {

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

    return (
        <Button
        title = {title}
        buttonStyle={styles.button}
        titleStyle={styles.title}
        onPress={onPress}
        />

    )


}






