# MIGRATION V3 TO V4 NOTES

## What Already Exists

The repo already contains several "v4-style" pieces:

- one app shell
- one shared session engine
- one shared storage namespace
- one shared game interface
- one shared hub adapter

## What Still Is Not Done

- live `index.json`
- fully normalized hub topic model
- complete cleanup of dead or drifting paths

## Safe Next Steps

1. Clean up dead or drifting shell paths.
2. Tighten service worker asset discipline.
3. Only then consider replacing `hubIndex.js` with a generated `index.json`.
