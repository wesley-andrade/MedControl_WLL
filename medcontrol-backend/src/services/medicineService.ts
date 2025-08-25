import { ApiError } from "../middlewares/errorMiddleware";
import { DosageGeneratorService } from "./dosageGeneratorService";
import { CreateMedicineRequest } from "../types/medicine";
import { medicineModel } from "../models/medicineModel";

const getAllMedicinesByUser = async (userId: number) => {
  return medicineModel.findManyByUser(userId);
};

const getMedicineById = async (userId: number, id: number) => {
  return medicineModel.findById(userId, id);
};

const createMedicine = async (userId: number, data: CreateMedicineRequest) => {
  const existing = await medicineModel.findByName(userId, data.name);
  if (existing) {
    throw ApiError.conflict(
      "Já existe um medicamento com este nome",
      "MEDICINE_NAME_DUPLICATE"
    );
  }

  let medicine;
  try {
    medicine = await medicineModel.create(userId, data);
  } catch (err: any) {
    if (err?.code === "P2002") {
      throw ApiError.conflict(
        "Já existe um medicamento com este nome",
        "MEDICINE_NAME_DUPLICATE"
      );
    }
    throw err;
  }
  try {
    await DosageGeneratorService.generateDosagesForMedicine(
      medicine.id,
      data.frequencyHours!,
      new Date(data.dateStart),
      data.dateEnd ? new Date(data.dateEnd) : undefined,
      data.fixedSchedules
    );
  } catch (error) {
    console.error(`Erro ao gerar dosagens para ${medicine.name}:`, error);
  }

  return medicine;
};

const updateMedicine = async (
  userId: number,
  id: number,
  updates: Partial<{
    name: string;
    dosage: string;
    frequencyHours: number;
    fixedSchedules?: string;
    dateStart: string;
    dateEnd?: string;
    observations?: string;
    active: boolean;
  }>
) => {
  const medicine = await medicineModel.findById(userId, id);

  if (!medicine) {
    throw ApiError.notFound("Medicamento não encontrado", "MEDICINE_NOT_FOUND");
  }

  const updatedMedicine = await medicineModel.update(userId, id, updates);
  if (!updatedMedicine) {
    throw ApiError.notFound("Medicamento não encontrado", "MEDICINE_NOT_FOUND");
  }

  const shouldRegenerateDosages =
    updates.frequencyHours !== undefined ||
    updates.fixedSchedules !== undefined ||
    updates.dateStart !== undefined ||
    updates.dateEnd !== undefined ||
    (updates.active === true && !medicine.active);

  if (shouldRegenerateDosages) {
    try {
      const fromDate =
        updates.dateStart !== undefined ? new Date(0) : undefined;

      await DosageGeneratorService.updateDosagesForMedicine(
        id,
        updates.frequencyHours,
        updates.dateStart ? new Date(updates.dateStart) : medicine.dateStart,
        updates.dateEnd
          ? new Date(updates.dateEnd)
          : medicine.dateEnd || undefined,
        updates.fixedSchedules,
        fromDate
      );
    } catch (error) {
      console.error(
        `Erro ao atualizar dosagens para ${updatedMedicine.name}:`,
        error
      );
    }
  }

  return updatedMedicine;
};

const deleteMedicine = async (userId: number, id: number) => {
  const result = await medicineModel.remove(userId, id);
  if (!result.deleted) {
    if (result.reason === "NOT_FOUND") {
      throw ApiError.notFound(
        "Medicamento não encontrado",
        "MEDICINE_NOT_FOUND"
      );
    }
    if (result.reason === "HAS_DOSAGES") {
      throw ApiError.conflict(
        "Não é possível excluir: existem dosagens associadas",
        "MEDICINE_HAS_DOSAGES"
      );
    }
  }
  return { success: true };
};

export default {
  getAllMedicinesByUser,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
