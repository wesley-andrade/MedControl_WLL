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

  medicineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  medicineName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },

  medicineDosage: {
    fontSize: 16,
    color: "#6B7280",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  detailItem: {
    width: "50%",
    marginBottom: 16,
  },

  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },

  observationsContainer: {
    marginTop: 10,
  },

  observationsBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },

  observationsText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});
