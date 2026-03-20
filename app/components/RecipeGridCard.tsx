import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function RecipeGridCard({ recipe }: any) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: recipe.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.meta}>
          ⏱ {recipe.time} | {recipe.difficulty}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  info: {
    padding: 10,
  },
  title: {
    fontWeight: "600",
  },
  meta: {
    color: "#777",
  },
});