import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  SafeAreaView 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StatsCategory from "../../components/StatsCategory";
import UsageChart from "../../components/UsageChart";

export default function Stats() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    totalTime: 0,
    eyeStrainEvents: 0,
    healthyBreaks: 0
  });
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;
  
  // Get screen dimensions
  const { width } = Dimensions.get('window');
  
  useEffect(() => {
    // Mock data with more detailed stats
    const mockStats = {
      today: [
        { appName: "WhatsApp", usageTime: 25, eyeStrainEvents: 2 },
        { appName: "Instagram", usageTime: 15, eyeStrainEvents: 1 },
        { appName: "YouTube", usageTime: 30, eyeStrainEvents: 3 },
        { appName: "TikTok", usageTime: 20, eyeStrainEvents: 2 },
      ],
      yesterday: [
        { appName: "Chrome", usageTime: 20, eyeStrainEvents: 2 },
        { appName: "Facebook", usageTime: 10, eyeStrainEvents: 0 },
        { appName: "YouTube", usageTime: 35, eyeStrainEvents: 4 },
        { appName: "Netflix", usageTime: 45, eyeStrainEvents: 5 },
      ],
      lastWeek: [
        { appName: "WhatsApp", usageTime: 150, eyeStrainEvents: 12 },
        { appName: "Instagram", usageTime: 140, eyeStrainEvents: 15 },
        { appName: "YouTube", usageTime: 170, eyeStrainEvents: 20 },
        { appName: "TikTok", usageTime: 120, eyeStrainEvents: 18 },
        { appName: "Netflix", usageTime: 200, eyeStrainEvents: 25 },
      ],
    };

    const loadData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats(mockStats);
      calculateSummary(mockStats[selectedPeriod]);
      setLoading(false);
      
      // Trigger animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
    };
    
    loadData();
  }, []);
  
  // Recalculate summary when period changes
  useEffect(() => {
    if (stats) {
      calculateSummary(stats[selectedPeriod]);
      
      // Trigger animations when tab changes
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ])
      ]).start();
    }
  }, [selectedPeriod]);
  
  const calculateSummary = (data) => {
    if (!data) return;
    
    const totalTime = data.reduce((sum, app) => sum + app.usageTime, 0);
    const eyeStrainEvents = data.reduce((sum, app) => sum + (app.eyeStrainEvents || 0), 0);
    const healthyBreaks = Math.floor(totalTime / 30); // Assuming 1 healthy break per 30 mins
    
    setSummaryData({
      totalTime,
      eyeStrainEvents,
      healthyBreaks
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient 
          colors={["#4158D0", "#C850C0"]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Usage Statistics</Text>
        </LinearGradient>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4158D0" />
          <Text style={styles.loadingText}>Loading your statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <LinearGradient 
        colors={["#4158D0", "#C850C0"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Usage Statistics</Text>
      </LinearGradient>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Period Selection */}
        <View style={styles.periodSelector}>
          {["today", "yesterday", "lastWeek"].map((period) => (
            <TouchableOpacity 
              key={period} 
              onPress={() => setSelectedPeriod(period)} 
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriodButton
              ]}
            >
              <Text 
                style={[
                  styles.periodText, 
                  selectedPeriod === period && styles.selectedText
                ]}
              >
                {period === "lastWeek" ? "Last Week" : period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Stats Summary Cards */}
        <Animated.View 
          style={[
            styles.summaryContainer,
            { opacity: fadeAnim, transform: [{ translateY: translateAnim }] }
          ]}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summaryData.totalTime}m</Text>
            <Text style={styles.summaryLabel}>Screen Time</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summaryData.eyeStrainEvents}</Text>
            <Text style={styles.summaryLabel}>Eye Strain Events</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summaryData.healthyBreaks}</Text>
            <Text style={styles.summaryLabel}>Healthy Breaks</Text>
          </View>
        </Animated.View>
        
        {/* Chart Section */}
        <Animated.View 
          style={[
            styles.chartContainer,
            { opacity: fadeAnim, transform: [{ translateY: translateAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Usage Distribution</Text>
          <UsageChart data={stats[selectedPeriod]} />
        </Animated.View>
        
        {/* App Usage List */}
        <Animated.View 
          style={[
            styles.listContainer,
            { opacity: fadeAnim, transform: [{ translateY: translateAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>App Breakdown</Text>
          <StatsCategory 
            title={`${selectedPeriod === "lastWeek" ? "Last Week" : selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Usage`} 
            data={stats[selectedPeriod]} 
          />
        </Animated.View>
        
        {/* Health Recommendations */}
        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Eye Health Tips</Text>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationIcon}>💧</Text>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Take More Breaks</Text>
              <Text style={styles.recommendationText}>
                Try the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.
              </Text>
            </View>
          </View>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationIcon}>🌙</Text>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Night Mode</Text>
              <Text style={styles.recommendationText}>
                Reduce blue light exposure in the evening. Enable night mode on your device.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginVertical: 15,
    shadowColor: "#4158D0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  selectedPeriodButton: {
    backgroundColor: "rgba(65, 88, 208, 0.1)",
  },
  periodText: {
    fontSize: 14,
    color: "#666",
  },
  selectedText: {
    fontWeight: "bold",
    color: "#4158D0",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    margin: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4158D0",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  recommendationsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recommendationCard: {
    flexDirection: "row",
    backgroundColor: "rgba(65, 88, 208, 0.05)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 12,
    alignSelf: "center",
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4158D0",
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});