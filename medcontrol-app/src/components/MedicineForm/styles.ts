import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 8,
  },

  inputGroup: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  textInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },

  helpText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  checkboxLabel: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
});
