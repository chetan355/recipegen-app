import { Recipe } from "../services/gemini";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Auth: undefined;
  RecipeList: { recipes: Recipe[] };
  RecipeDetail: { recipe: Recipe };
};