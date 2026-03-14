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

  buildTree(lang, category = null) {
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

    return tree;
  },

  async loadTopic(fileRecord, options = {}) {
    const path = typeof fileRecord === "string" ? fileRecord : fileRecord.path;
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

    return count;
  },
};
