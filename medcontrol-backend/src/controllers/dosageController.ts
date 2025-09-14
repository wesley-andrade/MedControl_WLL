import { Request, Response, NextFunction } from "express";
import dosageService from "../services/dosageService";
import { ApiError } from "../middlewares/errorMiddleware";
import { validateId } from "../utils/validationUtils";
import { successResponse } from "../utils/responseUtils";

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

const getAllDosages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const dosages = await dosageService.getAllDosagesByUser(userId);
    res.json(successResponse(dosages, "Dosagens encontradas"));
  } catch (error: any) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao buscar dosagens")
    );
  }
};

const getDosageById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const id = validateId(req.params.id);

    const dosage = await dosageService.getDosageById(id, userId);
    if (!dosage) {
      throw ApiError.notFound("Dosagem não encontrada", "DOSAGE_NOT_FOUND");
    }

    res.json(successResponse(dosage, "Dosagem encontrada"));
  } catch (error: any) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao buscar dosagem")
    );
  }
};

const createDosage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { medicineId, expectedTimeDate, status } = req.body;

    const dosage = await dosageService.createDosage(
      medicineId,
      new Date(expectedTimeDate),
      status,
      userId
    );
    res.status(201).json(successResponse(dosage, "Dosagem criada com sucesso"));
  } catch (error: any) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao criar dosagem")
    );
  }
};

const updateDosage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const id = validateId(req.params.id);

    const dosage = await dosageService.updateDosage(id, userId, req.body);
    if (!dosage) {
      throw ApiError.notFound("Dosagem não encontrada", "DOSAGE_NOT_FOUND");
    }

    res.json(successResponse(dosage, "Dosagem atualizada com sucesso"));
  } catch (error: any) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao atualizar dosagem")
    );
  }
};

const deleteDosage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const id = validateId(req.params.id);

    const result = await dosageService.deleteDosage(id, userId);
    if (!result) {
      throw ApiError.notFound("Dosagem não encontrada", "DOSAGE_NOT_FOUND");
    }

    res.json(successResponse(result, "Dosagem excluída com sucesso"));
  } catch (error: any) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao excluir dosagem")
    );
  }
};

const registerDosageTaken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const id = validateId(req.params.id);

    const dosage = await dosageService.updateDosage(id, userId, {
      status: "taken",
      takenAt: getCurrentUTC(),
    });

    if (!dosage) {
      throw ApiError.notFound("Dosagem não encontrada", "DOSAGE_NOT_FOUND");
    }

    res.json(successResponse(dosage, "Dosagem registrada como tomada"));
  } catch (error: any) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao registrar dosagem como tomada")
    );
  }
};

const markDosageMissed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const id = validateId(req.params.id);

    const dosage = await dosageService.updateDosage(id, userId, {
      status: "missed",
    });

    if (!dosage) {
      throw ApiError.notFound("Dosagem não encontrada", "DOSAGE_NOT_FOUND");
    }

    res.json(successResponse(dosage, "Dosagem marcada como perdida"));
  } catch (error: any) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao marcar dosagem como perdida")
    );
  }
};

const deleteByMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const medicineId = validateId(req.params.medicineId);

    const result = await dosageService.deleteByMedicine(medicineId, userId);

    res.json(successResponse(result, "Dosagens excluídas com sucesso"));
  } catch (error: any) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao excluir dosagens do medicamento")
    );
  }
};

export default {
  getAllDosages,
  getDosageById,
  createDosage,
  updateDosage,
  deleteDosage,
  registerDosageTaken,
  markDosageMissed,
  deleteByMedicine,
};
