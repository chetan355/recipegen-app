import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/types";

export default function SplashScreen({ }) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (loading) return; // wait for session check to finish

    const timer = setTimeout(() => {
      if (user) {
        // User has an active session — go straight to MainTabs
        navigation.replace("MainTabs");
      } else {
        // No session — go to login
        navigation.replace("Auth");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [loading, user]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={styles.logo}>🍳</Text>
      <Text style={styles.title}>RecipeGen</Text>
      <Text style={styles.subtitle}>AI Powered Cooking</Text>
      <ActivityIndicator
        size="small"
        color="#FFF"
        style={{ marginTop: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 70,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginTop: 10,
  },
  subtitle: {
    color: "#fff",
    marginTop: 6,
  },
});