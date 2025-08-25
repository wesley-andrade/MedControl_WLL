import prisma from "../database/prisma";
import { ApiError } from "../middlewares/errorMiddleware";

interface DosageSchedule {
  expectedTimeDate: Date;
  status: "pending";
}

export class DosageGeneratorService {
  private static createUTCDate(date: Date | string): Date {
    const d = new Date(date);
    return new Date(
      Date.UTC(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours(),
        d.getUTCMinutes(),
        d.getUTCSeconds(),
        d.getUTCMilliseconds()
      )
    );
  }

  private static getCurrentUTC(): Date {
    const now = new Date();
    return new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
      )
    );
  }

  static async generateDosagesForMedicine(
    medicineId: number,
    frequencyHours: number,
    dateStart: Date,
    dateEnd?: Date,
    fixedSchedules?: string
  ): Promise<number> {
    try {
      if (fixedSchedules) {
        return await this.generateFixedScheduleDosages(
          medicineId,
          dateStart,
          dateEnd,
          fixedSchedules
        );
      }

      if (frequencyHours > 0) {
        return await this.generateFrequencyBasedDosages(
          medicineId,
          frequencyHours,
          dateStart,
          dateEnd
        );
      }

      throw ApiError.badRequest(
        "Medicamento deve ter frequência em horas ou horários fixos",
        "INVALID_FREQUENCY"
      );
    } catch (error) {
      throw error;
    }
  }

  private static async generateFrequencyBasedDosages(
    medicineId: number,
    frequencyHours: number,
    dateStart: Date,
    dateEnd?: Date
  ): Promise<number> {
    const dosages: DosageSchedule[] = [];

    const startDate = this.createUTCDate(dateStart);
    const endDate = dateEnd
      ? this.createUTCDate(dateEnd)
      : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const now = this.getCurrentUTC();
    let currentDate = new Date(startDate);

    const MAX_DOSAGES = 5000;
    let generated = 0;

    while (currentDate <= endDate && generated < MAX_DOSAGES) {
      if (generated === 0 || currentDate >= now) {
        dosages.push({
          expectedTimeDate: new Date(currentDate),
          status: "pending",
        });
        generated++;
      }

      currentDate = new Date(
        currentDate.getTime() + frequencyHours * 60 * 60 * 1000
      );
    }

    const createdDosages = await prisma.dosage.createMany({
      data: dosages.map((dosage) => ({
        medicineId,
        expectedTimeDate: dosage.expectedTimeDate,
        status: dosage.status,
      })),
    });

    return createdDosages.count;
  }

  private static async generateFixedScheduleDosages(
    medicineId: number,
    dateStart: Date,
    dateEnd?: Date,
    fixedSchedules?: string
  ): Promise<number> {
    if (!fixedSchedules) return 0;

    const timeSlots = fixedSchedules.split(",").map((time) => time.trim());
    const dosages: DosageSchedule[] = [];

    const startDate = this.createUTCDate(dateStart);
    const endDate = dateEnd
      ? this.createUTCDate(dateEnd)
      : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    let currentDate = new Date(startDate);
    const now = this.getCurrentUTC();
    const MAX_DOSAGES = 5000;
    let generated = 0;

    while (currentDate <= endDate && generated < MAX_DOSAGES) {
      for (const timeSlot of timeSlots) {
        const [hours, minutes] = timeSlot.split(":").map(Number);

        if (hours !== undefined && minutes !== undefined) {
          const dosageDate = new Date(
            Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              currentDate.getUTCDate(),
              hours,
              minutes,
              0,
              0
            )
          );

          if (generated === 0 || dosageDate >= now) {
            dosages.push({
              expectedTimeDate: dosageDate,
              status: "pending",
            });
            generated++;
          }
        }
      }

      currentDate = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate() + 1,
          0,
          0,
          0,
          0
        )
      );
    }

    if (dosages.length > 0) {
      const createdDosages = await prisma.dosage.createMany({
        data: dosages.map((dosage) => ({
          medicineId,
          expectedTimeDate: dosage.expectedTimeDate,
          status: dosage.status,
        })),
      });

      return createdDosages.count;
    }

    return 0;
  }

  static async updateDosagesForMedicine(
    medicineId: number,
    frequencyHours?: number,
    dateStart?: Date,
    dateEnd?: Date,
    fixedSchedules?: string,
    fromDate?: Date
  ): Promise<number> {
    try {
      const deletionCutoff = fromDate
        ? this.createUTCDate(fromDate)
        : this.getCurrentUTC();

      await prisma.dosage.deleteMany({
        where: {
          medicineId,
          status: "pending",
          expectedTimeDate: {
            gte: deletionCutoff,
          },
        },
      });

      if (frequencyHours || fixedSchedules) {
        const startDate = dateStart || deletionCutoff;
        return await this.generateDosagesForMedicine(
          medicineId,
          frequencyHours || 0,
          startDate,
          dateEnd,
          fixedSchedules
        );
      }

      return 0;
    } catch (error) {
      throw error;
    }
  }

  static async generateNextDosages(
    medicineId: number,
    daysAhead: number = 7
  ): Promise<number> {
    try {
      const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId },
      });

      if (!medicine) {
        throw ApiError.notFound("Medicamento não encontrado");
      }

      const startDate = this.getCurrentUTC();
      const endDate = new Date(
        startDate.getTime() + daysAhead * 24 * 60 * 60 * 1000
      );

      return await this.generateDosagesForMedicine(
        medicineId,
        medicine.frequencyHours,
        startDate,
        endDate,
        medicine.fixedSchedules || undefined
      );
    } catch (error) {
      throw error;
    }
  }
}
