# Game design and content schema

A game file must satisfy `gameDefinitionSchema` in `src/game-engine/schema.ts`. The loader calls `parseGame`. On failure the message looks like:

```
Invalid game content in content/games/token-forge.ts:
rounds.0.hints: Invalid input
```

Required game fields include id, title, tier, order, summary, purpose, whyItMatters, learningObjectives, concepts, bloomLevels, prerequisites, estimatedMinutes, difficulty, masteryThreshold, misconception, reflectionPrompt, workedExample, furtherReadingIds, implementation, and rounds.

Each round includes the concept, learner task, expected reasoning, scenario, exactly three hints, scoring rule, explanation, feedback for a met target, feedback for a miss, and one interaction.

The implementation object is required so the interface can say what is real and what is simulated. Do not describe a precomputed table as a live model.

Interaction types currently implemented:

| type | Learner action | Scoring idea |
| --- | --- | --- |
| choice | One card | best 10, acceptable 6, poor 0 |
| tokenizer | One family | same quality scale; counts are the length of the token array |
| attention | One token | argmax of computed softmax; wrong index is 0 |
| budget | Strategy and optional spans | budget, relevance, and must-keep checks |
| curve | Learning rate, epochs, batch, method | documented loss formula against targets |
| workflow | Steps and a temperature | required steps present, harmful steps absent, temperature quality |
| rank | One response | weighted sum of authored rubric scores |
| levers | A set of switches | projected metrics inside authored bounds |
| agent | Tools and controls | needed items selected, harmful items not selected |
| retrieval | Method and filter | precision and recall thresholds on toy vectors |
| composer | Blocks | coverage, cost, latency, conflicts |
| foundry | Decisions, reflection, self-ratings | rubric coverage |

`representativeSuccessAction` is the solver used by tests. If you add a round, keep it solvable.
