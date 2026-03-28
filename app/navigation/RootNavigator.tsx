import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";

import { useAuth } from "../context/AuthContext";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import RecipeListScreen from "../screens/RecipeListScreen";
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  const onLayoutRootView = useCallback(() => {
    if (!loading) {
      // Auth check is done — hide the native splash screen
      ExpoSplashScreen.hideAsync().catch(() => {});
    }
  }, [loading]);

  // While auth is still loading, render nothing — the native splash stays visible
  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? "MainTabs" : "Auth"}
    >
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        listeners={{ focus: onLayoutRootView }}
      />
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        listeners={{ focus: onLayoutRootView }}
      />
      <Stack.Screen name="RecipeList" component={RecipeListScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}