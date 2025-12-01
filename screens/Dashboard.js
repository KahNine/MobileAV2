import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { createHabit } from "../database";
import { LinearGradient } from "expo-linear-gradient";

import DashboardView from "../components/DashboardView";
import CalendarView from "../components/CalendarView";
import ProfileView from "../components/ProfileView";
import HomeView from "../components/HomeView";
import StatisticsView from "../components/StatisticsView";
import NewHabitModal from "../components/NewHabitModal";

export default function DashboardScreen({ route, navigation }) {
  const { userId, username } = route.params || {
    userId: 1,
    username: "Visitante",
  };
  
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Início");
  // We use a key to force re-render of views when data might have changed
  const [refreshKey, setRefreshKey] = useState(0);

  // Função para salvar um novo hábito
  const handleAddHabit = (habitData) => {
    const res = createHabit(userId, habitData);
    if (res.success) {
      setModalVisible(false);
      setRefreshKey((prev) => prev + 1); // Força atualização das views
      Alert.alert("Sucesso", "Hábito criado com sucesso!");
    } else {
      Alert.alert("Erro", "Não foi possível criar o hábito");
    }
  };

  const handleLogout = () => {
    navigation.replace("Login");
  };

  // Renderiza o conteúdo principal com base na aba ativa
  const renderContent = () => {
    // Passa refreshKey para forçar re-renderização quando necessário
    if (activeTab === "Dashboard") {
      return <DashboardView userId={userId} key={refreshKey} />;
    }
    if (activeTab === "Estatísticas") {
      return <StatisticsView userId={userId} key={refreshKey} />;
    }
    if (activeTab === "Calendário") {
      return <CalendarView userId={userId} key={refreshKey} />;
    }
    if (activeTab === "Perfil") {
      return (
        <ProfileView
          userId={userId}
          username={username}
          onLogout={handleLogout}
        />
      );
    }

    // View padrão (Início)
    return <HomeView userId={userId} key={refreshKey} />;
  };

  const TabItem = ({ name, icon, label }) => (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={() => setActiveTab(name)}
    >
      <Feather
        name={icon}
        size={24}
        color={activeTab === name ? "#2dd4bf" : "#9ca3af"}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: activeTab === name ? "#2dd4bf" : "#9ca3af" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <StatusBar barStyle="dark-content" />

      {/* Main Content */}
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* Botão Flutuante (FAB) - Apenas na Home ou Dashboard */}
      {(activeTab === "Início" || activeTab === "Dashboard") && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#2dd4bf", "#0d9488"]}
            style={styles.fabGradient}
          >
            <Feather name="plus" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Barra de Abas Inferior */}
      <View style={styles.tabBar}>
        <TabItem name="Início" icon="home" label="Início" />
        <TabItem name="Dashboard" icon="grid" label="Dash" />
        <TabItem name="Estatísticas" icon="bar-chart-2" label="Stats" />
        <TabItem name="Calendário" icon="calendar" label="Agenda" />
        <TabItem name="Perfil" icon="user" label="Perfil" />
      </View>

      {/* Advanced Modal */}
      <NewHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddHabit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "#2dd4bf",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
