import { normalizeWhitespace } from "./text.js";

const LANGUAGE_PAIR_SEPARATOR = " \u2192 ";
const LANGUAGE_NAME_TO_SPEECH_CODE = {
  ar: "ar-SA",
  arabic: "ar-SA",
  de: "de-DE",
  english: "en-US",
  en: "en-US",
  es: "es-ES",
  french: "fr-FR",
  fr: "fr-FR",
  german: "de-DE",
  he: "he-IL",
  hebrew: "he-IL",
  italian: "it-IT",
  it: "it-IT",
  pl: "pl-PL",
  polish: "pl-PL",
  portuguese: "pt-PT",
  pt: "pt-PT",
  russian: "ru-RU",
  ru: "ru-RU",
  spanish: "es-ES",
  uk: "uk-UA",
  ukrainian: "uk-UA",
};

function normalizeLanguageName(label) {
  return normalizeWhitespace(label)
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ");
}

export function buildCustomLanguagePairTitle(sourceLabel, targetLabel) {
  const source = normalizeWhitespace(sourceLabel);
  const target = normalizeWhitespace(targetLabel);

  if (!source && !target) {
    return "";
  }

  if (!source || !target) {
    return source || target;
  }

  return `${source}${LANGUAGE_PAIR_SEPARATOR}${target}`;
}

export function parseLanguagePairTitle(title) {
  const [sourceLabel = "", targetLabel = ""] = String(title || "")
    .split(/->|\u2192/u)
    .map((part) => normalizeWhitespace(part));

  return {
    sourceLabel,
    targetLabel,
  };
}

export function resolveLanguageNameSpeechCode(label) {
  const normalized = normalizeLanguageName(label);
  return LANGUAGE_NAME_TO_SPEECH_CODE[normalized] || "";
}

