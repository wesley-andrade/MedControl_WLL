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
