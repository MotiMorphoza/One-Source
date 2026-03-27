# MIGRATION V3 TO V4 NOTES

This file summarizes the unification direction that was discussed for a more advanced future architecture.

## 1. Known Intermediate State

A “v3” style state was described conceptually as:

- single `index.html` entry
- hub shell loading games dynamically
- shared CSS
- PWA-ready direction
- router/flow basic but functional

But not yet a single unified `GameEngine`.

## 2. Proposed Next Upgrade Direction

A “v4” style direction discussed included:

### SessionEngine / Core Engine
Shared lifecycle handling:

- session start/end
- timer
- mistakes
- progress
- stats

### Common Game Interface
Games ideally expose something like:

```text
init(container, context)
destroy()
```

### Fully Unified Storage Contract
A single storage abstraction with per-game/topic scoping.

### Central HubAdapter
Games receive resolved data/context instead of managing HUB discovery themselves.

### Shared Utilities
One place for:

- CSV parse
- sanitize
- shuffle
- RTL detection
- tokenize
- audio
- speech

## 3. Important Constraint

This was discussed as future direction, not guaranteed completed implementation.

The repo agent must not assume the code is already there.
They must map what exists and then decide what is safe to upgrade.

## 4. Safe Migration Principle

Only unify what can be unified without breaking working flows.

Do not force all games into one abstraction layer prematurely.
