import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { Recipe } from "../services/gemini";

export default function RecipeListScreen() {
  const { colors } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const recipes: Recipe[] = route.params?.recipes ?? [];

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.recipeName, { color: colors.text }]}>{item.name}</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.gray} />
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="restaurant-outline" size={14} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.gray }]}>{item.cuisine}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.gray }]}>{item.time}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="speedometer-outline" size={14} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.gray }]}>{item.difficulty}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={14} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.gray }]}>{item.servings} servings</Text>
        </View>
      </View>
      <Text style={[styles.ingredientPreview, { color: colors.gray }]} numberOfLines={2}>
        {item.ingredients.join(", ")}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Generated Recipes</Text>
        <View style={{ width: 24 }} />
      </View>
      <Text style={[styles.subtitle, { color: colors.gray }]}>
        {recipes.length} recipes found based on your preferences
      </Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14, marginBottom: 16, textAlign: "center" },
  list: { paddingBottom: 30 },
  card: { borderRadius: 14, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  recipeName: { fontSize: 18, fontWeight: "700", flex: 1, marginRight: 8 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10, gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 13 },
  ingredientPreview: { fontSize: 13, fontStyle: "italic" },
});
