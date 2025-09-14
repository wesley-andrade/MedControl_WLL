import prisma from "../database/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../middlewares/errorMiddleware";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado");
}

const register = async (data: { email: string; password: string }) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw ApiError.conflict("E-mail já cadastrado", "EMAIL_TAKEN");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    email: user.email,
  };
};

const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password)
    throw ApiError.unauthorized("Credenciais inválidas");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw ApiError.unauthorized("Credenciais inválidas");

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    token,
    user: { id: user.id, email: user.email },
  };
};

export default { register, login };
