import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E9ECF3",
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  leftSection: {
    flexDirection: "row",
    flex: 1,
  },

  statusIcon: {
    marginRight: 12,
    marginTop: 2,
  },

  medicineInfo: {
    flex: 1,
  },

  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },

  dosage: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },

  timeText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 6,
  },

  rightSection: {
    alignItems: "flex-end",
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
