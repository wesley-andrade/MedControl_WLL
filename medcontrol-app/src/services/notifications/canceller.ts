import * as Notifications from "expo-notifications";

export const cancelNotification = async (
  notificationId: string
): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Erro ao cancelar notificação:", error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Erro ao cancelar todas as notificações:", error);
  }
};

export const cancelMedicineNotifications = async (
  medicineId: number
): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter((n) => {
      const data = n.content.data as any;
      return data && data.medicineId === medicineId;
    });
    await Promise.all(
      toCancel.map((n) =>
        Notifications.cancelScheduledNotificationAsync(n.identifier)
      )
    );
  } catch (error) {
    console.error("Erro ao cancelar notificações do medicamento:", error);
  }
};
