import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AppUsageCard from "./AppUsageCard";

interface StatsCategoryProps {
  title: string;
  data: { appName: string; usageTime: string }[];
}

const StatsCategory: React.FC<StatsCategoryProps> = ({ title, data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.appName || index.toString()}
          renderItem={({ item }) => (
            <AppUsageCard appName={item.appName} usageTime={item.usageTime} />
          )}
          scrollEnabled={false} // Disable internal scrolling
          showsVerticalScrollIndicator={false} // Hide scroll indicator
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // Add spacing between items
          ListFooterComponent={() => <View style={{ height: 10 }} />} // Bottom spacing
          initialNumToRender={data.length} // Render all items immediately
          removeClippedSubviews={false} // Prevent item clipping
        />
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
});

export default StatsCategory;