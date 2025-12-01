import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function NewHabitModal({ visible, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("target");
  const [color, setColor] = useState("#4ade80");
  const [frequency, setFrequency] = useState("Diário");
  const [category, setCategory] = useState("Saúde");
  const [goal, setGoal] = useState("");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState(new Date()); // Simplified date handling

  const icons = [
    "activity", "book", "briefcase", "calendar", "check-circle", 
    "clock", "coffee", "droplet", "gift", "heart", 
    "home", "image", "layers", "layout", "life-buoy", 
    "list", "map", "moon", "music", "package", 
    "pen-tool", "phone", "pie-chart", "play-circle", "power", 
    "printer", "radio", "refresh-cw", "save", "settings", 
    "shopping-bag", "shopping-cart", "smile", "star", "sun", 
    "target", "tool", "trash", "truck", "umbrella", 
    "user", "video", "watch", "wifi", "zap"
  ];

  const colors = [
    "#4ade80", "#60a5fa", "#c084fc", "#f472b6", "#fb923c", 
    "#f87171", "#facc15", "#2dd4bf", "#94a3b8", "#a78bfa"
  ];

  const categories = ["Saúde", "Trabalho", "Estudo", "Lazer", "Outros"];

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Ops", "Dê um nome para o seu hábito!");
      return;
    }

    const habitData = {
      title,
      icon,
      color,
      frequency,
      category,
      goal,
      notes,
      startDate: startDate.toISOString().split("T")[0],
    };

    onSave(habitData);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setIcon("target");
    setColor("#4ade80");
    setFrequency("Diário");
    setCategory("Saúde");
    setGoal("");
    setNotes("");
    setStartDate(new Date());
  };

  // Simple Date Picker Logic (Next 7 days)
  const renderDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {dates.map((d, index) => {
          const isSelected = d.toISOString().split("T")[0] === startDate.toISOString().split("T")[0];
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setStartDate(d)}
              style={[
                styles.dateChip,
                isSelected && { backgroundColor: color, borderColor: color },
              ]}
            >
              <Text style={[styles.dateText, isSelected && { color: "#fff" }]}>
                {d.getDate()}/{d.getMonth() + 1}
              </Text>
              <Text style={[styles.dateSubText, isSelected && { color: "#fff" }]}>
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d.getDay()]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <LinearGradient
            colors={[color, "#3b82f6"]} // Dynamic gradient based on selection
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <Text style={styles.headerTitle}>Novo Hábito</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Name */}
            <Text style={styles.label}>Nome do Hábito</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Beber água, Meditar..."
              value={title}
              onChangeText={setTitle}
            />

            {/* Icons */}
            <Text style={styles.label}>Escolha um Ícone</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
              {icons.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  onPress={() => setIcon(ic)}
                  style={[
                    styles.iconOption,
                    icon === ic && { backgroundColor: "#1f2937" }, // Dark background for selected
                  ]}
                >
                  <Feather
                    name={ic}
                    size={24}
                    color={icon === ic ? "#fff" : "#6b7280"}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Colors */}
            <Text style={styles.label}>Escolha uma Cor</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
              {colors.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c },
                    color === c && styles.colorSelected,
                  ]}
                />
              ))}
            </ScrollView>

            {/* Frequency */}
            <Text style={styles.label}>Frequência</Text>
            <View style={styles.segmentControl}>
              {["Diário", "Semanal", "Mensal"].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  onPress={() => setFrequency(freq)}
                  style={[
                    styles.segmentBtn,
                    frequency === freq && { backgroundColor: "#000" },
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      frequency === freq && { color: "#fff" },
                    ]}
                  >
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category */}
            <Text style={styles.label}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryChip,
                    category === cat && { borderColor: color, backgroundColor: "#fff" },
                  ]}
                >
                  <Text style={[styles.categoryText, category === cat && { color: "#000", fontWeight: "bold" }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Start Date */}
            <Text style={styles.label}>Começar em</Text>
            {renderDateOptions()}

            {/* Optional Fields */}
            <Text style={styles.label}>Meta (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 1000 passos, 30 minutos..."
              value={goal}
              onChangeText={setGoal}
            />

            <Text style={styles.label}>Notas (opcional)</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="Ex: Lembre-se de beber água antes..."
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: color }]}
              onPress={handleSave}
            >
              <Text style={styles.createBtnText}>Criar Hábito</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "90%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  iconScroll: {
    marginBottom: 16,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  colorScroll: {
    marginBottom: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#1f2937",
  },
  segmentControl: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  segmentText: {
    color: "#6b7280",
    fontWeight: "500",
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  categoryText: {
    color: "#374151",
  },
  dateChip: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
  },
  dateSubText: {
    fontSize: 10,
    color: "#6b7280",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  createBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  createBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
