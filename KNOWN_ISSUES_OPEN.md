# KNOWN ISSUES OPEN

These items are based on the current repo contents.

## High Priority

### 1. Service worker cache drift risk

The install-time asset list is manual and can fall out of sync with actual imports.

## Medium Priority

### 2. Search rerenders on every keystroke

Library row search has no debounce and rerenders the editor immediately on each input event.
