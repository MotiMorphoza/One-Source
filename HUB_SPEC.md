# HUB SPEC

## Current HUB Files

- `hubIndex.js`
- `core/hubAdapter.js`
- `core/hubManager.js`
- `ui/accordion.js`

## Current HUB Responsibilities

- expose bundled language pairs
- merge bundled hub files with local library topics
- filter topic tree by selected game
- load local topics from storage
- fetch bundled CSV files from `hub/`
- create a local editable copy of a hub topic on first use

## Current Source Of Truth

Bundled metadata currently comes from `window.HUB_INDEX` in `hubIndex.js`.

There is no live `index.json` file in this repo.

`hubIndex.js` is generated from the physical `hub/` folders by `scripts/build_hub_index.py`.

## Current Bundled Structure

Physical hub layout:

- `hub/<language-pair>/<topic>/<file>.csv`

Generated registry shape:

- `language`
- `topic`
- `files`

The UI tree is rendered as one accordion root, `Choose a topic`, and then topic buckets under it.

## Current Filtering Rule

- Topic `sentences` is sentence content:
  - available to `flashcards`
  - available to `wordmatch`
  - available to `wordpuzzle`

- Any other topic is standard pair content:
  - available to `flashcards`
  - available to `wordmatch`
  - not available to `wordpuzzle`

## Local Library Integration

Local topics are mixed into the HUB tree with:

- free-form `topicName` chosen by the user
- default local topic suggestion: `grammer`
- source types such as `local`, `import`, and `hub-copy`

## Automation

`.github/workflows/rebuild-hub-index.yml` rebuilds `hubIndex.js` automatically on pushes that change `hub/`.
