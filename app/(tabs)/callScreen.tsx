import { StyleSheet, } from 'react-native';
import Scheduler from '@/components/Scheduler';
import React from 'react';
import { usePathname,  } from 'expo-router';
import { styles } from "@/constants/Stylesheet"

export default function callScreen() {
  return (

      <Scheduler></Scheduler>

  );
}