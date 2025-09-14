import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import NotificationService from "../services/notificationService";
import { Medicine, DosageItem } from "../types";

interface UseNotificationsReturn {
  hasPermissions: boolean;
  isLoading: boolean;
  requestPermissions: () => Promise<boolean>;
  scheduleDosageNotification: (
    dosage: DosageItem,
    medicine: Medicine
  ) => Promise<string | null>;
  scheduleMultipleNotifications: (
    dosages: DosageItem[],
    medicines: Medicine[]
  ) => Promise<string[]>;
  cancelNotification: (notificationId: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  cancelMedicineNotifications: (medicineId: number) => Promise<void>;
  updateNotificationForDosage: (
    dosageId: number,
    status: "taken" | "missed"
  ) => Promise<void>;
  getScheduledNotifications: () => Promise<any[]>;
  getScheduledNotificationsCountForMedicine: (
    medicineId: number
  ) => Promise<number>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const permissions = await NotificationService.hasPermissions();
      setHasPermissions(permissions);
    } catch (error) {
      console.error("Erro ao verificar permissões:", error);
      setHasPermissions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const granted = await NotificationService.requestPermissions();
      setHasPermissions(granted);

      if (!granted) {
        Alert.alert(
          "Permissão Necessária",
          "Para receber lembretes de medicamentos, é necessário permitir notificações nas configurações do dispositivo.",
          [{ text: "OK", style: "default" }]
        );
      }

      return granted;
    } catch (error) {
      console.error("Erro ao solicitar permissões:", error);
      setHasPermissions(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleDosageNotification = useCallback(
    async (dosage: DosageItem, medicine: Medicine): Promise<string | null> => {
      try {
        if (!hasPermissions) {
          const granted = await requestPermissions();
          if (!granted) {
            return null;
          }
        }

        return await NotificationService.scheduleDosageNotification(
          dosage,
          medicine
        );
      } catch (error) {
        console.error("Erro ao agendar notificação:", error);
        return null;
      }
    },
    [hasPermissions, requestPermissions]
  );

  const scheduleMultipleNotifications = useCallback(
    async (dosages: DosageItem[], medicines: Medicine[]): Promise<string[]> => {
      try {
        if (!hasPermissions) {
          const granted = await requestPermissions();
          if (!granted) {
            return [];
          }
        }

        return await NotificationService.scheduleMultipleDosageNotifications(
          dosages,
          medicines
        );
      } catch (error) {
        console.error("Erro ao agendar múltiplas notificações:", error);
        return [];
      }
    },
    [hasPermissions, requestPermissions]
  );

  const cancelNotification = useCallback(
    async (notificationId: string): Promise<void> => {
      try {
        await NotificationService.cancelNotification(notificationId);
      } catch (error) {
        console.error("Erro ao cancelar notificação:", error);
      }
    },
    []
  );

  const cancelAllNotifications = useCallback(async (): Promise<void> => {
    try {
      await NotificationService.cancelAllNotifications();
    } catch (error) {
      console.error("Erro ao cancelar todas as notificações:", error);
    }
  }, []);

  const cancelMedicineNotifications = useCallback(
    async (medicineId: number): Promise<void> => {
      try {
        await NotificationService.cancelMedicineNotifications(medicineId);
      } catch (error) {
        console.error("Erro ao cancelar notificações do medicamento:", error);
      }
    },
    []
  );

  const updateNotificationForDosage = useCallback(
    async (dosageId: number, status: "taken" | "missed"): Promise<void> => {
      try {
        await NotificationService.updateNotificationForDosage(dosageId, status);
      } catch (error) {
        console.error("Erro ao atualizar notificação da dose:", error);
      }
    },
    []
  );

  const getScheduledNotifications = useCallback(async (): Promise<any[]> => {
    try {
      return await NotificationService.getScheduledNotifications();
    } catch (error) {
      console.error("Erro ao obter notificações agendadas:", error);
      return [];
    }
  }, []);

  const getScheduledNotificationsCountForMedicine = useCallback(
    async (medicineId: number): Promise<number> => {
      try {
        return await NotificationService.getScheduledNotificationsCountForMedicine(
          medicineId
        );
      } catch (error) {
        console.error("Erro ao contar notificações do medicamento:", error);
        return 0;
      }
    },
    []
  );

  return {
    hasPermissions,
    isLoading,
    requestPermissions,
    scheduleDosageNotification,
    scheduleMultipleNotifications,
    cancelNotification,
    cancelAllNotifications,
    cancelMedicineNotifications,
    updateNotificationForDosage,
    getScheduledNotifications,
    getScheduledNotificationsCountForMedicine,
  };
};
