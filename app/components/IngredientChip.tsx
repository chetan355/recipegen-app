import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function IngredientChip({ label, onPress }: any) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={[styles.chip, { borderColor: colors.border }]} onPress={onPress}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    margin: 5,
  },
  text: {
    fontSize: 14,
  },
});