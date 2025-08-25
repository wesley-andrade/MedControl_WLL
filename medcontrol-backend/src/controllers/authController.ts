import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import { successResponse } from "../utils/responseUtils";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register({ email, password });
    return res
      .status(201)
      .json(successResponse(user, "Usuário registrado com sucesso"));
  } catch (err: any) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.json(successResponse(result, "Login realizado com sucesso"));
  } catch (err: any) {
    next(err);
  }
};

export default { register, login };
