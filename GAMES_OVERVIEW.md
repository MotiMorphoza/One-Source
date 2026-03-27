# GAMES OVERVIEW

ONE SOURCE currently consolidates three main learning modes:

- FC
- WM
- WP

They should share content, but they do not necessarily share all runtime logic yet.

## 1. FC — Flash Cards

Most mature module in the conversation history.

Known concepts:

- topic loading
- flip behavior
- hard words
- stats
- import/export
- topic management
- sound toggle
- bank/list views
- HUB integration

## 2. WM — Word Match

Matching-based game mode.

Known concepts from broader project context:

- matching pairs
- timing / best time
- audio integration
- same underlying vocabulary source

Less detailed issue history is remembered here than FC/WP, so the repo agent should inspect it directly.

## 3. WP — Word Puzzle

Sentence/phrase ordering mode.

Known to have a large pending improvement list including:

- sound stability
- mistake counting logic
- mobile checks
- softer sounds
- long sentence handling
- hard manager behavior
- session persistence
- animations
- cleanup
- automatic CSV direction checks

This suggests WP works but remains one of the most active refinement zones.

## 4. Shared Goal

All games should eventually consume the same normalized dataset and follow a common lifecycle pattern.

## 5. Potential Shared Contract

A future direction discussed:

```text
init(container, context)
destroy()
```

Where `context` would include topic metadata and normalized content from the HUB.

## 6. What The Repo Agent Should Compare

For each game:

- input expectations
- storage patterns
- stats patterns
- hard-item patterns
- sound handling
- speech/TTS handling
- cleanup/destroy logic
- directionality/RTL handling
- assumptions about topic shape
