export function normalizeWhitespace(text) {
  return String(text || "").trim().replace(/\s+/g, " ");
}

export function isRTL(text) {
  return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text || "");
}

export function setDirection(element, text) {
  if (!element) {
    return;
  }

  element.dir = isRTL(text) ? "rtl" : "ltr";
}

export function tokenizeSentence(text) {
  return normalizeWhitespace(text).split(" ").filter(Boolean);
}

export function escapeHtml(text) {
  return String(text).replace(/[&<>'"]/g, (character) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return map[character];
  });
}
