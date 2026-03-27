# PERFORMANCE AND CLEANUP

## 1. Known Issues Previously Identified

### Search without debounce
This can cause unnecessary rendering and poor responsiveness.

### Full rerenders
At least some code was described as rerendering too broadly.

### Large monolithic script blocks
The code was described as having a very large JS file with mixed concerns.

### Inline-heavy style/script structure
May complicate testing and maintenance.

## 2. Intentional Boundary

Even though deeper modularization was recommended, a major immediate refactor was intentionally deferred.

So the priority is:

- fix the biggest performance and safety issues first
- then modularize carefully

## 3. Near-Term Recommended Fixes

These were effectively prioritized for near-future stabilization:

1. sanitize before DOM insertion
2. debounce search
3. replace fragile IDs with UUIDs

## 4. Cleanup Direction

Later, after stability:

- split UI/data/storage concerns
- move reusable helpers to shared utilities
- reduce duplicate logic between games
- normalize lifecycle handling

## 5. What To Avoid

- giant speculative rewrite
- changing working flow just to make architecture “look cleaner”
- introducing abstraction layers with no immediate value
