import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("conquista.db");

export const initDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    console.log("Tabela users criada ou já existente.");
  } catch (e) {
    console.error("Erro ao iniciar DB:", e);
  }
};

export const registerUser = (username, password) => {
  try {
    const existing = db.getAllSync("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (existing.length > 0) {
      return { success: false, message: "Usuário já existe!" };
    }

    db.runSync("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      password,
    ]);
    return { success: true, message: "Conta criada com sucesso!" };
  } catch (e) {
    return { success: false, message: "Erro ao cadastrar: " + e.message };
  }
};

export const loginUser = (username, password) => {
  try {
    const user = db.getFirstSync(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "Usuário ou senha incorretos" };
    }
  } catch (e) {
    return { success: false, message: "Erro no login" };
  }
};
