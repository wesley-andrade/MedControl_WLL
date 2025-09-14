import { z } from "zod";

export const createDosageSchema = z.object({
  medicineId: z
    .number()
    .positive("ID do medicamento deve ser um número positivo"),
  expectedTimeDate: z
    .string()
    .datetime("Data e hora esperada devem ser válidas"),
  status: z.enum(["pending", "taken", "missed", "late"]),
});

export const dosageIdSchema = z.object({
  id: z.string().transform((val) => {
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error("ID deve ser um número válido");
    }
    return num;
  }),
});

export const medicineIdSchema = z.object({
  medicineId: z.string().transform((val) => {
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error("ID do medicamento deve ser um número válido");
    }
    return num;
  }),
});
