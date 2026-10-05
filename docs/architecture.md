# Architecture

LLM Odyssey is a static React application. Vite builds it to `dist/`. The browser is the runtime.

```
Learner
   |
React UI  (src/app, src/components/game)
   |
Shared game engine  (src/game-engine)
   |
Game definitions  (content/games, validated by Zod)
   |
Local progress store  (IndexedDB, localStorage fallback)
   |
Optional analytics adapter  (off, unless research mode and consent)
   |
Optional backend  (Supabase insert only)
```

`src/content/load-games.ts` parses every definition at startup. A malformed file throws before the course renders, and the error names the file and the Zod path.

`evaluateRound` is the only scorer. The panels in `InteractionHost` call the same pure functions for the live readout, so the preview and the grade do not drift.

`LearnerProvider` reads and writes one IndexedDB database per namespace (`learner` or `demo`). If IndexedDB is unavailable, the same JSON is stored under `llmodyssey.fallback.<namespace>`.

Routes are declared once in `src/App.tsx`. A game id does not get its own route file.

Optional pieces that the games do not call:

- `src/analytics/create-adapter.ts` when `VITE_RESEARCH_MODE` is true and storage mode is `supabase`
- `src/llm/providers.ts`, which returns `MockProvider` unless a proxy URL is set
- `examples/llm-proxy/server.mjs`, which is not started by `npm run dev`
