import { z } from "zod";

export const createMedicineSchema = z
  .object({
    name: z.string().min(1, "Nome do medicamento é obrigatório"),
    dosage: z.string().min(1, "Dosagem é obrigatória"),
    frequencyHours: z
      .number()
      .int("Frequência deve ser um inteiro")
      .positive("Frequência deve ser um número positivo"),
    fixedSchedules: z
      .string()
      .regex(
        /^(?:[01]\d|2[0-3]):[0-5]\d(?:\s*,\s*(?:[01]\d|2[0-3]):[0-5]\d)*$/,
        "Horários devem estar no formato HH:mm separados por vírgula"
      )
      .optional(),
    dateStart: z.string().datetime("Data de início deve ser uma data válida"),
    dateEnd: z
      .string()
      .datetime("Data de fim deve ser uma data válida")
      .optional(),
    observations: z.string().optional(),
    active: z.boolean().default(true),
  })
  .refine(
    (data) =>
      !data.dateEnd || new Date(data.dateEnd) >= new Date(data.dateStart),
    {
      message: "Data de fim deve ser igual ou posterior à data de início",
      path: ["dateEnd"],
    }
  );

export const updateMedicineSchema = z
  .object({
    name: z.string().min(1, "Nome do medicamento é obrigatório").optional(),
    dosage: z.string().min(1, "Dosagem é obrigatória").optional(),
    frequencyHours: z
      .number()
      .int("Frequência deve ser um inteiro")
      .positive("Frequência deve ser um número positivo")
      .optional(),
    fixedSchedules: z
      .string()
      .regex(
        /^(?:[01]\d|2[0-3]):[0-5]\d(?:\s*,\s*(?:[01]\d|2[0-3]):[0-5]\d)*$/,
        "Horários devem estar no formato HH:mm separados por vírgula"
      )
      .optional(),
    dateStart: z
      .string()
      .datetime("Data de início deve ser uma data válida")
      .optional(),
    dateEnd: z
      .string()
      .datetime("Data de fim deve ser uma data válida")
      .optional(),
    observations: z.string().optional(),
    active: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.dateStart && data.dateEnd) {
        return new Date(data.dateEnd) >= new Date(data.dateStart);
      }
      return true;
    },
    {
      message: "Data de fim deve ser igual ou posterior à data de início",
      path: ["dateEnd"],
    }
  );

export const medicineIdSchema = z.object({
  id: z.string().transform((val) => {
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error("ID deve ser um número válido");
    }
    return num;
  }),
});

export const regenerateDosagesSchema = z.object({
  daysAhead: z
    .number()
    .min(1, "Dias deve ser pelo menos 1")
    .max(365, "Dias não pode ser mais que 365")
    .default(7),
});
