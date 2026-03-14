import { Storage } from "./storage.js";
import { parseCsv } from "../utils/csv.js";

function createTimeoutSignal(timeoutMs) {
  const controller = new AbortController();
  const timerId = window.setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    dispose() {
      window.clearTimeout(timerId);
    },
  };
}

export const HubAdapter = {
  index: null,

  init() {
    const index = window.HUB_INDEX;

    if (
      !index ||
      !Array.isArray(index.languages) ||
      !Array.isArray(index.branches) ||
      !Array.isArray(index.entries)
    ) {
      throw new Error("HUB_INDEX is missing or invalid");
    }

    this.index = index;
  },

  getLanguages() {
    return this.index?.languages || [];
  },

  getBranches() {
    return this.index?.branches || [];
  },

  buildTree(lang, category = null, options = {}) {
    const { gameId = null } = options;
    const tree = {};

    (this.index?.entries || []).forEach((entry) => {
      if (category && entry.group !== category) {
        return;
      }

      const files = entry.files?.[lang];
      if (!files || files.length === 0) {
        return;
      }

      if (!tree[entry.branch]) {
        tree[entry.branch] = {};
      }

      if (!tree[entry.branch][entry.group]) {
        tree[entry.branch][entry.group] = [];
      }

      files.forEach((fileName) => {
        const path = `hub/${lang}/${entry.branch}/${entry.group}/${fileName}`;
        tree[entry.branch][entry.group].push({
          id: path,
          name: fileName.replace(/\.csv$/i, ""),
          file: fileName,
          path,
          lang,
          branch: entry.branch,
          group: entry.group,
        });
      });
    });

    Storage.getImportedTopics().forEach((topic) => {
      if (topic.lang !== lang) {
        return;
      }

      if (category && topic.category && topic.category !== category) {
        return;
      }

      if (
        gameId &&
        Array.isArray(topic.allowedGames) &&
        topic.allowedGames.length > 0 &&
        !topic.allowedGames.includes(gameId)
      ) {
        return;
      }

      const branch = topic.branch || "imports";
      const group = topic.group || "my_files";

      if (!tree[branch]) {
        tree[branch] = {};
      }

      if (!tree[branch][group]) {
        tree[branch][group] = [];
      }

      tree[branch][group].push({
        id: topic.id,
        name: topic.name,
        file: topic.fileName || topic.name,
        path: topic.path,
        lang: topic.lang,
        branch,
        group,
        source: "import",
      });
    });

    return tree;
  },

  async loadTopic(fileRecord, options = {}) {
    const record = typeof fileRecord === "string" ? { path: fileRecord } : fileRecord;
    if (record.source === "import" || String(record.path || "").startsWith("import:")) {
      const imported = Storage.getImportedTopic(record.id || record.path);
      if (!imported) {
        throw new Error("Imported topic not found in local library.");
      }

      return imported.rows || [];
    }

    const path = record.path;
    const requestPath = encodeURI(path);
    const timeoutHandle = options.signal ? null : createTimeoutSignal(15000);
    const signal = options.signal || timeoutHandle.signal;

    try {
      const response = await fetch(requestPath, { signal, cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Could not load ${path}`);
      }

      const text = await response.text();
      return parseCsv(text, path);
    } finally {
      timeoutHandle?.dispose();
    }
  },

  countFiles(lang = null) {
    let count = 0;

    (this.index?.entries || []).forEach((entry) => {
      if (lang) {
        count += entry.files?.[lang]?.length || 0;
        return;
      }

      Object.values(entry.files || {}).forEach((files) => {
        count += files.length;
      });
    });

    Storage.getImportedTopics().forEach((topic) => {
      if (!lang || topic.lang === lang) {
        count += 1;
      }
    });

    return count;
  },
};
