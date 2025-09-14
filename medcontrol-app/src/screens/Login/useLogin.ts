import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "../../hooks/useNavigation";
import { useAuth } from "../../contexts/AuthContext";

export const useLogin = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleRememberMe = () => setRememberMe((prev) => !prev);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Erro", "Por favor, insira um email válido");
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password, rememberMe);

      setEmail("");
      setPassword("");
      setRememberMe(false);
    } catch (error: any) {
      console.error("Erro no login:", error);

      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (error?.message) {
        if (error.message.includes("Credenciais inválidas")) {
          errorMessage = "Email ou senha incorretos";
        } else if (error.message.includes("E-mail já cadastrado")) {
          errorMessage = "Este email já está cadastrado";
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert("Erro no Login", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate("Register");
  };

  return {
    email,
    password,
    showPassword,
    rememberMe,
    isLoading,
    setEmail,
    setPassword,
    toggleShowPassword,
    toggleRememberMe,
    handleLogin,
    handleSignUp,
  } as const;
};
