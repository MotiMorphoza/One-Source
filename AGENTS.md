# AGENTS.md

This file is for any external coding agent working on ONE SOURCE.

## Read This First

You are not designing a fresh greenfield product.

You are inheriting an already-evolved project with working parts, old constraints, intentional quirks, and unfinished unification work.

The primary task is not innovation.
The primary task is controlled stabilization.

## Mission

Preserve the working system while moving it toward a cleaner unified architecture for:

- FC
- WM
- WP
- shared HUB
- shared topic/data pipeline

## Hard Rules

### 1. Do not break the HUB
The HUB is central to the project and should remain the content entry point.

### 2. Do not break `index.json`
The project is moving toward `index.json` as the source of truth for content availability.

### 3. Do not introduce a backend
Do not solve client-side problems by introducing a server unless explicitly requested.

### 4. Do not introduce frameworks
No React/Vue/etc. unless explicitly approved.

### 5. Do not force a massive refactor before stability
Several deeper refactors were intentionally postponed.

### 6. Keep GitHub Pages compatibility
Static deployment matters.

## Project Philosophy

- browser-first
- static-first
- simple data model
- CSV-friendly
- modular but not over-engineered
- stable over fancy

## Known Intentional Behavior

### Double BACK buttons
Previously flagged, later explicitly marked as intentional.
Do not “fix” this unless the user changes direction.

### Topic deletion rule
If all words are deleted from a list, the topic itself should be deleted.

### Stability before deep cleanup
Security fixes and key behavior fixes were prioritized over deep modularization.

## Known High-Priority Open Areas

- rename-topic bug
- incomplete multi-file topic handling
- sanitization / XSS hardening
- CSV validation
- search debounce
- localStorage versioning strategy
- unification of shared engines/utilities

## Expected Work Style

When changing code:

- inspect the real file structure first
- identify existing working paths
- preserve working behavior
- patch in place when possible
- avoid speculative redesign
- if a deep refactor is proposed, isolate it and justify it

## Preferred Deliverables

The user often prefers:

- precise file-by-file instructions
- explicit replacement blocks
- complete paste-ready files when practical
- direct identification of what is intentional vs accidental
- clear separation between “must fix now” and “future nice-to-have”

## Areas That Likely Exist In Code

The repo agent should verify actual names, but these concepts are expected to exist somewhere:

- HUB / hubIndex / library loading
- `index.json`
- import/export logic
- topic management
- hard words / hard items manager
- stats storage
- sound toggles
- app switching / shell flow
- localStorage constants
- language / topic selectors

## What To Verify Immediately

1. actual file names for HUB logic
2. actual file names for FC / WM / WP runtime
3. whether storage keys are shared or per-game
4. how `index.json` is currently shaped
5. how multi-file topics are represented and rendered
6. current rename-topic implementation
7. current CSV parsing and sanitization behavior
8. current service worker / PWA behavior
9. whether absolute paths break GitHub Pages deployment
10. whether any intentional quirks are documented in code comments

## Final Rule

When in doubt, prefer:
working and understandable
over
clever and fragile
