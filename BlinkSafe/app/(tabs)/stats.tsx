import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import StatsCategory from "../../components/StatsCategory";
import UsageChart from "../../components/UsageChart";

export default function Stats() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockStats = {
      today: [
        { appName: "WhatsApp", usageTime: 25 },
        { appName: "Instagram", usageTime: 15 },
        { appName: "YouTube", usageTime: 30 },
      ],
      yesterday: [
        { appName: "Chrome", usageTime: 20 },
        { appName: "Facebook", usageTime: 10 },
        { appName: "YouTube", usageTime: 35 },
      ],
      lastWeek: [
        { appName: "WhatsApp", usageTime: 50 },
        { appName: "Instagram", usageTime: 40 },
        { appName: "YouTube", usageTime: 70 },
      ],
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Period Selection */}
      <View style={styles.periodSelector}>
        {["today", "yesterday", "lastWeek"].map((period) => (
          <TouchableOpacity key={period} onPress={() => setSelectedPeriod(period)} style={styles.periodButton}>
            <Text style={[styles.periodText, selectedPeriod === period && styles.selectedText]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      <UsageChart data={stats[selectedPeriod]} />

      {/* List of Usage */}
      <StatsCategory title={`${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Usage`} data={stats[selectedPeriod]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  periodButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#EEE",
  },
  periodText: {
    fontSize: 16,
    color: "#666",
  },
  selectedText: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
