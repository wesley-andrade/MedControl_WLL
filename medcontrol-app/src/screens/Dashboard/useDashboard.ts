import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Medicine } from "../../types";
import { MedicineService } from "../../services/medicineService";
import { DosageService, DosageItem } from "../../services/dosageService";
import { isDosagePending } from "../../utils/dateUtils";

export const useDashboard = () => {
  const { token } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [dosages, setDosages] = useState<DosageItem[]>([]);
  const [search, setSearch] = useState("");
  const [showFinished, setShowFinished] = useState(false);

  const fetchMedicines = useCallback(async () => {
    if (!token) return;
    try {
      const list = await MedicineService.list(token);
      setMedicines(list);
      const d = await DosageService.list(token);
      setDosages(d);
    } catch (err: any) {
      console.error("Erro ao buscar medicamentos:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const totalActive = useMemo(
    () => medicines.filter((m) => m.active).length,
    [medicines]
  );

  const nextDoseByMedicine = useMemo(() => {
    const map = new Map<number, string | null>();

    for (const med of medicines) {
      const next = dosages
        .map((d) => ({
          ...d,
          normalizedAt: new Date(d.expectedTimeDate || d.scheduledAt || ""),
        }))
        .filter((d) => {
          const isPending = isDosagePending(d.status);
          const isSameMedicine = d.medicineId === med.id;

          return isSameMedicine && isPending;
        })
        .sort((a, b) => a.normalizedAt.getTime() - b.normalizedAt.getTime())[0];

      map.set(
        med.id,
        next ? next.expectedTimeDate || next.scheduledAt || null : null
      );
    }
    return map;
  }, [medicines, dosages]);

  const filteredMedicines = useMemo(() => {
    const q = search.trim().toLowerCase();
    let filtered = medicines.filter((m) => m.active);

    if (q) {
      filtered = filtered.filter((m) => m.name.toLowerCase().includes(q));
    }

    return filtered.sort((a, b) => {
      const nextDoseA = nextDoseByMedicine.get(a.id);
      const nextDoseB = nextDoseByMedicine.get(b.id);

      if (nextDoseA && nextDoseB) {
        return new Date(nextDoseA).getTime() - new Date(nextDoseB).getTime();
      }

      return 0;
    });
  }, [medicines, search, nextDoseByMedicine]);

  const filteredMedicinesFinished = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return medicines.filter((m) => !m.active);
    return medicines.filter(
      (m) => !m.active && m.name.toLowerCase().includes(q)
    );
  }, [medicines, search]);

  return {
    filteredMedicines,
    filteredMedicinesFinished,
    totalActive,
    nextDoseByMedicine,
    fetchMedicines,
    search,
    setSearch,
    showFinished,
    setShowFinished,
  };
};
