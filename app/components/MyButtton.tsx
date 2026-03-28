import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface MyButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const MyButton = ({ title, onPress, loading = false, disabled = false }: MyButtonProps) => {
  const { colors } = useTheme();
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.button,
        { backgroundColor: colors.primary },
        isDisabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: "center",
    minHeight: 62,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
});

export default MyButton;