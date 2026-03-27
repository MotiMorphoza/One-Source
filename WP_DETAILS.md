# WP DETAILS

WP is the sentence/phrase ordering module.

It is functional but carries a significant backlog of remembered improvements.

## 1. Purpose

Present a sentence or phrase broken into parts and let the learner reconstruct it.

## 2. Remembered Pending Improvements

The user explicitly asked to preserve a WP pending-fixes list including:

- sound stability
- mistake counting logic
- mobile checks
- softer sounds
- long sentence handling
- hard manager behavior
- session persistence
- animations
- code cleanup
- automatic CSV direction checks

This list should be treated as a major WP work queue.

## 3. Hard Manager

The user discussed the hard manager appearing earlier than intended.
This suggests WP has a separate hard-items subsystem whose display/trigger logic may need refinement.

## 4. Long Sentences

Long sentence handling was explicitly called out.
That likely affects:

- layout wrapping
- token sizing
- mobile usability
- drag/click interaction
- scroll or overflow behavior

## 5. Mistake Counting

The user explicitly wanted the mistake counting logic remembered as an issue area.
Repo agent should confirm:

- what counts as a mistake
- whether re-clicks count
- whether partial attempts count
- how that affects stats

## 6. Mobile Checks

WP likely needs stricter testing on small screens than FC/WM because tokenized sentence building is layout-sensitive.

## 7. Direction Handling

Automatic CSV direction checks were requested for future handling.
This is especially important for:

- Hebrew
- Arabic
- mixed-direction content

## 8. Shared Speech/TTS Direction

A later shared-engine note said that FC / WM / WP should not each build separate speech systems.
WP should eventually use the same central speech/TTS layer as the rest of the suite.

## 9. What To Verify In Code

- how sentences are tokenized
- what constitutes a unit/token
- how punctuation is handled
- how mistakes are counted
- how hard sentences are stored
- how session progress persists
- how sound is triggered
- whether cleanup/reset is complete on restart/topic switch
