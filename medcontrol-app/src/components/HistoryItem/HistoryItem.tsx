import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DosageItem } from "../../services/dosageService";
import { Medicine } from "../../types";
import { formatDateForDisplay, formatTime } from "../../utils/dateUtils";
import { styles } from "./styles";

interface HistoryItemProps {
  dosage: DosageItem;
  medicine?: Medicine;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  dosage,
  medicine,
}) => {
  const medicineData = medicine || (dosage as any).drug;

  const getStatusConfig = () => {
    switch (dosage.status) {
      case "taken":
        return {
          icon: "checkmark-circle",
          iconColor: "#22C55E",
          badgeText: "No Horário",
          badgeColor: "#DCFCE7",
          textColor: "#166534",
        };
      case "late":
        return {
          icon: "warning",
          iconColor: "#F59E0B",
          badgeText: "Com Atraso",
          badgeColor: "#FEF3C7",
          textColor: "#92400E",
        };
      case "missed":
        return {
          icon: "close-circle",
          iconColor: "#EF4444",
          badgeText: "Esquecida",
          badgeColor: "#FEE2E2",
          textColor: "#991B1B",
        };
      default:
        return {
          icon: "time-outline",
          iconColor: "#6B7280",
          badgeText: "Pendente",
          badgeColor: "#F3F4F6",
          textColor: "#374151",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const scheduledDate = dosage.expectedTimeDate;
  const takenDate = dosage.takenAt;

  const getTimeText = () => {
    if (takenDate) {
      const takenTime = formatTime(takenDate);
      if (dosage.status === "late" && scheduledDate) {
        const scheduledTime = formatTime(scheduledDate);
        return `Tomada às ${takenTime} (agendada para ${scheduledTime})`;
      }
      return `Tomada às ${takenTime}`;
    }

    if (dosage.status === "missed" && scheduledDate) {
      const scheduledTime = formatTime(scheduledDate);
      return `Agendada para ${scheduledTime}`;
    }

    return "";
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Ionicons
            name={statusConfig.icon as any}
            size={24}
            color={statusConfig.iconColor}
            style={styles.statusIcon}
          />
          <View style={styles.medicineInfo}>
            <Text style={styles.medicineName}>
              {medicineData?.name || "Medicamento"}
            </Text>
            <Text style={styles.dosage}>{medicineData?.dosage || ""}</Text>
            {getTimeText() && (
              <Text style={styles.timeText}>{getTimeText()}</Text>
            )}
            <View style={styles.dateContainer}>
              <Ionicons name="calendar" size={16} color="#6B7280" />
              <Text style={styles.dateText}>
                {scheduledDate ? formatDateForDisplay(scheduledDate) : ""}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          <View
            style={[styles.badge, { backgroundColor: statusConfig.badgeColor }]}
          >
            <Text style={[styles.badgeText, { color: statusConfig.textColor }]}>
              {statusConfig.badgeText}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
