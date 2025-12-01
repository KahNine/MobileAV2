import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getHabits, toggleHabitStatus, deleteHabit } from "../database";

export default function HomeView({ userId }) {
  const [habits, setHabits] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

  useEffect(() => {
    loadHabits();
  }, [userId]);

  const loadHabits = () => {
    const data = getHabits(userId);
    setHabits(data);
  };

  const handleToggle = (id, currentStatus) => {
    toggleHabitStatus(id, currentStatus);
    loadHabits();
  };

  const handleDelete = (id) => {
    deleteHabit(id);
    loadHabits();
  };

  const filteredHabits =
    filter === "Todos"
      ? habits
      : habits.filter((h) => h.category === filter);

  const categories = ["Todos", "Saúde", "Trabalho", "Estudo", "Lazer"];

  const HabitCard = ({ item }) => {
    const isCompleted = item.completed === 1;

    if (isCompleted) {
      return (
        <TouchableOpacity
          style={[
            styles.card,
            viewMode === "grid" ? styles.cardGrid : styles.cardList,
          ]}
          onPress={() => handleToggle(item.id, item.completed)}
          onLongPress={() => handleDelete(item.id)}
        >
          <LinearGradient
            colors={[item.color || "#4ade80", "#3b82f6"]} // Use item color + blue gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={styles.checkCircleCompleted}>
                <Feather name="check" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.habitTitleCompleted}>{item.title}</Text>
                <View style={styles.tagsRow}>
                  <View style={styles.tagCompleted}>
                    <Text style={styles.tagTextCompleted}>{item.category}</Text>
                  </View>
                  <View style={styles.streakBadge}>
                    <Feather name="flame" size={12} color="#fff" />
                    <Text style={styles.streakText}>1 dia</Text>
                  </View>
                  <View style={styles.tagCompleted}>
                    <Text style={styles.tagTextCompleted}>{item.frequency}</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.card,
          styles.cardUncompleted,
          viewMode === "grid" ? styles.cardGrid : styles.cardList,
        ]}
        onPress={() => handleToggle(item.id, item.completed)}
        onLongPress={() => handleDelete(item.id)}
      >
        <View style={styles.cardContent}>
          <View
            style={[
              styles.iconCircle,
              { borderColor: item.color || "#4ade80" },
            ]}
          >
            {/* Assuming item.icon is a Feather icon name */}
            <Feather
              name={item.icon || "target"}
              size={24}
              color={item.color || "#4ade80"}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.habitTitle}>{item.title}</Text>
            <View style={styles.tagsRow}>
              <View style={[styles.tag, { backgroundColor: "#f3f4f6" }]}>
                <Text style={styles.tagText}>{item.category}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: "#fef3c7" }]}>
                <Feather name="sun" size={12} color="#d97706" />
                <Text style={[styles.tagText, { color: "#d97706", marginLeft: 4 }]}>
                  {item.frequency}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#4ade80", "#2dd4bf"]}
        style={styles.header}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="sparkles" size={24} color="#fcd34d" />
          <Text style={styles.headerTitle}>Conquista Diária</Text>
        </View>
        <Text style={styles.headerSubtitle}>Seus hábitos de hoje</Text>
      </LinearGradient>

      {/* Filters & Toggle */}
      <View style={styles.toolbar}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Feather name="filter" size={16} color="#6b7280" style={{ marginRight: 8 }} />
          <Text style={{ color: "#6b7280", marginRight: 8 }}>Filtrar:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setFilter(cat)}
                style={[
                  styles.filterChip,
                  filter === cat && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === cat && styles.filterTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity onPress={() => setViewMode("list")}>
            <View style={[styles.toggleBtn, viewMode === "list" && styles.toggleBtnActive]}>
              <Feather name="list" size={20} color={viewMode === "list" ? "#fff" : "#6b7280"} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode("grid")}>
            <View style={[styles.toggleBtn, viewMode === "grid" && styles.toggleBtnActive]}>
              <Feather name="grid" size={20} color={viewMode === "grid" ? "#fff" : "#6b7280"} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Feather name="sun" size={20} color="#f59e0b" />
          <Text style={styles.sectionTitle}>Hábitos Diários</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{filteredHabits.length}</Text>
          </View>
        </View>

        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id.toString()}
          key={viewMode} // Force re-render on view change
          numColumns={viewMode === "grid" ? 2 : 1}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Feather name="target" size={40} color="#ec4899" />
              </View>
              <Text style={styles.emptyTitle}>Nenhum hábito ainda</Text>
              <Text style={styles.emptySubtitle}>
                Comece sua jornada criando seu primeiro hábito!
              </Text>
              <View style={styles.tipBox}>
                <Feather name="bulb" size={16} color="#f59e0b" />
                <Text style={styles.tipText}>
                  Dica: Toque no botão + no canto inferior direito
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => <HabitCard item={item} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
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
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  filterChipActive: {
    backgroundColor: "#2dd4bf",
    borderColor: "#2dd4bf",
  },
  filterText: { color: "#6b7280", fontSize: 12 },
  filterTextActive: { color: "#fff", fontWeight: "bold" },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  toggleBtn: {
    padding: 6,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: "#10b981",
  },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginLeft: 8,
    marginRight: 8,
  },
  badge: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  card: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  cardList: { width: "100%" },
  cardGrid: { flex: 1, margin: 4 },
  cardUncompleted: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  cardGradient: {
    padding: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  checkCircleCompleted: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  habitTitleCompleted: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: { fontSize: 10, color: "#6b7280", fontWeight: "500" },
  tagCompleted: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagTextCompleted: { fontSize: 10, color: "#fff", fontWeight: "500" },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  streakText: { color: "#fff", fontSize: 10, fontWeight: "bold", marginLeft: 4 },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "rgba(45, 212, 191, 0.1)", // Light teal
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: "70%",
    marginBottom: 24,
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderStyle: "dashed",
    maxWidth: "90%",
  },
  tipText: {
    color: "#0369a1",
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
});
