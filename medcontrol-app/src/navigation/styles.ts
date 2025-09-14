import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F8FE",
  },
});

export const TAB_BAR_CONFIG = {
  height: 70,
  paddingTop: 6,
  paddingBottom: 10,
  fontSize: 13,
  marginBottom: 2,
  paddingVertical: 2,
  iconSizeOffset: 4,
} as const;

export const ROUTE_ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  Histórico: "time-outline",
  Config: "settings-outline",
} as const;

export const TAB_BAR_STYLES = {
  backgroundColor: "#FFFFFF",
  height: 70,
  paddingTop: 6,
  paddingBottom: 10,
};

export const TAB_BAR_LABEL_STYLES = {
  fontSize: 13,
  marginBottom: 2,
};

export const TAB_BAR_ITEM_STYLES = {
  paddingVertical: 2,
};

export const TAB_BAR_COLORS = {
  active: "#2563EB",
  inactive: "#6B7280",
};

export const STACK_SCREEN_OPTIONS = {
  headerShown: false,
  cardStyle: { backgroundColor: "#F5F8FE" },
};
