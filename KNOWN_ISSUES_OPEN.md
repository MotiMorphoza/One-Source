# KNOWN ISSUES — OPEN

This file tracks issues that are known from prior conversation history and should be assumed open until confirmed fixed in the repo.

## Critical / High Priority

### 1. XSS Risk
User-generated or CSV-derived content may be inserted into the DOM without sanitization.

### 2. CSV Validation Missing
Parsing may not sufficiently validate malformed rows, empty cells, or special-case input.

### 3. Rename Topic Bug
Renaming a topic/list creates a dummy or ghost topic instead of properly renaming the original.

### 4. Multi-File Topics Incomplete
The system is expected to support multiple files per topic, but UI support is not fully complete.

## Medium Priority

### 5. Search Without Debounce
May trigger unnecessary rerenders or reduce responsiveness.

### 6. Weak ID Generation
Historically identified pattern:
`Date.now() + Math.random()`
This is fragile and should be replaced with something safer like UUIDs.

### 7. Missing Formal Storage Versioning
At least across all modules, versioning discipline was identified as insufficient.

## WP-Specific Open Areas

### 8. Sound Stability
### 9. Mistake Counting Logic
### 10. Mobile Checks
### 11. Long Sentence Handling
### 12. Hard Manager Behavior
### 13. Session Persistence
### 14. Animation Polish
### 15. Automatic CSV Direction Checks

## Possible Deployment / Integration Issues

### 16. Path Sensitivity
GitHub Pages and case-sensitive paths may break file loading if inconsistent.

### 17. Service Worker / PWA Drift
Should be verified if stale caches or versioning issues exist.

## Verification Note

Do not mark any of these resolved from this document alone.
The repo-aware agent must confirm with the actual code.
