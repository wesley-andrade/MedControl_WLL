import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FE",
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoContainer: {
    marginBottom: 12,
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },

  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },

  formContainer: {
    backgroundColor: "#FAFCFE",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },

  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 24,
    textAlign: "center",
  },

  loginButton: {
    marginBottom: 20,
  },

  loadingIndicator: {
    marginLeft: 8,
  },

  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  signUpText: {
    fontSize: 16,
    color: "#6B7280",
  },

  signUpLink: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "600",
  },

  footer: {
    alignItems: "center",
  },

  tagline: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
});
