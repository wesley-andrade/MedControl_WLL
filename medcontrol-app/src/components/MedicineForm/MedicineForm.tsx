import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Medicine } from "../../types";
import { styles } from "./styles";

interface MedicineFormProps {
  medicine: Partial<Medicine>;
  setMedicine: (medicine: Partial<Medicine>) => void;
  useFixedSchedules: boolean;
  setUseFixedSchedules: (value: boolean) => void;
}

export const MedicineForm: React.FC<MedicineFormProps> = ({
  medicine,
  setMedicine,
  useFixedSchedules,
  setUseFixedSchedules,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="document-text" size={20} color="#4E8DFF" />
        <Text style={styles.cardTitle}>Informações Básicas</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nome do Medicamento *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ex: Omeprazol"
          value={medicine.name}
          onChangeText={(text) => setMedicine({ ...medicine, name: text })}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Dosagem *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ex: 20mg"
          value={medicine.dosage}
          onChangeText={(text) => setMedicine({ ...medicine, dosage: text })}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Frequência (horas) *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ex: 12 (a cada 12 horas)"
          value={medicine.frequencyHours ? String(medicine.frequencyHours) : ""}
          onChangeText={(text) => {
            const value = parseInt(text) || 0;
            setMedicine({ ...medicine, frequencyHours: value });
          }}
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputGroup}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setUseFixedSchedules(!useFixedSchedules)}
        >
          <View
            style={[
              styles.checkbox,
              useFixedSchedules && styles.checkboxChecked,
            ]}
          >
            {useFixedSchedules && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Usar horários fixos</Text>
        </TouchableOpacity>
      </View>

      {useFixedSchedules && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Horários Fixos *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: 08:00,12:00,18:00 (separados por vírgula)"
            value={medicine.fixedSchedules || ""}
            onChangeText={(text) =>
              setMedicine({ ...medicine, fixedSchedules: text })
            }
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.helpText}>
            Digite os horários no formato HH:MM, separados por vírgula
          </Text>
        </View>
      )}
    </View>
  );
};
