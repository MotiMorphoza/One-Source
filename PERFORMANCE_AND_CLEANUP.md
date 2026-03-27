# PERFORMANCE AND CLEANUP

## Current Observations

### Library search rerenders on each keystroke

`core/hubManager.js` rerenders the library editor directly on every `input` event.

### Topic tree rerenders frequently

Selection and several library actions rebuild the topic tree from scratch. This is acceptable at current scale but worth keeping in mind.

### Manual asset lists can drift

`sw.js` keeps a manual cache list. This is maintenance-sensitive.

### Some dead code remains

`triggerHomeImport()` exists but is not exposed by the current home UI.

## Recommended Cleanup Order

1. correctness bugs
2. DOM hardening
3. CSV validation
4. dead-code cleanup
5. render optimization only if needed
