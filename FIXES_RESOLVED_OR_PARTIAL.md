# FIXES RESOLVED OR PARTIAL

This file only lists items that are supported by the current repo structure.

## Verified Or Largely Verified

### Shared session runtime exists

`core/engine.js` is real and used by all three games.

### Shared storage namespace exists

`core/storage.js` already uses the `LLH_v4_*` namespace pattern.

### Hub copies can be saved locally

When a hub file is launched, `HubManager` can create a local library copy tied to `originPath`.

### Rename is in-place in current storage code

`Storage.renameLibraryTopic()` updates an existing topic object by id instead of creating a new one.

### HUB vocabulary filtering was corrected

Bundled hub entries are now filtered by inferred category instead of raw group name.

### Topic titles are no longer interpolated directly into game HTML

The game headers now render title text through DOM assignment instead of direct template interpolation.

### Deleting the last row now deletes the topic

Removing the final row from a local list removes the topic from storage and returns the editor to the library view.

### CSV parsing is stricter

Malformed rows now raise explicit validation errors instead of being silently accepted.

## Not Marked Resolved Here

Do not treat the following as resolved from this file:

- hub metadata redesign
- vocabulary tree filtering mismatch
