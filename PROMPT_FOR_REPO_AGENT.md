# PROMPT FOR REPO AGENT

You are working on the ONE SOURCE repository.

Treat the code as the primary source of truth.

## Repo Facts You Should Start From

- entry page: `index.html`
- app controller: `core/hubManager.js`
- live bundled hub registry: `hubIndex.js`
- no live `index.json`
- shared storage: `core/storage.js`
- shared session engine: `core/engine.js`
- games: Flash Cards, Word Match, Word Puzzle

## Your Job

1. preserve the working static app
2. prefer targeted patches
3. keep relative-path deployment safe
4. distinguish current fact from future goal
5. verify every claim against the repo before documenting it

## Known Current Issues Worth Checking First

- vocabulary tree filtering mismatch
- topic-title DOM interpolation
- empty-topic auto-delete missing
- permissive CSV parsing
- service worker asset drift
- dead code around import paths
