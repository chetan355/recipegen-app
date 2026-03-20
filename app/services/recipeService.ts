import { Recipe } from "./gemini";
import { supabase } from "./supabase";

export interface SavedRecipe extends Recipe {
  id: string;
  user_id: string;
  is_favorite: boolean;
  created_at: string;
}

/**
 * Save a generated recipe to Supabase for the current user.
 */
export async function saveRecipe(recipe: Recipe): Promise<SavedRecipe> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in to save recipes.");

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      name: recipe.name,
      cuisine: recipe.cuisine,
      time: recipe.time,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      is_favorite: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as SavedRecipe;
}

/**
 * Toggle the favorite status of a saved recipe.
 */
export async function toggleFavorite(
  id: string,
  isFavorite: boolean
): Promise<void> {
  const { error } = await supabase
    .from("recipes")
    .update({ is_favorite: isFavorite })
    .eq("id", id);

  if (error) throw error;
}

/**
 * Get all saved recipes for the current user (History).
 */
export async function getSavedRecipes(): Promise<SavedRecipe[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as SavedRecipe[]) ?? [];
}

/**
 * Get only favorite recipes for the current user.
 */
export async function getFavoriteRecipes(): Promise<SavedRecipe[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_favorite", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as SavedRecipe[]) ?? [];
}

/**
 * Delete a saved recipe.
 */
export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Check if a recipe is already saved (by name, for current user).
 */
export async function findSavedRecipe(
  recipeName: string
): Promise<SavedRecipe | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", user.id)
    .eq("name", recipeName)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as SavedRecipe | null;
}
