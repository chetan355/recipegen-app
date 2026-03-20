import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface MyButtonProps {
  title: string;
  onPress: () => void;
}

const MyButton = ({ title, onPress }: MyButtonProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.button, { backgroundColor: colors.primary }]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
});

export default MyButton;