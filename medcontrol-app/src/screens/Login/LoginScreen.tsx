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
import { CustomInput } from "../../components/Input/CustomInput";
import { CustomButton } from "../../components/Button/CustomButton";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import { useLogin } from "./useLogin";
import { styles } from "./styles";

export const LoginScreen: React.FC = () => {
  const {
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
  } = useLogin();

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
            <Text style={styles.subtitle}>Entre na sua conta</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Fazer Login</Text>

            <CustomInput
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              editable={!isLoading}
            />

            <CustomInput
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

            <Checkbox
              checked={rememberMe}
              onToggle={toggleRememberMe}
              label="Continuar conectado"
              disabled={isLoading}
            />

            <CustomButton
              title={isLoading ? "Entrando..." : "Entrar"}
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                  style={styles.loadingIndicator}
                />
              )}
            </CustomButton>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
                <Text style={styles.signUpLink}>Cadastre-se</Text>
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
