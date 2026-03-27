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
  rootTitle,
  languages: [{ id, title }],
  topics: [{ id, title }],
  entries: [
    {
      topic,
      folder,
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
  topicName,
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

- topic `sentences` -> `flashcards`, `wordmatch`, `wordpuzzle`
- any other topic -> `flashcards`, `wordmatch`

## Important Repo Fact

The current bundled hub now behaves as `language -> topic -> files`, while still allowing legacy local records with old `branch/group` fields to migrate forward through `core/storage.js`.
