# WM DETAILS

## File

- `games/wordmatch.js`

## Current Runtime

Word Match:

- shuffles the incoming rows
- shows up to 6 active pairs at a time
- uses left/right card selection
- records correct and wrong attempts through `SessionEngine`
- refills the board from a queue until all pairs are cleared

## Shared Dependencies

- `core/engine.js`
- `core/audio.js`
- `utils/helpers.js`
- `utils/text.js`

## Current Risks

- wrong-attempt fallback ids can still use a timestamp-based string for misses

## Behavioral Note

Cleanup is simple and mostly adequate. The game clears pending timeouts on destroy.
