import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DosageItem, Medicine, NotificationData } from "../types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  private static readonly STORAGE_KEY = "notification_permissions_granted";
  private static permissionsCache: boolean | null = null;
  private static cacheTimestamp: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000;
  private static readonly MAX_NOTIFICATIONS_PER_MEDICINE = 5;
  private static readonly MAX_TOTAL_NOTIFICATIONS = 50;

  static async requestPermissions(): Promise<boolean> {
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
        await Notifications.setNotificationChannelAsync(
          "medication-reminders",
          {
            name: "Lembretes de Medicamentos",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#2291FF",
            sound: "default",
          }
        );
      }

      await AsyncStorage.setItem(this.STORAGE_KEY, "true");
      this.permissionsCache = true;
      this.cacheTimestamp = Date.now();
      return true;
    } catch (error) {
      console.error("Erro ao solicitar permissões de notificação:", error);
      return false;
    }
  }

  static async hasPermissions(): Promise<boolean> {
    try {
      const now = Date.now();
      if (
        this.permissionsCache !== null &&
        now - this.cacheTimestamp < this.CACHE_DURATION
      ) {
        return this.permissionsCache;
      }

      const { status } = await Notifications.getPermissionsAsync();
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      const hasPermission = status === "granted" && stored === "true";

      this.permissionsCache = hasPermission;
      this.cacheTimestamp = now;
      return hasPermission;
    } catch (error) {
      console.error("Erro ao verificar permissões:", error);
      return false;
    }
  }

  static async scheduleDosageNotification(
    dosage: DosageItem,
    medicine: Medicine,
    skipPermissionCheck: boolean = false
  ): Promise<string | null> {
    try {
      if (!skipPermissionCheck && !(await this.hasPermissions())) return null;

      const expectedTime = new Date(
        dosage.expectedTimeDate || dosage.scheduledAt!
      );
      const now = new Date();

      if (
        expectedTime <= now ||
        dosage.status !== "pending" ||
        !medicine.active
      ) {
        return null;
      }

      const diffSeconds = Math.floor(
        (expectedTime.getTime() - now.getTime()) / 1000
      );
      if (diffSeconds < 1) return null;

      const notificationData: NotificationData = {
        dosageId: dosage.id,
        medicineId: medicine.id,
        medicineName: medicine.name,
        dosage: medicine.dosage,
        expectedTime: expectedTime.toISOString(),
      };

      return await Notifications.scheduleNotificationAsync({
        content: {
          title: "💊 Hora do Medicamento",
          body: `É hora de tomar ${medicine.name} (${medicine.dosage})`,
          data: notificationData as any,
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: diffSeconds,
        },
      });
    } catch (error) {
      console.error("Erro ao agendar notificação:", error);
      return null;
    }
  }

  static async scheduleMultipleDosageNotifications(
    dosages: DosageItem[],
    medicines: Medicine[]
  ): Promise<string[]> {
    if (!(await this.hasPermissions())) return [];

    try {
      await this.cancelAllNotifications();

      const medicineMap = new Map(medicines.map((m) => [m.id, m]));

      const validDosages = dosages.filter((dosage) => {
        const medicine = medicineMap.get(dosage.medicineId);
        if (!medicine) return false;

        const expectedTime = new Date(
          dosage.expectedTimeDate || dosage.scheduledAt!
        );
        const now = new Date();

        return (
          expectedTime > now && dosage.status === "pending" && medicine.active
        );
      });

      const dosagesByMedicine = new Map<number, DosageItem[]>();
      validDosages.forEach((dosage) => {
        if (!dosagesByMedicine.has(dosage.medicineId)) {
          dosagesByMedicine.set(dosage.medicineId, []);
        }
        dosagesByMedicine.get(dosage.medicineId)!.push(dosage);
      });

      const limitedDosages: DosageItem[] = [];
      dosagesByMedicine.forEach((medicineDosages, medicineId) => {
        const sortedDosages = medicineDosages.sort((a, b) => {
          const dateA = new Date(a.expectedTimeDate || a.scheduledAt!);
          const dateB = new Date(b.expectedTimeDate || b.scheduledAt!);
          return dateA.getTime() - dateB.getTime();
        });

        const limitedMedicineDosages = sortedDosages.slice(
          0,
          this.MAX_NOTIFICATIONS_PER_MEDICINE
        );
        limitedDosages.push(...limitedMedicineDosages);
      });

      const finalDosages = limitedDosages
        .sort((a, b) => {
          const dateA = new Date(a.expectedTimeDate || a.scheduledAt!);
          const dateB = new Date(b.expectedTimeDate || b.scheduledAt!);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, this.MAX_TOTAL_NOTIFICATIONS);

      const scheduledIds: string[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (const dosage of finalDosages) {
        try {
          const medicine = medicineMap.get(dosage.medicineId)!;
          const notificationId = await this.scheduleDosageNotification(
            dosage,
            medicine,
            true
          );

          if (notificationId) {
            scheduledIds.push(notificationId);
            successCount++;
          }
        } catch (error: any) {
          errorCount++;
          console.error(
            `Erro ao agendar notificação para dose ${dosage.id}:`,
            error
          );

          if (
            error.message &&
            error.message.includes("Maximum limit of concurrent alarms")
          ) {
            console.warn(
              `Limite de alarmes atingido. Parando agendamento. Sucesso: ${successCount}, Erros: ${errorCount}`
            );
            break;
          }
        }
      }

      console.log(
        `Notificações agendadas: ${successCount}, Erros: ${errorCount}`
      );
      return scheduledIds;
    } catch (error) {
      console.error("Erro geral ao agendar notificações:", error);
      return [];
    }
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error("Erro ao cancelar notificação:", error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Erro ao cancelar todas as notificações:", error);
    }
  }

  static async cancelMedicineNotifications(medicineId: number): Promise<void> {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const notificationsToCancel = scheduledNotifications.filter(
        (notification) => {
          const data = notification.content.data as any;
          return data && data.medicineId === medicineId;
        }
      );

      const cancelPromises = notificationsToCancel.map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      );

      await Promise.all(cancelPromises);
    } catch (error) {
      console.error("Erro ao cancelar notificações do medicamento:", error);
    }
  }

  static async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Erro ao obter notificações agendadas:", error);
      return [];
    }
  }

  static async getScheduledNotificationsCountForMedicine(
    medicineId: number
  ): Promise<number> {
    try {
      const scheduledNotifications = await this.getScheduledNotifications();
      return scheduledNotifications.filter((notification) => {
        const data = notification.content.data as any;
        return data && data.medicineId === medicineId;
      }).length;
    } catch (error) {
      console.error("Erro ao contar notificações do medicamento:", error);
      return 0;
    }
  }

  static async updateNotificationForDosage(
    dosageId: number,
    newStatus: "taken" | "missed"
  ): Promise<void> {
    try {
      const scheduledNotifications = await this.getScheduledNotifications();
      const targetNotification = scheduledNotifications.find((notification) => {
        const data = notification.content.data as any;
        return data && data.dosageId === dosageId;
      });

      if (!targetNotification) return;

      await Notifications.cancelScheduledNotificationAsync(
        targetNotification.identifier
      );
    } catch (error) {
      console.error("Erro ao atualizar notificação da dose:", error);
    }
  }

  static setupNotificationListeners() {
    const notificationListener = Notifications.addNotificationReceivedListener(
      () => {}
    );
    const responseListener =
      Notifications.addNotificationResponseReceivedListener(() => {});

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
    this.permissionsCache = null;
    this.cacheTimestamp = 0;
  }
}

export default NotificationService;
