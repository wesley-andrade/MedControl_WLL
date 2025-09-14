import * as Notifications from "expo-notifications";
import { DosageItem, Medicine } from "../../types";
import {
  buildNotificationData,
  getExpectedTime,
  isDosageSchedulable,
  sortByExpectedTime,
} from "./utils";

const MAX_NOTIFICATIONS_PER_MEDICINE = 5;
const MAX_TOTAL_NOTIFICATIONS = 50;

export const scheduleSingle = async (
  dosage: DosageItem,
  medicine: Medicine,
  skipPermissionCheck: boolean,
  hasPermissions: () => Promise<boolean>
): Promise<string | null> => {
  if (!skipPermissionCheck && !(await hasPermissions())) return null;

  const now = new Date();
  if (!isDosageSchedulable(dosage, medicine, now)) {
    return null;
  }

  const expectedTime = getExpectedTime(dosage);
  const diffSeconds = Math.floor(
    (expectedTime.getTime() - now.getTime()) / 1000
  );
  if (diffSeconds < 1) return null;

  const data = buildNotificationData(dosage, medicine);

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "💊 Hora do Medicamento",
      body: `É hora de tomar ${medicine.name} (${medicine.dosage})`,
      data: data as any,
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: diffSeconds,
    },
  });
};

export const scheduleMany = async (
  dosages: DosageItem[],
  medicines: Medicine[],
  hasPermissions: () => Promise<boolean>
): Promise<string[]> => {
  if (!(await hasPermissions())) return [];

  const medicineMap = new Map(medicines.map((m) => [m.id, m]));
  const now = new Date();
  const validDosages = dosages.filter((dosage) => {
    const medicine = medicineMap.get(dosage.medicineId);
    return medicine ? isDosageSchedulable(dosage, medicine, now) : false;
  });

  const dosagesByMedicine = new Map<number, DosageItem[]>();
  validDosages.forEach((dosage) => {
    if (!dosagesByMedicine.has(dosage.medicineId)) {
      dosagesByMedicine.set(dosage.medicineId, []);
    }
    dosagesByMedicine.get(dosage.medicineId)!.push(dosage);
  });

  const limitedDosages: DosageItem[] = [];
  dosagesByMedicine.forEach((medicineDosages) => {
    const sortedDosages = medicineDosages.sort((a, b) =>
      sortByExpectedTime(a, b)
    );
    const limitedMedicineDosages = sortedDosages.slice(
      0,
      MAX_NOTIFICATIONS_PER_MEDICINE
    );
    limitedDosages.push(...limitedMedicineDosages);
  });

  const finalDosages = limitedDosages
    .sort((a, b) => sortByExpectedTime(a, b))
    .slice(0, MAX_TOTAL_NOTIFICATIONS);

  const alreadyScheduled =
    await Notifications.getAllScheduledNotificationsAsync();
  const alreadyScheduledByDosage = new Map<number, string>();
  alreadyScheduled.forEach((n) => {
    const data = (n.content.data as any) || {};
    if (typeof data.dosageId === "number") {
      alreadyScheduledByDosage.set(data.dosageId, n.identifier);
    }
  });

  const desiredDosageIds = new Set(finalDosages.map((d) => d.id));
  const cancelObsoletePromises = alreadyScheduled
    .filter((n) => {
      const data = (n.content.data as any) || {};
      const id = data.dosageId as number | undefined;
      return id !== undefined && !desiredDosageIds.has(id);
    })
    .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier));
  if (cancelObsoletePromises.length > 0) {
    await Promise.allSettled(cancelObsoletePromises);
  }

  const scheduledIds: string[] = [];

  for (const dosage of finalDosages) {
    try {
      const medicine = medicineMap.get(dosage.medicineId)!;
      if (alreadyScheduledByDosage.has(dosage.id)) continue;
      const id = await scheduleSingle(dosage, medicine, true, hasPermissions);
      if (id) scheduledIds.push(id);
    } catch (error) {
      console.error(
        `Erro ao agendar notificação para dose ${dosage.id}:`,
        error
      );
    }
  }

  return scheduledIds;
};
