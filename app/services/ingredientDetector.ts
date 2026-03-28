import { GoogleGenerativeAI } from "@google/generative-ai";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

// Re-use the same API key from gemini.ts
const GEMINI_API_KEY = "AIzaSyAeu8TkWNhJB-yKOa5ekVfATWFz7FlXeEQ";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Cache the model instance with system instructions so they're reused across calls
const ingredientModel = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  systemInstruction: `You are a food ingredient identification expert.
Your task is to analyze images and identify all visible food ingredients.

Rules:
- Return ONLY a comma-separated list of ingredient names in lowercase.
- Be specific: say "red bell pepper" not just "vegetable".
- Include quantities if visually estimable (e.g. "2 tomatoes", "bunch of cilantro").
- If no food ingredients are visible, return exactly "none".
- Do not include any explanation, formatting, or extra text.

Example output: tomatoes, onion, garlic cloves, chicken breast, red bell pepper, cilantro`,
});

async function requestPermissions(
  source: "camera" | "gallery"
): Promise<boolean> {
  if (source === "camera") {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access in your device settings to scan ingredients."
      );
      return false;
    }
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Gallery Permission Required",
        "Please allow gallery access in your device settings to select ingredient photos."
      );
      return false;
    }
  }
  return true;
}

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
}

/**
 * Resize image so the longest side is ~768px, then return base64.
 */
async function resizeAndEncode(image: PickedImage): Promise<string> {
  const { uri, width, height } = image;
  const TARGET = 768;
  let resizeAction: ImageManipulator.Action[] = [];

  if (width > TARGET || height > TARGET) {
    if (width >= height) {
      resizeAction = [{ resize: { width: TARGET } }];
    } else {
      resizeAction = [{ resize: { height: TARGET } }];
    }
  }

  const result = await ImageManipulator.manipulateAsync(uri, resizeAction, {
    compress: 0.8,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });

  return result.base64!;
}

export async function pickImage(
  source: "camera" | "gallery"
): Promise<PickedImage | null> {
  const hasPermission = await requestPermissions(source);
  if (!hasPermission) return null;

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    quality: 0.8,
    allowsEditing: false,
  };

  const result =
    source === "camera"
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

  if (result.canceled || !result.assets?.[0]?.uri) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
  };
}

export async function detectIngredientsFromImage(
  image: PickedImage
): Promise<string[]> {
  try {
    // Resize to ~768px and get base64
    const base64 = await resizeAndEncode(image);

    // Send to Gemini with the cached system instructions
    const result = await ingredientModel.generateContent([
      "Identify all food ingredients in this image.",
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64,
        },
      },
    ]);

    const text = result.response.text().trim();

    if (text.toLowerCase() === "none" || !text) {
      return [];
    }

    // Parse comma-separated ingredients
    const ingredients = text
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && item.length < 60);

    return ingredients;
  } catch (error: any) {
    console.error("Ingredient detection error:", error);
    throw new Error(
      "Could not detect ingredients. Please try again or enter them manually."
    );
  }
}
