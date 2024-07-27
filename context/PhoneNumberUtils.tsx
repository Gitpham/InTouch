const formatPhoneNumber = (phoneNumber: string): string => {
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    

    // Ensure the phone number starts with a + and is followed by digits
    const e164PhoneNumber = cleaned.startsWith('+') ? cleaned : `+1${cleaned}`;
    if (e164PhoneNumber.length != 12){
        throw new Error("phone number is not 11 digits")
    }

    return e164PhoneNumber
  };
  
  const isE164PhoneNumber = (phoneNumber: string): boolean => {
    const pattern = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    return pattern.test(phoneNumber);
  };
  
  const validateAndFormatPhoneNumber = (phoneNumber: string): string => {
    if (isE164PhoneNumber(phoneNumber)) {
      return phoneNumber;
    } else {
      return formatPhoneNumber(phoneNumber);
    }
  };

  export {
    validateAndFormatPhoneNumber
  }