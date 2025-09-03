import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },

  scrollContent: {
    paddingHorizontal: 4,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  selectedButton: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },

  icon: {
    marginRight: 6,
  },

  filterText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  selectedText: {
    fontWeight: "600",
  },
});
