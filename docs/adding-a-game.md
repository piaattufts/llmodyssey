# Adding a game

1. Create `src/games/<id>/index.ts` that re-exports the definition.
2. Add `content/games/<id>.ts` as a `GameDefinition`. Copy `examples/custom-game/sample.ts` and change the ids.
3. Put rounds, hints, objectives, and the implementation note in that file. Zod checks it when the app loads.
4. If the round uses `choice`, `tokenizer`, `attention`, `budget`, `curve`, `workflow`, `rank`, `levers`, `agent`, `retrieval`, `composer`, or `foundry`, you do not add a React component. A new interaction type needs a schema variant in `src/game-engine/schema.ts`, a case in `src/game-engine/evaluate.ts`, and a branch in `src/components/game/InteractionHost.tsx`.
5. Register the import in `src/content/load-games.ts` and `src/games/register.ts`. Add the id to `enabledGames` and `gameOrder` in `config/odyssey.config.ts`. The loader throws if the count is not 13, so update that expectation and `tests/engine.test.ts` together.
6. The route is already `/play/:gameId`. Do not add a route unless the game needs a page that is not the shared shell.
7. Run `npm test`. `gameIsSolvable` fails if a round has no successful action.
8. Add any new citation to `content/references.ts` and reference its id from `furtherReadingIds`.
9. Run `npm run build`.

Keep the example game out of the registry. `examples/custom-game/sample.ts` is parsed in tests and is not shown to learners.
