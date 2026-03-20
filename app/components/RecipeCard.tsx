import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function RecipeCard({ recipe }: any) {
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
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  info: {
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    color: "#777",
  },
});