import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function SafetyScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [eyeHealth, setEyeHealth] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
      analyzeEyeHealth(result.assets[0].base64);
    }
  };

  const analyzeEyeHealth = async (base64Image: string | undefined) => {
    if (!base64Image) return;
    setLoading(true);

    try {
      const response = await fetch("YOUR_MODEL_API_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      setEyeHealth(`Eye Health: ${data.percentage}%`);
    } catch (error) {
      console.error("Error analyzing eye health:", error);
      setEyeHealth("Error analyzing eye health.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ Safety Check</Text>

      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Capture Eye Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        eyeHealth && <Text style={styles.result}>{eyeHealth}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6F0FF",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#003366",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  loader: {
    marginTop: 20,
  },
  result: {
    fontSize: 20,
    color: "#003366",
    marginTop: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
});
