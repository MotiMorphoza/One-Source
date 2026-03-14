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
      } else {
        inQuotes = !inQuotes;
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
  return cells;
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

export function parseCsv(text, sourceId = "csv") {
  const rows = [];

  String(text || "")
    .split(/\r?\n/)
    .forEach((line, index) => {
      if (!line.trim()) {
        return;
      }

      const cells = parseCsvLine(line);
      if (index === 0 && isHeader(cells)) {
        return;
      }

      if (cells.length < 2) {
        return;
      }

      const source = normalizeWhitespace(cells[0]);
      const target = normalizeWhitespace(cells.slice(1).join(","));

      if (!source || !target) {
        return;
      }

      rows.push({
        id: uid(`${sourceId}-${index}`),
        source,
        target,
      });
    });

  return rows;
}
