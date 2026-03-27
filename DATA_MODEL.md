# DATA MODEL

## Current Normalized Row Shape

Rows are normalized to:

```js
{
  id: "string",
  source: "string",
  target: "string"
}
```

This shape is produced by:

- `utils/csv.js`
- `core/storage.js`

## CSV Parsing Today

The parser now:

- supports quoted values
- skips blank lines
- skips two known header styles
- requires exactly two columns
- rejects malformed non-empty rows
- throws validation errors for unclosed quotes or missing cells

## Bundled Hub Metadata Shape

The live bundled registry is `window.HUB_INDEX` from `hubIndex.js`.

Current shape:

```js
{
  version,
  languages: [{ id, title }],
  branches: [{ id, title }],
  entries: [
    {
      branch,
      group,
      files: {
        "lang-pair": ["file.csv"]
      }
    }
  ]
}
```

## Local Library Topic Shape

`core/storage.js` sanitizes topics to:

```js
{
  id,
  name,
  fileName,
  path,
  lang,
  branch,
  group,
  source,
  category,
  allowedGames,
  rows,
  createdAt,
  updatedAt,
  originPath,
  originMeta
}
```

## Category Rules In Code

- `sentences` -> `wordpuzzle`
- `vocabulary` -> `flashcards`, `wordmatch`

## Important Repo Fact

The current bundled hub does not yet model a true `language -> topics -> files` hierarchy. It models `branch + group + files-by-language`.
