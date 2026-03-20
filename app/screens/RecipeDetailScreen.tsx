import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { Recipe } from "../services/gemini";
import {
  SavedRecipe,
  findSavedRecipe,
  saveRecipe,
  toggleFavorite,
} from "../services/recipeService";

export default function RecipeDetailScreen() {
  const { colors } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const recipe: Recipe = route.params?.recipe;
  const savedRecipeParam: SavedRecipe | undefined = route.params?.savedRecipe;

  const [savedData, setSavedData] = useState<SavedRecipe | null>(savedRecipeParam ?? null);
  const [isFavorite, setIsFavorite] = useState(savedRecipeParam?.is_favorite ?? false);
  const [saving, setSaving] = useState(false);

  const activeRecipe = savedData ?? recipe;

  const checkSavedStatus = useCallback(async () => {
    if (savedData || !recipe?.name) return;
    try {
      const found = await findSavedRecipe(recipe.name);
      if (found) {
        setSavedData(found);
        setIsFavorite(found.is_favorite);
      }
    } catch { /* silently ignore */ }
  }, [recipe?.name, savedData]);

  useEffect(() => { checkSavedStatus(); }, [checkSavedStatus]);

  const handleSave = async () => {
    if (savedData) {
      Alert.alert("Already Saved", "This recipe is already in your history.");
      return;
    }
    setSaving(true);
    try {
      const saved = await saveRecipe(activeRecipe);
      setSavedData(saved);
      Alert.alert("Saved!", "Recipe saved to your history.");
    } catch (error: any) {
      Alert.alert("Save Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!savedData) {
      setSaving(true);
      try {
        const saved = await saveRecipe(activeRecipe);
        await toggleFavorite(saved.id, true);
        setSavedData({ ...saved, is_favorite: true });
        setIsFavorite(true);
        Alert.alert("Favorited!", "Recipe saved and added to favorites.");
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setSaving(false);
      }
      return;
    }
    try {
      const newFavState = !isFavorite;
      await toggleFavorite(savedData.id, newFavState);
      setIsFavorite(newFavState);
      setSavedData({ ...savedData, is_favorite: newFavState });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (!activeRecipe) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No recipe data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            Recipe Details
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.headerBtn}>
              <Ionicons
                name={savedData ? "bookmark" : "bookmark-outline"}
                size={22}
                color={savedData ? colors.primary : colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToggleFavorite} disabled={saving} style={styles.headerBtn}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? "#EF4444" : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.recipeName, { color: colors.text }]}>{activeRecipe.name}</Text>

        <View style={styles.metaContainer}>
          {[
            { icon: "time-outline", value: activeRecipe.time, label: "Time" },
            { icon: "speedometer-outline", value: activeRecipe.difficulty, label: "Difficulty" },
            { icon: "people-outline", value: activeRecipe.servings, label: "Servings" },
            { icon: "restaurant-outline", value: activeRecipe.cuisine, label: "Cuisine" },
          ].map((meta) => (
            <View key={meta.label} style={[styles.metaCard, { backgroundColor: colors.card }]}>
              <Ionicons name={meta.icon as any} size={20} color={colors.primary} />
              <Text style={[styles.metaValue, { color: colors.text }]}>{meta.value}</Text>
              <Text style={[styles.metaLabel, { color: colors.gray }]}>{meta.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredients</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          {activeRecipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.ingredientText, { color: colors.text }]}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Steps</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          {activeRecipe.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text }]}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingTop: 10, paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: "600", flex: 1, textAlign: "center" },
  headerActions: { flexDirection: "row", gap: 12 },
  headerBtn: { padding: 4 },
  recipeName: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  metaContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  metaCard: { borderRadius: 12, padding: 12, alignItems: "center", flex: 1, minWidth: "20%" },
  metaValue: { fontSize: 14, fontWeight: "600", marginTop: 6, textAlign: "center" },
  metaLabel: { fontSize: 11, marginTop: 2 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  sectionCard: { borderRadius: 14, padding: 16, marginBottom: 20 },
  ingredientRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  bullet: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  ingredientText: { fontSize: 15, flex: 1 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 8 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 12, marginTop: 2 },
  stepNumberText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  stepText: { fontSize: 15, flex: 1, lineHeight: 22 },
});
