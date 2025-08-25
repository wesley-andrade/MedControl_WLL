import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export class ApiError extends Error implements AppError {
  statusCode: number;
  code: string;
  details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(
    message: string,
    code: string = "BAD_REQUEST",
    details?: any
  ) {
    return new ApiError(message, 400, code, details);
  }

  static unauthorized(
    message: string = "Não autorizado",
    code: string = "UNAUTHORIZED",
    details?: any
  ) {
    return new ApiError(message, 401, code, details);
  }

  static forbidden(
    message: string = "Acesso negado",
    code: string = "FORBIDDEN",
    details?: any
  ) {
    return new ApiError(message, 403, code, details);
  }

  static notFound(
    message: string = "Recurso não encontrado",
    code: string = "NOT_FOUND",
    details?: any
  ) {
    return new ApiError(message, 404, code, details);
  }

  static conflict(message: string, code: string = "CONFLICT", details?: any) {
    return new ApiError(message, 409, code, details);
  }

  static validationError(message: string = "Erro de validação", details?: any) {
    return new ApiError(message, 422, "VALIDATION_ERROR", details);
  }

  static internalError(
    message: string = "Erro interno no servidor",
    details?: any
  ) {
    return new ApiError(message, 500, "INTERNAL_ERROR", details);
  }
}

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  let statusCode = 500;
  let errorResponse: any = {
    success: false,
    message: "Erro interno no servidor",
    code: "INTERNAL_ERROR",
  };

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    errorResponse = {
      success: false,
      message: err.message,
      code: err.code,
    };

    if (err.details) {
      errorResponse.details = err.details;
    }
  } else if (err.code && err.code.startsWith("P")) {
    statusCode = 400;
    errorResponse = {
      success: false,
      message: "Erro de banco de dados",
      code: "DATABASE_ERROR",
      ...(process.env.NODE_ENV === "development"
        ? { details: { prismaCode: err.code, prismaMessage: err.message } }
        : {}),
    };
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    errorResponse = {
      success: false,
      message: "Token inválido ou expirado",
      code: "UNAUTHORIZED",
    };
  } else if (err.name === "ValidationError") {
    statusCode = 422;
    errorResponse = {
      success: false,
      message: "Erro de validação",
      code: "VALIDATION_ERROR",
      details: err.errors,
    };
  } else {
    statusCode = err.statusCode || 500;
    errorResponse.message = err.message || "Erro interno no servidor";
  }

  return res.status(statusCode).json(errorResponse);
};
