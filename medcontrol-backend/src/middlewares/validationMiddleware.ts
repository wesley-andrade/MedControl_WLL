import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "./errorMiddleware";

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      const details = (error as any)?.errors ?? undefined;
      next(ApiError.validationError("Dados inválidos", details));
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      next(ApiError.badRequest("Parâmetros inválidos", "INVALID_PARAMS"));
    }
  };
};
