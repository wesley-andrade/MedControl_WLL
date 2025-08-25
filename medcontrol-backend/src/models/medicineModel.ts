import prisma from "../database/prisma";
import {
  CreateMedicineRequest,
  UpdateMedicineRequest,
} from "../types/medicine";

export const medicineModel = {
  findManyByUser: async (userId: number) => {
    return prisma.medicine.findMany({
      where: { userId },
      include: { dosages: true },
    });
  },

  findById: async (userId: number, id: number) => {
    return prisma.medicine.findFirst({
      where: { id, userId },
      include: { dosages: true },
    });
  },

  findByName: async (userId: number, name: string) => {
    return prisma.medicine.findFirst({
      where: { userId, name },
    });
  },

  create: async (userId: number, data: CreateMedicineRequest) => {
    return prisma.medicine.create({
      data: {
        userId,
        name: data.name,
        dosage: data.dosage,
        frequencyHours: data.frequencyHours!,
        fixedSchedules: data.fixedSchedules ?? null,
        dateStart: new Date(data.dateStart),
        dateEnd: data.dateEnd ? new Date(data.dateEnd) : null,
        observations: data.observations ?? null,
        active: data.active ?? true,
      },
    });
  },

  update: async (
    userId: number,
    id: number,
    updates: UpdateMedicineRequest
  ) => {
    const exists = await prisma.medicine.findFirst({ where: { id, userId } });
    if (!exists) return null;

    return prisma.medicine.update({
      where: { id },
      data: {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.dosage !== undefined && { dosage: updates.dosage }),
        ...(updates.frequencyHours !== undefined && {
          frequencyHours: updates.frequencyHours,
        }),
        ...(updates.fixedSchedules !== undefined && {
          fixedSchedules: updates.fixedSchedules,
        }),
        ...(updates.dateStart !== undefined && {
          dateStart: new Date(updates.dateStart),
        }),
        ...(updates.dateEnd !== undefined && {
          dateEnd: updates.dateEnd ? new Date(updates.dateEnd) : null,
        }),
        ...(updates.observations !== undefined && {
          observations: updates.observations,
        }),
        ...(updates.active !== undefined && { active: updates.active }),
      },
    });
  },

  remove: async (userId: number, id: number) => {
    const med = await prisma.medicine.findFirst({
      where: { id, userId },
      include: { dosages: { select: { id: true }, take: 1 } },
    });
    if (!med) return { deleted: false, reason: "NOT_FOUND" } as const;
    if (med.dosages.length > 0)
      return { deleted: false, reason: "HAS_DOSAGES" } as const;

    await prisma.medicine.delete({ where: { id } });
    return { deleted: true as const };
  },
};

export default medicineModel;
