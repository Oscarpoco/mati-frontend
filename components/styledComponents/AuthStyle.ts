import { StyleSheet, Platform } from "react-native";

export const AuthStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 60,
    paddingBottom: 40,
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },

  inputWrapper: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    opacity: 0.8,
  },

  inputField: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    paddingLeft: 2,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },

  forgotLink: {
    fontSize: 12,
    fontWeight: "600",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    borderTopWidth: 1,
  },

  socialButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  confirmContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    borderRadius: 32,
    flexDirection: "row",
    padding: 4,
    paddingRight: 20,
  },

  confirmButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  confirmText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    letterSpacing: 1.2,
    fontWeight: "600",
  },

  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  successSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});