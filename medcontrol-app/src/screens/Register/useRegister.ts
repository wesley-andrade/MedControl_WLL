import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "../../hooks/useNavigation";
import { AuthService } from "../../services/authService";

export const useRegister = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const validateInputs = (): boolean => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Erro", "Por favor, insira um email válido");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      await AuthService.register({
        email: email.trim(),
        password,
        confirmPassword,
      });

      Alert.alert(
        "Sucesso",
        "Conta criada com sucesso! Agora você pode fazer login.",
        [
          {
            text: "OK",
            onPress: () => {
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              navigation.navigate("Login");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Erro no registro:", error);

      let errorMessage = "Erro ao criar conta. Tente novamente.";

      if (error?.message) {
        if (error.message.includes("E-mail já cadastrado")) {
          errorMessage = "Este email já está cadastrado";
        } else if (error.message.includes("Email já cadastrado")) {
          errorMessage = "Este email já está cadastrado";
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert("Erro no Registro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const hasMinLength = password.length >= 6;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  return {
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading,
    hasMinLength,
    passwordsMatch,
    setEmail,
    setPassword,
    setConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    handleRegister,
    handleLogin,
  } as const;
};
