export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface LoginUser {
  id: string;
  email: string;
}

export interface Medicine {
  id: number;
  userId: number;
  name: string;
  dosage: string;
  frequencyHours: number;
  fixedSchedules?: string | null;
  dateStart: string;
  dateEnd?: string | null;
  observations?: string | null;
  active: boolean;
}

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

export interface Dosage {
  id: number;
  medicineId: number;
  scheduledAt: string;
  takenAt?: string | null;
  status: "pending" | "taken" | "missed" | "late";
}
