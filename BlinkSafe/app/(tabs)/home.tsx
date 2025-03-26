import { View, Text, StyleSheet, Image, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Fade-in effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Bounce effect for features
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 3,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#007AFF", "#00C6FF"]} style={styles.header}>
        <Image source={require("../../assets/logo.jpeg")} style={styles.logo} />
        <Text style={styles.title}>BlinkSafe</Text>
      </LinearGradient>

      {/* Fade-in Description */}
      <Animated.View style={{ ...styles.textContainer, opacity: fadeAnim }}>
        <Text style={styles.description}>
          <Text style={styles.bold}>BlinkSafe</Text> protects children's eyes from
          <Text style={styles.bold}> excessive screen time</Text> using
          <Text style={styles.bold}> advanced Machine Learning & Computer Vision</Text>.
        </Text>

        <Text style={styles.description}>
          🔥 <Text style={styles.bold}>How It Works?</Text>
          The app <Text style={styles.bold}>detects eye redness & dryness</Text> and
          <Text style={styles.bold}> automatically locks the screen</Text> when excessive strain is detected,
          requiring a <Text style={styles.bold}>parental password</Text> to unlock.
        </Text>
      </Animated.View>

      {/* Features List with Bounce Effect */}
      <Animated.View style={{ ...styles.featuresContainer, transform: [{ scale: bounceAnim }] }}>
        <Text style={styles.feature}>🔍 AI-Powered Eye Strain Detection</Text>
        <Text style={styles.feature}>📱 Smart Screen Lock to Prevent Overuse</Text>
        <Text style={styles.feature}>🛡️ Ensures Healthy Screen Time</Text>
        <Text style={styles.feature}>👨‍👩‍👧‍👦 Parental Unlock for Extra Safety</Text>
      </Animated.View>

      {/* Final Encouragement */}
      <Text style={styles.footer}>
        🌟 <Text style={styles.bold}>Empower healthy screen habits!</Text>  
        Protect your child’s <Text style={styles.bold}>vision</Text> with <Text style={styles.bold}>BlinkSafe</Text>. 🚀  
      </Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  header: {
    width: "100%",
    paddingVertical: 30,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  textContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#444",
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  bold: {
    fontWeight: "bold",
  },
  featuresContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  feature: {
    fontSize: 16,
    color: "#007AFF",
    marginVertical: 5,
    textAlign: "center",
    fontWeight: "600",
  },
  footer: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
});
