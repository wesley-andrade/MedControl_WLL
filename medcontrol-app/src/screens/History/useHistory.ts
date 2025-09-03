import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { DosageService, DosageItem } from "../../services/dosageService";
import { Medicine } from "../../types";

export type FilterType = "all" | "onTime" | "delayed" | "missed";

interface UseHistoryReturn {
  dosages: DosageItem[];
  medicines: Medicine[];
  selectedFilter: FilterType;
  isLoading: boolean;
  error: string | null;
  handleFilterChange: (filter: FilterType) => void;
  refreshData: () => void;
}

export const useHistory = (): UseHistoryReturn => {
  const { token } = useAuth();
  const [dosages, setDosages] = useState<DosageItem[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      const dosagesData = await DosageService.list(token);

      const medicinesFromDosages = dosagesData
        .map((dosage) => (dosage as any).drug)
        .filter(
          (medicine, index, arr) =>
            medicine && arr.findIndex((m) => m?.id === medicine.id) === index
        );

      setDosages(dosagesData);
      setMedicines(medicinesFromDosages);
    } catch (err) {
      setError("Erro ao carregar dados do histórico");
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const handleFilterChange = useCallback((filter: FilterType) => {
    setSelectedFilter(filter);
  }, []);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();

      const interval = setInterval(() => {
        loadData();
      }, 30000);

      return () => clearInterval(interval);
    }, [loadData])
  );

  const filteredDosages = dosages
    .filter((dosage) => {
      switch (selectedFilter) {
        case "onTime":
          return dosage.status === "taken";
        case "delayed":
          return dosage.status === "late";
        case "missed":
          return dosage.status === "missed";
        default:
          return (
            dosage.status === "taken" ||
            dosage.status === "late" ||
            dosage.status === "missed"
          );
      }
    })
    .sort((a, b) => {
      const dateA = a.takenAt
        ? new Date(a.takenAt)
        : new Date(a.expectedTimeDate || "");
      const dateB = b.takenAt
        ? new Date(b.takenAt)
        : new Date(b.expectedTimeDate || "");

      return dateB.getTime() - dateA.getTime();
    });

  return {
    dosages: filteredDosages,
    medicines,
    selectedFilter,
    isLoading,
    error,
    handleFilterChange,
    refreshData,
  };
};
