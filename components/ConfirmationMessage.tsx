import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { styles } from '@/constants/Stylesheet';

const ConfirmationMessage = ({ message , show} ) => {
    const [visible, setVisible] = useState(show);
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (show) {
            setVisible(true);
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => setVisible(false));
                }, 2000); // Show message for 2 seconds
            });
        }
    }, [show]);

    if (!visible) {
        return null;
    }

    return (
        <Animated.View style={[styles.messageContainer, { opacity }]}>
            <View style = {styles.confirmationLogoContainer}>
            <Image
            style={styles.tinyLogo}
            source={require('@/assets/images/checkmark.png')}
            />
            </View>
            <Text style={styles.confirmationText}>{message}</Text>
        </Animated.View>
    );
};


export default ConfirmationMessage;
