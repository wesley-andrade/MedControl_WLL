import { API_CONFIG, buildApiUrl } from "../config/api";
import { apiGet, apiPut, apiDelete } from "../utils/apiUtils";

export interface DosageItem {
  id: number;
  medicineId: number;
  scheduledAt?: string;
  expectedTimeDate?: string;
  takenAt?: string | null;
  status: "pending" | "taken" | "missed" | "late";
}

class DosageService {
  static async list(token: string): Promise<DosageItem[]> {
    return apiGet<DosageItem[]>(
      buildApiUrl(API_CONFIG.ENDPOINTS.DOSAGES.ROOT),
      token,
      "Erro ao buscar dosagens"
    );
  }

  static async registerDoseTaken(
    token: string,
    dosageId: number
  ): Promise<DosageItem> {
    return apiPut<DosageItem>(
      buildApiUrl(API_CONFIG.ENDPOINTS.DOSAGES.MARK_TAKEN(dosageId)),
      token,
      {},
      "Erro ao registrar dose"
    );
  }

  static async markDoseMissed(
    token: string,
    dosageId: number
  ): Promise<DosageItem> {
    return apiPut<DosageItem>(
      buildApiUrl(API_CONFIG.ENDPOINTS.DOSAGES.MARK_MISSED(dosageId)),
      token,
      {},
      "Erro ao marcar dose como esquecida"
    );
  }

  static async deleteByMedicine(
    token: string,
    medicineId: number
  ): Promise<{ message: string }> {
    return apiDelete<{ message: string }>(
      buildApiUrl(API_CONFIG.ENDPOINTS.DOSAGES.BY_MEDICINE(medicineId)),
      token,
      "Erro ao excluir doses do medicamento"
    );
  }
}

export { DosageService };
