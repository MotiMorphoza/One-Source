import { normalizeWhitespace } from "./text.js";
import { uid } from "./helpers.js";

function parseDelimitedLine(line, delimiter) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else if (inQuotes) {
        inQuotes = !inQuotes;
      } else if (current.length === 0) {
        inQuotes = true;
      } else {
        current += character;
      }

      continue;
    }

    if (character === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += character;
  }

  cells.push(current.trim());
  return {
    cells,
    hasUnclosedQuote: inQuotes,
  };
}

function countDelimiter(line, delimiter) {
  let count = 0;
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === delimiter && !inQuotes) {
      count += 1;
    }
  }

  return count;
}

function inferDelimiter(text, sourceId = "", preferredDelimiter = null) {
  if (preferredDelimiter === "|" || preferredDelimiter === ",") {
    return preferredDelimiter;
  }

  const normalizedSourceId = String(sourceId || "").toLowerCase();
  if (normalizedSourceId.endsWith(".txt")) {
    return "|";
  }

  if (normalizedSourceId.endsWith(".csv")) {
    return ",";
  }

  const firstContentLine = String(text || "")
    .split(/\r?\n/)
    .find((line) => line.trim());

  if (!firstContentLine) {
    return "|";
  }

  const pipeCount = countDelimiter(firstContentLine, "|");
  const commaCount = countDelimiter(firstContentLine, ",");

  if (pipeCount > 0 && pipeCount >= commaCount) {
    return "|";
  }

  return ",";
}

function isHeader(cells) {
  if (cells.length < 2) {
    return false;
  }

  const first = normalizeWhitespace(cells[0]).toLowerCase();
  const second = normalizeWhitespace(cells[1]).toLowerCase();

  return (
    (first === "learning" && second === "translation") ||
    (first === "learning language" && second === "translation") ||
    (first === "learning language" && second === "user language") ||
    (first === "source" && second === "target")
  );
}

export function parseCsv(text, sourceId = "csv", options = {}) {
  const { strict = true, delimiter = null } = options;
  const resolvedDelimiter = inferDelimiter(text, sourceId, delimiter);
  const rows = [];
  const errors = [];

  String(text || "")
    .split(/\r?\n/)
    .forEach((line, index) => {
      const lineNumber = index + 1;

      if (!line.trim()) {
        return;
      }

      const { cells, hasUnclosedQuote } = parseDelimitedLine(line, resolvedDelimiter);
      if (index === 0 && isHeader(cells)) {
        return;
      }

      if (hasUnclosedQuote) {
        errors.push(`line ${lineNumber}: unclosed quoted value`);
        return;
      }

      if (cells.length < 2) {
        errors.push(`line ${lineNumber}: expected two columns`);
        return;
      }

      if (strict && cells.length !== 2) {
        errors.push(`line ${lineNumber}: expected exactly two columns`);
        return;
      }

      const source = normalizeWhitespace(cells[0]);
      const target = normalizeWhitespace(
        strict ? cells[1] : cells.slice(1).join(resolvedDelimiter),
      );

      if (!source || !target) {
        errors.push(`line ${lineNumber}: source and target are required`);
        return;
      }

      rows.push({
        id: uid(`${sourceId}-${index}`),
        source,
        target,
      });
    });

  if (errors.length > 0) {
    throw new Error(`Invalid file in ${sourceId}: ${errors.slice(0, 3).join("; ")}`);
  }

  return rows;
}
