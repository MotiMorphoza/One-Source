# GAMES OVERVIEW

## Current Game Files

- Flash Cards: `games/flashcards.js`
- Word Match: `games/wordmatch.js`
- Word Puzzle: `games/wordpuzzle.js`

## Shared Launch Contract

All games are launched from `core/hubManager.js` and receive:

- a DOM container
- a context object with `lang`, `topic`, and `data`
- a shared `SessionEngine`

Return-to-home navigation during active screens now comes from the shared shell top bar instead of duplicated per-screen `Home` buttons.

## Content Gating In Code

- `flashcards` -> vocabulary content
- `wordmatch` -> vocabulary content
- `wordpuzzle` -> sentence content

## Shared Runtime Pieces

- `games/gameInterface.js`
- `core/engine.js`
- `core/audio.js`
- `core/speech.js`

## Key Difference Between Games

- Flash Cards is card-based repetition.
- Word Match is board-based pairing.
- Word Puzzle is token-order reconstruction with speech playback.
