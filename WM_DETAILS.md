# WM DETAILS

WM is the word-matching game in ONE SOURCE.

Conversation history contains less granular WM debugging detail than FC, but the following is known or strongly implied.

## 1. Purpose

Use the same topic content to create a matching game between source and target terms.

## 2. Likely Runtime Concepts

- pair generation
- shuffle
- match validation
- timer
- best time or session performance
- sound feedback
- topic context from HUB

## 3. Unification Requirement

WM should consume the same normalized topic data as FC and WP.
It should not require a separate incompatible dataset shape.

## 4. Likely Areas To Audit

Repo agent should inspect:

- how pairs are built
- whether duplicate words are safe
- whether shuffling is fair and stable
- whether RTL/LTR is handled correctly
- whether sound logic is duplicated vs shared
- whether stats are isolated or reusable
- whether cleanup occurs when changing games/topics

## 5. Possible Shared Utility Opportunities

- shuffle utility
- timer utility
- sound utility
- storage utility
- direction detection

## 6. Delivery Goal

WM should remain simple and stable.
Avoid overcomplicating it during unification.
