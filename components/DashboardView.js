import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { getDashboardStats } from "../database";

const { width } = Dimensions.get("window");

export default function DashboardView({ userId }) {
  const [stats, setStats] = useState({
    streak: 0,
    bestStreak: 0,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    weeklyActivity: [],
    weeklyAverage: 0,
    totalCompleted: 0,
  });

  useEffect(() => {
    loadStats();
  }, [userId]);

  // Carrega as estatísticas do dashboard (streak, xp, nível, etc)
  const loadStats = () => {
    const data = getDashboardStats(userId);
    setStats(data);
  };

  // Componente auxiliar para renderizar cards de estatísticas
  const StatCard = ({ icon, value, label, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Feather name={icon} size={24} color="#fff" />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Card de Cabeçalho com Saudação e Progresso Diário */}
      <LinearGradient
        colors={["#4facfe", "#00f2fe"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <View>
          <Text style={styles.greeting}>Olá, Campeão! 👋</Text>
          <Text style={styles.subGreeting}>
            Vamos começar? Seu futuro eu agradece!
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Progresso Hoje</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "0%" }]} />
            </View>
            <Text style={styles.progressPercent}>0%</Text>
          </View>
        </View>
        <Feather
          name="star"
          size={120}
          color="rgba(255,255,255,0.1)"
          style={styles.bgIcon}
        />
      </LinearGradient>

      {/* Card de Nível e XP */}
      <LinearGradient
        colors={["#c084fc", "#db2777"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.levelCard}
      >
        <View style={styles.levelInfo}>
          <Text style={styles.levelLabel}>Seu Nível</Text>
          <Text style={styles.levelValue}>Nível {stats.level}</Text>
          <Text style={styles.xpText}>{stats.xp} XP</Text>
        </View>
        <View style={styles.levelIconBox}>
          <Feather name="zap" size={32} color="#fff" />
        </View>
        <View style={styles.xpBarContainer}>
          <View style={[styles.xpBarFill, { width: `${100 - stats.xpToNextLevel}%` }]} />
        </View>
        <Text style={styles.xpRemaining}>Faltam {stats.xpToNextLevel} XP</Text>
      </LinearGradient>

      {/* Grade de Estatísticas Gerais */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="flame"
          value={stats.streak}
          label="Sequência Atual"
          color="#4ade80"
        />
        <StatCard
          icon="award"
          value={stats.bestStreak}
          label="Melhor Sequência"
          color="#8b5cf6"
        />
        <StatCard
          icon="target"
          value={stats.weeklyAverage}
          label="Média Semanal"
          color="#f97316"
        />
        <StatCard
          icon="check-circle"
          value={stats.totalCompleted}
          label="Total Completos"
          color="#ec4899"
        />
      </View>

      {/* Desafio Semanal */}
      <LinearGradient
        colors={["#f59e0b", "#f97316"]}
        style={styles.challengeCard}
      >
        <View style={styles.challengeHeader}>
          <Feather name="zap" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.challengeTitle}>Desafio da Semana</Text>
        </View>
        <Text style={styles.challengeDesc}>
          Complete todos os hábitos por 7 dias seguidos
        </Text>
        <View style={styles.challengeProgressRow}>
          <Text style={styles.challengeProgressText}>Progresso</Text>
          <Text style={styles.challengeProgressText}>
            {stats.streak > 7 ? 7 : stats.streak}/7 dias
          </Text>
        </View>
        <View style={styles.challengeBarBg}>
          <View
            style={[
              styles.challengeBarFill,
              { width: `${(Math.min(stats.streak, 7) / 7) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.rewardBadge}>
          <Text style={styles.rewardText}>
            Recompensa: 🏆 100 XP + Badge Especial
          </Text>
        </View>
        <View style={styles.calendarIconBox}>
          <Feather name="calendar" size={24} color="#fff" />
        </View>
      </LinearGradient>

      {/* Gráfico de Atividade Recente */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Feather name="trending-up" size={20} color="#22c55e" />
          <Text style={styles.chartTitle}>Atividade Recente (7 dias)</Text>
        </View>
        <View style={styles.chartBars}>
          {stats.weeklyActivity.map((day, index) => (
            <View key={index} style={styles.chartBarContainer}>
              <View style={styles.barTrack}>
                <LinearGradient
                  colors={["#4ade80", "#22c55e"]}
                  style={[
                    styles.barFill,
                    { height: `${Math.min(day.count * 20, 100)}%` }, // Scale: 5 habits = 100%
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, index === 6 && { color: "#22c55e", fontWeight: "bold" }]}>
                {day.day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Insights */}
      <LinearGradient
        colors={["#6366f1", "#8b5cf6"]}
        style={styles.insightsCard}
      >
        <View style={styles.insightsHeader}>
          <Feather name="sun" size={20} color="#fcd34d" />
          <Text style={styles.insightsTitle}>Insights Inteligentes</Text>
        </View>
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            🌱 Comece criando seu primeiro hábito! Pequenos passos levam a
            grandes mudanças.
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  headerCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  bgIcon: {
    position: "absolute",
    right: -20,
    top: -20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 20,
    maxWidth: "80%",
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabel: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 6,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  progressPercent: {
    position: "absolute",
    right: 0,
    top: -20,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  levelCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    position: "relative",
  },
  levelInfo: {
    marginBottom: 16,
  },
  levelLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  levelValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  xpText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },
  levelIconBox: {
    position: "absolute",
    right: 24,
    top: 24,
    width: 50,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  xpBarContainer: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 4,
    marginBottom: 8,
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  xpRemaining: {
    textAlign: "right",
    color: "#fff",
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  challengeCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    position: "relative",
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  challengeDesc: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginBottom: 16,
    maxWidth: "80%",
  },
  challengeProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  challengeProgressText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  challengeBarBg: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 5,
    marginBottom: 16,
  },
  challengeBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  rewardBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  rewardText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  calendarIconBox: {
    position: "absolute",
    top: 24,
    right: 24,
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 8,
  },
  chartBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
  },
  chartBarContainer: {
    alignItems: "center",
    flex: 1,
  },
  barTrack: {
    width: 12,
    height: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 12,
    color: "#9ca3af",
  },
  insightsCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  insightBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 16,
  },
  insightText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
});
