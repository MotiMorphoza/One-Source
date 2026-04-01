# STORAGE MODEL

## Current Namespace

The app uses browser `localStorage` under the prefix:

```text
LLH_v4_
```

## Main Key Families

- library topics: `LLH_v4_library_topics_global`
- local language pairs: `LLH_v4_local_language_pairs`
- hidden Library-only bundled origins: `LLH_v4_hidden_library_hub_origins`
- preferences
- sessions
- best times
- hard items

## Current Storage Responsibilities

- local library topics
- local custom language-pair registry
- imported topics
- HUB-derived cached topics
- HUB-derived editable local copies
- user preferences for audio and speech
- session history
- best times
- hard-item counts

## Topic Persistence

Library topics are stored as sanitized topic objects with embedded row arrays.
Custom language pairs are stored as separate records with stable local ids and user-facing labels.

Important current source values:

- `local`
- `import`
- `hub-cache`
- `hub-copy`
- `hard-list`

Important custom language-pair fields:

- `id`
- `sourceLabel`
- `targetLabel`
- `title`
- `createdAt`
- `updatedAt`

Important list metadata fields now preserved on stored list records:

- `isSystemTemplate`
- `systemTemplateKind`

## Current Behavior Notes

- starting a HUB list can create a `hub-cache` entry
- editing a cached HUB list promotes it to `hub-copy`
- if browser storage is tight, older `hub-cache` entries can be evicted before local editable saves fail
- deleting a local list removes its stored topic object
- creating a brand-new custom language pair can also create one visible `sentences` template list for Word Puzzle setup
- the template list is never allowed to start a session and does not record sessions, best times, or hard marks
- removing a bundled HUB list from the Library uses Library-only hidden origin storage instead of deleting a bundled file
- legacy `LLH_v4_hidden_hub_origins` entries are migrated into the Library-only hidden key on startup
- topic-scoped sessions and best times now prefer `originPath` when available, so a HUB file and its edited local copy can share the same identity more cleanly
- hard marks are recorded with stable encoded row signatures
- generated hard lists are built from hard marks with a threshold of 2 wrong answers
- system-template promotion is evaluated only while saving list rows, not during rename, search, or render

## Current Good News

- storage versioning already exists in code
- list rename is in-place by topic id
- deleting the last row removes the topic object

## Current Gaps

- no formal migration layer beyond versioned keys
- no storage corruption reporting beyond safe fallbacks
- legacy hide-origin compatibility methods still exist, but they now map to Library-only hide behavior
