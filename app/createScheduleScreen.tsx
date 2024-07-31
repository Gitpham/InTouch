import Scheduler from "@/components/Scheduler";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
export default function createScheduleScreen() {
  const localSearchParams = useLocalSearchParams();
//   const [bid, setBid] = useState(localSearchParams.bid);
  const bid = parseInt(localSearchParams.bid as string)
  const isFromBondScreen = ("true" === localSearchParams.isFromBondScreen)
//   const [isFromBondScreen, setIsFromBondScreen] = useState(localSearchParams.isFromBondScreen);

  useEffect(() => {
    const i = localSearchParams.isFromBondScreen;
    const b = localSearchParams.bid
    console.log("createScheduleScreen: bid: ", b)
    console.log("createScheduleScreen: isFromBondScreen: ", i)

    
    // setIsFromBondScreen(true == localSearchParams.isFromBondScreen);
    // setBid(parseInt(localSearchParams.bid as string));
  }, [localSearchParams]);

  return <Scheduler bid={bid} isFromBondScreen={isFromBondScreen}></Scheduler>;
}
