# WP DETAILS

## File

- `games/wordpuzzle.js`

## Current Runtime

Word Puzzle:

- shuffles sentence rows
- tokenizes `source` text by whitespace
- lets the user build the source sentence from a bank
- enables speech playback only after the sentence is solved
- records a wrong attempt when the built token count matches the target length but the order is wrong

## Shared Dependencies

- `core/engine.js`
- `core/audio.js`
- `core/speech.js`
- `utils/helpers.js`
- `utils/text.js`

## Current Risks

- tokenization is simple whitespace splitting only
- long-sentence handling is still basic
- mistake logic is intentionally lightweight and may not match all desired interpretations
