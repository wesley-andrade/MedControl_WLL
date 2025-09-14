import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { styles } from "./styles";
import { useSettings } from "./useSettings";

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    isLoading,
    notificationsEnabled,
    voiceAssistantEnabled,
    toggleNotifications,
    toggleVoiceAssistant,
    hasPermissions,
  } = useSettings();

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View>
        <AppHeader
          title="Configurações"
          gradientColors={["#2FC2B4", "#80E1D7"]}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="person-circle"
                size={22}
                color="#6B7280"
                style={styles.rowIcon}
              />
              <View>
                <Text style={styles.rowTitle}>Email</Text>
                <Text style={styles.rowSubtitle}>{user?.email || "-"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="log-out"
                size={20}
                color="#EF4444"
                style={styles.rowIcon}
              />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Aplicativo</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="notifications"
                size={20}
                color="#6B7280"
                style={styles.rowIcon}
              />
              <View>
                <Text style={styles.toggleText}>Notificações</Text>
                <Text style={styles.rowSubtitle}>
                  {hasPermissions
                    ? "Lembretes de medicamentos ativados"
                    : "Permissão necessária para lembretes"}
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled && hasPermissions}
              onValueChange={toggleNotifications}
              disabled={isLoading}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Assistente de voz</Text>
            <Switch
              value={voiceAssistantEnabled}
              onValueChange={toggleVoiceAssistant}
              disabled={isLoading}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="information-circle"
                size={20}
                color="#6B7280"
                style={styles.rowIcon}
              />
              <Text style={styles.rowTitle}>Versão</Text>
            </View>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
