# PROJECT HISTORY SUMMARY

This summary consolidates the known evolution of the ONE SOURCE effort from prior conversations.

## 1. Earlier Scope

The user was building and evolving separate language-learning apps, especially:

- FC
- WM
- WP

Over time, the need emerged to stop treating them as isolated apps and instead unify them through a shared HUB.

## 2. HUB Direction

The HUB became the central concept:

- central place to expose content
- central place to choose language/topic/file
- central place to feed selected content into each learning mode

The user described this unification as the “hub” and later asked for evaluation of code that attempts to do this.

## 3. Shared Data Direction

The long-term idea became:

- one content registry
- one topic/file model
- one source of availability truth
- multiple interfaces using that same content

That eventually led to the requirement that `index.json` reflect file availability by language and topics, instead of the browser discovering files ad hoc.

## 4. Why `index.json` Matters

A key remembered decision:

Availability should be modeled as:

```text
language -> topics -> files
```

Reasoning that was explicitly preserved:

- avoid browser HEAD checks
- avoid wrong UI states
- make `index.json` the single source of truth for file availability
- support multiple files per topic cleanly

## 5. Refactor Pressure vs Stability

At several points, deeper cleanup/refactor ideas were raised, including:

- modularization
- sanitization
- better storage
- performance cleanup
- stronger architecture

But a conscious decision was later taken not to do a deep refactor immediately.

The priority became:

- functional stability first
- fix critical bugs first
- postpone broader cleanup

## 6. Security / Code Quality Review

A third-party-style critique identified:

- XSS risk due to DOM insertion without sanitization
- missing CSV validation
- mixed concerns in large script files
- performance issues like lack of debounce
- weak ID generation using `Date.now() + Math.random()`
- missing storage versioning discipline

The adopted response was not “rewrite everything now”.

The adopted response was closer to:

- stabilize first
- later apply targeted fixes
- future near-term priorities:
  - sanitize before DOM insertion
  - debounce search
  - use UUID instead of fragile IDs

## 7. Specific Intentional Decisions

Several details were explicitly marked for memory:

- double BACK buttons are intentional
- when all words in a topic are deleted, the topic itself should also be deleted

These are not accidental bugs unless the user later changes direction.

## 8. Important Open Bug

One known bug was called out repeatedly:

### Rename Topic Bug
Changing a list/topic name does not really rename it.
Instead, it creates a ghost or dummy topic and the result is unusable for starting a session.

This should remain on the known-issues list until confirmed fixed in repo.

## 9. Multi-File Topic Direction

The system is expected to support multiple files under one topic.
This is an important requirement, not an optional extra.

Conversation history suggests:

- underlying support or intent exists
- UI support is incomplete or inconsistent

## 10. Shared Speech Direction

A future direction was preserved:
Instead of each game building separate speech/TTS behavior, the system should eventually have one shared speech/TTS engine with:

- automatic voice detection
- per-language voice selection
- user accent settings
- fallback logic

## 11. WP-Specific Memory

The Word Puzzle game has had a substantial list of pending improvements remembered, including areas such as:

- sound stability
- mistake counting logic
- mobile checks
- softer sounds
- long sentence handling
- hard manager behavior
- session persistence
- animations
- code cleanup
- automatic CSV direction checks

This indicates WP is functional but still a major cleanup zone.

## 12. V3 to V4 Direction

A more advanced future unification path was discussed:

- single shell
- shared CSS
- PWA-ready app shell
- more standardized game loading
- future Core Engine / SessionEngine
- more unified storage API
- shared utility layers

This should be understood as target direction, not necessarily already completed code reality.

## 13. Deployment Expectations

The project is intended to be deployable to GitHub Pages as long as:

- folder structure matches what the HUB expects
- manifest uses correct relative paths
- fetches are not broken by absolute paths
- case-sensitive repo paths are respected
- service worker versioning is handled correctly
- testing is done via HTTP server, not `file://`
