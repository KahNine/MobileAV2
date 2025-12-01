import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import {
  createHabit,
  getHabits,
  toggleHabitStatus,
  deleteHabit,
} from "../database";

import DashboardView from "../components/DashboardView";
import CalendarView from "../components/CalendarView";
import ProfileView from "../components/ProfileView";

export default function DashboardScreen({ route, navigation }) {
  const { userId, username } = route.params || {
    userId: 1,
    username: "Visitante",
  };
  const [habits, setHabits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitText, setNewHabitText] = useState("");
  const [activeTab, setActiveTab] = useState("Início");

  const loadHabits = () => {
    const data = getHabits(userId);
    setHabits(data);
  };

  useEffect(() => {
    loadHabits();
  }, [activeTab]); // Reload when tab changes to ensure fresh data

  const handleAddHabit = () => {
    if (!newHabitText.trim()) return;
    const res = createHabit(userId, newHabitText);
    if (res.success) {
      setNewHabitText("");
      setModalVisible(false);
      loadHabits();
    } else {
      Alert.alert("Erro", "Não foi possível criar o hábito");
    }
  };

  const handleToggle = (id, currentStatus) => {
    toggleHabitStatus(id, currentStatus);
    loadHabits();
  };

  const handleDelete = (id) => {
    Alert.alert("Excluir", "Deseja remover este hábito?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          deleteHabit(id);
          loadHabits();
        },
      },
    ]);
  };

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const renderContent = () => {
    if (activeTab === "Dashboard") {
      return <DashboardView userId={userId} />;
    }
    if (activeTab === "Calendário") {
      return <CalendarView userId={userId} />;
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

    // Default view (Início)
    return (
      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: -20 }}>
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Feather name="clipboard" size={50} color="#d1d5db" />
              <Text style={{ color: "#9ca3af", marginTop: 10 }}>
                Nenhum hábito criado ainda.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.habitCard}
              onPress={() => handleToggle(item.id, item.completed)}
              onLongPress={() => handleDelete(item.id)}
              activeOpacity={0.7}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <View
                  style={[
                    styles.checkCircle,
                    item.completed ? styles.checked : null,
                  ]}
                >
                  {item.completed ? (
                    <Feather name="check" size={16} color="#fff" />
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.habitTitle,
                    item.completed && styles.habitTitleDone,
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              {item.completed ? (
                <Feather name="award" size={20} color="#fbbf24" />
              ) : (
                <Feather name="circle" size={20} color="#e5e7eb" />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.dashHeader}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Feather
            name="star"
            size={24}
            color="#fcd34d"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.dashTitle}>Olá, {username}</Text>
        </View>
        <Text style={styles.dashSubtitle}>
          {activeTab === "Calendário"
            ? "Seu histórico de conquistas"
            : activeTab === "Perfil"
            ? "Gerencie sua conta"
            : "Foco total nas suas metas de hoje!"}
        </Text>
      </LinearGradient>

      {/* Main Content */}
      {renderContent()}

      {/* FAB - Only show on Home/Dashboard */}
      {(activeTab === "Início" || activeTab === "Dashboard") && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <LinearGradient
            colors={["#4ade80", "#2dd4bf"]}
            style={styles.fabGradient}
          >
            <Feather name="plus" size={30} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* New Habit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Hábito</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Beber 2L de água"
              placeholderTextColor="#9ca3af"
              value={newHabitText}
              onChangeText={setNewHabitText}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalBtnCancel}
              >
                <Text style={{ color: "#ef4444" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddHabit}
                style={styles.modalBtnConfirm}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem
          icon="home"
          label="Início"
          active={activeTab === "Início"}
          onPress={() => setActiveTab("Início")}
        />
        <TabItem
          icon="grid"
          label="Dashboard"
          active={activeTab === "Dashboard"}
          onPress={() => setActiveTab("Dashboard")}
        />
        <TabItem
          icon="calendar"
          label="Calendário"
          active={activeTab === "Calendário"}
          onPress={() => setActiveTab("Calendário")}
        />
        <TabItem
          icon="user"
          label="Perfil"
          active={activeTab === "Perfil"}
          onPress={() => setActiveTab("Perfil")}
        />
      </View>
    </View>
  );
}

const TabItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ alignItems: "center" }}>
    <View style={[styles.tabIconContainer, active && styles.activeTab]}>
      <Feather name={icon} size={20} color={active ? "#fff" : "#6b7280"} />
    </View>
    <Text
      style={[
        styles.tabLabel,
        active && { color: "#4b5563", fontWeight: "bold" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  dashHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 10,
  },
  dashTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  dashSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 4 },
  habitCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: { backgroundColor: "#4ade80", borderColor: "#4ade80" },
  habitTitle: { fontSize: 16, color: "#374151", fontWeight: "500" },
  habitTitleDone: { textDecorationLine: "line-through", color: "#9ca3af" },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    zIndex: 20,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: { backgroundColor: "#fff", borderRadius: 24, padding: 24 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1f2937",
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalBtnCancel: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
  },
  modalBtnConfirm: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 20,
  },
  tabIconContainer: { padding: 10, borderRadius: 12, marginBottom: 4 },
  activeTab: {
    backgroundColor: "#2dd4bf",
    shadowColor: "#2dd4bf",
    shadowOpacity: 0.5,
    elevation: 5,
  },
  tabLabel: { fontSize: 10, color: "#9ca3af" },
});
