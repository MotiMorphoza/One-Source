# FC DETAILS

FC is the most documented module in prior conversation history.

## 1. Core Purpose

Flash-card style vocabulary learning using topic-based CSV content.

## 2. Known Functional Areas

- import CSV as topic
- topic rename / delete
- topic bank / word list
- hard words management
- stats storage
- sound toggle
- HUB topic loading
- possibly active topic highlighting for downloaded topics
- export/download workflows

## 3. Important Rules

### If all words are removed, delete the topic
This was explicitly stored as a behavior rule.

### Duplicate topic import should be blocked
At one stage, import logic was adjusted to prevent importing a file into an already-existing topic name.

## 4. Known Bug

### Rename Topic Bug
Renaming a list/topic creates a ghost or dummy topic instead of correctly renaming the real one.
That ghost topic then cannot properly start a session.

This should be treated as a real open bug until confirmed fixed.

## 5. Known Structural Areas Mentioned Historically

The user referenced large script sections / headings such as:

- STORAGE CONSTANTS
- SOUND
- HUB DATA
- TOPIC NAME GATE
- LIBRARY → FC TOPIC

This indicates FC likely has a large monolithic script with many labeled regions.

## 6. Potential Quality Issues Previously Raised

- mixed UI/data/storage concerns in one file
- lack of sanitization
- no CSV validation
- no debounce in search
- weak ID generation
- incomplete modularity

## 7. Hard Words

Known behaviors or references include:

- add/remove hard words
- render hard words list
- sync with stats
- interaction with current topic rendering

Repo agent should inspect whether the hard-word removal flow causes any unintended navigation or visibility behavior.

## 8. Active Topic / Download State

The user cared that:

- downloaded content should exist locally, not just online
- currently loaded/downloaded topic should show visually as active
- active topic state should sync with HUB list

Repo agent should trace the exact current implementation.

## 9. Topic Name Gate

A “topic name gate” was explicitly mentioned in prior code-structure discussion.
This suggests topic naming/validation is already a recognized subsystem and should be preserved or improved carefully.

## 10. Import Logic Sensitivities

Historically, some import blocks caused crashes during experimentation.
The user rolled code back multiple times while isolating issues.

Takeaway:
do not assume FC import logic is robust just because a partial version worked once.
Retest from scratch.

## 11. Things To Verify In Real Code

- actual import parser
- duplicate topic block
- rename logic
- delete logic
- empty-topic auto-delete
- export logic
- hard-words storage
- active topic state
- HUB handoff
- search behavior
