# REPO AGENT CHECKLIST

## App Shell

- verify `index.html` screens
- verify `core/hubManager.js` event wiring
- verify relative paths for deployment

## HUB

- verify `hubIndex.js` matches actual files in `hub/`
- verify `HubAdapter.buildTree()` filtering logic
- verify local-library merge behavior

## Storage

- verify `LLH_v4_*` keys
- verify topic sanitization and row sanitization
- verify topic deletion behavior when the last row is removed

## Games

- verify shared `SessionEngine` use
- verify topic names are not injected unsafely
- verify current category gating per game

## PWA

- verify `manifest.json`
- verify `sw.js` asset coverage

## Docs

- do not document `index.json` as live unless it exists in the repo
- call out future targets separately from current reality
