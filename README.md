# ONE SOURCE

ONE SOURCE is a static browser app that unifies three language-learning modes behind one shell:

- Flash Cards
- Word Match
- Word Puzzle

The repo is plain HTML/CSS/JavaScript. It is designed to run without a product backend and stay compatible with GitHub Pages style hosting.

## Current Repo Reality

- Entry point: `index.html`
- Main app controller: `core/hubManager.js`
- Content registry shipped in repo: `hubIndex.js`
- Shared data loader: `core/hubAdapter.js`
- Shared storage: `core/storage.js`
- Shared session logic: `core/engine.js`
- Games: `games/flashcards.js`, `games/wordmatch.js`, `games/wordpuzzle.js`
- Local content lives in browser `localStorage`
- Bundled hub content lives in `hub/`

Important: this repo does **not** currently ship an `index.json` file. The app currently reads `window.HUB_INDEX` from `hubIndex.js`.

## How The App Works Today

1. The home screen lets the user choose a language pair.
2. The user chooses a game.
3. The HUB tree is built as `Choose a topic -> topic -> files`, using bundled hub content plus local library topics.
4. When a hub file is started for the first time, the app saves a local copy in the library.
5. Games run through a shared `SessionEngine`.

## Content Rules In Code

- Topic `sentences` is available to Flash Cards, Word Match, and Word Puzzle.
- All other topics are available to Flash Cards and Word Match.
- Word Puzzle can use only the `sentences` topic.
- Rows are normalized to `{ id, source, target }`.
- Imported and edited lists are stored locally and stay editable.
- Users can create their own topics from the library UI.

## Local Development

Open the project through HTTP, not `file://`.

```bash
node server.js
```

Then open `http://localhost:4173`.

## Current Gaps Confirmed In Repo

- `hubIndex.js` is still the live source of hub content metadata.
- there is still no live `index.json`
- `sw.js` uses a manual asset list that can drift from the actual import graph

## Scope Notes

`server.js` is only a local static file server for development. It is not a product backend.
