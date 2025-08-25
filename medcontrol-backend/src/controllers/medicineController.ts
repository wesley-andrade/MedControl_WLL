import { Request, Response, NextFunction } from "express";
import medicineService from "../services/medicineService";
import { ApiError } from "../middlewares/errorMiddleware";
import { validateId } from "../utils/validationUtils";
import { successResponse } from "../utils/responseUtils";
import { DosageGeneratorService } from "../services/dosageGeneratorService";

const getAllMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const medicines = await medicineService.getAllMedicinesByUser(userId);
    res.json(successResponse(medicines, "Medicamentos encontrados"));
  } catch (error) {
    next(ApiError.internalError("Erro ao buscar medicamentos"));
  }
};

const getMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const id = validateId(req.params.id);

    const medicine = await medicineService.getMedicineById(userId, id);

    if (!medicine) {
      throw ApiError.notFound(
        "Medicamento não encontrado",
        "MEDICINE_NOT_FOUND"
      );
    }

    res.json(successResponse(medicine, "Medicamento encontrado"));
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao buscar medicamento")
    );
  }
};

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const medicine = await medicineService.createMedicine(userId, req.body);
    res
      .status(201)
      .json(successResponse(medicine, "Medicamento criado com sucesso"));
  } catch (error: any) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao criar medicamento")
    );
  }
};

const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const id = validateId(req.params.id);

    const updated = await medicineService.updateMedicine(userId, id, req.body);
    res.json(successResponse(updated, "Medicamento atualizado com sucesso"));
  } catch (error: any) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao atualizar medicamento")
    );
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const id = validateId(req.params.id);

    const deleted = await medicineService.deleteMedicine(userId, id);
    res.json(successResponse(deleted, "Medicamento excluído com sucesso"));
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao excluir medicamento")
    );
  }
};

const regenerateDosages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const id = validateId(req.params.id);
    const { daysAhead = 7 } = req.body;

    const medicine = await medicineService.getMedicineById(userId, id);
    if (!medicine) {
      throw ApiError.notFound(
        "Medicamento não encontrado",
        "MEDICINE_NOT_FOUND"
      );
    }

    const dosagesCount = await DosageGeneratorService.generateNextDosages(
      id,
      daysAhead
    );

    res.json(
      successResponse(
        { dosagesCount, daysAhead },
        `Regeneradas ${dosagesCount} dosagens para os próximos ${daysAhead} dias`
      )
    );
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.internalError("Erro ao regenerar dosagens")
    );
  }
};

export default {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  regenerateDosages,
};
