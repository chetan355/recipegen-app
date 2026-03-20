import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "../context/ThemeContext";
import {
  SavedRecipe,
  deleteRecipe,
  getSavedRecipes,
} from "../services/recipeService";

export default function HistoryScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const fetchRecipes = async () => {
        setLoading(true);
        try {
          const data = await getSavedRecipes();
          if (active) setRecipes(data);
        } catch {
          // silently ignore
        } finally {
          if (active) setLoading(false);
        }
      };
      fetchRecipes();
      return () => { active = false; };
    }, [])
  );

  const handleDelete = (item: SavedRecipe) => {
    Alert.alert("Delete Recipe", `Remove "${item.name}" from history?`, [
      { text: "Cancel", style: "cancel", onPress: () => swipeableRefs.current.get(item.id)?.close() },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteRecipe(item.id);
            setRecipes((prev) => prev.filter((r) => r.id !== item.id));
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragX: Animated.AnimatedInterpolation<number>,
    item: SavedRecipe
  ) => {
    const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [80, 0] });
    const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

    return (
      <Animated.View style={[styles.deleteAction, { transform: [{ translateX }], opacity }]}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={24} color="#FFF" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderRecipeCard = ({ item }: { item: SavedRecipe }) => (
    <Swipeable
      ref={(ref) => { if (ref) swipeableRefs.current.set(item.id, ref); }}
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
      overshootRight={false}
      friction={2}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("RecipeDetail", { recipe: item, savedRecipe: item })}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.recipeName, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.iconsRow}>
              {item.is_favorite && <Ionicons name="heart" size={16} color="#EF4444" />}
              <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="trash-outline" size={16} color={colors.gray} />
              </TouchableOpacity>
              <Ionicons name="chevron-forward" size={18} color={colors.gray} />
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="restaurant-outline" size={13} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.gray }]}>{item.cuisine}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.gray }]}>{item.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="speedometer-outline" size={13} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.gray }]}>{item.difficulty}</Text>
            </View>
          </View>
          <Text style={[styles.dateText, { color: colors.gray }]}>
            Saved {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
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
          <Ionicons name="book-outline" size={64} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.gray }]}>No Saved Recipes</Text>
          <Text style={[styles.emptySubtitle, { color: colors.gray }]}>Recipes you save will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
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
  card: { borderRadius: 14, padding: 14, marginBottom: 10 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  recipeName: { fontSize: 16, fontWeight: "700", flex: 1, marginRight: 8 },
  iconsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaRow: { flexDirection: "row", gap: 14, marginBottom: 6 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12 },
  dateText: { fontSize: 11, fontStyle: "italic" },
  deleteAction: { justifyContent: "center", alignItems: "center", marginBottom: 10, marginLeft: 8 },
  deleteButton: { backgroundColor: "#EF4444", borderRadius: 14, justifyContent: "center", alignItems: "center", width: 72, height: "100%", gap: 4 },
  deleteText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  emptyTitle: { fontSize: 20, fontWeight: "600", marginTop: 16 },
  emptySubtitle: { fontSize: 14, marginTop: 6 },
});