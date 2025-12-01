import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("conquista.db");

// Inicializa o banco de dados e cria as tabelas se não existirem
export const initDB = () => {
  try {
    // Tabela de usuários
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    // DROP TABLE IF EXISTS para forçar atualização do esquema durante desenvolvimento
    // AVISO: Isso deleta todos os hábitos do usuário!
    db.execSync("DROP TABLE IF EXISTS habits");

    // Tabela de hábitos
    db.execSync(`
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        frequency TEXT,
        category TEXT,
        goal TEXT,
        notes TEXT,
        startDate TEXT,
        completed INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users (id)
      );
    `);

    // Tabela de logs de hábitos (histórico de conclusão)
    db.execSync(`
      CREATE TABLE IF NOT EXISTS habit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habitId INTEGER NOT NULL,
        date TEXT NOT NULL,
        status INTEGER DEFAULT 0,
        FOREIGN KEY (habitId) REFERENCES habits (id)
      );
    `);
    console.log("Banco de dados inicializado.");
  } catch (e) {
    console.error("Erro ao iniciar DB:", e);
  }
};

// Registra um novo usuário no sistema
export const registerUser = (username, password) => {
  try {
    // Verifica se usuário já existe
    const existing = db.getAllSync("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (existing.length > 0) {
      return { success: false, message: "Usuário já existe!" };
    }

    // Insere novo usuário
    db.runSync("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      password,
    ]);
    return { success: true, message: "Conta criada com sucesso!" };
  } catch (e) {
    return { success: false, message: "Erro ao cadastrar: " + e.message };
  }
};

// Realiza o login do usuário verificando credenciais
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

// Busca todos os hábitos ativos do usuário (data de início <= hoje)
export const getHabits = (userId) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    // Filtra hábitos que já começaram
    return db.getAllSync(
      "SELECT * FROM habits WHERE userId = ? AND (startDate IS NULL OR startDate <= ?) ORDER BY id DESC",
      [userId, today]
    );
  } catch (e) {
    console.error(e);
    return [];
  }
};

// Busca hábitos para uma data específica e verifica se foram completados nesse dia
export const getHabitsForDate = (userId, date) => {
  try {
    // 1. Busca todos os hábitos ativos nesta data
    const habits = db.getAllSync(
      "SELECT * FROM habits WHERE userId = ? AND (startDate IS NULL OR startDate <= ?) ORDER BY id DESC",
      [userId, date]
    );

    // 2. Busca o status de cada hábito nesta data específica
    return habits.map((habit) => {
      const log = db.getFirstSync(
        "SELECT status FROM habit_logs WHERE habitId = ? AND date = ?",
        [habit.id, date]
      );
      
      // Se existe log, usa o status dele. 
      // Se não, considera não completado (0).
      return {
        ...habit,
        completed: log ? log.status : 0
      };
    });
  } catch (e) {
    console.error("Erro ao buscar hábitos por data:", e);
    return [];
  }
};

// Cria um novo hábito no banco de dados
export const createHabit = (userId, habitData) => {
  try {
    const {
      title,
      icon,
      color,
      frequency,
      category,
      goal,
      notes,
      startDate,
    } = habitData;

    db.runSync(
      `INSERT INTO habits (userId, title, icon, color, frequency, category, goal, notes, startDate, completed) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        userId,
        title,
        icon || "check-circle",
        color || "#4ade80",
        frequency || "Diário",
        category || "Geral",
        goal || "",
        notes || "",
        startDate || new Date().toISOString().split("T")[0],
      ]
    );
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
};

// Alterna o status de um hábito (completado/não completado) para uma data
export const toggleHabitStatus = (habitId, currentStatus, date = null) => {
  try {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const targetDate = date || new Date().toISOString().split("T")[0];

    // Só atualiza a flag "completed" na tabela habits se for para hoje
    const today = new Date().toISOString().split("T")[0];
    if (targetDate === today) {
      db.runSync("UPDATE habits SET completed = ? WHERE id = ?", [
        newStatus,
        habitId,
      ]);
    }

    // Registra no histórico (habit_logs)
    const existingLog = db.getFirstSync(
      "SELECT * FROM habit_logs WHERE habitId = ? AND date = ?",
      [habitId, targetDate]
    );

    if (existingLog) {
      db.runSync(
        "UPDATE habit_logs SET status = ? WHERE id = ?",
        [newStatus, existingLog.id]
      );
    } else {
      db.runSync(
        "INSERT INTO habit_logs (habitId, date, status) VALUES (?, ?, ?)",
        [habitId, targetDate, newStatus]
      );
    }

    return { success: true };
  } catch (e) {
    console.error("Erro ao alternar status:", e);
    return { success: false };
  }
};

export const deleteHabit = (habitId) => {
  try {
    db.runSync("DELETE FROM habits WHERE id = ?", [habitId]);
    db.runSync("DELETE FROM habit_logs WHERE habitId = ?", [habitId]);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};

// Busca o histórico de hábitos completados para exibir no calendário
export const getHabitHistory = (userId) => {
  try {
    // Junta habits e logs para pegar histórico dos hábitos do usuário
    const history = db.getAllSync(`
      SELECT hl.date, hl.status 
      FROM habit_logs hl
      JOIN habits h ON hl.habitId = h.id
      WHERE h.userId = ? AND hl.status = 1
    `, [userId]);
    
    // Agrupa por data para contar hábitos completados por dia
    const historyMap = {};
    history.forEach(item => {
      if (!historyMap[item.date]) historyMap[item.date] = 0;
      historyMap[item.date] += 1;
    });
    
    return historyMap;
  } catch (e) {
    console.error("Erro ao buscar histórico:", e);
    return {};
  }
};

export const getUserStats = (userId) => {
  try {
    const totalHabits = db.getFirstSync("SELECT COUNT(*) as count FROM habits WHERE userId = ?", [userId]).count;
    const completedToday = db.getFirstSync("SELECT COUNT(*) as count FROM habits WHERE userId = ? AND completed = 1", [userId]).count;
    
    return {
      totalHabits,
      completedToday
    };
  } catch (e) {
    console.error("Erro ao buscar estatísticas:", e);
    return { totalHabits: 0, completedToday: 0 };
  }
};

// Calcula estatísticas para o Dashboard (Streak, XP, Nível, Gráfico Semanal)
export const getDashboardStats = (userId) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    // 1. Calcula Sequência (Streak)
    let currentStreak = 0;
    let bestStreak = 0; 
    
    const logs = db.getAllSync(
      "SELECT DISTINCT date FROM habit_logs WHERE status = 1 ORDER BY date DESC"
    );

    if (logs.length > 0) {
      const lastActive = logs[0].date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastActive === today || lastActive === yesterdayStr) {
        currentStreak = 1;
        let checkDate = new Date(lastActive);
        
        for (let i = 1; i < logs.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1);
          const checkStr = checkDate.toISOString().split("T")[0];
          if (logs[i].date === checkStr) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
    
    // 2. Calcula XP e Nível
    const totalCompleted = db.getFirstSync(
      "SELECT COUNT(*) as count FROM habit_logs WHERE status = 1"
    ).count;
    
    const xp = totalCompleted * 10;
    const level = Math.floor(xp / 100) + 1;
    const xpToNextLevel = 100 - (xp % 100);

    // 3. Atividade Semanal (últimos 7 dias)
    const weeklyActivity = [];
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = days[d.getDay()];
      
      const count = db.getFirstSync(
        "SELECT COUNT(*) as count FROM habit_logs WHERE date = ? AND status = 1",
        [dateStr]
      ).count;
      
      weeklyActivity.push({ day: dayName, count, fullDate: dateStr });
    }

    // 4. Média Semanal
    const totalWeekly = weeklyActivity.reduce((acc, curr) => acc + curr.count, 0);
    const weeklyAverage = Math.round(totalWeekly / 7);

    return {
      streak: currentStreak,
      bestStreak: Math.max(currentStreak, bestStreak), 
      level,
      xp,
      xpToNextLevel,
      weeklyActivity,
      weeklyAverage,
      totalCompleted
    };

  } catch (e) {
    console.error("Erro ao buscar stats do dashboard:", e);
    return {
      streak: 0,
      bestStreak: 0,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      weeklyActivity: [],
      weeklyAverage: 0,
      totalCompleted: 0
    };
  }
};

export const getDetailedStats = (userId) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    const activeHabits = db.getFirstSync(
      "SELECT COUNT(*) as count FROM habits WHERE userId = ?", 
      [userId]
    ).count;

    const completedToday = db.getFirstSync(
      "SELECT COUNT(*) as count FROM habits WHERE userId = ? AND completed = 1", 
      [userId]
    ).count;

    const totalCompleted = db.getFirstSync(
      "SELECT COUNT(*) as count FROM habit_logs WHERE status = 1" // Global count
    ).count;

    // Reuse streak logic or simplify
    // For now, let's just return what we have
    const dashStats = getDashboardStats(userId);

    return {
      activeHabits,
      completedToday,
      totalCompleted, // This might be redundant with dashStats but good for clarity
      bestStreak: dashStats.bestStreak,
      weeklyActivity: dashStats.weeklyActivity
    };

  } catch (e) {
    return {
      activeHabits: 0,
      completedToday: 0,
      totalCompleted: 0,
      bestStreak: 0,
      weeklyActivity: []
    };
  }
};
