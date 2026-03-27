# DECISIONS AND NON-NEGOTIABLES

## 1. `index.json` must be the source of truth
This is one of the clearest project decisions preserved from prior work.

Reasoning included:

- prevent browser HEAD checks
- prevent wrong UI states
- support multiple files cleanly
- one authoritative availability model

## 2. No backend for routine stabilization
The project is intended to remain static/client-side.

## 3. No framework migration by default
The project should remain lightweight and browser-native unless the user explicitly changes direction.

## 4. Stability before deep refactor
A broad cleanup was considered but intentionally postponed.

## 5. Double BACK buttons are intentional
Do not remove them just because they look redundant.

## 6. Empty topic must auto-delete
If all words are deleted, the topic should be removed.

## 7. Shared TTS should exist eventually
Future direction:
one shared speech/TTS engine rather than one per game.

## 8. Multi-file topics are required
This is not optional future fantasy.
It is part of the intended model.

## 9. CSV output must stay strict
User requirement:
only the separator comma should exist in CSV outputs.

## 10. GitHub Pages compatibility matters
Pathing, manifest, static behavior, and service worker setup must respect this.
