import { CommonActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import MyButton from "../components/MyButtton";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../services/supabase";

export default function ProfileScreen() {
  const { user } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const userName = user?.user_metadata?.name || "User";
  const userEmail = user?.email || "No email";
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "N/A";

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout Error", error.message);
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        })
      );
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Avatar with initial */}
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={styles.avatarText}>
          {userName.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
      <Text style={[styles.email, { color: colors.gray }]}>{userEmail}</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.text }]}>Name</Text>
        <Text style={{ color: colors.gray }}>{userName}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.text }]}>Email</Text>
        <Text style={{ color: colors.gray }}>{userEmail}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.text }]}>Member Since</Text>
        <Text style={{ color: colors.gray }}>{createdAt}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.text }]}>Password</Text>
        <Text style={{ color: colors.gray }}>••••••••</Text>
      </View>

      <View style={[styles.cardRow, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFF"
        />
      </View>

      <MyButton title={"Logout"} onPress={handleLogout}></MyButton>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: "center",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFF",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  email: {
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardLabel: {
    fontWeight: "600",
    marginBottom: 4,
  },
  cardRow: {
    padding: 14,
    marginBottom: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});