import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
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

  statusStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },

  cardContent: {
    padding: 18,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },

  badgeActive: {
    backgroundColor: "#22C55E22",
  },

  badgeLow: {
    backgroundColor: "#EF444422",
  },

  badgeInactive: {
    backgroundColor: "#EF444422",
  },

  badgeText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
  },

  cardSub: {
    color: "#6B7280",
    fontSize: 16,
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  metaLabel: {
    color: "#6B7280",
    fontSize: 15,
  },

  metaValue: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 18,
  },
});
