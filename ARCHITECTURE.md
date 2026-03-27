# ARCHITECTURE

## 1. System Overview

ONE SOURCE is a unified language-learning platform that combines multiple game modes under one content system.

At a conceptual level:

```text
                HUB / Library / Index
                        |
        -----------------------------------------
        |                   |                   |
       FC                  WM                  WP
        \                  |                  /
         \                 |                 /
          -------- Shared Storage / Utils -----
```

## 2. Architectural Goals

The architecture is intended to achieve:

- one shared content source
- one shared topic selection flow
- one shared storage layer or compatible storage contract
- reusable parsing / utility logic
- multiple learning experiences on top of the same dataset

## 3. Main Layers

### A. HUB Layer
Responsibilities:

- expose available content
- list languages / branches / topics / files
- download or load a selected topic
- pass selected data into a game
- act as the user-facing library

Target truth model:

- do not probe the filesystem in the browser
- do not rely on HEAD requests for availability
- trust `index.json`

### B. Data Layer
Responsibilities:

- parse CSV
- normalize rows
- validate content
- sanitize unsafe text
- optionally detect RTL / language direction
- provide a shared topic/data format to games

### C. Game Layer
Contains:

- FC
- WM
- WP

Each game should consume normalized data rather than implementing its own incompatible parsing rules.

### D. Storage Layer
Responsibilities:

- save user topics
- save stats
- save hard items
- save preferences such as sound
- later possibly version data safely

### E. Shared UX / Shell Layer
Potential responsibilities:

- navigation
- app switching
- shared screen transitions
- common controls
- PWA integration

## 4. Current Reality vs Target Reality

### Current / Historical Reality
From conversation history, the system appears to be partly unified but not fully.

Observed state:

- HUB exists
- shared data ideas exist
- games are present under the same umbrella
- some storage/utilities are shared
- some lifecycle control is still game-specific

### Target Reality
A more standardized runtime was discussed where all games follow a common contract and receive data/context from the shell instead of pulling everything themselves.

Possible target interface:

```text
game.init(container, context)
game.destroy()
```

## 5. Proposed Shared Engine Direction

A future v4-style direction was discussed, including:

### Session/Core Engine
Potential centralized handling of:

- session lifecycle
- timer
- stats
- mistakes
- progress bookkeeping

### Shared Storage API
Potential unified namespace pattern, for example:

```text
LLH_v4_{type}_{game}_{topic}
```

This pattern must be verified against the repo before use.

### Shared Hub Adapter
Games should not own HUB logic.
Games should receive already-resolved context/data.

### Shared Utilities
Likely candidates:

- CSV parse
- sanitize
- shuffle
- detect RTL
- tokenize / split logic
- audio helpers
- speech/TTS helpers

## 6. Design Principles

### Stability over refactor
Large structural changes were intentionally postponed at times.

### Source of truth over inference
`index.json` should say what exists.

### Unified content, multiple learning modes
Same content, different pedagogic interfaces.

### Static deployability
Everything should work without server-side logic.

## 7. Current Weak Points

- missing sanitization
- incomplete CSV validation
- localStorage versioning not fully formalized
- some logic likely mixed across UI/data/state
- multi-file topic support incomplete in UI
- some game-specific managers still isolated

## 8. Security Boundaries

Any user-provided or CSV-derived text that reaches the DOM must be treated as unsafe until sanitized.

This was explicitly identified as a concern.

## 9. Future Architectural Milestones

1. complete shared data contract
2. complete shared storage contract
3. centralize HUB adapter
4. standardize game interface
5. shared speech/audio module
6. performance cleanup
7. optional deeper modular split
