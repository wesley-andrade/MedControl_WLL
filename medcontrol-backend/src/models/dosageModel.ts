import prisma from "../database/prisma";

export const dosageModel = {
  findManyByUser: async (userId: number) => {
    return prisma.dosage.findMany({
      include: { drug: true },
      where: {
        drug: { userId },
      },
      orderBy: { expectedTimeDate: "asc" },
    });
  },

  findByIdForUser: async (id: number, userId: number) => {
    return prisma.dosage.findFirst({
      where: { id, drug: { userId } },
      include: { drug: true },
    });
  },

  findByMedicineAroundTime: async (
    userId: number,
    medicineId: number,
    start: Date,
    end: Date
  ) => {
    return prisma.dosage.findFirst({
      where: {
        medicineId,
        expectedTimeDate: { gte: start, lte: end },
        drug: { userId },
      },
    });
  },

  create: async (
    userId: number,
    data: { medicineId: number; expectedTimeDate: Date; status: string }
  ) => {
    const medicine = await prisma.medicine.findFirst({
      where: { id: data.medicineId, userId },
    });
    if (!medicine) return null;

    return prisma.dosage.create({
      data: {
        medicineId: data.medicineId,
        expectedTimeDate: data.expectedTimeDate,
        status: data.status,
      },
    });
  },
};

export default dosageModel;
