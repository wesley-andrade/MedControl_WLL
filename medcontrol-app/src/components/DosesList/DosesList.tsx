import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { DosageItem } from "../../services/dosageService";
import { formatTime, getRelativeDate } from "../../utils/dateUtils";
import { styles } from "./styles";

interface DosesListProps {
  nextDoses: DosageItem[];
}

export const DosesList: React.FC<DosesListProps> = ({ nextDoses }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="time" size={20} color="#6B7280" />
        <Text style={styles.cardTitle}>Próximas Doses</Text>
      </View>

      {nextDoses.length > 0 ? (
        nextDoses.map((dosage, index) => (
          <View key={dosage.id} style={styles.doseItem}>
            <View style={styles.doseInfo}>
              <Ionicons name="calendar" size={16} color="#6B7280" />
              <View style={styles.doseTimeInfo}>
                <Text style={styles.doseTime}>
                  {formatTime(
                    dosage.scheduledAt || dosage.expectedTimeDate || ""
                  )}
                </Text>
                <Text style={styles.doseDate}>
                  {getRelativeDate(
                    dosage.scheduledAt || dosage.expectedTimeDate || ""
                  )}
                </Text>
              </View>
            </View>
            {index === 0 && (
              <View style={styles.nextBadge}>
                <Text style={styles.nextBadgeText}>Próxima</Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noDosesText}>Nenhuma dose agendada</Text>
      )}
    </View>
  );
};
