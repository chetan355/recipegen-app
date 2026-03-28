import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import IngredientChip from "../components/IngredientChip";
import MyButton from "../components/MyButtton";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/types";
import { generateRecipes } from "../services/gemini";
import {
  detectIngredientsFromImage,
  pickImage,
} from "../services/ingredientDetector";

const timeOptions = ["<30m", "30-60m", "1h+"];
const difficultyOptions = ["Easy", "Medium", "Hard"];
const cuisineOptions = [
  "Any",
  "Italian",
  "Indian",
  "Chinese",
  "Mexican",
  "Japanese",
  "Thai",
  "French",
  "Mediterranean",
  "American",
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [ingredients, setIngredients] = useState("");
  const [selectedTime, setSelectedTime] = useState("<30m");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
  const [selectedCuisine, setSelectedCuisine] = useState("Any");
  const [cuisineModalVisible, setCuisineModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanSourceModalVisible, setScanSourceModalVisible] = useState(false);

  const handleScanIngredients = async (source: "camera" | "gallery") => {
    setScanSourceModalVisible(false);
    try {
      const image = await pickImage(source);
      if (!image) return;

      setScanning(true);
      const detectedIngredients = await detectIngredientsFromImage(image);

      if (detectedIngredients.length === 0) {
        Alert.alert(
          "No Ingredients Found",
          "Could not detect food ingredients in this image. Try a clearer photo or enter ingredients manually."
        );
        return;
      }

      const ingredientText = detectedIngredients.join(", ");
      setIngredients((prev) =>
        prev.trim() ? `${prev.trim()}, ${ingredientText}` : ingredientText
      );

      Alert.alert(
        "Ingredients Detected!",
        `Found: ${ingredientText}`,
      );
    } catch (error: any) {
      Alert.alert(
        "Detection Failed",
        error.message || "Could not detect ingredients. Please try again."
      );
    } finally {
      setScanning(false);
    }
  };

  const quickAdd = [
    "🥕 Carrot",
    "🍗 Chicken",
    "🍅 Tomato",
    "🧄 Garlic",
    "🥔 Potato",
    "🧅 Onion",
  ];

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      Alert.alert("Missing Ingredients", "Please enter at least one ingredient to generate recipes.");
      return;
    }

    setLoading(true);
    try {
      const recipes = await generateRecipes({
        ingredients: ingredients.trim(),
        cuisine: selectedCuisine,
        time: selectedTime,
        difficulty: selectedDifficulty,
      });

      navigation.navigate("RecipeList", { recipes });
    } catch (error: any) {
      Alert.alert(
        "Generation Failed",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        What's in your kitchen?
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.inputBg, color: colors.text },
        ]}
        placeholder="Enter ingredients (e.g., tomatoes, pasta, garlic...)"
        placeholderTextColor={colors.gray}
        multiline
        value={ingredients}
        onChangeText={setIngredients}
      />

      {/* Scan Ingredients Button */}
      {scanning ? (
        <View style={styles.scanLoadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.scanLoadingText, { color: colors.gray }]}>
            🔍 Detecting ingredients...
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.scanButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
          activeOpacity={0.7}
          onPress={() => setScanSourceModalVisible(true)}
        >
          <Ionicons name="camera-outline" size={22} color={colors.primary} />
          <Text style={[styles.scanButtonText, { color: colors.primary }]}>
            Scan Ingredients
          </Text>
        </TouchableOpacity>
      )}

      {/* Scan Source Modal */}
      <Modal
        visible={scanSourceModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setScanSourceModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setScanSourceModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Scan Ingredients
            </Text>
            <TouchableOpacity
              style={[styles.scanOption, { borderColor: colors.border }]}
              activeOpacity={0.7}
              onPress={() => handleScanIngredients("camera")}
            >
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={[styles.scanOptionText, { color: colors.text }]}>
                Take Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.scanOption, { borderColor: colors.border }]}
              activeOpacity={0.7}
              onPress={() => handleScanIngredients("gallery")}
            >
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={[styles.scanOptionText, { color: colors.text }]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={[styles.section, { color: colors.text }]}>Quick Add</Text>

      <View style={styles.chips}>
        {quickAdd.map((item) => (
          <IngredientChip
            key={item}
            label={item}
            onPress={() => setIngredients((prev) => prev + " " + item)}
          />
        ))}
      </View>

      <Text style={[styles.section, { color: colors.text }]}>Preferences</Text>

      <Text style={[styles.label, { color: colors.text }]}>Cuisine</Text>

      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: colors.card }]}
        activeOpacity={0.6}
        onPress={() => setCuisineModalVisible(true)}
      >
        <Text style={{ color: colors.text }}>{selectedCuisine}</Text>
        <Text style={[styles.dropdownArrow, { color: colors.gray }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={cuisineModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCuisineModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCuisineModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Cuisine
            </Text>
            <ScrollView>
              {cuisineOptions.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine}
                  style={[
                    styles.modalOption,
                    selectedCuisine === cuisine && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => {
                    setSelectedCuisine(cuisine);
                    setCuisineModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: colors.text },
                      selectedCuisine === cuisine && { color: "#FFF", fontWeight: "600" },
                    ]}
                  >
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={[styles.label, { color: colors.text }]}>Time Available</Text>

      <View style={styles.row}>
        {timeOptions.map((time) => (
          <TouchableOpacity
            key={time}
            style={
              selectedTime === time
                ? [styles.activeBtn, { backgroundColor: colors.primary }]
                : [styles.btn, { borderColor: colors.border }]
            }
            activeOpacity={0.6}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={
                selectedTime === time
                  ? styles.activeText
                  : { color: colors.text }
              }
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Difficulty</Text>

      <View style={styles.row}>
        {difficultyOptions.map((difficulty) => (
          <TouchableOpacity
            key={difficulty}
            style={
              selectedDifficulty === difficulty
                ? [styles.activeBtn, { backgroundColor: colors.primary }]
                : [styles.btn, { borderColor: colors.border }]
            }
            activeOpacity={0.6}
            onPress={() => setSelectedDifficulty(difficulty)}
          >
            <Text
              style={
                selectedDifficulty === difficulty
                  ? styles.activeText
                  : { color: colors.text }
              }
            >
              {difficulty}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.generateButtonContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.gray }]}>
              Generating delicious recipes...
            </Text>
          </View>
        ) : (
          <MyButton title={"Generate Recipe"} onPress={handleGenerateRecipe} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    height: 120,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  label: {
    marginTop: 10,
    fontWeight: "500",
  },
  dropdown: {
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownArrow: {
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
  },
  btn: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    width: 90,
    alignItems: "center",
  },
  activeBtn: {
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    width: 90,
    alignItems: "center",
  },
  activeText: {
    color: "#FFF",
    fontWeight: "600",
  },
  generateButtonContainer: {
    marginTop: 30,
    marginBottom: 40,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  modalOptionText: {
    fontSize: 16,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    marginBottom: 6,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  scanLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    marginBottom: 6,
  },
  scanLoadingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scanOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  scanOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});