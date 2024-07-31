import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    button: {
      margin: 10,
      backgroundColor: "white",
      borderColor: "black",
      borderWidth: 2,
    },
    title: {
      color: "black",
    },
    redButton: {
      margin: 10,
      backgroundColor: "white",
      borderColor: "red",
      borderWidth: 2,
    },
    redTitle: {
      color: "red",
    },
    stepContainer: {
      flex: 1,
      backgroundColor: "white",
      gap: 8,
      marginBottom: 8,
      flexDirection: "column",
      paddingTop: 10,
    },
    entityContainer: {
      flex: 1,
      backgroundColor: "white",
      gap: 8,
      marginBottom: 8,
      flexDirection: "column",
      paddingTop: 10,
      alignItems:'center',
    },
    homeContainer: {
        flex: 1,
        backgroundColor: 'white',
        gap: 8,
        marginBottom: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
    centeredView: {
      alignItems: "center",
    },
    flatList: {
      height: 200,
    },
    rowOrientation: {
      flex: 1,
      flexDirection: "row",
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    nameContainer: {
      flex: 1,
      marginRight: 10, // Adds space between delete button and name
    },
    touchable: {
      padding: 10,
    },
    date: {
      color: "gray",
      fontSize: 12,
    },
    name: {
     color: "black",
     fontWeight: 'bold',
     fontSize: 20
    },
    tinyLogo: {
        width: 15,
        height: 15,
        marginLeft: 10,
    },
    textInput: {
        height: 40,
        margin: 13,
        borderWidth: 1,
        padding: 10,
        color: "white",
        backgroundColor: "gray",
    },
    indentedView: {
        paddingLeft: 10,
    },
  })