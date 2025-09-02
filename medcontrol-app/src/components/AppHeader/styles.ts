import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  hero: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    marginBottom: 16,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff22",
    alignItems: "center",
    justifyContent: "center",
  },

  rightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff22",
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    flex: 1,
  },

  searchBox: {
    backgroundColor: "#ffffff1A",
    borderWidth: 1,
    borderColor: "#ffffff66",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
    padding: 0,
  },

  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroSmall: {
    color: "#EAF2FF",
    fontSize: 16,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  filterText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
