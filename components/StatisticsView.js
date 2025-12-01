import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { getDetailedStats } from "../database";

const { width } = Dimensions.get("window");

export default function StatisticsView({ userId }) {
  const [stats, setStats] = useState({
    activeHabits: 0,
    completedToday: 0,
    totalCompleted: 0,
    bestStreak: 0,
    weeklyActivity: [],
  });

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = () => {
    const data = getDetailedStats(userId);
    setStats(data);
  };

  const StatCard = ({ title, value, subtitle, color, icon }) => (
    <LinearGradient
      colors={color}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statCard}
    >
      <View style={styles.statIcon}>
        <Feather name={icon} size={24} color="#fff" />
      </View>
      <View>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={["#2dd4bf", "#0d9488"]}
        style={styles.header}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="bar-chart-2" size={24} color="#fcd34d" />
          <Text style={styles.headerTitle}>Conquista Diária</Text>
        </View>
        <Text style={styles.headerSubtitle}>Estatísticas detalhadas</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Grid of Stats */}
        <View style={styles.grid}>
          <View style={styles.row}>
            <StatCard
              title="Hoje"
              value={stats.completedToday}
              subtitle={`de ${stats.activeHabits} hábitos`}
              color={["#4ade80", "#22c55e"]}
              icon="target"
            />
            <StatCard
              title="Melhor Sequência"
              value={stats.bestStreak}
              subtitle="dias seguidos"
              color={["#2dd4bf", "#0f766e"]}
              icon="award"
            />
          </View>
          <View style={styles.row}>
            <StatCard
              title="Total"
              value={stats.totalCompleted}
              subtitle="completados"
              color={["#818cf8", "#6366f1"]}
              icon="calendar"
            />
            <StatCard
              title="Hábitos Ativos"
              value={stats.activeHabits}
              subtitle="cadastrados"
              color={["#e879f9", "#d946ef"]}
              icon="trending-up"
            />
          </View>
        </View>

        {/* Weekly Progress Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Progresso da Semana</Text>
          <View style={styles.chartContainer}>
            {stats.weeklyActivity.map((day, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barBg}>
                  <LinearGradient
                    colors={["#e5e7eb", "#f3f4f6"]} // Empty state
                    style={[styles.barFill, { height: "100%" }]}
                  />
                  <LinearGradient
                    colors={["#2dd4bf", "#0d9488"]}
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.min(day.count * 20, 100)}%`,
                        position: "absolute",
                        bottom: 0,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.dayLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    marginLeft: 32,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  grid: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    height: 140,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  statTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  statSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 150,
    alignItems: "flex-end",
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
  },
  barBg: {
    width: 12,
    height: 120,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
    position: "relative",
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
});
