# TEST PLAN

This is a practical regression-oriented test plan based on known project behavior.

## 1. HUB / Library

- open HUB
- list languages
- list topics
- open topic with one file
- open topic with multiple files
- select file and launch FC
- select file and launch WM
- select file and launch WP
- refresh after selection
- test missing file referenced in index

## 2. FC

- import valid CSV
- import duplicate topic name
- rename topic
- delete word
- delete all words in topic
- verify topic auto-deletes
- add hard word
- remove hard word
- export topic
- search within topic/bank
- sound on/off persistence
- active topic highlight after HUB selection

## 3. WM

- load topic
- generate match board
- complete round
- verify timing/best-time behavior
- verify reset/restart
- verify RTL/LTR display

## 4. WP

- load short sentence topic
- load long sentence topic
- verify token layout on mobile width
- verify mistake counting
- verify hard manager behavior
- verify session persistence
- verify sound stability
- verify directionality on Hebrew/Arabic content

## 5. Security

- import CSV with HTML-like content
- topic name with angle brackets
- quotes/apostrophes in values
- malformed rows
- empty cells
- extra commas

## 6. Deployment

- test via local HTTP server
- test via GitHub Pages
- hard refresh
- reopen after service worker cache
- verify manifest load
- verify relative paths

## 7. Cross-Game

- load same topic into FC, WM, WP
- verify same source data is accepted by all three
- verify storage isolation/shared behavior is intentional
