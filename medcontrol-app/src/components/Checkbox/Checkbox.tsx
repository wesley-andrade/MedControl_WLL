import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={styles.container}
      disabled={disabled}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {checked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </View>
      <Text style={[styles.label, disabled && styles.disabledText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
