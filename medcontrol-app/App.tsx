import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import NotificationService from "./src/services/notificationService";

export default function App() {
  useEffect(() => {
    const listeners = NotificationService.setupNotificationListeners();

    return () => {
      NotificationService.removeNotificationListeners(listeners);
    };
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}
