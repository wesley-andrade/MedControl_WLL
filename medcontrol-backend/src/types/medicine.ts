export interface CreateMedicineRequest {
  name: string;
  dosage: string;
  frequencyHours: number;
  fixedSchedules?: string;
  dateStart: string;
  dateEnd?: string;
  observations?: string;
  active?: boolean;
}

export type UpdateMedicineRequest = Partial<CreateMedicineRequest>;

export interface MedicineResponse {
  id: number;
  userId: number;
  name: string;
  dosage: string;
  frequencyHours: number;
  fixedSchedules?: string | null;
  dateStart: Date;
  dateEnd?: Date | null;
  observations?: string | null;
  active: boolean;
}
