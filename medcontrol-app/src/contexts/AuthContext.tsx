import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService, LoginResponse } from "../services/authService";
import { LoginUser } from "../types";

interface AuthContextType {
  user: LoginUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
  REMEMBER_ME: "rememberMe",
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const savedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);

      if (savedToken && savedUserData && rememberMe === "true") {
        const userData = JSON.parse(savedUserData);
        setToken(savedToken);
        setUser(userData);
      }
    } catch (error) {
      console.error("Erro ao verificar status de autenticação:", error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      const response: LoginResponse = await AuthService.login({
        email,
        password,
        rememberMe,
      });

      if (rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(response.user)
        );
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, "true");
      }

      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.REMEMBER_ME,
      ]);

      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
