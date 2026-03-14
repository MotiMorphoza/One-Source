const VERSION = "v4";
const PREFIX = "LLH";

function keyPart(value) {
  return encodeURIComponent(value ?? "global");
}

function buildKey(type, game = "global", topicId = "global") {
  return `${PREFIX}_${VERSION}_${type}_${keyPart(game)}_${keyPart(topicId)}`;
}

function safeGet(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Storage write failed", error);
    return false;
  }
}

export const Storage = {
  key(type, game, topicId) {
    return buildKey(type, game, topicId);
  },

  get(key, fallback = null) {
    return safeGet(key, fallback);
  },

  set(key, value) {
    return safeSet(key, value);
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  getPreference(name, fallback = null) {
    const preferences = safeGet(buildKey("preferences"), {});
    return Object.prototype.hasOwnProperty.call(preferences, name)
      ? preferences[name]
      : fallback;
  },

  setPreference(name, value) {
    const preferences = safeGet(buildKey("preferences"), {});
    preferences[name] = value;
    return safeSet(buildKey("preferences"), preferences);
  },

  saveGameSession(game, topicMeta, stats) {
    const sessionKey = buildKey("sessions", game, topicMeta.id);
    const sessions = safeGet(sessionKey, []);

    sessions.push({
      date: Date.now(),
      topic: topicMeta.name,
      lang: topicMeta.lang,
      path: topicMeta.path,
      branch: topicMeta.branch,
      group: topicMeta.group,
      ...stats,
    });

    if (sessions.length > 100) {
      sessions.splice(0, sessions.length - 100);
    }

    safeSet(sessionKey, sessions);
    this.addGlobalSession(game, topicMeta, stats);
  },

  addGlobalSession(game, topicMeta, stats) {
    const globalKey = buildKey("sessions", "all");
    const sessions = safeGet(globalKey, []);

    sessions.push({
      date: Date.now(),
      game,
      topic: topicMeta.name,
      lang: topicMeta.lang,
      path: topicMeta.path,
      time: stats.time,
      correct: stats.correct,
      wrong: stats.wrong,
      attempts: stats.attempts,
      accuracy: stats.accuracy,
    });

    if (sessions.length > 500) {
      sessions.splice(0, sessions.length - 500);
    }

    safeSet(globalKey, sessions);
  },

  getGameSessions(game, topicId = null) {
    return safeGet(buildKey("sessions", game, topicId), []);
  },

  getAllSessions() {
    return safeGet(buildKey("sessions", "all"), []);
  },

  updateBestTime(game, topicId, time) {
    const key = buildKey("best", game, topicId);
    const current = safeGet(key, 0);

    if (!current || time < current) {
      safeSet(key, time);
      return true;
    }

    return false;
  },

  getBestTime(game, topicId) {
    return safeGet(buildKey("best", game, topicId), 0);
  },

  addHardItem(game, topicId, itemId) {
    const key = buildKey("hard", game, topicId);
    const items = safeGet(key, {});
    items[itemId] = (items[itemId] || 0) + 1;
    safeSet(key, items);
  },

  getHardItems(game, topicId) {
    return safeGet(buildKey("hard", game, topicId), {});
  },

  getAllHardItems() {
    const prefix = `${PREFIX}_${VERSION}_hard_`;
    const result = [];

    Object.keys(localStorage).forEach((key) => {
      if (!key.startsWith(prefix)) {
        return;
      }

      const raw = safeGet(key, {});
      Object.entries(raw).forEach(([itemId, count]) => {
        result.push({ key, itemId, count });
      });
    });

    return result;
  },

  removeHardItem(game, topicId, itemId) {
    const key = buildKey("hard", game, topicId);
    const items = safeGet(key, {});
    delete items[itemId];
    safeSet(key, items);
  },

  clearNamespace(type = null) {
    const prefix = type
      ? `${PREFIX}_${VERSION}_${type}_`
      : `${PREFIX}_${VERSION}_`;

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  },

  getUsage() {
    let bytes = 0;

    Object.keys(localStorage).forEach((key) => {
      if (!key.startsWith(`${PREFIX}_${VERSION}_`)) {
        return;
      }

      bytes += key.length;
      bytes += (localStorage.getItem(key) || "").length;
    });

    return {
      bytes,
      kb: (bytes / 1024).toFixed(2),
      mb: (bytes / 1024 / 1024).toFixed(2),
    };
  },
};
