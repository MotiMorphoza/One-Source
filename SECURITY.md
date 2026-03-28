# SECURITY

## Current Safe Patterns

Most user-facing content rows are rendered with `textContent` or DOM node creation, which is safer than HTML string injection.

Game topic titles are now also assigned through DOM text assignment rather than direct template interpolation.

## Current Unsafe Or Fragile Patterns

### Import validation is weak

This area is improved, but import and edit flows still rely on lightweight client-side validation and should keep being treated as untrusted input paths.

### Local topic names come from user input and imports

That makes topic names untrusted input and they should be treated accordingly.

### External links should remain opener-safe

Outbound contact links now use `noopener noreferrer`, and future external links should keep the same pattern.

## Recommended Fix Order

1. keep validating imported CSV structure strictly
2. keep clearer user-facing errors for malformed imports
3. continue removing any future dynamic HTML interpolation of untrusted text
