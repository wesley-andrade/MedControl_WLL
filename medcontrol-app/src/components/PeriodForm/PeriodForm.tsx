import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { Medicine } from "../../types";
import {
  formatDateWhileTyping,
  formatTimeWhileTyping,
} from "../../utils/dateUtils";
import { styles } from "./styles";

interface PeriodFormProps {
  medicine: Partial<Medicine>;
  setMedicine: (medicine: Partial<Medicine>) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
}

export const PeriodForm: React.FC<PeriodFormProps> = ({
  medicine,
  setMedicine,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="calendar" size={20} color="#22C55E" />
        <Text style={styles.cardTitle}>Período do Tratamento</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Data de Início *</Text>
        <TextInput
          style={styles.dateInput}
          placeholder="Ex: 15/12/2024"
          value={medicine.dateStart}
          onChangeText={(text) => {
            const formatted = formatDateWhileTyping(text);
            setMedicine({ ...medicine, dateStart: formatted });
          }}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Horário de Início *</Text>
        <TextInput
          style={styles.timeInput}
          placeholder="Ex: 08:30"
          value={startTime}
          onChangeText={(text) => {
            const formatted = formatTimeWhileTyping(text);
            setStartTime(formatted);
          }}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={5}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Data de Término (opcional)</Text>
        <TextInput
          style={styles.dateInput}
          placeholder="Ex: 15/01/2025"
          value={medicine.dateEnd || ""}
          onChangeText={(text) => {
            const formatted = formatDateWhileTyping(text);
            setMedicine({ ...medicine, dateEnd: formatted });
            if (!formatted.trim()) {
              setEndTime("");
            }
          }}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Horário de Término (se houver data)
        </Text>
        <TextInput
          style={[
            styles.timeInput,
            !medicine.dateEnd?.trim() && styles.disabledInput,
          ]}
          placeholder="Ex: 20:00"
          value={endTime}
          onChangeText={(text) => {
            const formatted = formatTimeWhileTyping(text);
            setEndTime(formatted);
          }}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={5}
          editable={!!medicine.dateEnd?.trim()}
        />
      </View>
    </View>
  );
};
