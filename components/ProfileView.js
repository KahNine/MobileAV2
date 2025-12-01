import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getUserStats } from "../database";

export default function ProfileView({ userId, username, onLogout }) {
  const [stats, setStats] = useState({ totalHabits: 0, completedToday: 0 });

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = () => {
    const data = getUserStats(userId);
    setStats(data);
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: onLogout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#4ade80", "#3b82f6"]}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>
              {username ? username.charAt(0).toUpperCase() : "U"}
            </Text>
          </LinearGradient>
        </View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.userTag}>Membro Premium</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Feather name="check-circle" size={24} color="#4ade80" />
          <Text style={styles.statValue}>{stats.completedToday}</Text>
          <Text style={styles.statLabel}>Hoje</Text>
        </View>
        <View style={styles.statCard}>
          <Feather name="award" size={24} color="#f59e0b" />
          <Text style={styles.statValue}>{stats.totalHabits}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: "#e0f2fe" }]}>
            <Feather name="settings" size={20} color="#0284c7" />
          </View>
          <Text style={styles.menuText}>Configurações</Text>
          <Feather name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconBox, { backgroundColor: "#fef3c7" }]}>
            <Feather name="bell" size={20} color="#d97706" />
          </View>
          <Text style={styles.menuText}>Notificações</Text>
          <Feather name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={[styles.iconBox, { backgroundColor: "#fee2e2" }]}>
            <Feather name="log-out" size={20} color="#dc2626" />
          </View>
          <Text style={[styles.menuText, { color: "#dc2626" }]}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    elevation: 10,
    shadowColor: "#4ade80",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  userTag: {
    fontSize: 14,
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
});
