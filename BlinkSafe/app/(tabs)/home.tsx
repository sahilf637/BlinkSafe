import { View, Text, StyleSheet, Image, Animated, Easing, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Sequence of animations for smoother loading
    Animated.sequence([
      // Fade and slide in header
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      // Scale in features after header appears
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderFeatureCard = (icon, title, description) => (
    <Animated.View 
      style={[
        styles.featureCard, 
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            styles.headerContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient 
            colors={["#4158D0", "#C850C0", "#FFCC70"]} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.logoContainer}>
              <Image 
                source={require("../../assets/logo.jpeg")} 
                style={styles.logo} 
              />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.title}>BlinkSafe</Text>
              <Text style={styles.tagline}>
                Protecting young eyes with intelligent vision care
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Highlights - Modified to be more general claims */}
        <Animated.View 
          style={[
            styles.statsContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Reduce</Text>
            <Text style={styles.statLabel}>Screen Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Prevent</Text>
            <Text style={styles.statLabel}>Eye Strain</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Monitor</Text>
            <Text style={styles.statLabel}>Daily Usage</Text>
          </View>
        </Animated.View>

        {/* How It Works Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionDescription}>
            BlinkSafe uses advanced computer vision to monitor eye health in real-time,
            preventing digital eye strain before it happens.
          </Text>
        </View>
        
        {/* Features Section - Removed Smart Screen Lock */}
        <View style={styles.featuresGrid}>
          {renderFeatureCard(
            "🔍", 
            "AI Vision Analysis", 
            "Detects eye redness, dryness and blink rate changes in real-time"
          )}
          {renderFeatureCard(
            "📊", 
            "Usage Analytics", 
            "Track screen time patterns and eye health improvements"
          )}
          {renderFeatureCard(
            "🔑", 
            "Parental Controls", 
            "Custom time limits and password-protected override"
          )}
          {renderFeatureCard(
            "⏰", 
            "Break Reminders", 
            "Timely notifications to encourage healthy viewing habits"
          )}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.ctaButton}>
            <LinearGradient
              colors={["#4158D0", "#C850C0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.ctaSubtext}>
            Join thousands of parents protecting their children's vision
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    width: "100%",
    overflow: "hidden",
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 5,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 15,
    shadowColor: "#4158D0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4158D0",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
  ctaContainer: {
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  ctaButton: {
    width: "80%",
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#4158D0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  ctaSubtext: {
    fontSize: 13,
    color: "#666",
    marginTop: 12,
    textAlign: "center",
  },
});