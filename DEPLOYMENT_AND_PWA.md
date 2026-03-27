# DEPLOYMENT AND PWA

## Current Files

- `index.html`
- `manifest.json`
- `sw.js`
- `server.js`

## Current Behavior

- `manifest.json` uses `./index.html` as `start_url`
- `core/hubManager.js` registers `./sw.js`
- `server.js` serves the repo over HTTP on port `4173`
- the app warns when opened over `file://`

## Good Current Signs

- app asset paths are relative
- service worker registration is relative
- manifest path is relative
- hub file fetches use relative paths

## Current Risks

1. Hub CSV files are not precached in the install step and will be runtime-cached only after they are fetched.
2. The service worker cache name is a hard-coded string and will need bumps when shipped assets change.
3. The app currently depends on `hubIndex.js`, so metadata and content deployment must stay in sync.

## Practical Rule

Always test through HTTP:

```bash
node server.js
```
