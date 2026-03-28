import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MyButton from "../components/MyButtton";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/types";
import { supabase } from "../services/supabase";

export default function LoginScreen({ }) {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginUser = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        Alert.alert("Login Error", error.message);
        setLoading(false);
      } else {
        setLoading(false);
        const parentNav = navigation.getParent();
        if (parentNav) {
          parentNav.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "MainTabs" }],
            })
          );
        } else {
          // Fallback for independent tree or if already at root
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "MainTabs" }],
            })
          );
        }
      }
    } catch (e: any) {
      setLoading(false);
      if (e.message?.includes("Network request failed") || e.name === "TypeError") {
        Alert.alert("Network Error", "Please check your internet connection and try again.");
      } else {
        Alert.alert("Error", e.message || "An unexpected error occurred during login.");
      }
    }
  };

  function doNotHaveAccount() {
    router.navigate("/screens/RegisterScreen");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Welcome Back 👋</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Email"
        placeholderTextColor={colors.gray}
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Password"
        placeholderTextColor={colors.gray}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      <MyButton title={"Login"} onPress={loginUser} loading={loading} />
      <TouchableOpacity onPress={doNotHaveAccount}>
        <Text style={[styles.link, { color: colors.primary }]}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 40 },
  input: { padding: 14, borderRadius: 10, marginBottom: 16, borderWidth: 1 },
  link: { textAlign: "center", marginTop: 20 },
});