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

    // DROP TABLE IF EXISTS to force schema update during dev
    // WARNING: This deletes all user habits!
    db.execSync("DROP TABLE IF EXISTS habits");

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

export const getHabits = (userId) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    // Filter habits that have started (startDate <= today)
    // If startDate is null, assume it started immediately
    return db.getAllSync(
      "SELECT * FROM habits WHERE userId = ? AND (startDate IS NULL OR startDate <= ?) ORDER BY id DESC",
      [userId, today]
    );
  } catch (e) {
    console.error(e);
    return [];
  }
};

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

export const toggleHabitStatus = (habitId, currentStatus) => {
  try {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const today = new Date().toISOString().split("T")[0];

    db.runSync("UPDATE habits SET completed = ? WHERE id = ?", [
      newStatus,
      habitId,
    ]);

    // Log history
    const existingLog = db.getFirstSync(
      "SELECT * FROM habit_logs WHERE habitId = ? AND date = ?",
      [habitId, today]
    );

    if (existingLog) {
      db.runSync(
        "UPDATE habit_logs SET status = ? WHERE id = ?",
        [newStatus, existingLog.id]
      );
    } else {
      db.runSync(
        "INSERT INTO habit_logs (habitId, date, status) VALUES (?, ?, ?)",
        [habitId, today, newStatus]
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

export const getHabitHistory = (userId) => {
  try {
    // Join habits and logs to get history for a user's habits
    const history = db.getAllSync(`
      SELECT hl.date, hl.status 
      FROM habit_logs hl
      JOIN habits h ON hl.habitId = h.id
      WHERE h.userId = ? AND hl.status = 1
    `, [userId]);
    
    // Group by date to count completed habits per day
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

export const getDashboardStats = (userId) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    // 1. Calculate Streak
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
    
    // 2. Calculate XP & Level
    const totalCompleted = db.getFirstSync(
      "SELECT COUNT(*) as count FROM habit_logs WHERE status = 1"
    ).count;
    
    const xp = totalCompleted * 10;
    const level = Math.floor(xp / 100) + 1;
    const xpToNextLevel = 100 - (xp % 100);

    // 3. Weekly Activity
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

    // 4. Weekly Average
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
