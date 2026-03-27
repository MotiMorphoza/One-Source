# HUB SPEC

## 1. Role of the HUB

The HUB is the central entry and routing/content-selection layer for ONE SOURCE.

It is not an optional add-on.
It is the unifying spine of the system.

## 2. HUB Responsibilities

The HUB should be responsible for:

- exposing available languages
- exposing branches/topics/groups if used
- exposing files within topics
- reading `index.json`
- letting the user select what to study
- loading/downloading/importing the selected data
- passing context/data into FC / WM / WP

## 3. Source of Truth Rule

A key preserved decision:

`index.json` must become the single source of truth for file availability.

Meaning:

- no browser HEAD probing
- no guessed availability
- no UI built on assumptions
- no “maybe this file exists” logic

## 4. Target Index Shape

Target direction:

```text
language -> topics -> files
```

If the current repo still uses branches/groups/etc., that may remain internally, but the repo agent should clarify the actual structure and whether it matches the intended target.

## 5. Multi-File Topics

This is a core requirement.
The HUB must support topics with more than one file.

Conversation history suggests this is a pain point:
support exists conceptually, but UI behavior is incomplete.

## 6. Active Topic Behavior

At least in FC-related flow, there were discussions around:

- current active topic
- visual indication for active downloaded topic
- downloaded files sitting locally for the user
- better state sync between HUB and app

These areas should be verified in real code.

## 7. Download / Import Expectations

Important behaviors that the user cared about:

- downloaded file should actually sit with the user, not only remain online
- active/downloaded topic state should be shown correctly
- duplicate imports should be blocked or handled clearly
- library-driven topic creation should be clean

## 8. Likely HUB Components To Verify

Repo agent should locate actual code for:

- library accordion
- download language selector
- topic/file list rendering
- active topic highlighting
- current topic tracking
- import trigger
- export trigger
- index parsing
- error handling when index/file paths fail

## 9. Failure Modes To Test

- file listed in index but missing in repo
- multiple files under one topic
- duplicate topic import
- index with malformed structure
- topic selection followed by game launch
- app refresh after active topic set
- case-sensitivity issues on GitHub Pages

## 10. Design Goal

The HUB should evolve toward a thin but authoritative adapter between content registry and games.
The games should not each reimplement library/file-discovery logic.
