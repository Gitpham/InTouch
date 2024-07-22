import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/context/notifications";
import { useState, useRef, useEffect } from "react";
import { Platform, View, Button, Text } from "react-native";
import React from "react";

Notifications.setNotificationHandler({
     handleNotification: async () => ({
       shouldShowAlert: true,
       shouldPlaySound: false,
       shouldSetBadge: false,
     }),
   });
   
   export default function statScreen() {
     const [expoPushToken, setExpoPushToken] = useState('');
     const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
     const [notification, setNotification] = useState<Notifications.Notification | undefined>(
       undefined
     );
     const notificationListener = useRef<Notifications.Subscription>();
     const responseListener = useRef<Notifications.Subscription>();
   
     useEffect(() => {
       registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));
   
       if (Platform.OS === 'android') {
         Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
       }
       notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
         setNotification(notification);
       });
   
       responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
         console.log(response);
       });
   
       return () => {
         notificationListener.current &&
           Notifications.removeNotificationSubscription(notificationListener.current);
         responseListener.current &&
           Notifications.removeNotificationSubscription(responseListener.current);
       };
     }, []);
   
     return (
       <View
         style={{
           flex: 1,
           alignItems: 'center',
           justifyContent: 'space-around',
         }}>
         <Text>Your expo push token: {expoPushToken}</Text>
         <Text>{`Channels: ${JSON.stringify(
           channels.map(c => c.id),
           null,
           2
         )}`}</Text>
         <View style={{ alignItems: 'center', justifyContent: 'center' }}>
           <Text>Title: {notification && notification.request.content.title} </Text>
           <Text>Body: {notification && notification.request.content.body}</Text>
           <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
         </View>
         <Button
           title="Press to schedule a notification"
           onPress={async () => {
             await schedulePushNotification();
           }}
         />
       </View>
     );
   }
