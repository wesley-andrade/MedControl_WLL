import { ApiError } from "../middlewares/errorMiddleware";
import { DosageGeneratorService } from "./dosageGeneratorService";
import { CreateMedicineRequest } from "../types/medicine";
import { medicineModel } from "../models/medicineModel";
import dosageService from "./dosageService";

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
      let fromDate: Date | undefined;

      if (updates.active === true && !medicine.active) {
        fromDate = medicine.dateStart;
      }

      const effectiveFrequencyHours =
        updates.frequencyHours !== undefined
          ? updates.frequencyHours
          : medicine.frequencyHours;

      const effectiveFixedSchedules =
        updates.fixedSchedules !== undefined
          ? updates.fixedSchedules
          : medicine.fixedSchedules || undefined;

      const effectiveDateStart = updates.dateStart
        ? new Date(updates.dateStart)
        : medicine.dateStart;

      const effectiveDateEnd = updates.dateEnd
        ? new Date(updates.dateEnd)
        : medicine.dateEnd || undefined;

      await DosageGeneratorService.updateDosagesForMedicine(
        id,
        effectiveFrequencyHours,
        effectiveDateStart,
        effectiveDateEnd,
        effectiveFixedSchedules,
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
  try {
    await dosageService.deleteByMedicine(id, userId);
  } catch (error) {
    console.error(`Erro ao deletar dosagens do medicamento ${id}:`, error);
  }

  const result = await medicineModel.remove(userId, id);
  if (!result.deleted) {
    if (result.reason === "NOT_FOUND") {
      throw ApiError.notFound(
        "Medicamento não encontrado",
        "MEDICINE_NOT_FOUND"
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
