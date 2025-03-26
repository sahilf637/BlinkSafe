import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface AppUsageCardProps {
  appName: string;
  usageTime: string; // Example: "2h 30m"
}

const AppUsageCard: React.FC<AppUsageCardProps> = ({ appName, usageTime }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.appName}>{appName}</Text>
      <Text style={styles.usageTime}>{usageTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  usageTime: {
    fontSize: 16,
    color: "#666",
  },
});

export default AppUsageCard;
