import { buildApiUrl, getAuthHeaders } from "../config/api";
import { LoginCredentials, RegisterCredentials, User } from "../types";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro no login");
      }

      const data: ApiResponse<LoginResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erro no login");
      }

      return data.data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  static async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const response = await fetch(buildApiUrl("/api/auth/register"), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro no registro");
      }

      const data: ApiResponse<User> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erro no registro");
      }

      return data.data;
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  }
}

export { AuthService };
