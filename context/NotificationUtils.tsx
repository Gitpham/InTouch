import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SQLite from "expo-sqlite";

import Constants from "expo-constants";
import { Alert, Linking, Platform } from "react-native";
import {
  Bond,
  DailySchedule,
  DateInYear,
  DayOfMonth,
  MonthlySchedule,
  ScheduleFrequency,
  WeeklySchedule,
  YearlySchedule,
} from "@/constants/types";
import { uploadScheduleToDB } from "@/assets/db/ScheduleRepo";

export async function allowsNotificationsAsync() {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function redirect(notification: Notifications.Notification) {
  const url = notification.request.content.data?.url;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    Linking.openURL(url);
  } else {
    Alert.alert("could not open url");
  }
}

export async function requestNotificationPermission() {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
}

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.error(e);
    throw Error(
      "cancelAllNotifications() failed to call cancelAllScheduledNotificationsAsync"
    );
  }
}

export async function cancelNotifications(notificationIDs: string[]) {
  try {
    notificationIDs.forEach(async (id) => {
      await Notifications.cancelScheduledNotificationAsync(id);
    });
  } catch (e) {
    console.error(e);
    throw Error(
      "cancelNotification() failed to call cancelScheduleNotificationsAsync"
    );
  }
}

const notificationContentDaily = (
  bond: Bond
): Notifications.NotificationContentInput => {
  return {
    title: `Call ${bond.bondName} !`,
    body: `Daily: Time to call somebody in ${bond.bondName}`,
    data: { bondID: `${bond.bond_id}`, test: { test1: "more data" } },
  };
};

const notificationContentWeekly = (
  bond: Bond
): Notifications.NotificationContentInput => {
  return {
    title: `Call ${bond.bondName} !`,
    body: `Weekly: Time to call somebody in ${bond.bondName}`,
    data: { bondID: `${bond.bond_id}`, test: { test1: "more data" } },
  };
};

const notificationContentMonthly = (
  bond: Bond
): Notifications.NotificationContentInput => {
  return {
    title: `Call ${bond.bondName} !`,
    body: `Monthly: Time to call somebody in ${bond.bondName}`,
    data: { bondID: `${bond.bond_id}`, test: { test1: "more data" } },
  };
};

const notificationContentYearly = (
  bond: Bond
): Notifications.NotificationContentInput => {
  return {
    title: `Call ${bond.bondName} !`,
    body: `Yearly: Time to call somebody in ${bond.bondName}`,
    data: { bondID: `${bond.bond_id}`, test: { test1: "more data" } },
  };
};
/**
 * schedules a daily notificaion according to the hour and time of the schedule, and bondID of the bond.
 * @param schedule
 * @param bond
 * @returns
 */
export async function scheduleDailyNotification(
  schedule: DailySchedule,
  bond: Bond
): Promise<string> {
  const dailyTrigger: Notifications.DailyTriggerInput = {
    hour: schedule.time.getHours(),
    minute: schedule.time.getMinutes(),
    repeats: true,
  };
  try {
    return await Notifications.scheduleNotificationAsync({
      content: notificationContentDaily(bond),
      trigger: dailyTrigger,
    });
  } catch (e) {
    console.error(e);
    throw Error(
      "scheduleDailyNotification() failed to scheduleNotificationAsync "
    );
  }
}


export async function scheduleWeeklyNotification(
  schedule: WeeklySchedule,
  bond: Bond
): Promise<string[]> {

  const nids: string[] = [];
  if (schedule.sunday != undefined) {
    const day: Date = schedule.sunday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 1,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      nids.push(await Notifications.scheduleNotificationAsync({
        content: notificationContentWeekly(bond),
        trigger: weeklyTrigger,
      }));
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleWeeklyNotification() failed to scheduleNotificationAsync for sunday "
      );
    }
  }

  if (schedule.monday != undefined) {
    const day: Date = schedule.monday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 2,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      nids.push(await Notifications.scheduleNotificationAsync({
        content: notificationContentWeekly(bond),
        trigger: weeklyTrigger,
      }));
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleWeeklyNotification() failed to scheduleNotificationAsync for monday "
      );
    }
  }

  if (schedule.tuesday != undefined) {
    const day: Date = schedule.tuesday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 3,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      nids.push(await Notifications.scheduleNotificationAsync({
        content: notificationContentWeekly(bond),
        trigger: weeklyTrigger,
      }));
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleWeeklyNotification() failed to scheduleNotificationAsync for tuesday "
      );
    }
  }

  if (schedule.wednesday != undefined) {
    const day: Date = schedule.wednesday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 4,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      console.log("wednesday");
      nids.push(await Notifications.scheduleNotificationAsync({
        content: notificationContentWeekly(bond),
        trigger: weeklyTrigger,
      }));
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleWeeklyNotification() failed to scheduleNotificationAsync for wednesday "
      );
    }
  }

  if (schedule.thursday != undefined) {
    const day: Date = schedule.thursday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 5,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      nids.push(await Notifications.scheduleNotificationAsync({
        content: notificationContentWeekly(bond),
        trigger: weeklyTrigger,
      }));
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleWeeklyNotification() failed to scheduleNotificationAsync for thursday "
      );
    }
  }

  if (schedule.friday != undefined) {
    const day: Date = schedule.friday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 6,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      nids.push(await Notifications.scheduleNotificationAsync({
        content: notificationContentWeekly(bond),
        trigger: weeklyTrigger,
      }));
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleWeeklyNotification() failed to scheduleNotificationAsync for friday "
      );
    }
  }

  if (schedule.saturday != undefined) {
    const day: Date = schedule.saturday;
    const weeklyTrigger: Notifications.WeeklyTriggerInput = {
      weekday: 7,
      hour: day.getHours(),
      minute: day.getMinutes(),
      repeats: true,
    };

    try {
      nids.push(await Notifications.scheduleNotificationAsync({
        content: notificationContentWeekly(bond),
        trigger: weeklyTrigger,
      }));
    } catch (e) {
      console.error(e);
      throw Error(
        "scheduleWeeklyNotification() failed to scheduleNotificationAsync for saturday "
      );
    }
  }

  return nids;
}

export async function scheduleMonthlyNotification(
  schedule: MonthlySchedule,
  bond: Bond
): Promise<string[]> {
  const nids: string[] = [];
  schedule.daysInMonth.forEach(async (d: DayOfMonth) => {
    console.log("day in monthly schedule: ", d as DayOfMonth);

    const weekOfMonth: number = Number(d.weekOfMonth);
    const dayOfWeek: number = Number(d.dayOfWeek);
    const trigger: Notifications.CalendarTriggerInput = {
      weekOfMonth: weekOfMonth,
      weekday: dayOfWeek,
      hour: d.time.getHours(),
      minute: d.time.getMinutes(),
      repeats: true,
    };

    try {
      nids.push(await Notifications.scheduleNotificationAsync({
        content: notificationContentMonthly(bond),
        trigger: trigger,
      }));
    } catch (e) {
      console.error(e);
      throw new Error(
        `scheduleMonthlyNotification() failed to scheduleNotificationAsync for the ${d.dayOfWeek} of the ${d.weekOfMonth} week of Month`
      );
    }
  });
  return nids
}

export async function scheduleYearlyNotification(
  schedule: YearlySchedule,
  bond: Bond
): Promise<string[]>{
  console.log("scheduleYearlyNotificaion(): ")
  const nids: string[] = [];
  schedule.datesInYear.forEach(async (d: DateInYear) => {
    const trigger: Notifications.YearlyTriggerInput = {
      day: d.date.getUTCDate(),
      month: d.date.getMonth(),
      hour: d.time.getHours(),
      minute: d.time.getMinutes(),
      repeats: true
    }
    try {
      nids.push(await Notifications.scheduleNotificationAsync({
        content: notificationContentYearly(bond),
        trigger: trigger,
      }));
    } catch (e) {
      console.error(e);
      throw new Error(
        `scheduleYearlyNotification() failed to scheduleNotificationAsync for ${d.getDate()} of ${d.getMonth()}`
      );
    }
  })
  console.log("nids: ", nids)
  return nids;
}
export async function getAllScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log("all scheduled notifications: ")
    notifications.forEach(r => {
      console.log("trigger: ", r.trigger)
      console.log("content: ", r.content)
    })
  } catch (e) {
    console.error(e);
    throw new Error("getAllScheduledNotifications(): failed getAllSCheduledNotificaionsAsync()")
  }
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

export const writeDailyScheduleToDB = async (
  schedule: DailySchedule,
  bond: Bond,
  nid: string, 
  db: SQLite.SQLiteDatabase
) => {
  try {
    const time = schedule.time.toTimeString();
    await uploadScheduleToDB(db, ScheduleFrequency.DAILY, time, null, null, null, bond.bond_id, nid )
  } catch (e) {
    console.error(e);
    throw new Error("writeDailyScheduleToDB() failed");
  }
};

  /**
   * dayOFWeek: Sunday = 1, Saty = 7
   * @param schedule
   * @param bond
   * @param nid
   */
 export  const writeWeeklyScheduleToDB = async (
    schedule: WeeklySchedule,
    bond: Bond,
    nids: string[],
    db: SQLite.SQLiteDatabase
  ) => {
    const timesOfWeek: string[] = [];
    const dayOfWeek: number[] = [];
    if (schedule.sunday != undefined) {
      dayOfWeek.push(1);
      timesOfWeek.push(schedule.sunday.toTimeString());
    }
    if (schedule.monday != undefined) {
      dayOfWeek.push(2);
      timesOfWeek.push(schedule.monday.toTimeString());
    }
    if (schedule.tuesday != undefined) {
      dayOfWeek.push(3);
      timesOfWeek.push(schedule.tuesday.toTimeString());
    }
    if (schedule.wednesday != undefined) {
      dayOfWeek.push(4);
      timesOfWeek.push(schedule.wednesday.toTimeString());
    }
    if (schedule.thursday != undefined) {
      dayOfWeek.push(5);
      timesOfWeek.push(schedule.thursday.toTimeString());
    }
    if (schedule.friday != undefined) {
      dayOfWeek.push(6);
      timesOfWeek.push(schedule.friday.toTimeString());
    }
    if (schedule.saturday != undefined) {
      dayOfWeek.push(7);
      timesOfWeek.push(schedule.saturday.toTimeString());
    }

    let i = 0;
    dayOfWeek.forEach(async (d) => {
      try {
        const time: string = timesOfWeek[i];
        await uploadScheduleToDB(db, ScheduleFrequency.WEEKLY, time, d, null, null, bond.bond_id, nids[i])
        i++;
      } catch (e) {
        console.error(e);
        throw new Error("writeWeeklyScheduleToDb(): uploadScheduleToDB failed");
      }
    });
  };

export const writeMonthlyScheduleToDB = async (
  schedule: MonthlySchedule,
  bond: Bond,
  nids: string[], 
  db: SQLite.SQLiteDatabase
) => {
  let i = 0;
  schedule.daysInMonth.forEach(async (d) => {
    const time: string = d.time.toTimeString();
    const dayOfWeek: number = d.dayOfWeek;
    const weekOfMonth: number = d.weekOfMonth;
    try {
      await uploadScheduleToDB(db, ScheduleFrequency.MONTHLY, time, dayOfWeek, weekOfMonth, null, bond.bond_id, nids[i])
      i++;
    } catch (e) {
      console.error(e);
      throw new Error("writeMonthlyScheduleToDB() failed");
    }
  });
};

export const writeYearlyScheduleToDB = async (
  schedule: YearlySchedule,
  bond: Bond,
  nids: string[],
  db: SQLite.SQLiteDatabase
) => {
  let i = 0;
  schedule.datesInYear.forEach(async (d) => {
    const time = d.time.toTimeString();
    const date = d.date.toDateString();
    const nid = nids[i];
    const bid = bond.bond_id;
    try {
      await uploadScheduleToDB(db, ScheduleFrequency.YEARLY, time, null, null, date, bid, nid )
      i++;
    } catch (e) {
      console.error(e);
      throw new Error("writeYearlyScheduleToDB() failed");
    }
  });
};




export { registerForPushNotificationsAsync };
