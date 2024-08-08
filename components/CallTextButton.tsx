import { Pressable, View , Text} from "react-native";
import React, { useContext } from "react";
import { styles } from "@/constants/Stylesheet";
import { callUtil, sendSMS } from "@/context/PhoneNumberUtils";
import { Person } from "@/constants/types";
import { useSQLiteContext } from "expo-sqlite";
import { CallContext } from "@/app/_layout";


interface CallTextBtnInterface {
    person: Person,
}
export default function CallTextButton({person}: CallTextBtnInterface){

    const db = useSQLiteContext();
    const {changeIsCalling} = useContext(CallContext)
    return (
        <View
        style={{
          flex: .5,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={styles.callBtn}
        >
          <Pressable onPress={() => 
          {
            changeIsCalling(true);
            callUtil(person, db)
          }
            }>
            <Text style={{color: 'purple' }}>Call</Text>
          </Pressable>
        </View>
        <View
          style={styles.textBtn}
        >
          <Pressable              
           onPress={() => sendSMS(person?.phoneNumber.toString() as string)}
          >
            <Text style={{color: 'green', fontWeight: 'bold' }}>Text</Text>
          </Pressable>
        </View>
      </View>
    )

}