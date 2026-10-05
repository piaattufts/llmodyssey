# Migration audit

The public repository at <https://github.com/piaattufts/llmodyssey> was empty when this standalone version was written. The Base44 export named in the rebuild request (`llm-odyssey-0544b844.zip`) was not present on the build machine. There was no Base44 runtime, SDK, or generated client to port.

This audit therefore classifies the prototype described by the earlier public README and by the paper “WIP: LLM Odyssey” (arXiv:2608.16924), not a line-by-line diff of Base44 source.

| Prototype feature | Status | What this repository does |
| --- | --- | --- |
| Thirteen learning experiences in three tiers | REIMPLEMENTED | All 13 games run in the browser from `content/games/`. |
| Token Forge comparisons, hints, mastery, Bloom labels | REIMPLEMENTED | Content modules plus the shared engine. |
| Immediate feedback and worked examples | REIMPLEMENTED | `GameShell` shows a readout before submit and feedback after it. |
| Anonymous browser session id | PRESERVED | `localStorage` keys `llmodyssey.sessionId` and `llmodyssey.demo.sessionId`. |
| Visual direction: laboratory, purple to cyan | REIMPLEMENTED | Theme tokens in `src/index.css`. |
| Supabase as a required database and auth backend | REMOVED | Default install has no backend. Supabase is an optional analytics insert. |
| Accounts, player names, leaderboard | REMOVED | No name field and no leaderboard. |
| Instructor login gate | REMOVED | `/educator` is open on a local deployment. |
| Community solution board with votes | REMOVED | Not implemented. Listed under Future Work in the README. |
| Foundry as five paths plus sandbox | REIMPLEMENTED | Six rounds, one brief per path. |
| Several challenges per Foundry path | REMOVED | One challenge per path in this release. |
| Claim that every deployment is under Durham College REB #339-2526 | REMOVED | Not asserted. Institutions obtain their own review. Research mode defaults off. |
| Required pre/post test and feedback survey with contact email | IMPROVED | Pre/post checks are optional and local. There is no contact form and no email column. |
| Paid or live LLM calls inside the games | REMOVED | Games use authored cases. A mock provider and a sample proxy exist and are unused by gameplay. |
| Base44 client, Base44 auth, Base44 database | REMOVED | No Base44 dependency in `package.json` or `src/`. |

Educational claims in the interface match the code: precomputed tokenizations, toy attention and retrieval arithmetic, an educational loss formula, and authored production cases. They are not described as production model execution.
