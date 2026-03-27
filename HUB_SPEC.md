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

## Current Bundled Structure

The bundled registry is based on:

- `language`
- `branch`
- `group`
- `files`

It is not yet a fully normalized topic registry.

## Current Filtering Rule

Bundled hub entries are classified by inferred category:

- `sentences` group -> sentence content
- any other current bundled group -> vocabulary content

## Local Library Integration

Local topics are mixed into the HUB tree with:

- branch default: `my library`
- group default: `my files` or `sentences`
- source types such as `local`, `import`, and `hub-copy`
