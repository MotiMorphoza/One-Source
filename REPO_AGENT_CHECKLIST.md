# REPO AGENT CHECKLIST

Use this list when reconciling this documentation pack with the actual repository.

## A. Identify Actual Files

- locate the main entry HTML
- locate FC files
- locate WM files
- locate WP files
- locate HUB files
- locate index.json or generated index files
- locate service worker / manifest files if present

## B. Confirm Data Model

- actual CSV expected format
- whether only one comma is allowed in generated CSV outputs
- actual structure of index.json
- how multi-file topics are represented
- whether language -> topics -> files already exists fully or partially

## C. Confirm Storage

- current localStorage keys
- version suffix strategy
- stats schema
- hard-items schema
- whether storage is shared across games or duplicated

## D. Confirm Open Bugs

- reproduce rename-topic bug
- reproduce multi-file topic UI limitation
- verify topic deletion when empty
- verify sound persistence
- verify import/export behavior
- verify CSS or state issues after sleep/refresh if applicable in this repo

## E. Confirm Intentional Behavior

- double BACK buttons intentional
- no deep refactor yet
- prioritize stability first
- source of truth should be index.json
- no backend

## F. Security Audit

- find all DOM injection points
- find all CSV parsing points
- add sanitization before insertion
- add validation for malformed rows

## G. Performance Audit

- search for non-debounced search input
- search for full rerenders
- identify oversized inline logic blocks
- identify missing utility reuse

## H. Unification Audit

- what is already shared
- what is duplicated
- what can be unified without breakage
- which game lifecycles are incompatible today

## I. Deployment Audit

- GitHub Pages path correctness
- relative paths vs absolute paths
- service worker behavior
- manifest start_url
- case-sensitive path safety

## J. Produce

- corrected repo map
- corrected architecture doc
- updated README
- open issues list
- resolved issues list
- prioritized execution plan
