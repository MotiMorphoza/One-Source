# OUTSIDE PROJECT RELATED CONTEXT

This file captures relevant context that appears connected to the broader ONE SOURCE effort even if not strictly confined to one project thread.

## 1. CSV Discipline

The user explicitly required that in CSV outputs the only comma allowed is the one separating the languages.

This affects all content-generation/export tooling around FC / ONE SOURCE.

## 2. Shared Speech/TTS Direction

The user wanted a future unification across FC, WM, and WP:
build one shared speech/TTS module with:

- automatic voice detection
- per-language voice selection
- user accent settings
- fallback logic

This is broader than one module and should influence future architecture.

## 3. General Style of Repo Work

The user consistently prefers:

- direct answers
- practical fixes
- exact file-level instructions
- complete blocks/files for agents where possible
- clear distinction between what exists, what is broken, and what is intentional

This matters when generating repo-facing documentation and implementation plans.

## 4. Git / Deployment Practicality

The user often works through GitHub Desktop and local Windows folders, so path, casing, and local-vs-repo state mismatches should be handled explicitly in documentation.
