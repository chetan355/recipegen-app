import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { SavedRecipe, getFavoriteRecipes } from "../services/recipeService";

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const fetchFavorites = async () => {
        setLoading(true);
        try {
          const data = await getFavoriteRecipes();
          if (active) setRecipes(data);
        } catch {
          // silently ignore
        } finally {
          if (active) setLoading(false);
        }
      };
      fetchFavorites();
      return () => { active = false; };
    }, [])
  );

  const renderFavoriteCard = ({ item }: { item: SavedRecipe }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate("RecipeDetail", { recipe: item, savedRecipe: item })}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="heart" size={28} color="#EF4444" />
      </View>
      <Text style={[styles.recipeName, { color: colors.text }]} numberOfLines={2}>
        {item.name}
      </Text>
      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: colors.gray }]}>⏱ {item.time}</Text>
        <Text style={[styles.metaText, { color: colors.gray }]}>{item.difficulty}</Text>
      </View>
      <Text style={[styles.cuisineText, { color: colors.primary }]}>{item.cuisine}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {recipes.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="heart-outline" size={64} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.gray }]}>No Favorites Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.gray }]}>
            Tap the heart icon on a recipe to add it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderFavoriteCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { paddingTop: 10, paddingBottom: 30 },
  gridRow: { justifyContent: "space-between" },
  card: { borderRadius: 14, padding: 14, marginBottom: 12, width: "48%" },
  iconContainer: { alignSelf: "flex-end", marginBottom: 6 },
  recipeName: { fontSize: 15, fontWeight: "700", marginBottom: 8 },
  metaRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  metaText: { fontSize: 12 },
  cuisineText: { fontSize: 12, fontWeight: "500" },
  emptyTitle: { fontSize: 20, fontWeight: "600", marginTop: 16 },
  emptySubtitle: { fontSize: 14, marginTop: 6, textAlign: "center" },
});