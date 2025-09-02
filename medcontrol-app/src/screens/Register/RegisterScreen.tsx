import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { useRegister } from "./useRegister";
import { styles } from "./styles";

export const RegisterScreen: React.FC = () => {
  const {
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
  } = useRegister();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Image
                  source={require("../../assets/images/icon.png")}
                  style={styles.logoImage}
                  contentFit="contain"
                  transition={200}
                />
              </View>
            </View>
            <Text style={styles.appName}>MedControl</Text>
            <Text style={styles.subtitle}>Crie sua conta</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Criar Conta</Text>

            <Input
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              editable={!isLoading}
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              icon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onIconPress={toggleShowPassword}
              editable={!isLoading}
            />

            <Input
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              icon="lock-closed-outline"
              rightIcon={
                showConfirmPassword ? "eye-off-outline" : "eye-outline"
              }
              onIconPress={toggleShowConfirmPassword}
              editable={!isLoading}
            />

            {password.length > 0 && (
              <View style={styles.passwordValidation}>
                <Text
                  style={[
                    styles.validationText,
                    hasMinLength
                      ? styles.validationSuccess
                      : styles.validationError,
                  ]}
                >
                  {hasMinLength ? "✓" : "✗"} Mínimo 6 caracteres
                </Text>
              </View>
            )}

            {confirmPassword.length > 0 && !passwordsMatch && (
              <View style={styles.passwordValidation}>
                <Text style={[styles.validationText, styles.validationError]}>
                  ✗ As senhas não coincidem
                </Text>
              </View>
            )}

            {confirmPassword.length > 0 && passwordsMatch && (
              <View style={styles.passwordValidation}>
                <Text style={[styles.validationText, styles.validationSuccess]}>
                  ✓ Senhas coincidem
                </Text>
              </View>
            )}

            <Button
              title={isLoading ? "Criando conta..." : "Criar Conta"}
              onPress={handleRegister}
              style={styles.registerButton}
              disabled={isLoading}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                  style={styles.loadingIndicator}
                />
              )}
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
                <Text style={styles.loginLink}>Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.tagline}>
              Nunca mais esqueça de tomar seus remédios. Nós lembramos por você.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
