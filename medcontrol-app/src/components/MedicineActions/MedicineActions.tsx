import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Medicine } from "../../types";
import { styles } from "./styles";

interface MedicineActionsProps {
  medicine: Medicine;
  registeringDose: boolean;
  canTakeDose: boolean;
  onRegisterDose: () => void;
  onForgotDose: () => void;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const MedicineActions: React.FC<MedicineActionsProps> = ({
  medicine,
  registeringDose,
  canTakeDose,
  onRegisterDose,
  onForgotDose,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    Alert.alert(
      "Excluir Medicamento",
      "Tem certeza? Isso excluirá o histórico do medicamento e todas as doses registradas.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <View style={styles.actionButtons}>
      <View style={styles.mainActionRow}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            styles.flexButton,
            (registeringDose || !canTakeDose) && styles.disabledButton,
          ]}
          onPress={onRegisterDose}
          disabled={registeringDose || !canTakeDose}
        >
          {registeringDose ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="time" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.primaryButtonText}>
            {registeringDose
              ? "Registrando..."
              : !canTakeDose
              ? "Aguarde horário"
              : "Registrar Dose"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            styles.flexButton,
            registeringDose && styles.disabledButton,
          ]}
          onPress={onForgotDose}
          disabled={registeringDose}
        >
          <Ionicons name="close-circle" size={20} color="#EF4444" />
          <Text style={styles.forgotButtonText}>Esqueceu?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.secondaryButtons}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { backgroundColor: medicine.active ? "#EF4444" : "#22C55E" },
          ]}
          onPress={onToggleActive}
        >
          <Ionicons
            name={medicine.active ? "pause" : "play"}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.toggleButtonText}>
            {medicine.active ? "Desativar" : "Ativar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Ionicons name="pencil" size={18} color="#6B7280" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={18} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
