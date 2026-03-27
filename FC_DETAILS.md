# FC DETAILS

## File

- `games/flashcards.js`

## Current Runtime

Flash Cards:

- shuffles the selected data set
- shows one row at a time
- flips between `source` and `target`
- records correct and wrong answers through `SessionEngine`
- can reshuffle remaining cards
- can flip direction mid-session

## Shared Dependencies

- `core/engine.js`
- `core/audio.js`
- `utils/helpers.js`
- `utils/text.js`

## Current Strengths

- uses normalized row data
- uses `textContent` for card body text
- stays within the shared shell flow

## Current Risks

- the game still relies on the shared shell and hub path being correct before launch

## Repo-Grounded Note

The old rename-topic ghost bug does not appear in this file. Current rename logic lives in the library shell and storage layer, not in the Flash Cards runtime itself.
