# Contributing to LLM Odyssey

Issues and pull requests are welcome at <https://github.com/piaattufts/llmodyssey/issues>.

Useful contributions include new rounds, corrections to technical explanations, translations, accessibility fixes, tests, and reports from classroom use. A new game should follow `docs/adding-a-game.md`. Change challenge text in `content/games/` rather than in React components.

## Local check

```bash
git clone https://github.com/piaattufts/llmodyssey.git
cd llmodyssey
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

Do not commit API keys, learner exports, or Supabase service-role keys. Research data from your own classroom should stay out of this repository.

By submitting a contribution you agree that it may be distributed under the MIT license in `LICENSE`.
