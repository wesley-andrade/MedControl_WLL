import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  checked: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },

  label: {
    fontSize: 14,
    color: "#6B7280",
  },

  disabled: {
    opacity: 0.5,
  },

  disabledText: {
    color: "#9CA3AF",
  },
});
