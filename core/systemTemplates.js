import { normalizeWhitespace } from "../utils/text.js";

export const SENTENCE_TOPIC_NAME = "sentences";
export const WORD_PUZZLE_TEMPLATE_KIND = "word-puzzle-sentences";
export const WORD_PUZZLE_TEMPLATE_LIST_NAME = "Word Puzzle setup";
export const WORD_PUZZLE_TEMPLATE_ROW = Object.freeze({
  source: "This list is required for Word Puzzle.",
  target:
    "Edit this list and replace this text with your own sentence pairs, or delete it.",
});

export function normalizeTemplateComparisonText(text) {
  return String(text ?? "")
    .replace(/\u00A0/g, " ")
    .replace(/[\t\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isWordPuzzleTemplateRow(row = {}) {
  return (
    normalizeTemplateComparisonText(row.source) ===
      normalizeTemplateComparisonText(WORD_PUZZLE_TEMPLATE_ROW.source) &&
    normalizeTemplateComparisonText(row.target) ===
      normalizeTemplateComparisonText(WORD_PUZZLE_TEMPLATE_ROW.target)
  );
}

export function hasValidNonTemplateRows(rows = []) {
  return rows.some((row) => {
    const source = normalizeWhitespace(row?.source ?? "");
    const target = normalizeWhitespace(row?.target ?? "");

    if (!source || !target) {
      return false;
    }

    return !isWordPuzzleTemplateRow({ source, target });
  });
}

export function shouldPromoteWordPuzzleTemplate(rows = []) {
  const hasTemplateRow = rows.some((row) => isWordPuzzleTemplateRow(row));
  return !hasTemplateRow && hasValidNonTemplateRows(rows);
}

export function isSystemTemplateList(record = {}) {
  return Boolean(record?.isSystemTemplate && record?.systemTemplateKind);
}

export function isWordPuzzleTemplateList(record = {}) {
  return (
    record?.isSystemTemplate === true &&
    record?.systemTemplateKind === WORD_PUZZLE_TEMPLATE_KIND
  );
}

export function createWordPuzzleTemplateList(lang) {
  return {
    name: WORD_PUZZLE_TEMPLATE_LIST_NAME,
    fileName: `${WORD_PUZZLE_TEMPLATE_LIST_NAME}.txt`,
    lang,
    topicName: SENTENCE_TOPIC_NAME,
    source: "local",
    rows: [{ ...WORD_PUZZLE_TEMPLATE_ROW }],
    isSystemTemplate: true,
    systemTemplateKind: WORD_PUZZLE_TEMPLATE_KIND,
  };
}
