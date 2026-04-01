import { uid } from "../utils/helpers.js";
import { buildCustomLanguagePairTitle } from "../utils/languageLabels.js";
import { normalizeWhitespace } from "../utils/text.js";
import {
  WORD_PUZZLE_TEMPLATE_KIND,
  isSystemTemplateList,
  shouldPromoteWordPuzzleTemplate,
} from "./systemTemplates.js";

const VERSION = "v4";
const PREFIX = "LLH";
const LIBRARY_KEY = `${PREFIX}_${VERSION}_library_topics_global`;
const LOCAL_LANGUAGE_PAIRS_KEY = `${PREFIX}_${VERSION}_local_language_pairs`;
const HIDDEN_ORIGINS_KEY = `${PREFIX}_${VERSION}_hidden_hub_origins`;
const HIDDEN_LIBRARY_HUB_ORIGINS_KEY = `${PREFIX}_${VERSION}_hidden_library_hub_origins`;
const LOCAL_TOPIC_NAME = "grammer";
const SENTENCE_TOPIC_NAME = "sentences";
const STANDARD_GAMES = ["flashcards", "wordmatch"];
const SENTENCE_GAMES = ["flashcards", "wordmatch", "wordpuzzle"];
let lastStorageError = null;

function keyPart(value) {
  return encodeURIComponent(value ?? "global");
}

function buildKey(type, game = "global", topicId = "global") {
  return `${PREFIX}_${VERSION}_${type}_${keyPart(game)}_${keyPart(topicId)}`;
}

function resolveTopicStorageCandidates(topicRef = null) {
  if (!topicRef || typeof topicRef === "undefined") {
    return ["global"];
  }

  if (typeof topicRef === "string") {
    return [topicRef || "global"];
  }

  const candidates = [
    topicRef.originPath,
    topicRef.path,
    topicRef.id,
  ]
    .map((value) => normalizeWhitespace(String(value || "")))
    .filter(Boolean);

  return candidates.length > 0 ? [...new Set(candidates)] : ["global"];
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
    lastStorageError = null;
    return true;
  } catch (error) {
    lastStorageError = error;
    console.error("Storage write failed", error);
    return false;
  }
}

function safeRemove(key) {
  try {
    localStorage.removeItem(key);
    lastStorageError = null;
    return true;
  } catch (error) {
    lastStorageError = error;
    console.error("Storage remove failed", error);
    return false;
  }
}

function sanitizeLocalLanguagePair(pair = {}, existing = null) {
  const id = normalizeWhitespace(pair.id ?? existing?.id ?? "");
  const sourceLabel = normalizeWhitespace(pair.sourceLabel ?? existing?.sourceLabel ?? "");
  const targetLabel = normalizeWhitespace(pair.targetLabel ?? existing?.targetLabel ?? "");
  const title = normalizeWhitespace(
    pair.title ?? existing?.title ?? buildCustomLanguagePairTitle(sourceLabel, targetLabel),
  );

  if (!id || !sourceLabel || !targetLabel) {
    return null;
  }

  return {
    id,
    sourceLabel,
    targetLabel,
    title: title || buildCustomLanguagePairTitle(sourceLabel, targetLabel),
    createdAt: existing?.createdAt ?? pair.createdAt ?? Date.now(),
    updatedAt: pair.updatedAt ?? existing?.updatedAt ?? Date.now(),
  };
}

function saveLocalLanguagePairsCollection(pairs) {
  return safeSet(LOCAL_LANGUAGE_PAIRS_KEY, pairs);
}

function createCustomLanguagePairId(existingPairs = []) {
  let maxIndex = 0;

  existingPairs.forEach((pair) => {
    const match = /^custom:(\d+)$/i.exec(pair.id || "");
    if (!match) {
      return;
    }

    maxIndex = Math.max(maxIndex, Number(match[1]) || 0);
  });

  let candidateIndex = maxIndex + 1;
  let candidateId = `custom:${String(candidateIndex).padStart(3, "0")}`;

  while (existingPairs.some((pair) => pair.id === candidateId)) {
    candidateIndex += 1;
    candidateId = `custom:${String(candidateIndex).padStart(3, "0")}`;
  }

  return candidateId;
}

function getLegacyHiddenOrigins() {
  return safeGet(HIDDEN_ORIGINS_KEY, []);
}

function setLegacyHiddenOrigins(origins) {
  return safeSet(HIDDEN_ORIGINS_KEY, [...new Set(origins.filter(Boolean))]);
}

function getHiddenLibraryHubOrigins() {
  return safeGet(HIDDEN_LIBRARY_HUB_ORIGINS_KEY, []);
}

function setHiddenLibraryHubOrigins(origins) {
  return safeSet(HIDDEN_LIBRARY_HUB_ORIGINS_KEY, [...new Set(origins.filter(Boolean))]);
}

function buildHardItemSignature(topicMeta = {}, item = null) {
  if (!item || typeof item !== "object") {
    return typeof item === "string" ? item : "";
  }

  const lang = normalizeWhitespace(topicMeta.lang || "");
  const source = normalizeWhitespace(item.source ?? item.learn ?? "");
  const target = normalizeWhitespace(item.target ?? item.tr ?? "");
  const topicName = resolveTopicName(topicMeta, null);
  const category = inferCategory(
    topicName,
    topicMeta.category,
    topicMeta.allowedGames || [],
  );

  if (!lang || !source || !target) {
    return item.id || "";
  }

  return [
    "hard",
    encodeURIComponent(lang),
    encodeURIComponent(category),
    encodeURIComponent(source),
    encodeURIComponent(target),
  ].join("|");
}

function parseHardItemSignature(signature) {
  if (typeof signature !== "string" || !signature.startsWith("hard|")) {
    return null;
  }

  const parts = signature.split("|");
  if (parts.length !== 5) {
    return null;
  }

  try {
    return {
      lang: decodeURIComponent(parts[1]),
      category: decodeURIComponent(parts[2]),
      source: decodeURIComponent(parts[3]),
      target: decodeURIComponent(parts[4]),
    };
  } catch {
    return null;
  }
}

function normalizeTopicName(topicName, fallback = LOCAL_TOPIC_NAME) {
  const normalized = normalizeWhitespace(String(topicName || ""))
    .replace(/_/g, " ")
    .toLowerCase();

  if (!normalized) {
    return fallback;
  }

  if (normalized === "grammar" || normalized === "my library") {
    return LOCAL_TOPIC_NAME;
  }

  if (normalized === "daily use") {
    return "daily";
  }

  if (normalized === "na co dzień") {
    return "daily";
  }

  if (normalized === "يومي" || normalized === "يَومِيّ") {
    return "daily";
  }

  if (normalized === "important words") {
    return "misc";
  }

  if (normalized === "gramatyka") {
    return LOCAL_TOPIC_NAME;
  }

  if (normalized === "قواعد" || normalized === "قَواعِد") {
    return LOCAL_TOPIC_NAME;
  }

  if (normalized === "zdania") {
    return SENTENCE_TOPIC_NAME;
  }

  if (normalized === "جمل" || normalized === "جُمَل") {
    return SENTENCE_TOPIC_NAME;
  }

  return normalized;
}

function resolveTopicName(record = {}, existing = null) {
  if (record.topicName || record.topic) {
    return normalizeTopicName(record.topicName || record.topic);
  }

  const normalizedGroup = normalizeTopicName(record.group ?? existing?.group, "");
  const normalizedBranch = normalizeTopicName(record.branch ?? existing?.branch, "");

  if (normalizedGroup === SENTENCE_TOPIC_NAME) {
    return SENTENCE_TOPIC_NAME;
  }

  if (normalizedGroup === "daily") {
    return "daily";
  }

  if (normalizedGroup === "misc") {
    return "misc";
  }

  if (normalizedGroup) {
    return normalizedGroup;
  }

  if (normalizedBranch) {
    return normalizedBranch;
  }

  return normalizeTopicName(existing?.topicName);
}

function inferCategory(topicName, category, allowedGames = []) {
  if (category === SENTENCE_TOPIC_NAME) {
    return SENTENCE_TOPIC_NAME;
  }

  if (normalizeTopicName(topicName) === SENTENCE_TOPIC_NAME) {
    return SENTENCE_TOPIC_NAME;
  }

  return allowedGames.includes("wordpuzzle") ? SENTENCE_TOPIC_NAME : "vocabulary";
}

function inferAllowedGames(category, allowedGames = null) {
  if (Array.isArray(allowedGames) && allowedGames.length > 0) {
    if (category === SENTENCE_TOPIC_NAME) {
      return [...new Set([...allowedGames, ...SENTENCE_GAMES])];
    }

    return [...new Set(allowedGames.filter((gameId) => gameId !== "wordpuzzle"))];
  }

  return category === SENTENCE_TOPIC_NAME ? [...SENTENCE_GAMES] : [...STANDARD_GAMES];
}

function sanitizeRow(row = {}, fallbackPrefix = "row") {
  const source = normalizeWhitespace(row.source ?? row.learn ?? "");
  const target = normalizeWhitespace(row.target ?? row.tr ?? "");

  if (!source || !target) {
    return null;
  }

  return {
    id: row.id || uid(fallbackPrefix),
    source,
    target,
  };
}

function sanitizeRows(rows = [], fallbackPrefix = "row") {
  return rows
    .map((row, index) => sanitizeRow(row, `${fallbackPrefix}-${index}`))
    .filter(Boolean);
}

function promoteSystemTemplateIfReady(topic, rowsWereExplicitlySaved = false) {
  if (!rowsWereExplicitlySaved || !isSystemTemplateList(topic)) {
    return topic;
  }

  if (
    topic.systemTemplateKind === WORD_PUZZLE_TEMPLATE_KIND &&
    shouldPromoteWordPuzzleTemplate(topic.rows)
  ) {
    return {
      ...topic,
      isSystemTemplate: false,
      systemTemplateKind: null,
    };
  }

  return topic;
}

function sanitizeTopic(topic = {}, existing = null) {
  const topicId = topic.id || existing?.id || `library:${uid("topic")}`;
  const topicName = resolveTopicName(topic, existing);
  const category = inferCategory(
    topicName,
    topic.category ?? existing?.category,
    topic.allowedGames || existing?.allowedGames || [],
  );
  const allowedGames = inferAllowedGames(category, topic.allowedGames || existing?.allowedGames);
  const rows = sanitizeRows(topic.rows ?? existing?.rows ?? [], topicId);
  const name = normalizeWhitespace(topic.name ?? topic.title ?? existing?.name ?? "Untitled");
  const source = topic.source ?? existing?.source ?? "local";
  const createdAt = existing?.createdAt ?? topic.createdAt ?? Date.now();
  const updatedAt = topic.updatedAt ?? existing?.updatedAt ?? Date.now();
  const isSystemTemplate = topic.isSystemTemplate ?? existing?.isSystemTemplate ?? false;
  const systemTemplateKind = topic.systemTemplateKind ?? existing?.systemTemplateKind ?? null;

  return {
    id: topicId,
    name,
    fileName: topic.fileName || existing?.fileName || `${name}.csv`,
    path: topic.path || existing?.path || topicId,
    lang: topic.lang || existing?.lang || "",
    topicName,
    source,
    category,
    allowedGames,
    rows,
    createdAt,
    updatedAt,
    originPath: topic.originPath ?? existing?.originPath ?? null,
    originMeta: topic.originMeta ?? existing?.originMeta ?? null,
    isSystemTemplate,
    systemTemplateKind,
  };
}

function saveLibraryTopicsCollection(topics, preservedIds = []) {
  if (safeSet(LIBRARY_KEY, topics)) {
    return true;
  }

  const preserved = new Set(preservedIds.filter(Boolean));
  const removableHubCacheIds = topics
    .filter((topic) => topic.source === "hub-cache" && !preserved.has(topic.id))
    .sort((left, right) => {
      const leftTime = left.updatedAt || left.createdAt || 0;
      const rightTime = right.updatedAt || right.createdAt || 0;
      return leftTime - rightTime;
    })
    .map((topic) => topic.id);

  if (!removableHubCacheIds.length) {
    return false;
  }

  const working = [...topics];
  while (removableHubCacheIds.length > 0) {
    const nextId = removableHubCacheIds.shift();
    const nextIndex = working.findIndex((topic) => topic.id === nextId);
    if (nextIndex >= 0) {
      working.splice(nextIndex, 1);
    }

    if (safeSet(LIBRARY_KEY, working)) {
      return true;
    }
  }

  return false;
}

function updateTopicInCollection(topicId, updater) {
  const topics = Storage.getLibraryTopics();
  const index = topics.findIndex((topic) => topic.id === topicId);

  if (index < 0) {
    return null;
  }

  const updated = updater(topics[index]);
  if (!updated) {
    return null;
  }

  const existing = topics[index];
  topics[index] = sanitizeTopic(updated, existing);
  const saved = saveLibraryTopicsCollection(topics, [topics[index].id]);
  return saved ? topics[index] : existing;
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

  consumeLastError() {
    const error = lastStorageError;
    lastStorageError = null;
    return error;
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

  getLocalLanguagePairs() {
    return safeGet(LOCAL_LANGUAGE_PAIRS_KEY, [])
      .map((pair) => sanitizeLocalLanguagePair(pair))
      .filter(Boolean);
  },

  getLocalLanguagePair(pairId) {
    return this.getLocalLanguagePairs().find((pair) => pair.id === pairId) || null;
  },

  findLocalLanguagePairByLabels(sourceLabel, targetLabel) {
    const normalizedSource = normalizeWhitespace(sourceLabel).toLowerCase();
    const normalizedTarget = normalizeWhitespace(targetLabel).toLowerCase();

    return (
      this.getLocalLanguagePairs().find(
        (pair) =>
          pair.sourceLabel.toLowerCase() === normalizedSource &&
          pair.targetLabel.toLowerCase() === normalizedTarget,
      ) || null
    );
  },

  createLocalLanguagePair(pairMeta) {
    const pairs = this.getLocalLanguagePairs();
    const now = Date.now();
    const nextPair = sanitizeLocalLanguagePair({
      ...pairMeta,
      id: pairMeta.id || createCustomLanguagePairId(pairs),
      createdAt: pairMeta.createdAt ?? now,
      updatedAt: pairMeta.updatedAt ?? now,
    });

    if (!nextPair) {
      return null;
    }

    pairs.push(nextPair);
    return saveLocalLanguagePairsCollection(pairs) ? nextPair : null;
  },

  removeLocalLanguagePair(pairId) {
    const pairs = this.getLocalLanguagePairs();
    const nextPairs = pairs.filter((pair) => pair.id !== pairId);

    if (nextPairs.length === pairs.length) {
      return false;
    }

    return saveLocalLanguagePairsCollection(nextPairs);
  },

  getLibraryTopics() {
    return safeGet(LIBRARY_KEY, []).map((topic) => sanitizeTopic(topic));
  },

  getLibraryTopic(topicId) {
    return this.getLibraryTopics().find((topic) => topic.id === topicId) || null;
  },

  topicTitleExists(name, options = {}) {
    const normalized = normalizeWhitespace(name).toLowerCase();
    const {
      lang = null,
      category = null,
      topicName = null,
      branch = null,
      group = null,
      excludeId = null,
    } = options;
    const normalizedTopic = topicName
      ? normalizeTopicName(topicName, "")
      : branch || group
        ? resolveTopicName({ branch, group }, null)
        : "";

    return this.getLibraryTopics().some((topic) => {
      if (excludeId && topic.id === excludeId) {
        return false;
      }

      if (lang && topic.lang !== lang) {
        return false;
      }

      if (category && topic.category !== category) {
        return false;
      }

      if (normalizedTopic && topic.topicName !== normalizedTopic) {
        return false;
      }

      return normalizeWhitespace(topic.name).toLowerCase() === normalized;
    });
  },

  saveLibraryTopic(topicMeta, rows = null) {
    const topics = this.getLibraryTopics();
    const existingIndex = topics.findIndex((topic) => topic.id === topicMeta.id);
    const existing = existingIndex >= 0 ? topics[existingIndex] : null;
    const rowsWereExplicitlySaved =
      rows !== null || Object.prototype.hasOwnProperty.call(topicMeta || {}, "rows");
    const nextTopic = promoteSystemTemplateIfReady(
      sanitizeTopic(
        {
          ...existing,
          ...topicMeta,
          rows: rows ?? topicMeta.rows ?? existing?.rows ?? [],
          updatedAt: Date.now(),
        },
        existing,
      ),
      rowsWereExplicitlySaved,
    );

    if (existingIndex >= 0) {
      topics[existingIndex] = nextTopic;
    } else {
      topics.push(nextTopic);
    }

    return saveLibraryTopicsCollection(topics, [nextTopic.id]);
  },

  createLibraryTopic(topicMeta) {
    const nextTopic = sanitizeTopic(topicMeta);
    const saved = this.saveLibraryTopic(nextTopic, nextTopic.rows);
    return saved ? this.getLibraryTopic(nextTopic.id) : null;
  },

  renameLibraryTopic(topicId, name) {
    return updateTopicInCollection(topicId, (topic) => ({
      ...topic,
      name,
      fileName: `${normalizeWhitespace(name)}.csv`,
    }));
  },

  setLibraryTopicRows(topicId, rows) {
    return updateTopicInCollection(topicId, (topic) =>
      promoteSystemTemplateIfReady(
        sanitizeTopic(
          {
            ...topic,
            rows: sanitizeRows(rows, topicId),
            updatedAt: Date.now(),
          },
          topic,
        ),
        true,
      ),
    );
  },

  addLibraryRow(topicId, row) {
    return updateTopicInCollection(topicId, (topic) => {
      const nextRow = sanitizeRow(row, `${topicId}-row`);
      if (!nextRow) {
        return null;
      }

      return promoteSystemTemplateIfReady(
        sanitizeTopic(
          {
            ...topic,
            rows: [...topic.rows, nextRow],
            updatedAt: Date.now(),
          },
          topic,
        ),
        true,
      );
    });
  },

  updateLibraryRow(topicId, rowId, changes) {
    return updateTopicInCollection(topicId, (topic) => {
      const existingRow = topic.rows.find((row) => row.id === rowId);
      if (!existingRow) {
        return null;
      }

      const nextRow = sanitizeRow({ ...existingRow, ...changes }, `${topicId}-row`);
      if (!nextRow) {
        return null;
      }

      return promoteSystemTemplateIfReady(
        sanitizeTopic(
          {
            ...topic,
            rows: topic.rows.map((row) => (row.id === rowId ? nextRow : row)),
            updatedAt: Date.now(),
          },
          topic,
        ),
        true,
      );
    });
  },

  removeLibraryRow(topicId, rowId) {
    const topics = this.getLibraryTopics();
    const index = topics.findIndex((topic) => topic.id === topicId);

    if (index < 0) {
      return null;
    }

    const topic = topics[index];
    const nextRows = topic.rows.filter((row) => row.id !== rowId);

    if (nextRows.length === topic.rows.length) {
      return topic;
    }

    if (nextRows.length === 0) {
      topics.splice(index, 1);
      const saved = saveLibraryTopicsCollection(topics);
      return saved ? null : topic;
    }

    topics[index] = promoteSystemTemplateIfReady(
      sanitizeTopic(
        {
          ...topic,
          rows: nextRows,
          updatedAt: Date.now(),
        },
        topic,
      ),
      true,
    );
    const saved = saveLibraryTopicsCollection(topics, [topics[index].id]);
    return saved ? topics[index] : topic;
  },

  removeLibraryTopic(topicId) {
    const topics = this.getLibraryTopics();
    const topic = topics.find((entry) => entry.id === topicId) || null;

    if (!topic) {
      return false;
    }

    const nextTopics = topics.filter((entry) => entry.id !== topicId);
    return saveLibraryTopicsCollection(nextTopics);
  },

  findLibraryTopicByOrigin(originPath) {
    return (
      this.getLibraryTopics().find((topic) => topic.originPath && topic.originPath === originPath) ||
      null
    );
  },

  migrateLegacyHiddenOrigins() {
    const legacyOrigins = getLegacyHiddenOrigins();

    if (!legacyOrigins.length) {
      return { moved: 0, failed: false };
    }

    const mergedOrigins = [...new Set([...getHiddenLibraryHubOrigins(), ...legacyOrigins])];
    if (!setHiddenLibraryHubOrigins(mergedOrigins)) {
      return { moved: 0, failed: true };
    }

    if (!safeRemove(HIDDEN_ORIGINS_KEY) && !setLegacyHiddenOrigins([])) {
      return { moved: legacyOrigins.length, failed: true };
    }

    return { moved: legacyOrigins.length, failed: false };
  },

  getHiddenOrigins() {
    return getHiddenLibraryHubOrigins();
  },

  isOriginHidden(originPath) {
    return this.isLibraryOriginHidden(originPath);
  },

  getHiddenLibraryHubOrigins() {
    return getHiddenLibraryHubOrigins();
  },

  isLibraryOriginHidden(originPath) {
    return Boolean(originPath) && getHiddenLibraryHubOrigins().includes(originPath);
  },

  hideLibraryOrigin(originPath) {
    if (!originPath) {
      return false;
    }

    return setHiddenLibraryHubOrigins([...getHiddenLibraryHubOrigins(), originPath]);
  },

  unhideLibraryOrigin(originPath) {
    if (!originPath) {
      return false;
    }

    return setHiddenLibraryHubOrigins(
      getHiddenLibraryHubOrigins().filter((entry) => entry !== originPath),
    );
  },

  hideOrigin(originPath) {
    return this.hideLibraryOrigin(originPath);
  },

  unhideOrigin(originPath) {
    return this.unhideLibraryOrigin(originPath);
  },

  getImportedTopics() {
    return this.getLibraryTopics();
  },

  saveImportedTopic(topicMeta, rows) {
    return this.saveLibraryTopic(topicMeta, rows);
  },

  getImportedTopic(topicId) {
    return this.getLibraryTopic(topicId);
  },

  removeImportedTopic(topicId) {
    return this.removeLibraryTopic(topicId);
  },

  saveGameSession(game, topicMeta, stats) {
    if (isSystemTemplateList(topicMeta)) {
      return;
    }

    const [primaryTopicId] = resolveTopicStorageCandidates(topicMeta);
    const sessionKey = buildKey("sessions", game, primaryTopicId);
    const sessions = safeGet(sessionKey, []);

    sessions.push({
      date: Date.now(),
      topic: normalizeTopicName(topicMeta.topicName, ""),
      topicName: normalizeTopicName(topicMeta.topicName, ""),
      lang: topicMeta.lang,
      path: topicMeta.path,
      ...stats,
    });

    if (sessions.length > 100) {
      sessions.splice(0, sessions.length - 100);
    }

    safeSet(sessionKey, sessions);
    this.addGlobalSession(game, topicMeta, stats);
  },

  addGlobalSession(game, topicMeta, stats) {
    if (isSystemTemplateList(topicMeta)) {
      return;
    }

    const globalKey = buildKey("sessions", "all");
    const sessions = safeGet(globalKey, []);

    sessions.push({
      date: Date.now(),
      game,
      topic: normalizeTopicName(topicMeta.topicName, ""),
      topicName: normalizeTopicName(topicMeta.topicName, ""),
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
    const candidates = resolveTopicStorageCandidates(topicId);
    const merged = candidates.flatMap((candidate) =>
      safeGet(buildKey("sessions", game, candidate), []),
    );

    if (merged.length === 0) {
      return [];
    }

    return merged
      .sort((left, right) => (right.date || 0) - (left.date || 0))
      .slice(0, 100);
  },

  getAllSessions() {
    return safeGet(buildKey("sessions", "all"), []);
  },

  updateBestTime(game, topicId, time) {
    if (typeof topicId === "object" && isSystemTemplateList(topicId)) {
      return false;
    }

    const candidates = resolveTopicStorageCandidates(topicId);
    const primaryKey = buildKey("best", game, candidates[0]);
    const current = candidates.reduce((best, candidate) => {
      const value = safeGet(buildKey("best", game, candidate), 0);
      if (!value) {
        return best;
      }

      if (!best || value < best) {
        return value;
      }

      return best;
    }, 0);

    if (!current || time < current) {
      safeSet(primaryKey, time);
      return true;
    }

    return false;
  },

  getBestTime(game, topicId) {
    return resolveTopicStorageCandidates(topicId).reduce((best, candidate) => {
      const value = safeGet(buildKey("best", game, candidate), 0);
      if (!value) {
        return best;
      }

      if (!best || value < best) {
        return value;
      }

      return best;
    }, 0);
  },

  addHardItem(game, topicMeta, item) {
    if (typeof topicMeta === "object" && isSystemTemplateList(topicMeta)) {
      return;
    }

    const topicId =
      typeof topicMeta === "string"
        ? topicMeta
        : topicMeta?.id || topicMeta?.path || "global";
    const key = buildKey("hard", game, topicId);
    const items = safeGet(key, {});
    const itemId =
      typeof topicMeta === "string"
        ? typeof item === "string"
          ? item
          : item?.id || ""
        : buildHardItemSignature(topicMeta, item) || item?.id || "";

    if (!itemId) {
      return;
    }

    items[itemId] = (items[itemId] || 0) + 1;
    safeSet(key, items);
  },

  getHardItems(game, topicId) {
    return safeGet(buildKey("hard", game, topicId), {});
  },

  getAllHardItems() {
    const prefix = `${PREFIX}_${VERSION}_hard_`;
    const result = new Map();

    Object.keys(localStorage).forEach((key) => {
      if (!key.startsWith(prefix)) {
        return;
      }

      const raw = safeGet(key, {});
      Object.entries(raw).forEach(([itemId, count]) => {
        const parsed = parseHardItemSignature(itemId);
        const existing = result.get(itemId) || {
          itemId,
          count: 0,
          lang: parsed?.lang || null,
          category: parsed?.category || null,
          source: parsed?.source || null,
          target: parsed?.target || null,
        };

        existing.count += Number(count) || 0;
        result.set(itemId, existing);
      });
    });

    return [...result.values()];
  },

  getHardListRows(lang, category) {
    return this.getAllHardItems()
      .filter((item) => {
        if (!item.lang || !item.source || !item.target) {
          return false;
        }

        if (lang && item.lang !== lang) {
          return false;
        }

        if (category && item.category !== category) {
          return false;
        }

        return item.count >= 2;
      })
      .sort((left, right) => {
        if (right.count !== left.count) {
          return right.count - left.count;
        }

        return `${left.source}|${left.target}`.localeCompare(
          `${right.source}|${right.target}`,
        );
      })
      .map((item) => ({
        id: item.itemId,
        source: item.source,
        target: item.target,
      }));
  },

  getHardListSummary(lang = null) {
    const items = this.getAllHardItems().filter((item) => {
      if (!item.lang || !item.source || !item.target) {
        return false;
      }

      if (lang && item.lang !== lang) {
        return false;
      }

      return item.count >= 2;
    });

    const words = items.filter((item) => item.category !== SENTENCE_TOPIC_NAME).length;
    const sentences = items.filter((item) => item.category === SENTENCE_TOPIC_NAME).length;

    return {
      words,
      sentences,
      total: words + sentences,
    };
  },

  removeHardItem(game, topicId, itemId) {
    const key = buildKey("hard", game, topicId);
    const items = safeGet(key, {});
    delete items[itemId];
    safeSet(key, items);
  },

  clearNamespace(type = null) {
    const prefix = type ? `${PREFIX}_${VERSION}_${type}_` : `${PREFIX}_${VERSION}_`;

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
