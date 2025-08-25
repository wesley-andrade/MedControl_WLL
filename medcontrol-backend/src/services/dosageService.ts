import prisma from "../database/prisma";
import { ApiError } from "../middlewares/errorMiddleware";
import dosageModel from "../models/dosageModel";
import { DosageGeneratorService } from "./dosageGeneratorService";

const getCurrentUTC = (): Date => {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    )
  );
};

const getDosageStatusByDelay = (
  expectedTime: Date,
  takenTime: Date
): "taken" | "late" => {
  const lateMinutes = calculateLateMinutes(expectedTime, takenTime);
  return lateMinutes > 10 ? "late" : "taken";
};

const getAllDosagesByUser = async (userId: number) => {
  return dosageModel.findManyByUser(userId);
};

const getDosageById = async (id: number, userId: number) => {
  return dosageModel.findByIdForUser(id, userId);
};

const createDosage = async (
  medicineId: number,
  expectedTimeDate: Date,
  status: string,
  userId: number
) => {
  const medicine = await prisma.medicine.findFirst({
    where: { id: medicineId, userId },
  });

  if (!medicine) {
    throw ApiError.notFound(
      "Medicamento não encontrado para este usuário",
      "MEDICINE_NOT_FOUND"
    );
  }

  if (!medicine.active) {
    throw ApiError.badRequest(
      "Não é possível criar doses para medicamento inativo",
      "INACTIVE_MEDICINE"
    );
  }

  const startTime = new Date(expectedTimeDate);
  startTime.setMinutes(startTime.getMinutes() - 5);

  const endTime = new Date(expectedTimeDate);
  endTime.setMinutes(endTime.getMinutes() + 5);

  const existingDosage = await dosageModel.findByMedicineAroundTime(
    userId,
    medicineId,
    startTime,
    endTime
  );

  if (existingDosage) {
    throw ApiError.conflict(
      "Já existe uma dose registrada para este medicamento em horário similar",
      "DUPLICATE_DOSAGE"
    );
  }

  return dosageModel.create(userId, {
    medicineId,
    expectedTimeDate,
    status,
  });
};

const updateDosage = async (
  id: number,
  userId: number,
  updates: { takenAt?: Date; status?: string }
) => {
  const dosage = await prisma.dosage.findFirst({
    where: { id, drug: { userId } },
    include: { drug: true },
  });

  if (!dosage)
    throw ApiError.notFound("Dosagem não encontrada", "DOSAGE_NOT_FOUND");

  if (!dosage.drug.active) {
    throw ApiError.badRequest(
      "Não é possível alterar doses de medicamento inativo",
      "INACTIVE_MEDICINE"
    );
  }

  if (updates.status && dosage.status !== "pending") {
    if (dosage.status === "taken") {
      throw ApiError.badRequest(
        "Não é possível alterar o status de uma dose já registrada como tomada",
        "STATUS_CHANGE_FORBIDDEN"
      );
    } else if (dosage.status === "missed") {
      throw ApiError.badRequest(
        "Não é possível alterar o status de uma dose já registrada como perdida",
        "STATUS_CHANGE_FORBIDDEN"
      );
    } else if (dosage.status === "late") {
      throw ApiError.badRequest(
        "Não é possível alterar o status de uma dose já registrada como atrasada",
        "STATUS_CHANGE_FORBIDDEN"
      );
    }
  }

  if (updates.status === "taken" && dosage.status === "pending") {
    if (!updates.takenAt) {
      updates.takenAt = getCurrentUTC();
    }

    const lateMinutes = calculateLateMinutes(
      dosage.expectedTimeDate,
      updates.takenAt
    );

    const finalStatus = getDosageStatusByDelay(
      dosage.expectedTimeDate,
      updates.takenAt
    );

    const updatedDosage = await prisma.dosage.update({
      where: { id },
      data: {
        status: finalStatus,
        takenAt: updates.takenAt,
        lateMinutes: lateMinutes > 0 ? lateMinutes : null,
      },
    });

    if (finalStatus === "late") {
      try {
        const medicine = await prisma.medicine.findUnique({
          where: { id: dosage.medicineId },
        });
        if (medicine && !medicine.fixedSchedules) {
          const nextTime = new Date(
            updates.takenAt.getTime() + medicine.frequencyHours * 60 * 60 * 1000
          );
          await DosageGeneratorService.updateDosagesForMedicine(
            dosage.medicineId,
            medicine.frequencyHours,
            nextTime,
            medicine.dateEnd || undefined,
            undefined,
            updates.takenAt
          );
        }
      } catch (error) {
        console.error("Erro ao regenerar dosagens após atraso:", error);
      }
    }

    return updatedDosage;
  }

  return prisma.dosage.update({
    where: { id },
    data: updates,
  });
};

const calculateLateMinutes = (expectedTime: Date, takenTime: Date): number => {
  const diffMs = takenTime.getTime() - expectedTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  return diffMinutes > 0 ? diffMinutes : 0;
};

const deleteDosage = async (id: number, userId: number) => {
  const dosage = await prisma.dosage.findFirst({
    where: { id, drug: { userId } },
  });

  if (!dosage)
    throw ApiError.notFound("Dosagem não encontrada", "DOSAGE_NOT_FOUND");

  if (dosage.status === "taken" || dosage.status === "late") {
    throw ApiError.badRequest(
      "Não é possível deletar doses já tomadas",
      "DELETE_FORBIDDEN"
    );
  }

  return prisma.dosage.delete({
    where: { id },
  });
};

export default {
  getAllDosagesByUser,
  getDosageById,
  createDosage,
  updateDosage,
  deleteDosage,
};
