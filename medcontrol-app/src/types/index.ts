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

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
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

export interface DosageItem {
  id: number;
  medicineId: number;
  scheduledAt?: string;
  expectedTimeDate?: string;
  takenAt?: string | null;
  status: "pending" | "taken" | "missed" | "late";
}

export interface NotificationData {
  dosageId: number;
  medicineId: number;
  medicineName: string;
  dosage: string;
  expectedTime: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export type StatusVariant = "active" | "low" | "inactive" | "custom";

export type FilterType = "all" | "onTime" | "delayed" | "missed";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Medicine: { medicineId: number };
  Form: { medicineId?: number };
};

export interface AdherenceData {
  percentage: number;
  taken: number;
  missed: number;
  total: number;
}

export interface MedicineWithCalculatedData extends Medicine {
  _adherence?: AdherenceData;
  _nextDoses?: DosageItem[];
  _canTakeNextDose?: boolean;
}
