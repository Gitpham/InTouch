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

    // registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

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

  const b: Bond = {
    bondName: "house",
    bond_id: 1,
    schedule: "",
    typeOfCall: "",
  };

  const b2: Bond = {
    bondName: "",
    bond_id: 2,
    schedule: "",
    typeOfCall: "",
  };

  function onSegmentedControlValueChange(value) {
    setScheduleFrequency(value);
  }

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

  async function onHasPermission() {
    try {
      const hasPermission = await allowsNotificationsAsync();
      if (hasPermission) {
        Alert.alert("has Notification permission");
      } else {
        Alert.alert("does NOT have Notification permission");
      }
    } catch (e) {
      console.error(e);
      throw Error("allowsNotications() failed");
    }
  }

  async function onRequestPermission() {
    try {
      const hasPermission = await requestNotificationPermission();
    } catch (e) {
      console.error(e);
      throw Error("failed requestNotificionPermission()");
    }
  }

  async function onGetPersonsOfBond() {
    const personsOfBond = await getPersonsOfBondDB(db, b2);
    console.log("persons of Bond: ", personsOfBond);
  }

  async function onGetNextToCall() {
    const nextToCall = await getNextToCall(b2);
    console.log(nextToCall);
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

  // function onDailyPress(event: DateTimePickerEvent, today: Date) {
  //   setDailyTime(() => today);
  // }

  function dailySelector() {
    return (
      <DailySchedulePicker></DailySchedulePicker>
      // <Card>
      //   <Text>Daily</Text>

      //   <DateTimePicker
      //     value={dailyTime}
      //     mode="time"
      //     onChange={onDailyPress}
      //   ></DateTimePicker>
      // </Card>
    );
  }

  function onSelectDayOfWeek(day: string) {
    switch (day) {
      case "mon": {
        setMon((m) => !m);
        break;
      }
      case "tues":
        {
          setTues((d) => !d);
        }
        break;
      case "weds": {
        setWeds((m) => !m);
        break;
      }
      case "thurs":
        {
          setThurs((d) => !d);
        }
        break;
      case "fri":
        {
          setFri((d) => !d);
        }
        break;
      case "sat": {
        setSat((m) => !m);
        break;
      }
      case "sun":
        {
          setSun((d) => !d);
        }
        break;
    }
  }

  function weeklySelector() {
    return (
      <WeeklySchedulePicker></WeeklySchedulePicker>
      // <Card>
      //   <Text>Weekly </Text>

      //   <View style={{ flexDirection: "row" }}>
      //     <CheckBox
      //       checked={mon}
      //       onPress={() => onSelectDayOfWeek("mon")}
      //       title="Monday"
      //     ></CheckBox>
      //     <DateTimePicker
      //       value={monTime}
      //       mode="time"
      //       onChange={(e, d) => setMonTime(d)}
      //     ></DateTimePicker>
      //   </View>

      //   <View style={{ flexDirection: "row" }}>
      //     <CheckBox
      //       checked={tues}
      //       onPress={() => onSelectDayOfWeek("tues")}
      //       title="Tuesday"
      //     ></CheckBox>
      //     <DateTimePicker
      //       value={tuesTime}
      //       mode="time"
      //       onChange={(e, d) => setTuesTime(d)}
      //     ></DateTimePicker>
      //   </View>

      //   <View style={{ flexDirection: "row" }}>
      //     <CheckBox
      //       checked={weds}
      //       onPress={() => onSelectDayOfWeek("weds")}
      //       title="Wednesday"
      //     ></CheckBox>
      //     <DateTimePicker
      //       value={wedsTime}
      //       mode="time"
      //       onChange={(e, d) => setWedsTime(d)}
      //     ></DateTimePicker>
      //   </View>

      //   <View style={{ flexDirection: "row" }}>
      //     <CheckBox
      //       checked={thurs}
      //       onPress={() => onSelectDayOfWeek("thurs")}
      //       title="Thursday"
      //     ></CheckBox>
      //     <DateTimePicker
      //       value={thursTime}
      //       mode="time"
      //       onChange={(e, d) => setThursTime(d)}
      //     ></DateTimePicker>
      //   </View>

      //   <View style={{ flexDirection: "row" }}>
      //     <CheckBox
      //       checked={fri}
      //       onPress={() => onSelectDayOfWeek("fri")}
      //       title="Friday"
      //     ></CheckBox>
      //     <DateTimePicker
      //       value={friTime}
      //       mode="time"
      //       onChange={(e, d) => setFriTime(d)}
      //     ></DateTimePicker>
      //   </View>

      //   <View style={{ flexDirection: "row" }}>
      //     <CheckBox
      //       checked={sat}
      //       onPress={() => onSelectDayOfWeek("sat")}
      //       title="Saturday"
      //     ></CheckBox>
      //     <DateTimePicker
      //       value={satTime}
      //       mode="time"
      //       onChange={(e, d) => setSatTime(d)}
      //     ></DateTimePicker>
      //   </View>

      //   <View style={{ flexDirection: "row" }}>
      //     <CheckBox
      //       checked={sun}
      //       onPress={() => onSelectDayOfWeek("sun")}
      //       title="Sunday"
      //     ></CheckBox>
      //     <DateTimePicker
      //       value={sunTime}
      //       mode="time"
      //       onChange={(e, d) => setSunTime(d)}
      //     ></DateTimePicker>
      //   </View>
      // </Card>
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

  function yearlySelector() {
    return (
      <Card>
        <Text>Yearly </Text>

        <DateTimePicker
          value={day}
          mode="day"
          onChange={() => {}}
        ></DateTimePicker>
        <DateTimePicker
          value={time}
          mode="time"
          onChange={() => {}}
        ></DateTimePicker>
      </Card>
    );
  }

  function displayScheduleSelectors() {
    return (
      <>
        {scheduleFrequency == "daily" && dailySelector()}

        {scheduleFrequency == "weekly" && weeklySelector()}

        {scheduleFrequency == "monthly" && monthlySelector()}

        {/* {scheduleFrequency == "yearly" && yearlySelector()} */}
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
            {/* <StandardButton title= "has permission to send Notifications?" onPress={onHasPermission}></StandardButton>
          <StandardButton title= "request notification permission?" onPress={onRequestPermission}></StandardButton>
          <StandardButton title="getPersonsOfBond" onPress={onGetPersonsOfBond}></StandardButton>
          <StandardButton title="getNextToCall" onPress={onGetNextToCall}></StandardButton> */}

            {/* <StandardButton title="navigated to bond screen" onPress={() => {
          router.navigate({pathname: "./peopleScreen" })
    }}></StandardButton>  */}

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
