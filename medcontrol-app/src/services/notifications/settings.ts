import AsyncStorage from "@react-native-async-storage/async-storage";

export const SETTINGS_KEYS = {
  NOTIFICATIONS_ENABLED: "settings_notifications_enabled",
  VOICE_ASSISTANT_ENABLED: "settings_voice_assistant_enabled",
} as const;

export const isNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(
      SETTINGS_KEYS.NOTIFICATIONS_ENABLED
    );
    return value === "true";
  } catch {
    return false;
  }
};

export const isVoiceAssistantEnabled = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(
      SETTINGS_KEYS.VOICE_ASSISTANT_ENABLED
    );
    return value === "true";
  } catch {
    return false;
  }
};
