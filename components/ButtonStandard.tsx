import { Button, Icon } from "@rneui/themed";
import { router } from "expo-router";
import { ColorValue, StyleSheet, View } from "react-native";
import React from "react";
import { PropsWithChildren } from "react";

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
  },
  addContactButton: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "darkorchid",
    borderWidth: 2,
    borderRadius: 5,
  },
  addBondButton: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "forestgreen",
    borderWidth: 2,
    borderRadius: 5,
  },

  title: {
    color: "black",
  },
});

export const StandardButton = ({ title, onPress }) => {
  return (
    <Button
      title={title}
      buttonStyle={styles.button}
      titleStyle={styles.title}
      onPress={onPress}
    />
  );
};

export const AddContactButton = ({ title, onPress }) => {
  return (
    <View style={{ alignSelf: "center" }}>
      <Button
        containerStyle={{ width: "auto" }}
        buttonStyle={styles.addContactButton}
        titleStyle={styles.title}
        onPress={onPress}
      >
        <Icon name="add-circle-outline"></Icon>
        {title}
      </Button>
    </View>
  );
};

export const AddButton = ({
  title,
  onPress,
  color,
}: {
  color: ColorValue | undefined;
  title: string,
  onPress: () => void
}) => {
  return (
    <View style={{ alignSelf: "center" }}>
      <Button
        containerStyle={{ width: "auto" }}
        buttonStyle={{ ...styles.addBondButton, borderColor: color }}
        titleStyle={styles.title}
        onPress={onPress}
      >
        <Icon name="add-circle-outline"></Icon>
        {title}
      </Button>
    </View>
  )
};
