# STORAGE MODEL

## 1. Known Storage Direction

The project uses browser storage, especially localStorage.

A backend is intentionally absent.

## 2. Known / Referenced Storage Concepts

Historical conversation references included concepts such as:

- `flashData`
- `stats`
- `hardWords`
- `soundOn`

In some versions, keys may have version suffixes such as:

- `flashData_vX`
- `stats_vX`

The repo agent must verify exact current names.

## 3. Why Storage Matters

Storage powers:

- user-imported topics
- progress
- hard-item lists
- preferences
- possibly session persistence

## 4. Current Weaknesses

Known concerns previously identified:

- no strong formal versioning across all storage
- possible schema drift across modules
- weak generated IDs
- localStorage size limitations for future scale

## 5. Intentional Near-Term Decision

A full migration to IndexedDB or backend was not treated as immediately necessary.
That was intentionally deferred.

## 6. Future Direction

Potential v4-style unified naming pattern was discussed conceptually, for example:

```text
LLH_v4_{type}_{game}_{topic}
```

This is a design direction only and must be validated before implementation.

## 7. Hard Items

Known concepts include:

- hard words in FC
- hard manager concepts in WP
- likely game-specific hard-item schemas today

A future unification path should standardize this while preserving behavior.

## 8. Stats

Stats likely differ between games but could eventually sit behind a unified API.

Possible tracked items across the project include:

- correct answers
- mistakes
- timing
- best time
- session state
- progress

## 9. Preferences

Known preference examples:

- sound on/off

Potential future preferences:

- speech voice
- accent / pronunciation
- text direction or display preferences
- difficulty mode

## 10. Recommended Verification Tasks

Repo agent should inspect:

- all `localStorage.setItem`
- all `localStorage.getItem`
- all reset/migration keys
- version constants
- data clearing flows
- compatibility between FC / WM / WP schemas
