import * as Notifications from "expo-notifications";
import { DosageItem, Medicine } from "../types";
import { isNotificationsEnabled } from "./notifications/settings";
import { speakIfEnabled } from "./notifications/tts";
import { buildSpokenMessage } from "./notifications/utils";
import {
  requestPermissionsWithCache,
  hasPermissionsWithCache,
  invalidatePermissionsCache,
} from "./notifications/permissions";
import { scheduleSingle, scheduleMany } from "./notifications/scheduler";
import {
  cancelAllNotifications as cancelAll,
  cancelMedicineNotifications as cancelByMedicine,
  cancelNotification as cancelOne,
} from "./notifications/canceller";
import {
  getScheduledNotifications as getScheduled,
  getScheduledNotificationsCountForMedicine as getCountForMedicine,
  updateNotificationForDosage as updateForDosage,
} from "./notifications/queries";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  private static isScheduling: boolean = false;

  static async requestPermissions(): Promise<boolean> {
    return requestPermissionsWithCache();
  }

  static async hasPermissions(): Promise<boolean> {
    return hasPermissionsWithCache();
  }

  static async scheduleDosageNotification(
    dosage: DosageItem,
    medicine: Medicine,
    skipPermissionCheck: boolean = false
  ): Promise<string | null> {
    try {
      const notificationsEnabled = await isNotificationsEnabled();
      if (!notificationsEnabled) return null;
      if (!skipPermissionCheck && !(await this.hasPermissions())) return null;

      return await scheduleSingle(dosage, medicine, false, this.hasPermissions);
    } catch (error) {
      console.error("Erro ao agendar notificação:", error);
      return null;
    }
  }

  static async scheduleMultipleDosageNotifications(
    dosages: DosageItem[],
    medicines: Medicine[]
  ): Promise<string[]> {
    const notificationsEnabled = await isNotificationsEnabled();
    if (!notificationsEnabled || !(await this.hasPermissions())) return [];

    try {
      if (this.isScheduling) return [];
      this.isScheduling = true;

      const scheduledIds = await scheduleMany(
        dosages,
        medicines,
        this.hasPermissions
      );
      console.log(`Notificações agendadas: ${scheduledIds.length}`);
      return scheduledIds;
    } catch (error) {
      console.error("Erro geral ao agendar notificações:", error);
      return [];
    } finally {
      this.isScheduling = false;
    }
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    await cancelOne(notificationId);
  }

  static async cancelAllNotifications(): Promise<void> {
    await cancelAll();
  }

  static async cancelMedicineNotifications(medicineId: number): Promise<void> {
    await cancelByMedicine(medicineId);
  }

  static async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    return getScheduled();
  }

  static async getScheduledNotificationsCountForMedicine(
    medicineId: number
  ): Promise<number> {
    return getCountForMedicine(medicineId);
  }

  static async updateNotificationForDosage(
    dosageId: number,
    newStatus: "taken" | "missed"
  ): Promise<void> {
    await updateForDosage(dosageId, newStatus);
  }

  static setupNotificationListeners() {
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
  }

  static removeNotificationListeners(listeners: {
    notificationListener: Notifications.Subscription;
    responseListener: Notifications.Subscription;
  }): void {
    Notifications.removeNotificationSubscription(
      listeners.notificationListener
    );
    Notifications.removeNotificationSubscription(listeners.responseListener);
  }

  static invalidatePermissionsCache(): void {
    invalidatePermissionsCache();
  }
}

export default NotificationService;
