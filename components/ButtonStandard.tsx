import { Button } from "@rneui/themed";
import { router } from "expo-router";
import { StyleSheet} from "react-native";
import { PropsWithChildren } from "react"


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






