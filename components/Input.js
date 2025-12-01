import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Input({
  label,
  icon,
  color = "#4b5563",
  isPassword,
  value,
  onChange,
}) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        <FontAwesome5 name={icon} size={14} color={color} />
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={`Digite ${label.toLowerCase()}`}
        placeholderTextColor="#9ca3af"
        secureTextEntry={isPassword}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 16 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingLeft: 4,
  },
  labelText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginLeft: 8,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: "#1f2937",
  },
});
