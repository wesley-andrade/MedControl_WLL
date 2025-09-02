import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FE",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F8FE",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F8FE",
  },

  errorText: {
    fontSize: 16,
    color: "#6B7280",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
  },
});
