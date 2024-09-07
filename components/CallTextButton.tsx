import { Pressable, View , Text} from "react-native";
import React, { useContext } from "react";
import { styles } from "@/constants/Stylesheet";
import { callUtil, sendSMS } from "@/context/PhoneNumberUtils";
import { Person } from "@/constants/types";


interface CallTextBtnInterface {
    person: Person,
    changeIsCalling: (b: boolean) => void;
}
export default function CallTextButton({person, changeIsCalling}: CallTextBtnInterface){
    return (
        <View
        style={{
          flex: .5,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

          <Pressable
          style={styles.callBtn}
           onPress={() => 
          {
            changeIsCalling(true);
            callUtil(person)
          }
            }>
            <Text style={{color: 'purple' }}>Call</Text>
          </Pressable>

          <Pressable   
          style={styles.textBtn}           
           onPress={() => sendSMS(person?.phoneNumber.toString() as string)}
          >
            <Text style={{color: 'green', fontWeight: 'bold' }}>Text</Text>
          </Pressable>
      </View>
    )

}