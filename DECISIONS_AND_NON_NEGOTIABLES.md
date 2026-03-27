# DECISIONS AND NON-NEGOTIABLES

## Confirmed From The Repo

1. The app is static-first.
2. The repo uses plain browser JavaScript, not a framework.
3. `server.js` is a local static dev server, not a product backend.
4. Relative paths are used throughout the app shell and service worker setup.
5. The current bundled hub source is `hubIndex.js`.
6. Local editable copies of hub content are part of the current behavior.
7. Word Puzzle is the only sentence-mode game.
8. Flash Cards and Word Match currently share vocabulary-mode content.

## Important Clarification

`index.json` is not a current repo fact. It is a future design target that older docs mentioned. Do not build changes that assume it already exists.

## Verified Guardrails For Future Work

- do not break the home -> hub -> game flow
- do not break local library editing
- do not break local storage compatibility without a migration plan
- do not replace the static app with a backend architecture
- do not hide current repo issues behind vague future abstractions
