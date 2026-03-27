# SECURITY

## 1. Primary Known Risk: XSS

A major issue previously identified:
user-generated or CSV-derived content may be inserted into the DOM without sanitization.

This is a real risk in any client-side app that renders imported text.

## 2. Required Principle

Anything that comes from:

- CSV
- manual input
- imported files
- topic names
- custom word/translation values

must be treated as unsafe until sanitized.

## 3. Basic Sanitization Pattern Previously Discussed

```js
function sanitizeInput(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

This was discussed as a defensive pattern, but the repo agent should determine whether a better render strategy is possible.

## 4. CSV Validation Gaps

Known missing validation concerns:

- malformed rows
- missing separator
- too many separators
- empty values
- unexpected long content
- invalid control characters

## 5. Recommended Security Audit

The repo agent should identify all places where text reaches the DOM through:

- `innerHTML`
- template strings inserted as HTML
- dynamic list rendering
- topic naming UI
- imported CSV content

## 6. Recommended Priority

Security hardening should happen before cosmetic refactors.

## 7. What Not To Do

Do not solve this by replacing working code with an oversized framework.
Fix the vulnerable paths directly.

## 8. Additional Considerations

- filename sanitization
- export filename safety
- localStorage corruption handling
- malformed `index.json` handling
- safe fallback rendering for bad data
