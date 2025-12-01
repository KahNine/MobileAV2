import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { getHabitsForDate, toggleHabitStatus, getHabitHistory } from "../database";

const { width } = Dimensions.get("window");
const CELL_SIZE = (width - 40) / 7;

export default function CalendarView({ userId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [history, setHistory] = useState({});

  useEffect(() => {
    loadHistory();
  }, [userId, currentMonth]); // Reload history when month changes (or could be just on focus)

  useEffect(() => {
    loadHabits();
  }, [selectedDate, userId]);

  const loadHistory = () => {
    const data = getHabitHistory(userId);
    setHistory(data);
  };

  const loadHabits = () => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const data = getHabitsForDate(userId, dateStr);
    setHabits(data);
  };

  const handleToggle = (habitId, currentStatus) => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    toggleHabitStatus(habitId, currentStatus, dateStr);
    loadHabits();
    loadHistory(); // Refresh dots
  };

  const changeMonth = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    return { days, firstDay };
  };

  const renderCalendar = () => {
    const { days, firstDay } = getDaysInMonth(currentMonth);
    const totalSlots = Math.ceil((days + firstDay) / 7) * 7;
    const grid = [];

    for (let i = 0; i < totalSlots; i++) {
      const dayNum = i - firstDay + 1;
      
      if (dayNum > 0 && dayNum <= days) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
        const dateStr = date.toISOString().split("T")[0];
        const isSelected = dateStr === selectedDate.toISOString().split("T")[0];
        const isToday = dateStr === new Date().toISOString().split("T")[0];
        const hasActivity = history[dateStr] > 0;

        grid.push(
          <TouchableOpacity
            key={i}
            style={[
              styles.dayCell,
              isSelected && styles.dayCellSelected,
              isToday && !isSelected && styles.dayCellToday,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text
              style={[
                styles.dayText,
                isSelected && styles.dayTextSelected,
                isToday && !isSelected && styles.dayTextToday,
              ]}
            >
              {dayNum}
            </Text>
            {hasActivity && (
              <View
                style={[
                  styles.dot,
                  isSelected ? { backgroundColor: "#fff" } : { backgroundColor: "#2dd4bf" },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      } else {
        grid.push(<View key={i} style={styles.dayCell} />);
      }
    }
    return grid;
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <View style={styles.container}>
      {/* Header & Calendar */}
      <LinearGradient
        colors={["#2dd4bf", "#0d9488"]}
        style={styles.headerContainer}
      >
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Feather name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {weekDays.map((day) => (
            <Text key={day} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>{renderCalendar()}</View>
      </LinearGradient>

      {/* Selected Date Title */}
      <View style={styles.dateHeader}>
        <Text style={styles.selectedDateTitle}>
          {selectedDate.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </Text>
      </View>

      {/* Habits List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Nenhum hábito para este dia</Text>
          </View>
        ) : (
          habits.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              style={[
                styles.habitCard,
                habit.completed && { borderColor: habit.color, borderWidth: 1 },
              ]}
              onPress={() => handleToggle(habit.id, habit.completed)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: habit.completed ? habit.color : "#f3f4f6" },
                ]}
              >
                <Feather
                  name={habit.icon || "activity"}
                  size={24}
                  color={habit.completed ? "#fff" : habit.color}
                />
              </View>

              <View style={styles.habitInfo}>
                <Text
                  style={[
                    styles.habitTitle,
                    habit.completed && styles.habitTitleCompleted,
                  ]}
                >
                  {habit.title}
                </Text>
                <Text style={styles.habitSubtitle}>
                  {habit.category} • {habit.frequency}
                </Text>
              </View>

              <View style={styles.checkContainer}>
                {habit.completed ? (
                  <View
                    style={[styles.checkCircle, { backgroundColor: habit.color }]}
                  >
                    <Feather name="check" size={16} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.uncheckedCircle} />
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDayText: {
    width: CELL_SIZE,
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "bold",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderRadius: CELL_SIZE / 2,
  },
  dayCellSelected: {
    backgroundColor: "#fff",
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  dayText: {
    color: "#fff",
    fontSize: 14,
  },
  dayTextSelected: {
    color: "#0d9488",
    fontWeight: "bold",
  },
  dayTextToday: {
    color: "#fff",
    fontWeight: "bold",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  dateHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  selectedDateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textTransform: "capitalize",
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    color: "#9ca3af",
    fontSize: 16,
  },
  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  habitTitleCompleted: {
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },
  habitSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  checkContainer: {
    marginLeft: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
});
