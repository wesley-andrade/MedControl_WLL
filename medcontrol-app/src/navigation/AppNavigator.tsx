import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { LoginScreen } from "../screens/Login/LoginScreen";
import { RegisterScreen } from "../screens/Register/RegisterScreen";
import { DashboardScreen } from "../screens/Dashboard/DashboardScreen";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { HistoryScreen } from "../screens/History/HistoryScreen";
import { SettingsScreen } from "../screens/Settings/SettingsScreen";
import { MedicineScreen } from "../screens/Medicine/MedicineScreen";
import { FormScreen } from "../screens/Form/FormScreen";
import {
  styles,
  TAB_BAR_CONFIG,
  ROUTE_ICON_MAP,
  TAB_BAR_STYLES,
  TAB_BAR_LABEL_STYLES,
  TAB_BAR_ITEM_STYLES,
  TAB_BAR_COLORS,
  STACK_SCREEN_OPTIONS,
} from "./styles";

import { RootStackParamList } from "../types";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const getTabIcon = (routeName: string, color: string, size: number) => {
  const iconName =
    ROUTE_ICON_MAP[routeName as keyof typeof ROUTE_ICON_MAP] ||
    "ellipse-outline";
  return (
    <Ionicons
      name={iconName}
      size={size + TAB_BAR_CONFIG.iconSizeOffset}
      color={color}
    />
  );
};

const getTabScreenOptions = ({ route }: { route: any }) => ({
  headerShown: false,
  tabBarShowLabel: true,
  tabBarStyle: TAB_BAR_STYLES,
  tabBarLabelStyle: TAB_BAR_LABEL_STYLES,
  tabBarItemStyle: TAB_BAR_ITEM_STYLES,
  tabBarActiveTintColor: TAB_BAR_COLORS.active,
  tabBarInactiveTintColor: TAB_BAR_COLORS.inactive,
  tabBarIcon: ({ color, size }: { color: string; size: number }) =>
    getTabIcon(route.name, color, size),
});

const MainTabs = () => (
  <Tab.Navigator screenOptions={getTabScreenOptions}>
    <Tab.Screen name="Home" component={DashboardScreen} />
    <Tab.Screen name="Histórico" component={HistoryScreen} />
    <Tab.Screen name="Config" component={SettingsScreen} />
  </Tab.Navigator>
);

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3B82F6" />
  </View>
);

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Main" : "Login"}
        screenOptions={STACK_SCREEN_OPTIONS}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Medicine" component={MedicineScreen} />
            <Stack.Screen name="Form" component={FormScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
