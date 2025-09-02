export const API_CONFIG = {
  BASE_URL:
    process.env.NODE_ENV === "development" || (global as any).__DEV__
      ? "http://10.0.2.2:3000"
      : "http://localhost:3000",

  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
    },
    MEDICINES: {
      ROOT: "/api/medicines",
      BY_ID: (id: number | string) => `/api/medicines/${id}`,
      REGENERATE_DOSAGES: (id: number | string) =>
        `/api/medicines/${id}/regenerate-dosages`,
    },
    DOSAGES: {
      ROOT: "/api/dosages",
      BY_ID: (id: number | string) => `/api/dosages/${id}`,
      MARK_TAKEN: (id: number | string) => `/api/dosages/${id}/taken`,
      MARK_MISSED: (id: number | string) => `/api/dosages/${id}/missed`,
      BY_MEDICINE: (medicineId: number | string) =>
        `/api/dosages/medicine/${medicineId}`,
    },
  },

  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = { ...API_CONFIG.DEFAULT_HEADERS };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};
