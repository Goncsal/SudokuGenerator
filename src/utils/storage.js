import { openDB } from 'idb';

const DB_NAME = 'SudokuDB';
const DB_VERSION = 1;
const GAMES_STORE = 'games';
const SETTINGS_STORE = 'settings';

// Initialize the database
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Games store
      if (!db.objectStoreNames.contains(GAMES_STORE)) {
        const gamesStore = db.createObjectStore(GAMES_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        gamesStore.createIndex('timestamp', 'timestamp');
        gamesStore.createIndex('difficulty', 'difficulty');
        gamesStore.createIndex('completed', 'completed');
      }

      // Settings store
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, {
          keyPath: 'key',
        });
      }
    },
  });
};

// Game operations
export const saveGame = async (gameData) => {
  const db = await initDB();
  const tx = db.transaction(GAMES_STORE, 'readwrite');
  const store = tx.objectStore(GAMES_STORE);
  
  const gameToSave = {
    ...gameData,
    timestamp: Date.now(),
  };
  
  // Remove undefined id to let IndexedDB auto-generate it
  if (gameToSave.id === null || gameToSave.id === undefined) {
    delete gameToSave.id;
  }
  
  const result = await store.put(gameToSave);
  await tx.done;
  return result;
};

export const getGame = async (id) => {
  const db = await initDB();
  return db.get(GAMES_STORE, id);
};

export const getAllGames = async () => {
  const db = await initDB();
  return db.getAll(GAMES_STORE);
};

export const deleteGame = async (id) => {
  const db = await initDB();
  const tx = db.transaction(GAMES_STORE, 'readwrite');
  await tx.objectStore(GAMES_STORE).delete(id);
  await tx.done;
};

export const getIncompleteGames = async () => {
  const db = await initDB();
  const games = await db.getAll(GAMES_STORE);
  // Filter incomplete games manually since the completed field might not be properly indexed
  return games.filter(game => !game.completed && game.gameState !== 'complete');
};

// Settings operations
export const saveSetting = async (key, value) => {
  const db = await initDB();
  const tx = db.transaction(SETTINGS_STORE, 'readwrite');
  await tx.objectStore(SETTINGS_STORE).put({ key, value });
  await tx.done;
};

export const getSetting = async (key, defaultValue = null) => {
  const db = await initDB();
  const result = await db.get(SETTINGS_STORE, key);
  return result ? result.value : defaultValue;
};

// Statistics
export const getGameStats = async () => {
  const games = await getAllGames();
  const completed = games.filter(game => game.completed);
  
  const stats = {
    totalGames: games.length,
    completedGames: completed.length,
    completionRate: games.length > 0 ? (completed.length / games.length) * 100 : 0,
    averageTime: 0,
    byDifficulty: {
      easy: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      hard: { total: 0, completed: 0 }
    }
  };

  // Calculate average completion time
  const completedWithTime = completed.filter(game => game.completionTime);
  if (completedWithTime.length > 0) {
    const totalTime = completedWithTime.reduce((sum, game) => sum + game.completionTime, 0);
    stats.averageTime = totalTime / completedWithTime.length;
  }

  // Calculate stats by difficulty
  games.forEach(game => {
    if (stats.byDifficulty[game.difficulty]) {
      stats.byDifficulty[game.difficulty].total++;
      if (game.completed) {
        stats.byDifficulty[game.difficulty].completed++;
      }
    }
  });

  return stats;
};
