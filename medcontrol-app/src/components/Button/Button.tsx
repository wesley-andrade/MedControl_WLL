import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { styles } from "./styles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
  children,
}) => {
  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          styles.primaryButton,
          style,
          disabled && styles.disabled,
        ]}
        disabled={disabled}
      >
        <LinearGradient
          colors={["#3B82F6", "#1D4ED8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.buttonContent}>
            <Text
              style={[styles.buttonText, styles.primaryButtonText, textStyle]}
            >
              {title}
            </Text>
            {children}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        styles.secondaryButton,
        style,
        disabled && styles.disabled,
      ]}
      disabled={disabled}
    >
      <View style={styles.buttonContent}>
        <Text
          style={[styles.buttonText, styles.secondaryButtonText, textStyle]}
        >
          {title}
        </Text>
        {children}
      </View>
    </TouchableOpacity>
  );
};
