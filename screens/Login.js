import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    function handleLogin() {
        console.log(usuario, senha);
    }
    function handleVisitorAccess() {
        console.log("Visitante");
    }
    return (
        <LinearGradient colors={["#20c997", "#0ea5"]} style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <View style={styles.content}>
                <View style={styles.logo}>
                    <Text style={styles.logoText}>Logo</Text>
                </View>
                <View style={styles.title}>
                    <Text>Habits</Text>
                    <Text style={styles.subtitle}>
                        Transforme pequenos hábitos em grandes conquistas
                    </Text>
                </View>
                <View style={styles.card}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Usuário</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu usuário"
                            placeholderTextColor="#a0aec0"
                            value={usuario}
                            onChangeText={setUsuario}
                        />
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite sua Senha"
                            placeholderTextColor="#a0aec0"
                            value={senha}
                            onChangeText={setSenha}
                        />
                    </View>
                    <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
                        <LinearGradient
                            colors={["#22c55e", "#0ea5e9"]}
                            style={styles.loginButton}
                        >
                            <Text style={styles.loginText}>Entrar na Plataforma</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={styles.footer}>2025 Uninassau, Karine Evelyn e Yan Lucas</Text>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logo: {
        marginBottom: 20,
        // Add logo styles if needed, e.g., width/height or container styles
    },
    logoText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
    },
    title: {
        alignItems: "center",
        marginBottom: 40,
    },
    subtitle: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        marginTop: 8,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        width: "100%",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fieldGroup: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        color: "#4a5568",
        marginBottom: 8,
        fontWeight: "600",
    },
    input: {
        backgroundColor: "#f7fafc",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        color: "#2d3748",
    },
    loginButton: {
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 8,
    },
    loginText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        marginTop: 24,
        textAlign: "center",
        color: "#a0aec0",
        fontSize: 12,
    },
});
