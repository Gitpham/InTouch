import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Card, CheckBox } from "@rneui/themed";
import { useContext, useEffect, useRef, useState } from "react";
import { View, Text, Platform, Alert, Linking } from "react-native";
import React from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StandardButton } from "./ButtonStandard";
import {
  Bond,
  DailySchedule,
  DayOfMonth,
  MonthlySchedule,
  Schedule,
  ScheduleFrequency,
  WeeklySchedule,
} from "@/constants/types";
import { ScheduleContext } from "@/context/ScheduleContext";
import * as Notifications from "expo-notifications";
import {
  allowsNotificationsAsync,
  cancelAllNotifications,
  getAllScheduledNotifications,
  requestNotificationPermission,
} from "@/context/notifications";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import { getPersonsOfBondDB } from "@/assets/db/PersonBondRepo";
import { useSQLiteContext } from "expo-sqlite";
import { Picker } from "@react-native-picker/picker";
import DailySchedulePicker from "./DailySchedulePicker";
import WeeklySchedulePicker from "./WeeklySchedulePicker";
import MonthlySchedulePicker from "./MonthlySchedulePicker";



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Scheduler() {
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });
    }

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          try {
            callPerson(response.notification);
          } catch (e) {
            console.error(e);
            throw Error("failed to navigate away");
          }
        }
      );

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  console.log("Scheduler renders")

  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const db = useSQLiteContext();
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>(
    ScheduleFrequency.DAILY
  );
  const {
    createPotentialSchedule,
    generateSchedule,
    getNextToCall,
    callPerson,
  } = useContext(ScheduleContext);


  //MONTHLY STATE VARIABLES
  const [selectedWeekOfMonth, setSelectedWeekOfMonth] = useState<number>();
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>();
  const [monthlyTime, setMonthlyTime] = useState(new Date());
  const [monthlySet, setMonthlySet] = useState<Set<DayOfMonth>>(new Set());



  async function onGenerateNotificationPress() {
    const testBond: Bond = {
      bondName: "testBond",
      bond_id: 5,
      schedule: "weekly",
      typeOfCall: "weekly",
    };
    await generateSchedule(testBond);
  }

  async function onCancelAllNotifications() {
    try {
      await cancelAllNotifications();
      Alert.alert("canceled all scheduled Notificaionts");
    } catch (e) {
      console.error(e);
      throw Error("failed to cancelAllNotifications");
    }
  }

  function onSegmentedControlValueChange(value) {
    setScheduleFrequency(value);
  }


  async function onDonePress() {
    switch (scheduleFrequency) {
      case ScheduleFrequency.DAILY:
        {
          const potentialDailySchedule: DailySchedule = {
            time: dailyTime,
          };
          const potentialSchedule: Schedule = {
            schedule: potentialDailySchedule,
          };

          await createPotentialSchedule(potentialSchedule);
        }
        break;
      case ScheduleFrequency.WEEKLY:
        {
          const potentialWeeklySchedule: WeeklySchedule = {
            monday: undefined,
            tuesday: undefined,
            wednesday: undefined,
            thursday: undefined,
            friday: undefined,
            saturday: undefined,
            sunday: undefined,
          };
          if (!mon && !tues && !weds && !thurs && !fri && !sat && !sun) {
            Alert.alert("Must have some days checked for a weekly schedule");
            break;
          }
          if (mon) {
            potentialWeeklySchedule.monday = monTime;
          }
          if (tues) {
            potentialWeeklySchedule.tuesday = tuesTime;
          }
          if (weds) {
            potentialWeeklySchedule.wednesday = wedsTime;
          }
          if (thurs) {
            potentialWeeklySchedule.thursday = thursTime;
          }
          if (fri) {
            potentialWeeklySchedule.friday = friTime;
          }
          if (sat) {
            potentialWeeklySchedule.saturday = satTime;
          }
          if (sun) {
            potentialWeeklySchedule.sunday = sunTime;
          }

          const pSchedule: Schedule = {
            schedule: potentialWeeklySchedule,
          };
          createPotentialSchedule(pSchedule);
        }
        break;
      case ScheduleFrequency.MONTHLY:
        {
          const pMonthlySchedule: MonthlySchedule = {
            daysInMonth: [],
          };
          monthlySet.forEach((d) => {
            pMonthlySchedule.daysInMonth.push(d);
          });

          pMonthlySchedule.daysInMonth.forEach((d) => {
            console.log(
              "day of week: ",
              d.dayOfWeek,
              "week of month: ",
              d.weekOfMonth
            );
          });

          const pSchedule: Schedule = {
            schedule: pMonthlySchedule,
          };
          createPotentialSchedule(pSchedule);
        }
        break;
      default:
        break;
    }
  }


  const [dailyTime, setDailyTime] = useState(new Date());

  function changeDailyTime(time: Date){
    setDailyTime(time);
  }

  function dailySelector() {
    return (
      <DailySchedulePicker dailyTime={dailyTime} changeDailyTime={changeDailyTime}></DailySchedulePicker>
    );
  }


    const [mon, setMon] = useState(false);
    function changeMon(isSelected: boolean){
      setMon(isSelected);
    }
    const [monTime, setMonTime] = useState<Date>(new Date());
    function changeMonTime(time: Date) {
      setMonTime(time);
    }
  
    const [tues, setTues] = useState(false);
    function changeTues(isSelected: boolean){
      setTues(isSelected);
    }
    const [tuesTime, setTuesTime] = useState<Date>(new Date());
    function changeTuesTime(time: Date) {
      setTuesTime(time);
    }
  
    const [weds, setWeds] = useState(false);
    function changeWeds(isSelected: boolean){
      setWeds(isSelected);
    }
    const [wedsTime, setWedsTime] = useState<Date>(new Date());
    function changeWedsTime(time: Date) {
      setWedsTime(time);
    }
  
    const [thurs, setThurs] = useState(false);
    function changeThurs(isSelected: boolean){
      setThurs(isSelected);
    }
    const [thursTime, setThursTime] = useState<Date>(new Date());
    function changeThursTime(time: Date) {
      setThursTime(time);
    }
  
    const [fri, setFri] = useState(false);
    function changeFri(isSelected: boolean){
      setFri(isSelected);
    }
    const [friTime, setFriTime] = useState<Date>(new Date());
    function changeFriTime(time: Date) {
      setFriTime(time);
    }
  
    const [sat, setSat] = useState(false);
    function changeSat(isSelected: boolean){
      setSat(isSelected);
    }
    const [satTime, setSatTime] = useState<Date>(new Date());
    function changeSatTime(time: Date) {
      setSatTime(time);
    }
  
    const [sun, setSun] = useState(false);
    function changeSun(isSelected: boolean){
      setSun(isSelected);
    }
    const [sunTime, setSunTime] = useState<Date>(new Date());
    function changeSunTime(time: Date) {
      setSunTime(time);
    }
  function weeklySelector() {
    return (
      <WeeklySchedulePicker 
      mon={mon}
      changeMon={changeMon}
      monTime={monTime}
      changeMonTime={changeMonTime}

      tues={tues}
      changeTues={changeTues}
      tuesTime={tuesTime}
      changeTuesTime={changeTuesTime}

      weds={weds}
      changeWeds={changeWeds}
      wedsTime={wedsTime}
      changeWedsTime={changeWedsTime}

      thurs={thurs}
      changeThurs={changeThurs}
      thursTime={thursTime}
      changeThursTime={changeThursTime}

      fri={fri}
      changeFri={changeFri}
      friTime={friTime}
      changeFriTime={changeFriTime}

      sat={sat}
      changeSat={changeSat}
      satTime={satTime}
      changeSatTime={changeSatTime}

      sun={sun}
      changeSun={changeSun}
      sunTime={sunTime}
      changeSunTime={changeSunTime}
      ></WeeklySchedulePicker>
    );
  }

  function monthlySelector() {
    return (
      <MonthlySchedulePicker></MonthlySchedulePicker>
      // <Card>
      //   <View>
      //     <Picker
      //       selectedValue={selectedWeekOfMonth}
      //       onValueChange={(itemValue, itemIndex) =>
      //         setSelectedWeekOfMonth(itemValue)
      //       }
      //     >
      //       <Picker.Item label="First Week" value="1" />
      //       <Picker.Item label="Second Week" value="2" />
      //       <Picker.Item label="Third Week" value="3" />
      //       <Picker.Item label="Fourth Week" value="4" />
      //     </Picker>

      //     <Picker
      //       selectedValue={selectedDayOfWeek}
      //       onValueChange={(itemValue, itemIndex) =>
      //         setSelectedDayOfWeek(itemValue)
      //       }
      //     >
      //       <Picker.Item label="Sunday" value="1" />
      //       <Picker.Item label="Monday" value="2" />
      //       <Picker.Item label="Tuesday" value="3" />
      //       <Picker.Item label="Wednesday" value="4" />
      //       <Picker.Item label="Thursday" value="5" />
      //       <Picker.Item label="Friday" value="6" />
      //       <Picker.Item label="Saturday" value="7" />
      //     </Picker>

      //     <DateTimePicker
      //       value={monthlyTime}
      //       mode="time"
      //       onChange={(e, d) => setMonthlyTime(d)}
      //     ></DateTimePicker>
      //   </View>

      //   <StandardButton
      //     title="Add"
      //     onPress={onChooseDayMonthly}
      //   ></StandardButton>

      //   <StandardButton
      //     title="Clear current schedule"
      //     onPress={() => {
      //       setMonthlySet(new Set());
      //     }}
      //   ></StandardButton>
      // </Card>
    );
  }

  //TODO: default is undefined
  function onChooseDayMonthly() {
    const day: DayOfMonth = {
      weekOfMonth: selectedWeekOfMonth as number,
      dayOfWeek: selectedDayOfWeek as number,
      time: monthlyTime,
    };

    if (!monthlySet.has(day)) {
      setMonthlySet((prev) => {
        const newDay = new Set([day]);
        return new Set<DayOfMonth>([...prev, ...newDay]);
      });
      return;
    }

    const monthlySetStringArr: string[] = [];
    monthlySet.forEach((d) => {
      const s =
        "Day of Week: " +
        d.dayOfWeek +
        " Week of Month: " +
        d.weekOfMonth +
        " time: " +
        d.time.getTime().toLocaleString;
      monthlySetStringArr.push(s);
    });
    console.log("monthlySet", monthlySetStringArr);
    Alert.alert("You already have this day scheduled!");
  }


  function displayScheduleSelectors() {
    return (
      <>
        {scheduleFrequency == "daily" && dailySelector()}

        {scheduleFrequency == "weekly" && weeklySelector()}

        {scheduleFrequency == "monthly" && monthlySelector()}
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.stepContainer}>
        <ScrollView>
          <View style={styles.centeredView}>
            <ThemedText type="title" style={styles.title}>
              Schedule
            </ThemedText>
          </View>

          <View>
            <SegmentedControl
              onValueChange={onSegmentedControlValueChange}
              values={[
                ScheduleFrequency.DAILY,
                ScheduleFrequency.WEEKLY,
                ScheduleFrequency.MONTHLY,
                ScheduleFrequency.YEARLY,
              ]}
            ></SegmentedControl>
            {displayScheduleSelectors()}
          </View>

          <View>
            <StandardButton title="Done" onPress={onDonePress}></StandardButton>
            <StandardButton
              title="generateNotification"
              onPress={onGenerateNotificationPress}
            ></StandardButton>
            <StandardButton
              title="cancel All Notificatios"
              onPress={onCancelAllNotifications}
            ></StandardButton>
            <StandardButton
              title="See All Notifications"
              onPress={() => {
                getAllScheduledNotifications();
              }}
            ></StandardButton>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
  },
  title: {
    color: "black",
  },
  stepContainer: {
    flex: 1,
    backgroundColor: "white",
    gap: 8,
    marginBottom: 8,
    flexDirection: "column",
    paddingTop: 50,
    justifyContent: "center",
  },
  centeredView: {
    alignItems: "center",
  },
});
