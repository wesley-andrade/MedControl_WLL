import { ApiError } from "../middlewares/errorMiddleware";

export const validateId = (id: string): number => {
  const numId = Number(id);
  if (isNaN(numId)) {
    throw ApiError.badRequest("ID inválido", "INVALID_ID");
  }
  return numId;
};
