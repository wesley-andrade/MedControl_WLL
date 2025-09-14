import * as Notifications from "expo-notifications";
import { buildSpokenMessage } from "./utils";
import { speakIfEnabled } from "./tts";

export const setupListeners = () => {
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      try {
        const { title, body, data } = notification.request.content as any;
        const message = buildSpokenMessage(
          title,
          body,
          data,
          "É hora de tomar"
        );
        void speakIfEnabled(message);
      } catch (error) {
        console.error(
          "Erro ao processar notificação recebida para TTS:",
          error
        );
      }
    }
  );

  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      try {
        const { title, body, data } = response.notification.request
          .content as any;
        const message = buildSpokenMessage(
          title,
          body,
          data,
          "Abrindo lembrete de"
        );
        void speakIfEnabled(message);
      } catch (error) {
        console.error(
          "Erro ao processar resposta de notificação para TTS:",
          error
        );
      }
    });

  return { notificationListener, responseListener };
};

export const removeListeners = (listeners: {
  notificationListener: Notifications.Subscription;
  responseListener: Notifications.Subscription;
}) => {
  Notifications.removeNotificationSubscription(listeners.notificationListener);
  Notifications.removeNotificationSubscription(listeners.responseListener);
};
