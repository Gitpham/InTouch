import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { View } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
    
      screenOptions={{
        tabBarStyle: {backgroundColor: "white"},
        tabBarActiveTintColor: 'blue',
        headerShown: false,
        tabBarBackground:  () => (
          <View style={{backgroundColor: "white"}} />
        ),

      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bonds',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />

<Tabs.Screen
        name="peopleScreen"
        options={{
          title: 'People',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people-circle' : 'people-circle-outline'} color={color} />
          ),
        }}
      />

<Tabs.Screen
        name="reminderScreen"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'library' : 'library-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}


