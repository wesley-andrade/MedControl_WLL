import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotifications } from "../../hooks/useNotifications";

const STORAGE_KEYS = {
  NOTIFICATIONS_ENABLED: "settings_notifications_enabled",
  VOICE_ASSISTANT_ENABLED: "settings_voice_assistant_enabled",
};

export const useSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [voiceAssistantEnabled, setVoiceAssistantEnabled] = useState(false);
  const { hasPermissions, requestPermissions, cancelAllNotifications } =
    useNotifications();

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const [n, v] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED),
        AsyncStorage.getItem(STORAGE_KEYS.VOICE_ASSISTANT_ENABLED),
      ]);
      setNotificationsEnabled(n === "true");
      setVoiceAssistantEnabled(v === "true");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleNotifications = useCallback(async () => {
    const next = !notificationsEnabled;

    if (next) {
      const granted = await requestPermissions();
      if (!granted) {
        return;
      }
    } else {
      await cancelAllNotifications();
    }

    setNotificationsEnabled(next);
    await AsyncStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS_ENABLED,
      next ? "true" : "false"
    );
  }, [notificationsEnabled, requestPermissions, cancelAllNotifications]);

  const toggleVoiceAssistant = useCallback(async () => {
    setVoiceAssistantEnabled((prev) => {
      const next = !prev;
      AsyncStorage.setItem(
        STORAGE_KEYS.VOICE_ASSISTANT_ENABLED,
        next ? "true" : "false"
      ).catch(() => {});
      return next;
    });
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    isLoading,
    notificationsEnabled,
    voiceAssistantEnabled,
    toggleNotifications,
    toggleVoiceAssistant,
    hasPermissions,
    requestPermissions,
  };
};
