const STORAGE_KEY = 'mathKidsProgress';

export const MODE_LABELS = {
  multiply: 'Умножение',
  divide: 'Деление',
  sum: 'Сложение и вычитание',
};

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function recordSession(mode, { correct, total, seconds }) {
  if (!total) return null;
  const data = loadAll();
  const modeStats = data[mode] || { sessions: [], streak: 0, bestStreak: 0 };

  modeStats.sessions.push({ date: new Date().toISOString(), correct, total, seconds });
  if (modeStats.sessions.length > 100) {
    modeStats.sessions.shift();
  }

  const isPerfect = correct === total;
  modeStats.streak = isPerfect ? modeStats.streak + 1 : 0;
  modeStats.bestStreak = Math.max(modeStats.bestStreak || 0, modeStats.streak);

  data[mode] = modeStats;
  saveAll(data);
  return modeStats;
}

export function getModeStats(mode) {
  return loadAll()[mode] || { sessions: [], streak: 0, bestStreak: 0 };
}

export function getAllStats() {
  return loadAll();
}

export function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
