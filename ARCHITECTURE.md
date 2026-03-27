# ARCHITECTURE

## Overview

ONE SOURCE is a single-page static application with one shell and three game modules.

```text
index.html
  -> core/hubManager.js
    -> core/hubAdapter.js
    -> core/storage.js
    -> core/engine.js
    -> games/*
    -> ui/*
    -> utils/*
```

## Main Layers

### 1. Shell

- `index.html`
- `styles.css`
- `core/hubManager.js`
- `core/router.js`

The shell owns screen switching, app state, imports, library editing, stats, and game launch.

### 2. Content Registry

- `hubIndex.js`
- `hub/`
- `core/hubAdapter.js`

The bundled content registry is currently `window.HUB_INDEX`, not `index.json`.

`HubAdapter.buildTree()` merges:

- bundled hub files from `hubIndex.js`
- local library topics from `localStorage`

### 3. Shared Runtime

- `core/engine.js`
- `core/audio.js`
- `core/speech.js`
- `core/eventBus.js`

Games use a common session engine for timing, correctness, hard-item marking, and session persistence.

### 4. Storage

- `core/storage.js`

Storage is already versioned under the `LLH_v4_*` namespace.

### 5. Game Modules

- `games/flashcards.js`
- `games/wordmatch.js`
- `games/wordpuzzle.js`

All games are launched through the same interface:

```js
game.init(container, context, engine)
```

## Current Data Flow

1. User picks a language pair.
2. User picks a game.
3. `HubManager` asks `HubAdapter` for a filtered topic tree.
4. The selected file is loaded from local library or fetched from `hub/`.
5. Rows are parsed by `utils/csv.js`.
6. The game receives normalized data and a shared `SessionEngine`.

## Important Current Limitation

The game-to-category mapping uses:

- `wordpuzzle -> "sentences"`
- `flashcards` / `wordmatch -> "vocabulary"`

But bundled hub entries currently use groups such as `daily_use`, `important_words`, and `sentences`. That mismatch is a real repo issue and affects the topic tree.

## What Is Already Unified

- app shell
- game launch path
- session timing and stats
- local storage namespace
- audio and speech helpers

## What Is Not Yet Unified

- hub metadata shape
- strict topic abstraction of `language -> topics -> files`
- CSV validation policy
- DOM hardening policy
- empty-topic deletion behavior
