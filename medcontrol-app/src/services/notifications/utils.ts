import { DosageItem, Medicine, NotificationData } from "../../types";

export const getExpectedTime = (dosage: DosageItem): Date => {
  return new Date(dosage.expectedTimeDate || dosage.scheduledAt!);
};

export const isDosageSchedulable = (
  dosage: DosageItem,
  medicine: Medicine,
  now: Date
): boolean => {
  const expectedTime = getExpectedTime(dosage);
  return expectedTime > now && dosage.status === "pending" && medicine.active;
};

export const sortByExpectedTime = (a: DosageItem, b: DosageItem): number => {
  return getExpectedTime(a).getTime() - getExpectedTime(b).getTime();
};

export const buildNotificationData = (
  dosage: DosageItem,
  medicine: Medicine
): NotificationData => {
  const expectedTime = getExpectedTime(dosage);
  return {
    dosageId: dosage.id,
    medicineId: medicine.id,
    medicineName: medicine.name,
    dosage: medicine.dosage,
    expectedTime: expectedTime.toISOString(),
  };
};

export const buildSpokenMessage = (
  title?: string,
  body?: string,
  data?: any,
  fallbackPrefix: "É hora de tomar" | "Abrindo lembrete de" = "É hora de tomar"
): string => {
  const medicineName = data?.medicineName as string | undefined;
  const dosage = data?.dosage as string | undefined;
  const fallback = medicineName
    ? `${fallbackPrefix} ${medicineName}${dosage ? `, ${dosage}` : ""}`
    : title;
  return (
    body ||
    fallback ||
    (fallbackPrefix === "É hora de tomar"
      ? "Você tem uma nova notificação"
      : "Abrindo lembrete")
  );
};
