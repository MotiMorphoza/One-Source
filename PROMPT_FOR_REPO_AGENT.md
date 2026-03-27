# PROMPT FOR REPO AGENT

Use the following prompt with the repo-aware coding agent.

---

You are working on the ONE SOURCE repository, which unifies FC, WM, WP, and a shared HUB/library/topic-loading system.

You have access to the real repository. Treat the attached markdown docs as historical memory and architectural intent, not as guaranteed code truth.

## Your job

1. inspect the actual repo
2. map the historical/project intent to the real code
3. correct any drift between docs and repo
4. preserve intentional behavior
5. identify real open bugs vs already-fixed issues
6. produce updated repo-grounded docs

## Non-negotiable rules

- do not introduce frameworks
- do not introduce a backend
- do not break GitHub Pages compatibility
- do not break the HUB flow
- do not break CSV-based workflows
- prioritize stability over deep refactor

## Critical preserved decisions

- `index.json` should be the source of truth for file availability
- target structure is language -> topics -> files
- double BACK buttons were intentional
- if all words are deleted from a topic, the topic should be deleted
- multi-file topics are a real requirement
- CSV outputs should keep strict comma discipline
- shared TTS should be a future direction, not three separate long-term systems

## Known historically important open areas to verify

- rename-topic bug
- multi-file topic UI completeness
- sanitization / XSS exposure
- CSV validation
- search debounce
- storage versioning consistency
- WP mistake counting / long sentence / mobile / session persistence issues

## Deliverables required from you

1. real repo map
2. actual file/function mapping for HUB, FC, WM, WP
3. corrected README
4. corrected AGENTS.md
5. corrected architecture doc
6. open issues list: verified only
7. resolved issues list: verified only
8. prioritized action plan:
   - must fix now
   - should fix next
   - later improvements
9. explicit list of intentional quirks that should not be “fixed”
10. risk list for security / deployment / storage

## Important method rule

Do not assume the docs are right if the repo disagrees.
Do not assume the repo is right if the docs reveal intentional design choices not reflected in comments.
Reconcile both.

## Preferred output style

- direct
- file-specific
- concrete
- no vague handwaving
- distinguish facts from assumptions

---
