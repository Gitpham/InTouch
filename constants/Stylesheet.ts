import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export function stackViews(): StyleProp<ViewStyle>{
  const insets = useSafeAreaInsets();
  return ({
    flex: 1,
    backgroundColor: "white",
    gap: 2,
    flexDirection: "column",
    paddingBottom: insets.bottom,
    justifyContent: 'center',
    alignContent: 'center',
    // alignItems: 'center',
  })
}

export const styles = StyleSheet.create({

    button: {
      margin: 10,
      backgroundColor: "white",
      borderColor: "black",
      borderWidth: 2,
    },
    callBtn: {
      height: "100%",
      width: "30%",
      margin: 10,
      borderColor: "darkorchid",
      borderWidth: 2,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center'

    },
    textBtn: {
      height: "100%",
      width: "30%",
      margin: 10,
      borderColor: "green",
      borderWidth: 2,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center'

    },
    title: {
      color: "black",
      fontWeight: "bold",
      fontSize: 20,
      fontFamily: "Lato"
    },
    redButton: {
      margin: 10,
      backgroundColor: "white",
      borderColor: "red",
      borderWidth: 2,
      width: '80%',
    },
    redTitle: {
      color: "red",
    },
    stepContainer: {
      flex: 1,
      backgroundColor: "white",
      gap: 8,
      marginBottom: 0,
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
    smallContainer: {
      flex: 1,
      backgroundColor: "White",
      flexDirection: "column",
      paddingTop: 10,
      paddingBottom: 10,
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
      flex: .3,
      flexDirection: "row",
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    btnOrientation: {
      flex: .3,
      flexDirection: "row",
      justifyContent: 'center',
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
    confirmationLogo: {
      width: 10,
      height: 10,
    },
    confirmationLogoContainer: {
      marginRight: 5
    },
    confirmationContent: {
      flexDirection: 'row',
      alignItems: 'center',
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
    messageContainer: {
      backgroundColor: 'white',
      padding: 5,
      borderRadius: 5,
      zIndex: 1000,
      justifyContent: 'center',
      alignSelf: 'center',
      width: 300,
      height: 30,
      flexDirection: "row"
    },
    confirmationText: {
        color: '#4CAF50',
    },
  })