# STORAGE MODEL

## Current Namespace

The app uses browser `localStorage` under the prefix:

```text
LLH_v4_
```

## Main Key Families

- library topics: `LLH_v4_library_topics_global`
- preferences
- sessions
- best times
- hard items

## Current Storage Responsibilities

- local library topics
- imported topics
- hub-derived local copies
- user preferences for audio and speech
- session history
- best times
- hard-item counts

## Topic Persistence

Library topics are stored as sanitized topic objects with embedded row arrays.

## Current Good News

Storage versioning already exists in code.

## Current Gaps

- no formal migration layer beyond versioned keys
- no storage corruption reporting beyond safe fallbacks
