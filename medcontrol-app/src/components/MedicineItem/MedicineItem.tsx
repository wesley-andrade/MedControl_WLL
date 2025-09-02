import React from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatTime } from "../../utils/dateUtils";
import { styles } from "./styles";

type StatusVariant = "active" | "low" | "inactive" | "custom";

interface MedicineItemProps {
  name: string;
  dosage: string;
  frequencyHours?: number;
  nextDoseTime?: string | null;
  statusColor?: string;
  variant?: StatusVariant;
  onPress?: () => void;
  containerStyle?: ViewStyle;
}

export const MedicineItem: React.FC<MedicineItemProps> = ({
  name,
  dosage,
  frequencyHours,
  nextDoseTime,
  statusColor = "#22C55E",
  variant = "active",
  onPress,
  containerStyle,
}) => {
  const displayTime = nextDoseTime ? formatTime(nextDoseTime) : "--:--";

  const renderBadge = () => {
    if (variant === "active")
      return (
        <View style={[styles.badge, styles.badgeActive]}>
          <Text style={styles.badgeText}>Ativo</Text>
        </View>
      );
    if (variant === "low")
      return (
        <View style={[styles.badge, styles.badgeLow]}>
          <Text style={styles.badgeText}>Estoque Baixo</Text>
        </View>
      );
    if (variant === "inactive")
      return (
        <View style={[styles.badge, styles.badgeInactive]}>
          <Text style={styles.badgeText}>Inativo</Text>
        </View>
      );
    return null;
  };

  const iconName = variant === "low" ? "warning-outline" : "time-outline";
  const iconColor =
    variant === "low"
      ? "#F59E0B"
      : variant === "inactive"
      ? "#EF4444"
      : "#16A34A";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, containerStyle]}
    >
      <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{name}</Text>
          <View style={styles.badgesRow}>
            <Ionicons name={iconName} size={18} color={iconColor} />
            {renderBadge()}
          </View>
        </View>
        <Text style={styles.cardSub}>{dosage}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Próxima dose</Text>
          <Text style={styles.metaValue}>{displayTime}</Text>
        </View>
        {typeof frequencyHours === "number" && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Frequência</Text>
            <Text style={styles.metaValue}>{frequencyHours}h</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
