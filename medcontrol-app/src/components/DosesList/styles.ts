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
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 8,
  },

  doseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  doseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  doseTimeInfo: {
    marginLeft: 12,
  },

  doseTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },

  doseDate: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  nextBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  nextBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },

  noDosesText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 20,
  },
});
