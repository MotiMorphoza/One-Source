import { normalizeWhitespace } from "./text.js";
import { uid } from "./helpers.js";

function parseCsvLine(line) {
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

    if (character === "," && !inQuotes) {
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

function isHeader(cells) {
  if (cells.length < 2) {
    return false;
  }

  const first = normalizeWhitespace(cells[0]).toLowerCase();
  const second = normalizeWhitespace(cells[1]).toLowerCase();

  return (
    (first === "learning language" && second === "translation") ||
    (first === "source" && second === "target")
  );
}

export function parseCsv(text, sourceId = "csv", options = {}) {
  const { strict = true } = options;
  const rows = [];
  const errors = [];

  String(text || "")
    .split(/\r?\n/)
    .forEach((line, index) => {
      const lineNumber = index + 1;

      if (!line.trim()) {
        return;
      }

      const { cells, hasUnclosedQuote } = parseCsvLine(line);
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
        strict ? cells[1] : cells.slice(1).join(","),
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
    throw new Error(`Invalid CSV in ${sourceId}: ${errors.slice(0, 3).join("; ")}`);
  }

  return rows;
}
