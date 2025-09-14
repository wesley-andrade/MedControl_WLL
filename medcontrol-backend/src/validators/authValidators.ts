import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email deve ser válido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Email deve ser válido"),
  password: z.string().min(1, "Senha é obrigatória"),
});
