import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AnimatedBackground from "./components/AnimatedBackground";
import { initDB, registerUser, loginUser } from "./database";

const Stack = createStackNavigator();

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Ops", "Preencha todos os campos");
      return;
    }
    const res = loginUser(username, password);
    if (res.success) {
      navigation.replace("Dashboard");
    } else {
      Alert.alert("Erro", res.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AnimatedBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.contentContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Feather name="star" size={32} color="#4ade80" />
            </View>
            <Text style={styles.title}>Conquista Diária</Text>
            <Text style={styles.subtitle}>
              Transforme pequenos hábitos em grandes conquistas
            </Text>
          </View>

          <View style={styles.card}>
            <Input
              label="Usuário"
              icon="user-alt"
              value={username}
              onChange={setUsername}
            />
            <Input
              label="Senha"
              icon="lock"
              color="#f59e0b"
              isPassword
              value={password}
              onChange={setPassword}
            />

            <TouchableOpacity
              style={styles.gradientButtonContainer}
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <LinearGradient
                colors={["#4ade80", "#3b82f6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Feather
                  name="log-in"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.gradientButtonText}>
                  Entrar na Plataforma
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={{ marginTop: 20 }}
            >
              <Text style={styles.linkText}>
                Não tem conta?{" "}
                <Text style={{ color: "#3b82f6", fontWeight: "bold" }}>
                  Crie agora
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!username || !password) {
      Alert.alert("Erro", "Preencha os campos");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    const res = registerUser(username, password);
    if (res.success) {
      Alert.alert("Sucesso", "Conta criada! Faça login.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Erro", res.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AnimatedBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.contentContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Comece sua jornada hoje mesmo</Text>
          </View>

          <View style={styles.card}>
            <Input
              label="Escolha um Usuário"
              icon="user-plus"
              value={username}
              onChange={setUsername}
            />
            <Input
              label="Sua Senha"
              icon="lock"
              color="#f59e0b"
              isPassword
              value={password}
              onChange={setPassword}
            />
            <Input
              label="Confirme a Senha"
              icon="check-circle"
              color="#10b981"
              isPassword
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            <TouchableOpacity
              style={styles.gradientButtonContainer}
              activeOpacity={0.8}
              onPress={handleRegister}
            >
              <LinearGradient
                colors={["#3b82f6", "#8b5cf6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Feather
                  name="user-check"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.gradientButtonText}>
                  Cadastrar e Entrar
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function DashboardScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <StatusBar barStyle="light-content" />

      {}
      <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.dashHeader}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather
            name="star"
            size={20}
            color="#fcd34d"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.dashTitle}>Conquista Diária</Text>
        </View>
        <Text style={styles.dashSubtitle}>Seus hábitos de hoje</Text>
      </LinearGradient>

      {}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: "#6b7280", fontSize: 16 }}>
          Carregando seus hábitos...
        </Text>
      </View>

      {}
      <View style={styles.tabBar}>
        <TabItem icon="home" label="Início" active />
        <TabItem icon="grid" label="Dashboard" />
        <TabItem icon="calendar" label="Calendário" />
        <TabItem icon="bar-chart-2" label="Estatísticas" />
        <TabItem icon="user" label="Perfil" />
      </View>
    </View>
  );
}

const Input = ({
  label,
  icon,
  color = "#4b5563",
  isPassword,
  value,
  onChange,
}) => (
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

const TabItem = ({ icon, label, active }) => (
  <View style={{ alignItems: "center" }}>
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
  </View>
);

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#333" },
  contentContainer: { flex: 1, zIndex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
  header: { alignItems: "center", marginBottom: 30 },
  logoContainer: {
    width: 70,
    height: 70,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#e0f2fe",
    textAlign: "center",
    maxWidth: "80%",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    elevation: 10,
  },
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
  gradientButtonContainer: {
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  linkText: { textAlign: "center", color: "#6b7280", fontSize: 14 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },

  dashHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  dashTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  dashSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 4 },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
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
