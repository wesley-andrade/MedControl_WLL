import * as Notifications from "expo-notifications";

export const getScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Erro ao obter notificações agendadas:", error);
    return [];
  }
};

export const getScheduledNotificationsCountForMedicine = async (
  medicineId: number
): Promise<number> => {
  try {
    const scheduledNotifications = await getScheduledNotifications();
    return scheduledNotifications.filter((notification) => {
      const data = notification.content.data as any;
      return data && data.medicineId === medicineId;
    }).length;
  } catch (error) {
    console.error("Erro ao contar notificações do medicamento:", error);
    return 0;
  }
};

export const updateNotificationForDosage = async (
  dosageId: number,
  newStatus: "taken" | "missed"
): Promise<void> => {
  try {
    const scheduledNotifications = await getScheduledNotifications();
    const target = scheduledNotifications.find((notification) => {
      const data = notification.content.data as any;
      return data && data.dosageId === dosageId;
    });
    if (!target) return;
    await Notifications.cancelScheduledNotificationAsync(target.identifier);
  } catch (error) {
    console.error("Erro ao atualizar notificação da dose:", error);
  }
};
