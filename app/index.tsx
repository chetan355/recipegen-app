import { NavigationIndependentTree } from "@react-navigation/native";
import * as ExpoSplashScreen from "expo-splash-screen";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./context/AuthContext";
import { NetworkProvider } from "./context/NetworkProvider";
import { ThemeProvider } from "./context/ThemeContext";
import RootNavigator from "./navigation/RootNavigator";

// Keep the native splash screen visible until we explicitly hide it
ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <ThemeProvider>
          <AuthProvider>
            <NavigationIndependentTree>
              <RootNavigator />
            </NavigationIndependentTree>
          </AuthProvider>
        </ThemeProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}