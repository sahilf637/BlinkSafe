import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import  EyeNotificationService from "../../hooks/useMail";
import { API_KEY, BIN_ID } from '@env';


export default function SmartCareScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Secure API details
  const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(URL, {
        headers: {
          "X-Master-Key": API_KEY,
        },
      });
      
      const json = await response.json();
      if(json.record.average_redness >= 75 && json.record.average_dryness >= 75 && json.record.drowsiness_status >= 75) {
        handleEyeProblem();
      }
      setData(json.record);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEyeProblem = async () => {
    try {
      await EyeNotificationService.sendEyeWarning();
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData(); // Initial fetch on mount
    
    const interval = setInterval(() => {
      fetchData(); // Re-fetch every 4 minutes (240,000 ms)
    }, 60000);
    
    return () => clearInterval(interval); // Clean up
  }, []);

  // Get health status and recommendations based on metrics
  const getHealthStatus = (metric, value) => {
    if (!value && value !== 0) return { status: "Unknown", color: "#9e9e9e" };
    
    const thresholds = {
      average_redness: { low: 10, medium: 30, high: 50 },
      average_dryness: { low: 15, medium: 40, high: 60 },
      drowsiness_status: { low: 20, medium: 50, high: 70 }
    };
    
    const threshold = thresholds[metric];
    
    if (value < threshold.low) {
      return { status: "Excellent", color: "#4caf50" };
    } else if (value < threshold.medium) {
      return { status: "Good", color: "#8bc34a" };
    } else if (value < threshold.high) {
      return { status: "Moderate", color: "#ffb300" };
    } else {
      return { status: "Critical", color: "#f44336" };
    }
  };

  // Generate personalized recommendations based on eye health metrics
  const getRecommendations = () => {
    if (!data) return [];
    
    const recommendations = [];
    
    // Redness recommendations
    const rednessStatus = getHealthStatus("average_redness", data.average_redness).status;
    if (rednessStatus === "Moderate" || rednessStatus === "Critical") {
      recommendations.push({
        icon: "water-outline",
        title: "Stay Hydrated",
        description: "Drink more water to reduce eye redness and irritation."
      });
      recommendations.push({
        icon: "eye-outline",
        title: "Rest Your Eyes",
        description: "Take a 5-minute break every 20 minutes of screen time."
      });
    }
    
    // Dryness recommendations
    const drynessStatus = getHealthStatus("average_dryness", data.average_dryness).status;
    if (drynessStatus === "Moderate" || drynessStatus === "Critical") {
      recommendations.push({
        icon: "rainy-outline",
        title: "Blink More Often",
        description: "Remember to blink frequently to maintain eye moisture."
      });
      recommendations.push({
        icon: "thermometer-outline",
        title: "Adjust Environment",
        description: "Use a humidifier if you're in a dry environment."
      });
    }
    
    // Drowsiness recommendations
    const drowsinessStatus = getHealthStatus("drowsiness_status", data.drowsiness_status).status;
    if (drowsinessStatus === "Moderate" || drowsinessStatus === "Critical") {
      recommendations.push({
        icon: "bed-outline",
        title: "Get More Sleep",
        description: "Aim for 7-8 hours of quality sleep tonight."
      });
      recommendations.push({
        icon: "walk-outline",
        title: "Take a Break",
        description: "Stand up and walk around for a few minutes."
      });
    }
    
    // General recommendations
    if (recommendations.length < 2) {
      recommendations.push({
        icon: "timer-outline",
        title: "Follow 20-20-20 Rule",
        description: "Every 20 minutes, look at something 20 feet away for 20 seconds."
      });
    }
    
    return recommendations;
  };

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4158D0" />
          <Text style={styles.loadingText}>Analyzing your eye health data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={50} color="#f44336" />
          <Text style={styles.error}>Unable to load your health data.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const recommendations = getRecommendations();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4158D0"]} />
        }
      >
        <LinearGradient
          colors={["#4158D0", "#C850C0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.title}>SmartCare Analysis</Text>
          <Text style={styles.subtitle}>Real-time eye health monitoring</Text>
        </LinearGradient>

        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Current Metrics</Text>
          
          {/* Eye Redness Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="eye-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Eye Redness</Text>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.metricRow}>
                <View style={styles.metricValue}>
                  <Text style={styles.valueText}>{data.average_redness?.toFixed(1)}%</Text>
                  <Text style={[
                    styles.statusText, 
                    { color: getHealthStatus("average_redness", data.average_redness).color }
                  ]}>
                    {getHealthStatus("average_redness", data.average_redness).status}
                  </Text>
                </View>
                
                <View style={styles.gauge}>
                  <View 
                    style={[
                      styles.gaugeProgress, 
                      { 
                        width: `${Math.min(100, data.average_redness || 0)}%`,
                        backgroundColor: getHealthStatus("average_redness", data.average_redness).color 
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>
          
          {/* Eye Dryness Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: "#26c6da" }]}>
                <Ionicons name="water-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Eye Dryness</Text>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.metricRow}>
                <View style={styles.metricValue}>
                  <Text style={styles.valueText}>{data.average_dryness?.toFixed(1)}%</Text>
                  <Text style={[
                    styles.statusText, 
                    { color: getHealthStatus("average_dryness", data.average_dryness).color }
                  ]}>
                    {getHealthStatus("average_dryness", data.average_dryness).status}
                  </Text>
                </View>
                
                <View style={styles.gauge}>
                  <View 
                    style={[
                      styles.gaugeProgress, 
                      { 
                        width: `${Math.min(100, data.average_dryness || 0)}%`,
                        backgroundColor: getHealthStatus("average_dryness", data.average_dryness).color 
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>
          
          {/* Drowsiness Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: "#7e57c2" }]}>
                <Ionicons name="moon-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Drowsiness Level</Text>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.metricRow}>
                <View style={styles.metricValue}>
                  <Text style={styles.valueText}>{data.drowsiness_status?.toFixed(1)}%</Text>
                  <Text style={[
                    styles.statusText, 
                    { color: getHealthStatus("drowsiness_status", data.drowsiness_status).color }
                  ]}>
                    {getHealthStatus("drowsiness_status", data.drowsiness_status).status}
                  </Text>
                </View>
                
                <View style={styles.gauge}>
                  <View 
                    style={[
                      styles.gaugeProgress, 
                      { 
                        width: `${Math.min(100, data.drowsiness_status || 0)}%`,
                        backgroundColor: getHealthStatus("drowsiness_status", data.drowsiness_status).color 
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Recommendations Section */}
        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
          
          {recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationCard}>
              <View style={styles.recommendationIcon}>
                <Ionicons name={recommendation.icon} size={24} color="#4158D0" />
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                <Text style={styles.recommendationText}>{recommendation.description}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Next update in a few minutes
          </Text>
          <Text style={styles.disclaimerText}>
            This analysis is based on camera data and is for informational purposes only.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 5,
  },
  metricsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4158D0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cardContent: {
    padding: 16,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricValue: {
    width: "30%",
  },
  valueText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  gauge: {
    flex: 1,
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
    marginLeft: 16,
  },
  gaugeProgress: {
    height: "100%",
    borderRadius: 6,
  },
  recommendationsContainer: {
    padding: 16,
  },
  recommendationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  recommendationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(65, 88, 208, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  error: {
    color: "#f44336",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4158D0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});