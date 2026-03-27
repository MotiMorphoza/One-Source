# DATA MODEL

## 1. Input Format

The project is CSV-driven.

A core remembered rule from the user:

In CSV outputs, the only comma allowed is the comma that separates the languages.

That implies generated/exported content should preserve a strict two-column pattern and avoid introducing extra commas inside values.

## 2. Minimal CSV Shape

Expected conceptual form:

```csv
source,target
```

In many FC examples, this is effectively:

```csv
word,translation
```

The repo agent must verify the exact canonical field names used internally.

## 3. Topic Representation

Conceptually, a topic is a collection of rows, typically represented as pairs:

```js
[
  { front: "...", back: "..." },
  { front: "...", back: "..." }
]
```

Actual field names may differ in code and must be verified.

## 4. HUB Index Representation

Target structure that has been explicitly remembered:

```json
{
  "languages": {
    "he-en": {
      "topics": {
        "basics": {
          "files": ["file1.csv", "file2.csv"]
        }
      }
    }
  }
}
```

This is not guaranteed to match the current repo exactly.
It is the intended direction and must be reconciled against reality.

## 5. Why This Model Matters

The design intent is:

- multiple files can belong to one topic
- availability is explicit
- UI is generated from known metadata
- browser does not need to infer or probe file existence

## 6. Storage-Backed Topic Data

The apps likely keep loaded/imported topics in localStorage.

Conceptual buckets include:

- topics / flashData
- stats
- hard items
- preferences such as sound

## 7. Deletion Rule

A preserved project rule:

If all words are deleted from a list, the topic itself must be deleted.

This affects both data integrity and UI behavior.

## 8. Import Behavior Expectations

Expected import concerns:

- avoid duplicate topic collisions
- use file name as topic name or derivative of it in some flows
- reject or protect against duplicate topic creation
- parse CSV rows safely
- validate malformed content

## 9. Export Expectations

Exports should likely preserve:

- row order where relevant
- strict CSV format
- safe filename generation
- no accidental extra commas in fields

## 10. Data Risks Currently Known

- malformed rows may pass
- empty values may pass
- special characters may not be sanitized
- DOM insertion may happen from unsafe text
- IDs may be weak if generated from timestamps/random

## 11. Recommended Normalized Internal Shape

A future-safe normalized model might include:

```js
{
  id: "uuid",
  topicId: "string",
  front: "string",
  back: "string",
  rtlFront: true/false,
  rtlBack: true/false
}
```

But this is a proposal, not a confirmed current implementation.
