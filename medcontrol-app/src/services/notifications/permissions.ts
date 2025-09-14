import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE_KEY = "notification_permissions_granted";

let permissionsCache: boolean | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export const requestPermissionsWithCache = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") return false;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("medication-reminders", {
        name: "Lembretes de Medicamentos",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2291FF",
        sound: "default",
      });
    }

    await AsyncStorage.setItem(STORAGE_KEY, "true");
    permissionsCache = true;
    cacheTimestamp = Date.now();
    return true;
  } catch (error) {
    console.error("Erro ao solicitar permissões de notificação:", error);
    return false;
  }
};

export const hasPermissionsWithCache = async (): Promise<boolean> => {
  try {
    const now = Date.now();
    if (permissionsCache !== null && now - cacheTimestamp < CACHE_DURATION) {
      return permissionsCache;
    }
    const { status } = await Notifications.getPermissionsAsync();
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const hasPermission = status === "granted" && stored === "true";
    permissionsCache = hasPermission;
    cacheTimestamp = now;
    return hasPermission;
  } catch (error) {
    console.error("Erro ao verificar permissões:", error);
    return false;
  }
};

export const invalidatePermissionsCache = (): void => {
  permissionsCache = null;
  cacheTimestamp = 0;
};
