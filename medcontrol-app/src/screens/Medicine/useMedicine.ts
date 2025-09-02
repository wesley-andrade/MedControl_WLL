import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { DosageItem, DosageService } from "../../services/dosageService";
import { MedicineService } from "../../services/medicineService";
import { Medicine } from "../../types";
import {
  isDosagePending,
  isDosageTaken,
  isDosageMissed,
} from "../../utils/dateUtils";

interface AdherenceData {
  percentage: number;
  taken: number;
  missed: number;
  total: number;
}

interface MedicineWithCalculatedData extends Medicine {
  _adherence?: AdherenceData;
  _nextDoses?: DosageItem[];
  _canTakeNextDose?: boolean;
}

interface UseMedicineProps {
  medicineId: number;
}

export const useMedicine = ({ medicineId }: UseMedicineProps) => {
  const { token } = useAuth();
  const [medicine, setMedicine] = useState<MedicineWithCalculatedData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [registeringDose, setRegisteringDose] = useState(false);

  const getMedicineDosages = useCallback(async () => {
    if (!token) return [];
    const dosagesData = await DosageService.list(token);
    return dosagesData.filter((dosage) => dosage.medicineId === medicineId);
  }, [token, medicineId]);

  const getNextPendingDose = useCallback(async () => {
    const medicineDosages = await getMedicineDosages();
    return medicineDosages.find((dosage) => isDosagePending(dosage.status));
  }, [getMedicineDosages]);

  const showTimeWaitAlert = useCallback((scheduledTime: Date) => {
    const currentTime = new Date();
    const timeDiff = scheduledTime.getTime() - currentTime.getTime();
    const minutesDiff = Math.ceil(timeDiff / (1000 * 60));

    if (minutesDiff > 60) {
      const hoursDiff = Math.ceil(minutesDiff / 60);
      Alert.alert(
        "Horário não chegou",
        `Aguarde ${hoursDiff} hora${
          hoursDiff > 1 ? "s" : ""
        } para tomar esta dose. Horário programado: ${scheduledTime.toLocaleTimeString(
          "pt-BR",
          { hour: "2-digit", minute: "2-digit" }
        )}`
      );
    } else {
      Alert.alert(
        "Horário não chegou",
        `Aguarde ${minutesDiff} minuto${
          minutesDiff > 1 ? "s" : ""
        } para tomar esta dose. Horário programado: ${scheduledTime.toLocaleTimeString(
          "pt-BR",
          { hour: "2-digit", minute: "2-digit" }
        )}`
      );
    }
  }, []);

  const calculateAdherence = useCallback(
    (dosages: DosageItem[]): AdherenceData => {
      if (!dosages.length)
        return { percentage: 0, taken: 0, missed: 0, total: 0 };

      const processedDosages = dosages.filter(
        (d) => isDosageTaken(d.status) || isDosageMissed(d.status)
      );

      if (processedDosages.length === 0)
        return { percentage: 0, taken: 0, missed: 0, total: 0 };

      const takenDosages = processedDosages.filter((d) =>
        isDosageTaken(d.status)
      );
      const percentage = Math.round(
        (takenDosages.length / processedDosages.length) * 100
      );

      return {
        percentage,
        taken: takenDosages.length,
        missed: processedDosages.length - takenDosages.length,
        total: processedDosages.length,
      };
    },
    []
  );

  const getNextDoses = useCallback((dosages: DosageItem[]): DosageItem[] => {
    return dosages
      .filter((dosage) => isDosagePending(dosage.status))
      .sort((a, b) => {
        const timeA = new Date(a.scheduledAt || a.expectedTimeDate || "");
        const timeB = new Date(b.scheduledAt || b.expectedTimeDate || "");
        return timeA.getTime() - timeB.getTime();
      })
      .slice(0, 3);
  }, []);

  const canTakeNextDoseCheck = useCallback((dosages: DosageItem[]): boolean => {
    if (!dosages.length) return false;
    const nextDose = dosages.find((dosage) => isDosagePending(dosage.status));
    if (!nextDose) return false;

    const scheduledTime = new Date(
      nextDose.scheduledAt || nextDose.expectedTimeDate || ""
    );
    return new Date() >= scheduledTime;
  }, []);

  const loadMedicineDetails = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const [medicineData, dosagesData] = await Promise.all([
        MedicineService.getById(token, medicineId),
        getMedicineDosages(),
      ]);

      setMedicine({
        ...medicineData,
        _adherence: calculateAdherence(dosagesData),
        _nextDoses: getNextDoses(dosagesData),
        _canTakeNextDose: canTakeNextDoseCheck(dosagesData),
      });
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os detalhes do medicamento"
      );
    } finally {
      setLoading(false);
    }
  }, [
    token,
    medicineId,
    getMedicineDosages,
    calculateAdherence,
    getNextDoses,
    canTakeNextDoseCheck,
  ]);

  const handleRegisterDose = useCallback(async () => {
    if (!token || !medicine) return;

    const nextDose = await getNextPendingDose();
    if (!nextDose) {
      Alert.alert("Aviso", "Não há doses pendentes para registrar");
      return;
    }

    const scheduledTime = new Date(
      nextDose.scheduledAt || nextDose.expectedTimeDate || ""
    );
    if (new Date() < scheduledTime) {
      showTimeWaitAlert(scheduledTime);
      return;
    }

    try {
      setRegisteringDose(true);
      await DosageService.registerDoseTaken(token, nextDose.id);
      await loadMedicineDetails();
      Alert.alert("Sucesso", "Dose registrada com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar dose:", error);
      Alert.alert("Erro", "Não foi possível registrar a dose");
    } finally {
      setRegisteringDose(false);
    }
  }, [
    token,
    medicine,
    getNextPendingDose,
    showTimeWaitAlert,
    loadMedicineDetails,
  ]);

  const handleForgotDose = useCallback(async () => {
    if (!token || !medicine) return;

    const nextDose = await getNextPendingDose();
    if (!nextDose) {
      Alert.alert("Aviso", "Não há doses pendentes para marcar como esquecida");
      return;
    }

    Alert.alert(
      "Esqueceu de tomar?",
      "Tem certeza que deseja marcar esta dose como esquecida?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: async () => {
            try {
              setRegisteringDose(true);
              await DosageService.markDoseMissed(token, nextDose.id);
              await loadMedicineDetails();
              Alert.alert("Sucesso", "Dose marcada como esquecida!");
            } catch (error) {
              console.error("Erro ao marcar dose como esquecida:", error);
              Alert.alert(
                "Erro",
                "Não foi possível marcar a dose como esquecida"
              );
            } finally {
              setRegisteringDose(false);
            }
          },
        },
      ]
    );
  }, [token, medicine, getNextPendingDose, loadMedicineDetails]);

  const handleToggleActive = useCallback(async () => {
    if (!token || !medicine) return;

    try {
      await MedicineService.update(token, medicine.id, {
        active: !medicine.active,
      });

      if (!medicine.active) {
        try {
          await MedicineService.regenerateDosages(token, medicine.id);
        } catch (dosageError) {
          console.error("Erro ao regenerar doses:", dosageError);
        }
      }

      await loadMedicineDetails();
      Alert.alert(
        "Sucesso",
        `Medicamento ${medicine.active ? "desativado" : "ativado"} com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao alterar status do medicamento:", error);
      Alert.alert("Erro", "Não foi possível alterar o status do medicamento");
    }
  }, [token, medicine, loadMedicineDetails]);

  const handleDelete = useCallback(async () => {
    if (!token || !medicine) return;

    try {
      await DosageService.deleteByMedicine(token, medicine.id);
      await MedicineService.remove(token, medicine.id);
      Alert.alert("Sucesso", "Medicamento e histórico excluídos com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("Erro", "Não foi possível excluir o medicamento");
      return false;
    }
  }, [token, medicine]);

  useEffect(() => {
    loadMedicineDetails();
  }, [loadMedicineDetails]);

  return {
    medicine,
    loading,
    registeringDose,
    adherence: medicine?._adherence || {
      percentage: 0,
      taken: 0,
      missed: 0,
      total: 0,
    },
    nextDoses: medicine?._nextDoses || [],
    canTakeNextDose: medicine?._canTakeNextDose || false,
    handleRegisterDose,
    handleForgotDose,
    handleToggleActive,
    handleDelete,
  };
};
