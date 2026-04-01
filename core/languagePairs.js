import { Storage } from "./storage.js";
import {
  buildCustomLanguagePairTitle,
  parseLanguagePairTitle,
  resolveLanguageNameSpeechCode,
} from "../utils/languageLabels.js";
import { normalizeWhitespace } from "../utils/text.js";

export const CREATE_LANGUAGE_PAIR_OPTION_VALUE = "__create_custom_language_pair__";

function getBundledLanguagePairs() {
  const languages = window.HUB_INDEX?.languages;
  return Array.isArray(languages) ? languages : [];
}

function pushUniquePair(collection, seenIds, pair) {
  const id = normalizeWhitespace(pair?.id);
  if (!id || seenIds.has(id)) {
    return;
  }

  seenIds.add(id);
  collection.push({
    id,
    title: normalizeWhitespace(pair?.title) || id,
    source: pair?.source || "legacy",
    sourceLabel: normalizeWhitespace(pair?.sourceLabel || ""),
    targetLabel: normalizeWhitespace(pair?.targetLabel || ""),
  });
}

export function isCreateNewLanguagePairValue(value) {
  return value === CREATE_LANGUAGE_PAIR_OPTION_VALUE;
}

export function resolveLanguageLabel(langId) {
  const id = normalizeWhitespace(langId);
  if (!id) {
    return "";
  }

  const bundled = getBundledLanguagePairs().find((language) => language.id === id);
  if (bundled?.title) {
    return bundled.title;
  }

  const custom = Storage.getLocalLanguagePair(id);
  if (custom?.title) {
    return custom.title;
  }

  return id;
}

export function getLanguagePairLabels(langId) {
  const id = normalizeWhitespace(langId);
  if (!id) {
    return {
      id: "",
      title: "",
      sourceLabel: "",
      targetLabel: "",
    };
  }

  const bundled = getBundledLanguagePairs().find((language) => language.id === id);
  if (bundled) {
    const parsed = parseLanguagePairTitle(bundled.title);
    return {
      id,
      title: bundled.title,
      sourceLabel: parsed.sourceLabel || id.split("-")[0] || id,
      targetLabel: parsed.targetLabel || id.split("-")[1] || "",
    };
  }

  const custom = Storage.getLocalLanguagePair(id);
  if (custom) {
    return {
      id,
      title: custom.title,
      sourceLabel: custom.sourceLabel,
      targetLabel: custom.targetLabel,
    };
  }

  return {
    id,
    title: id,
    sourceLabel: id,
    targetLabel: "",
  };
}

export function resolveSpeechLangCode(langId) {
  const id = normalizeWhitespace(langId);
  const directPrefix = id.split("-")[0];
  const directCode = resolveLanguageNameSpeechCode(directPrefix);
  if (directCode) {
    return directCode;
  }

  const labels = getLanguagePairLabels(id);
  const fromSourceLabel = resolveLanguageNameSpeechCode(labels.sourceLabel);
  if (fromSourceLabel) {
    return fromSourceLabel;
  }

  return "en-US";
}

export function getAvailableLanguagePairs(options = {}) {
  const includeLegacy = options.includeLegacy !== false;
  const includeCreateOption = options.includeCreateOption === true;
  const pairs = [];
  const seenIds = new Set();

  getBundledLanguagePairs().forEach((language) => {
    pushUniquePair(pairs, seenIds, {
      id: language.id,
      title: language.title,
      source: "hub",
    });
  });

  Storage.getLocalLanguagePairs()
    .slice()
    .sort((left, right) => left.title.localeCompare(right.title))
    .forEach((pair) => {
      pushUniquePair(pairs, seenIds, {
        ...pair,
        source: "custom",
      });
    });

  if (includeLegacy) {
    Storage.getLibraryTopics().forEach((topic) => {
      const id = normalizeWhitespace(topic.lang);
      if (!id) {
        return;
      }

      pushUniquePair(pairs, seenIds, {
        id,
        title: resolveLanguageLabel(id),
        source: "legacy",
      });
    });
  }

  if (includeCreateOption) {
    pairs.push({
      id: CREATE_LANGUAGE_PAIR_OPTION_VALUE,
      title: "Create new language pair",
      source: "create",
      sourceLabel: "",
      targetLabel: "",
    });
  }

  return pairs;
}

export function buildCustomPairRecord(sourceLabel, targetLabel) {
  const source = normalizeWhitespace(sourceLabel);
  const target = normalizeWhitespace(targetLabel);

  return {
    sourceLabel: source,
    targetLabel: target,
    title: buildCustomLanguagePairTitle(source, target),
  };
}
