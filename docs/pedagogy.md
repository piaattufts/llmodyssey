# Pedagogy

The eight principles and the game examples that implement them are written out in the README under “Pedagogical design.” This note is the short map from principle to code.

| Principle | Where it lives |
| --- | --- |
| Immediate feedback | `liveReadout` while the round is open; `evaluateRound` after lock-in |
| Scaffolded hints | `round.hints` length 3, rendered in `GameShell`; penalty in `applyHintPenalty` |
| Progressive difficulty | Round order inside each `content/games/*.ts` file |
| Worked example | `workedExample` on the game, shown before start |
| Authentic scenarios | `scenario` on each round |
| Mastery retries | Best round score is kept; mastery is recomputed by `projectRecord` |
| Reflection | Prompt after the last round, stored on the game record |
| Tiered progression | `unlockStatus` in `src/game-engine/prerequisites.ts` |

Bloom levels are data on each game, shown on the educator page. They are the author's classification of the task, not a measurement of a learner.

The design is meant to support practice. Whether it causes learning gains is an empirical question. The optional pre/post check is a local instrument, not a published effectiveness result.
