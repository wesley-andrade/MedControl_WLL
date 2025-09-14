import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FE",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#374151",
    marginHorizontal: 10,
    marginTop: 14,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E9ECF3",
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  toggleText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rowIcon: {
    marginRight: 12,
  },

  rowTitle: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },

  rowSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  rowValue: {
    fontSize: 15,
    color: "#6B7280",
    marginLeft: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },

  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 16,
  },
});
