# ONE SOURCE

ONE SOURCE is the current umbrella project name for the unified language-learning system that consolidates:

- Flash Cards (`FC`)
- Word Match (`WM`)
- Word Puzzle (`WP`)
- A shared HUB / library / topic-loading layer

This repository is intended to become a single static browser-based application that runs without a backend and can be deployed on GitHub Pages.

## Project Intent

The goal is not just to host several separate mini-games in one repo.

The goal is to create:

- one shared data source
- one shared topic library
- one shared storage model
- one shared user flow
- multiple learning modes powered by the same content

## Core Principle

`index.json` must become the single source of truth for file availability.

Target shape:

```json
language -> topics -> files
```

That means the UI should not guess file existence from the filesystem and should not rely on browser-side HEAD probing to decide what exists.

## Current Known Product Scope

### FC
Flash card style vocabulary learning.

### WM
Word pair matching game.

### WP
Sentence / phrase ordering game.

### HUB
Entry layer that exposes available content and routes or loads the chosen dataset into the games.

## High-Level Technical Direction

- static only
- client-side only
- GitHub Pages compatible
- no framework required
- no backend required
- lightweight and modular
- future-proof enough for unification

## Current State Summary

Based on prior work history:

- FC is the most mature and most discussed module
- WM is working and structurally simpler
- WP is functional but still has more behavior/polish issues
- HUB exists and is central
- unification has started but is not yet fully complete
- a deeper v4-style shared engine was discussed as a future upgrade path

## Non-Negotiable Constraints

- Do not convert the project into a framework-based app unless explicitly requested
- Do not add a backend just to solve local issues
- Do not break GitHub Pages compatibility
- Do not break the HUB flow
- Do not break the existing CSV-based content model
- Prefer stability over ambitious refactors

## Priority Order

1. Stabilize behavior
2. Preserve existing working flows
3. Fix open bugs
4. Improve shared structure
5. Expand features only after stability

## What This Documentation Pack Is

This ZIP is a handoff pack generated from conversation history and remembered project context.

It is not a repo scan.

It captures:

- architecture intent
- known decisions
- known bugs
- fixes already discussed
- future roadmap
- external-agent guidance
- assumptions that the repo agent should verify against actual files

## What The Repo Agent Must Do Next

The repo-aware agent should:

1. compare these docs against the real codebase
2. correct any naming drift
3. map these concepts to actual files/functions
4. preserve the decisions that are intentional
5. fill any gaps using the repository itself

## Important Limitation

This package is based on conversation history and stored project knowledge, not on direct repository file access in this turn.
Where exact file names or implementation details are unknown, that uncertainty is documented explicitly.
