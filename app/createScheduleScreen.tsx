import Scheduler from "@/components/Scheduler";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
export default function createScheduleScreen() {
  const localSearchParams = useLocalSearchParams();
//   const [bid, setBid] = useState(localSearchParams.bid);
  const bid = parseInt(localSearchParams.bid as string)
  const isFromBondScreen = ("true" === localSearchParams.isFromBondScreen)

  return <Scheduler bid={bid} isFromBondScreen={isFromBondScreen}></Scheduler>;
}
