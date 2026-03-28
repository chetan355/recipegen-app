import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ Replace with your actual Gemini API key from https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = "AIzaSyAeu8TkWNhJB-yKOa5ekVfATWFz7FlXeEQ";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface Recipe {
  name: string;
  cuisine: string;
  time: string;
  difficulty: string;
  servings: number;
  ingredients: string[];
  steps: string[];
}

interface GenerateParams {
  ingredients: string;
  cuisine: string;
  time: string;
  difficulty: string;
}

//https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent

export async function generateRecipes(params: GenerateParams): Promise<Recipe[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `You are a professional chef and recipe creator. Based on the following user preferences, generate 10 unique recipes.

User Preferences:
- Available Ingredients: ${params.ingredients}
- Preferred Cuisine: ${params.cuisine}
- Time Available: ${params.time}
- Difficulty Level: ${params.difficulty}

Instructions:
1. Generate exactly 10 recipes that can be made with the given ingredients (you may include common pantry staples like salt, pepper, oil, etc.)
2. Each recipe should match the preferred cuisine style (if "Any", feel free to mix cuisines)
3. Respect the time constraint
4. Match the difficulty level
5. Write all steps in simple, easy-to-follow language that a beginner can understand
6. Each step should be one clear action

Respond ONLY with a valid JSON array (no markdown, no code fences, no extra text). Each recipe object must have:
{
  "name": "Recipe Name",
  "cuisine": "Cuisine Type",
  "time": "Estimated cooking time (e.g. 25 mins)",
  "difficulty": "Easy/Medium/Hard",
  "servings": 2,
  "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
  "steps": ["Step 1 in simple language", "Step 2 in simple language"]
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Clean any markdown formatting that might slip through
  const cleanedText = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const recipes: Recipe[] = JSON.parse(cleanedText);
  return recipes;
}
