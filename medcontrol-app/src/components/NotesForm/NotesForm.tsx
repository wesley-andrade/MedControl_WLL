import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { Medicine } from "../../types";
import { styles } from "./styles";

interface NotesFormProps {
  medicine: Partial<Medicine>;
  setMedicine: (medicine: Partial<Medicine>) => void;
}

export const NotesForm: React.FC<NotesFormProps> = ({
  medicine,
  setMedicine,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="chatbubble" size={20} color="#22C55E" />
        <Text style={styles.cardTitle}>Observações</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Observações (opcional)</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Ex: Tomar com alimentos"
          value={medicine.observations || ""}
          onChangeText={(text) =>
            setMedicine({ ...medicine, observations: text })
          }
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};
