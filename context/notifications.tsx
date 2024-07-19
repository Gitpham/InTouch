import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import {
  Bond,
  DayOfMonth,
  isDailySchedule,
  isMonthlySchedule,
  isWeeklySchedule,
  Schedule,
} from "@/constants/types";


export async function scheduleDailyNotification(s: Schedule, bond: Bond) {
  console.log("scheduleDailyNotification")
  if (!isDailySchedule(s.schedule)) {
    throw Error(
      "scheduleDailyNotification(): param is not of type DailySchedule"
    );
  }

  const dailyTrigger: Notifications.DailyTriggerInput = {
    hour: s.schedule.time.getHours(),
    minute: s.schedule.time.getMinutes(),
    repeats: true,
  };
  console.log("dailyTrigger: ", dailyTrigger)
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Call ${bond.bondName} !`,
        body: `Time to Call ${bond.bondName}`,
        data: { data: `${bond.bond_id}`, test: { test1: "more data" } },
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

export async function scheduleWeeklyNotification(s: Schedule, bond: Bond) {
  if (!isWeeklySchedule(s.schedule)) {
    throw Error(
      "scheduleWeeklyNotification(): param is not of type WeeklySchedule"
    );
  }

  if (s.schedule.sunday != undefined) {
    const day: Date = s.schedule.sunday;
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

  if (s.schedule.monday != undefined) {
    const day: Date = s.schedule.monday;
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

  if (s.schedule.tuesday != undefined) {
    const day: Date = s.schedule.tuesday;
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

  if (s.schedule.wednesday != undefined) {
    const day: Date = s.schedule.wednesday;
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

  if (s.schedule.thursday != undefined) {
    const day: Date = s.schedule.thursday;
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

  if (s.schedule.friday != undefined) {
    const day: Date = s.schedule.friday;
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

  if (s.schedule.saturday != undefined) {
    const day: Date = s.schedule.saturday;
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


export async function scheduleMonthlyNotification(s:Schedule, bond:Bond) {
  if (!isMonthlySchedule(s.schedule)) {
    throw Error(
      "scheduleMonthlyNotification(): param is not of type MonthlySchedule"
    );
  }

  const daysToSchedule: DayOfMonth[] = s.schedule.daysInMonth;
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
