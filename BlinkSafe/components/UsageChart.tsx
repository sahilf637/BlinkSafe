import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, Text as SvgText, G } from "react-native-svg";

interface UsageChartProps {
  data: { appName: string; usageTime: number }[];
}

const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get("window").width - 40;
  const chartHeight = 250;
  const barWidth = 40;
  const barSpacing = 30;
  const topPadding = 20; // ✅ Extra space at the top
  const visibleData = data.sort((a, b) => b.usageTime - a.usageTime).slice(0, 5);
  const maxUsage = Math.max(...visibleData.map((d) => d.usageTime), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 5 App Usage (Minutes)</Text>
      <Svg width={screenWidth} height={chartHeight + 50}>
        {/* Bars */}
        {visibleData.map((item, index) => {
          const barHeight = (item.usageTime / maxUsage) * (chartHeight - topPadding);
          return (
            <Rect
              key={index}
              x={index * (barWidth + barSpacing) + 30}
              y={chartHeight - barHeight}
              width={barWidth}
              height={barHeight}
              fill="#007AFF"
              rx={4}
            />
          );
        })}

        {/* Usage Labels Above Bars */}
        {visibleData.map((item, index) => {
          const barHeight = (item.usageTime / maxUsage) * (chartHeight - topPadding);
          return (
            <SvgText
              key={index}
              x={index * (barWidth + barSpacing) + 30 + barWidth / 2}
              y={chartHeight - barHeight - 8} // ✅ Keeps labels from touching the top
              fontSize="12"
              fill="black"
              textAnchor="middle"
            >
              {item.usageTime}m
            </SvgText>
          );
        })}

        {/* X-Axis Labels (App Names) */}
        <G transform={`translate(30, ${chartHeight})`}>
          {visibleData.map((item, index) => (
            <SvgText
              key={index}
              x={index * (barWidth + barSpacing) + barWidth / 2}
              y={20}
              fontSize="12"
              fill="black"
              textAnchor="middle"
            >
              {item.appName.length > 8 ? item.appName.slice(0, 6) + "..." : item.appName}
            </SvgText>
          ))}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default UsageChart;
