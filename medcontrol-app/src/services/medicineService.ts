import { API_CONFIG, buildApiUrl } from "../config/api";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiUtils";
import {
  Medicine,
  CreateMedicineRequest,
  UpdateMedicineRequest,
} from "../types";

class MedicineService {
  static async list(token: string): Promise<Medicine[]> {
    return apiGet<Medicine[]>(
      buildApiUrl(API_CONFIG.ENDPOINTS.MEDICINES.ROOT),
      token,
      "Erro ao buscar medicamentos"
    );
  }

  static async getById(token: string, id: number): Promise<Medicine> {
    return apiGet<Medicine>(
      buildApiUrl(API_CONFIG.ENDPOINTS.MEDICINES.BY_ID(id)),
      token,
      "Erro ao buscar medicamento"
    );
  }

  static async create(
    token: string,
    payload: CreateMedicineRequest
  ): Promise<Medicine> {
    return apiPost<Medicine>(
      buildApiUrl(API_CONFIG.ENDPOINTS.MEDICINES.ROOT),
      token,
      payload,
      "Erro ao criar medicamento"
    );
  }

  static async update(
    token: string,
    id: number,
    payload: UpdateMedicineRequest
  ): Promise<Medicine> {
    return apiPut<Medicine>(
      buildApiUrl(API_CONFIG.ENDPOINTS.MEDICINES.BY_ID(id)),
      token,
      payload,
      "Erro ao atualizar medicamento"
    );
  }

  static async remove(token: string, id: number): Promise<Medicine> {
    return apiDelete<Medicine>(
      buildApiUrl(API_CONFIG.ENDPOINTS.MEDICINES.BY_ID(id)),
      token,
      "Erro ao excluir medicamento"
    );
  }

  static async regenerateDosages(
    token: string,
    id: number
  ): Promise<{ message: string }> {
    return apiPost<{ message: string }>(
      buildApiUrl(API_CONFIG.ENDPOINTS.MEDICINES.REGENERATE_DOSAGES(id)),
      token,
      {},
      "Erro ao regenerar doses"
    );
  }
}

export { MedicineService };
