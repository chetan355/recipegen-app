import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MyButton from "../components/MyButtton";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/types";
import { supabase } from "../services/supabase";

export default function RegisterScreen({ }) {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function toLogin() {
    router.navigate("/screens/LoginScreen");
  }

  const registerUser = async () => {
    if (!email || !password || !name || !confirmPassword) {
      Alert.alert("Error", "Please complete the registration form");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) {
        Alert.alert("Signup Error", error.message);
        setLoading(false);
      } else {
        setLoading(false);
        Alert.alert("Success", "Account created! Please login.");
        router.navigate("/screens/LoginScreen");
      }
    } catch (e: any) {
      setLoading(false);
      if (e.message?.includes("Network request failed") || e.name === "TypeError") {
        Alert.alert("Network Error", "Please check your internet connection and try again.");
      } else {
        Alert.alert("Error", e.message || "An unexpected error occurred during registration.");
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Full Name"
        placeholderTextColor={colors.gray}
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
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
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Confirm Password"
        placeholderTextColor={colors.gray}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />
      <MyButton title={"Register"} onPress={registerUser} loading={loading} />
      <TouchableOpacity onPress={toLogin}>
        <Text style={[styles.link, { color: colors.primary }]}>
          Already have an account? Login
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