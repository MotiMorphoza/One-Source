# DEPLOYMENT AND PWA

## 1. Deployment Target

ONE SOURCE is intended to be deployable as a static application, especially on GitHub Pages.

## 2. Deployment Conditions Previously Discussed

Deployment should work if:

- folder structure matches what the HUB expects
- `manifest.json` uses correct relative paths / start_url
- fetch paths are not broken by absolute URLs
- case-sensitive paths match repo reality
- service worker versioning is handled correctly
- testing is performed through an HTTP server, not `file://`

## 3. Areas To Verify

Repo agent should inspect:

- manifest pathing
- start_url
- icon references
- service worker registration
- cache versioning
- absolute vs relative fetches
- path assumptions in HUB loaders

## 4. Failure Modes

Potential breakages include:

- works locally, fails on GitHub Pages
- works on Windows paths, fails due to repo case sensitivity
- stale service worker caches old assets
- index file path mismatch
- active topic/file path mismatch in production

## 5. Practical Rule

No deployment assumption should be trusted until verified on:
- local HTTP server
- GitHub Pages-like path structure
- hard refresh / cache-refresh scenario
