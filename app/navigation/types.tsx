import { Recipe } from "../services/gemini";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Auth: undefined;
  RecipeList: { recipes: Recipe[] };
  RecipeDetail: { recipe: Recipe };
};