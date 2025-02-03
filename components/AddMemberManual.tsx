import { styles } from "@/constants/Stylesheet";
import { CountryCode, Person } from "@/constants/types";
import { phoneNumberVerifier } from "@/context/PhoneNumberUtils";
import { Button } from "@rneui/themed";
import { useState } from "react";
import PhoneInput 
    from 'react-native-phone-input';
import CountryPicker 
    from 'react-native-country-picker-modal';
import { ThemedText } from "./ThemedText";
import React from "react";
import {
  TextInput,
  View,
  StyleSheet
} from "react-native";
import { addPerson } from "@/assets/db/PersonRepo";
import { useSQLiteContext } from "expo-sqlite";

interface addMemberManualInterface {
  memberFirstName: string;
  memFirstNameChange: (n: string) => void;

  memberLastName: string;
  memLastNameChange: (n: string) => void;

  memberNumber: string;
  memNumberChange: (n: string) => void;

  // bondId: number;
  // setBondID: (n: number) => void;

  isVisible: boolean;
  setIsVisible: (b: boolean) => void;
}

export default function AddMemberManual({
  memberFirstName,
  memFirstNameChange,

  memberLastName,
  memLastNameChange,

  memberNumber,
  memNumberChange,
  isVisible,
  setIsVisible,
}: addMemberManualInterface) {


  const db = useSQLiteContext();
    const [countryCode, setCountryCode] = useState<CountryCode>("US");
    const [selectedCountry, setSelectedCountry] =
        useState(null);
    const [countryPickerVisible, setCountryPickerVisible] = 
        useState(false);

  // Phone Number Functions 
  
  const onSelectCountry = (country: any) => {
    setCountryCode(country.cca2);
    this.phone.selectCountry(country.cca2.toLowerCase())
    setSelectedCountry(country);
    setCountryPickerVisible(false);
};
  
  const toggleCountryPicker = () => {
    setCountryPickerVisible(!countryPickerVisible);
};


  // Member information

  async function savePerson() {
    const firstName = memberFirstName.trim();
    const lastName = memberLastName.trim();
    const newContact: Person = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: memberNumber,
      person_id: undefined,
    };

    await addPerson( db, newContact)
  }

  return (
      <>
        <View style={styles.centeredView}>
          <ThemedText type="subtitle" style={styles.title}>
            Enter Contact Information
          </ThemedText>
        </View>

        <View style={styles.indentedView}>
          <ThemedText style={styles.title}>First Name</ThemedText>
        </View>

        <TextInput
          onChangeText={memFirstNameChange}
          value={memberFirstName}
          placeholder="e.g. John"
          style={styles.textInput}
        ></TextInput>

        <View style={styles.indentedView}>
          <ThemedText style={styles.title}>Last Name</ThemedText>
        </View>
        <TextInput
          onChangeText={memLastNameChange}
          value={memberLastName}
          placeholder="e.g. Doe"
          style={styles.textInput}
        ></TextInput>
        <View style={styles.indentedView}>
          <ThemedText style={styles.title}>Phone Number</ThemedText>
        </View>
        <PhoneInput
                ref={(ref) => { this.phone = ref; }}
                initialValue={memberNumber}
                onChangePhoneNumber={(number: any) => memNumberChange(number)}
                onPressFlag={toggleCountryPicker}
                style={styles.textInput}
                editable={false}
        />
        {countryPickerVisible && (
        <CountryPicker
                    withFilter={true}
                    withFlagButton={true}
                    withCountryNameButton={true}
                    withCallingCodeButton={true}
                    withCallingCode={true}
                    countryCode={countryCode}
                    onSelect={onSelectCountry}
                    onClose={() => setCountryPickerVisible(false)}
                    visible={countryPickerVisible}
                    containerButtonStyle={tmpStyle.countryPickerButton}
                />
            )}
        <View style={styles.btnOrientation}>
          <Button
            title="Create Contact"
            onPress={async () => {
              if (phoneNumberVerifier(memberNumber.trim())) {
                await savePerson();
                memFirstNameChange("");
                memLastNameChange("");
                memNumberChange("");
                const newVisible = !isVisible;
                setIsVisible(newVisible);
              }
            }}
            buttonStyle={{
              backgroundColor: "black",
            }}
          />

          <Button
            title="Cancel"
            onPress={() => {
              memFirstNameChange("");
              memLastNameChange("");
              memNumberChange("");
              const newVisible = !isVisible;
              setIsVisible(newVisible);
            }}
            buttonStyle={{
              backgroundColor: "black",
            }}
          />
        </View>
      </>
  );
}


const tmpStyle = StyleSheet.create({    
  phoneInput: {
  height: 50,
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
  marginBottom: 20,
  paddingHorizontal: 10,
},
countryPickerButton: {
  borderRadius: 5,
  backgroundColor: '#fff',
  marginBottom: 20,
},
})