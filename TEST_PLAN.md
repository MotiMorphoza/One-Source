# TEST PLAN

## Home And HUB

- select each language pair
- select each game
- verify the topic tree appears
- verify bundled vocabulary content appears for Flash Cards and Word Match after the hub filtering bug is fixed
- verify sentence content appears for Word Puzzle

## Library

- create a local topic
- import a valid CSV
- rename a topic
- delete rows until empty and verify topic deletion behavior
- export a topic
- search rows

## Games

- start each game from bundled hub content
- start each game from local library content
- restart a completed session
- exit back to home

## Security

- import a topic name containing HTML-like text
- verify topic name does not execute when shown in a game header
- import malformed CSV rows and verify errors

## PWA And Deployment

- run via `node server.js`
- verify service worker registration
- hard refresh after asset changes
- verify relative paths still resolve
