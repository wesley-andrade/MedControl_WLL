import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Medicine, CreateMedicineRequest } from "../../types";
import { MedicineService } from "../../services/medicineService";
import { DosageService } from "../../services/dosageService";
import {
  formatDateForDisplay,
  extractTimeFromDate,
  convertDateToISO,
} from "../../utils/dateUtils";
import {
  validateRequired,
  validateNumber,
  validateDateFormat,
  validateTimeFormat,
  validateFixedSchedules,
  validateFixedSchedulesFormat,
  showValidationError,
} from "../../utils/validationUtils";
import { useNotifications } from "../../hooks/useNotifications";

interface UseFormProps {
  medicineId?: number;
}

const DATE_PADDING = 2;
const MONTH_OFFSET = 1;

export const useForm = ({ medicineId }: UseFormProps) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [medicine, setMedicine] = useState<Partial<Medicine>>({
    name: "",
    dosage: "",
    frequencyHours: 0,
    fixedSchedules: "",
    dateStart: "",
    dateEnd: "",
    observations: "",
    active: true,
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [useFixedSchedules, setUseFixedSchedules] = useState(false);
  const { scheduleMultipleNotifications, hasPermissions } = useNotifications();

  const isEditing = !!medicineId;

  const loadMedicine = useCallback(async () => {
    if (!token || !medicineId) return;

    try {
      setIsLoading(true);
      const medicineData = await MedicineService.getById(token, medicineId);

      setMedicine({
        name: medicineData.name,
        dosage: medicineData.dosage,
        frequencyHours: medicineData.frequencyHours,
        fixedSchedules: medicineData.fixedSchedules || "",
        dateStart: formatDateForDisplay(medicineData.dateStart),
        dateEnd: medicineData.dateEnd
          ? formatDateForDisplay(medicineData.dateEnd)
          : "",
        observations: medicineData.observations ?? "",
        active: medicineData.active,
      });

      setStartTime(extractTimeFromDate(medicineData.dateStart));
      if (medicineData.dateEnd) {
        setEndTime(extractTimeFromDate(medicineData.dateEnd));
      } else {
        setEndTime("");
      }
      setUseFixedSchedules(!!medicineData.fixedSchedules);
    } catch (error) {
      console.error("Erro ao carregar medicamento:", error);
      Alert.alert("Erro", "Não foi possível carregar o medicamento");
      return false;
    } finally {
      setIsLoading(false);
    }
    return true;
  }, [token, medicineId]);

  const validateForm = useCallback((): boolean => {
    const validations = [
      validateRequired(medicine.name || "", "Nome do medicamento"),
      validateRequired(medicine.dosage || "", "Dosagem"),
      validateNumber(medicine.frequencyHours || 0, "Frequência"),
      validateRequired(medicine.dateStart || "", "Data de início"),
      validateDateFormat(medicine.dateStart || "", "Data de início"),
      validateRequired(startTime, "Horário de início"),
      validateTimeFormat(startTime, "Horário de início"),
    ];

    if (medicine.dateEnd) {
      validations.push(validateDateFormat(medicine.dateEnd, "Data de término"));
      if (endTime) {
        validations.push(validateTimeFormat(endTime, "Horário de término"));
      }
    }

    if (useFixedSchedules) {
      validations.push(validateFixedSchedules(medicine.fixedSchedules || ""));
    }

    for (const validation of validations) {
      if (!validation.isValid) {
        showValidationError(validation.message!);
        return false;
      }
    }

    return true;
  }, [medicine, startTime, endTime, useFixedSchedules]);

  const prepareMedicineData = useCallback((): CreateMedicineRequest => {
    const baseData: CreateMedicineRequest = {
      name: medicine.name!.trim(),
      dosage: medicine.dosage!.trim(),
      frequencyHours: medicine.frequencyHours!,
      dateStart: convertDateToISO(medicine.dateStart!, startTime),
      dateEnd: medicine.dateEnd?.trim()
        ? convertDateToISO(medicine.dateEnd, endTime)
        : "",
      observations: medicine.observations?.trim() || "",
      active: medicine.active!,
    };

    let medicineData = { ...baseData };

    if (useFixedSchedules && medicine.fixedSchedules?.trim()) {
      const fixedSchedulesValue = medicine.fixedSchedules.trim();
      const validation = validateFixedSchedulesFormat(fixedSchedulesValue);
      if (!validation.isValid) {
        showValidationError(validation.message!);
        throw new Error(validation.message);
      }
      medicineData.fixedSchedules = fixedSchedulesValue;
    } else {
      medicineData.fixedSchedules = "";
    }

    Object.keys(medicineData).forEach((key) => {
      if (medicineData[key as keyof CreateMedicineRequest] === undefined) {
        delete medicineData[key as keyof CreateMedicineRequest];
      }
    });

    return medicineData;
  }, [medicine, startTime, endTime, useFixedSchedules]);

  const checkIfDosagesNeedRegeneration = useCallback(
    async (
      originalMedicine: Medicine,
      updatedData: CreateMedicineRequest
    ): Promise<boolean> => {
      return (
        originalMedicine.frequencyHours !== updatedData.frequencyHours ||
        originalMedicine.fixedSchedules !== updatedData.fixedSchedules ||
        originalMedicine.dateStart !== updatedData.dateStart ||
        originalMedicine.dateEnd !== updatedData.dateEnd
      );
    },
    []
  );

  const regenerateDosagesIfNeeded = useCallback(
    async (medicineId: number, needsRegeneration: boolean) => {
      if (needsRegeneration) {
        try {
          await MedicineService.regenerateDosages(token!, medicineId);
        } catch (dosageError) {
          console.error("Erro ao regenerar doses:", dosageError);
        }
      }
    },
    [token]
  );

  const saveNewMedicine = useCallback(
    async (medicineData: CreateMedicineRequest) => {
      const newMedicine = await MedicineService.create(token!, medicineData);

      if (hasPermissions && newMedicine.active) {
        try {
          setTimeout(async () => {
            const dosages = await DosageService.list(token!);
            const pendingDosages = dosages.filter(
              (dosage) =>
                dosage.medicineId === newMedicine.id &&
                dosage.status === "pending"
            );
            if (pendingDosages.length > 0) {
              await scheduleMultipleNotifications(pendingDosages, [
                newMedicine,
              ]);
            }
          }, 2000);
        } catch (error) {
          console.error(
            "Erro ao agendar notificações para novo medicamento:",
            error
          );
        }
      }

      Alert.alert("Sucesso", "Medicamento criado com sucesso!");
    },
    [token, hasPermissions, scheduleMultipleNotifications]
  );

  const updateExistingMedicine = useCallback(
    async (medicineId: number, medicineData: CreateMedicineRequest) => {
      await MedicineService.update(token!, medicineId, medicineData);

      const originalMedicine = await MedicineService.getById(
        token!,
        medicineId
      );
      const needsRegeneration = await checkIfDosagesNeedRegeneration(
        originalMedicine,
        medicineData
      );

      await regenerateDosagesIfNeeded(medicineId, needsRegeneration);
      Alert.alert("Sucesso", "Medicamento atualizado com sucesso!");
    },
    [token, checkIfDosagesNeedRegeneration, regenerateDosagesIfNeeded]
  );

  const handleSave = useCallback(async () => {
    if (!validateForm() || !token) return;

    try {
      setIsSaving(true);
      const medicineData = prepareMedicineData();

      if (isEditing && medicineId) {
        await updateExistingMedicine(medicineId, medicineData);
      } else {
        await saveNewMedicine(medicineData);
      }

      return true;
    } catch (error) {
      console.error("Erro ao salvar medicamento:", error);
      Alert.alert("Erro", "Não foi possível salvar o medicamento");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    validateForm,
    token,
    isEditing,
    medicineId,
    prepareMedicineData,
    updateExistingMedicine,
    saveNewMedicine,
  ]);

  const initializeNewMedicine = useCallback(() => {
    const today = new Date();
    const day = today.getUTCDate().toString().padStart(DATE_PADDING, "0");
    const month = (today.getUTCMonth() + MONTH_OFFSET)
      .toString()
      .padStart(DATE_PADDING, "0");
    const year = today.getUTCFullYear();
    setMedicine((prev) => ({
      ...prev,
      dateStart: `${day}/${month}/${year}`,
      dateEnd: "",
    }));
    setEndTime("");
  }, []);

  useEffect(() => {
    if (isEditing && medicineId) {
      loadMedicine();
    } else {
      initializeNewMedicine();
    }
  }, [isEditing, medicineId, loadMedicine, initializeNewMedicine]);

  return {
    medicine,
    setMedicine,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    useFixedSchedules,
    setUseFixedSchedules,
    isLoading,
    isSaving,
    isEditing,
    handleSave,
  };
};
