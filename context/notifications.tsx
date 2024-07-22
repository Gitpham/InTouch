import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Alert, Linking, Platform } from "react-native";
import {
  Bond,
  DailySchedule,
  DayOfMonth,
  isDailySchedule,
  isMonthlySchedule,
  isWeeklySchedule,
  MonthlySchedule,
  Schedule,
  WeeklySchedule,
} from "@/constants/types";
import React from "react";


export async function allowsNotificationsAsync() {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}


export async function redirect(notification: Notifications.Notification) {
  const url = notification.request.content.data?.url;
  const canOpen = await Linking.canOpenURL(url)
  if(canOpen){
    Linking.openURL(url)
  } else {
    Alert.alert("could not open url")
  }
}


export async function requestNotificationPermission(){
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
}


export async function cancelAllNotifications(){
  try {
    await Notifications.cancelAllScheduledNotificationsAsync()
  } catch (e) {
    console.error(e)
    throw Error(
      "cancelAllNotifications() failed to call cancelAllScheduledNotificationsAsync"
    );
  }
}

export async function cancelNotifications(notificationIDs: string[]) {
  try {
    notificationIDs.forEach(async (id) => {
      await Notifications.cancelScheduledNotificationAsync(id);
    })
  } catch (e) {
    console.error(e)
    throw Error(
      "cancelNotification() failed to call cancelScheduleNotificationsAsync"
    );
  }
}


/**
 * schedules a daily notificaion according to the hour and time of the schedule, and bondID of the bond. 
 * @param schedule 
 * @param bond 
 * @returns 
 */
export async function scheduleDailyNotification (schedule: DailySchedule, bond: Bond): Promise<string> {

  const dailyTrigger: Notifications.DailyTriggerInput = {
    hour: schedule.time.getHours(),
    minute: schedule.time.getMinutes(),
    repeats: true,
  };
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: `Call ${bond.bondName} !`,
        body: `Time to Call ${bond.bondName}`,
        data: { bondID: `${bond.bond_id}`, test: { test1: "more data" } },
      },
      trigger: dailyTrigger,
    });
  } catch (e) {
    console.error(e);
    throw Error(
      "scheduleDailyNotification() failed to scheduleNotificationAsync "
    );
  }
}

export async function scheduleWeeklyNotification(schedule: WeeklySchedule, bond: Bond) {


  if (schedule.sunday != undefined) {
    const day: Date = schedule.sunday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 0,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Call ${bond.bondName} !`,
          body: `Time to Call ${bond.bondName}`,
          data: { data: `${bond.bond_id}`, test: { test1: "more data" } },
        },
        trigger: weeklyTrigger,
      });
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleDailyNotification() failed to scheduleNotificationAsync for sunday "
      );
    }
  }

  if (schedule.monday != undefined) {
    const day: Date = schedule.monday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 1,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Call ${bond.bondName} !`,
          body: `Time to Call ${bond.bondName}`,
          data: { data: `${bond.bond_id}`, test: { test1: "more data" } },
        },
        trigger: weeklyTrigger,
      });
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleDailyNotification() failed to scheduleNotificationAsync for monday "
      );
    }
  }

  if (schedule.tuesday != undefined) {
    const day: Date = schedule.tuesday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 2,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Call ${bond.bondName} !`,
          body: `Time to Call ${bond.bondName}`,
          data: { data: `${bond.bond_id}`, test: { test1: "more data" } },
        },
        trigger: weeklyTrigger,
      });
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleDailyNotification() failed to scheduleNotificationAsync for tuesday "
      );
    }
  }

  if (schedule.wednesday != undefined) {
    const day: Date = schedule.wednesday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 3,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Call ${bond.bondName} !`,
          body: `Time to Call ${bond.bondName}`,
          data: { data: `${bond.bond_id}`, test: { test1: "more data" } },
        },
        trigger: weeklyTrigger,
      });
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleDailyNotification() failed to scheduleNotificationAsync for wednesday "
      );
    }
  }

  if (schedule.thursday != undefined) {
    const day: Date = schedule.thursday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 4,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Call ${bond.bondName} !`,
          body: `Time to Call ${bond.bondName}`,
          data: { data: `${bond.bond_id}`, test: { test1: "more data" } },
        },
        trigger: weeklyTrigger,
      });
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleDailyNotification() failed to scheduleNotificationAsync for thursday "
      );
    }
  }

  if (schedule.friday != undefined) {
    const day: Date = schedule.friday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 5,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Call ${bond.bondName} !`,
          body: `Time to Call ${bond.bondName}`,
          data: { data: `${bond.bond_id}`, test: { test1: "more data" } },
        },
        trigger: weeklyTrigger,
      });
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleDailyNotification() failed to scheduleNotificationAsync for friday "
      );
    }
  }

  if (schedule.saturday != undefined) {
    const day: Date = schedule.saturday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 6,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Call ${bond.bondName} !`,
          body: `Time to Call ${bond.bondName}`,
          data: { data: `${bond.bond_id}`, test: { test1: "more data" } },
        },
        trigger: weeklyTrigger,
      });
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleDailyNotification() failed to scheduleNotificationAsync for saturday "
      );
    }
  }
}


export async function scheduleMonthlyNotification(schedule:MonthlySchedule, bond:Bond) {
  if (!isMonthlySchedule(schedule)) {
    throw Error(
      "scheduleMonthlyNotification(): param is not of type MonthlySchedule"
    );
  }

  const daysToSchedule: DayOfMonth[] = schedule.daysInMonth;
  daysToSchedule.forEach(async (d) => {
    
    const trigger: Notifications.CalendarTriggerInput = {
      weekOfMonth: d.weekOfMonth,
      day: d.dayOfWeek,
      hour: d.time.getHours(),
      minute: d.time.getMinutes()
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Call ${bond.bondName} !`,
          body: `Time to Call ${bond.bondName}`,
          data: { data: `${bond.bond_id}`, test: { test1: "more data" } },
        },
        trigger: trigger,
      });
    } catch (e) {
      console.error(e);
      throw Error(
        `scheduleMonthlyNotification() failed to scheduleNotificationAsync for the ${d.dayOfWeek} of the ${d.weekOfMonth} week of Month`
      );

  }
})

}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export { registerForPushNotificationsAsync };
