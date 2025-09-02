import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface SaveButtonProps {
  isEditing: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  isEditing,
  isSaving,
  onCancel,
  onSave,
}) => {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={isSaving}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.disabledButton]}
        onPress={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="save" size={18} color="#FFFFFF" />
        )}
        <Text style={styles.saveButtonText}>
          {isSaving
            ? "Salvando..."
            : isEditing
            ? "Atualizar Medicamento"
            : "Salvar Medicamento"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
