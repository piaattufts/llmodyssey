# Research mode

Default: off.

`VITE_RESEARCH_MODE=false` in `.env.example`. When the variable is the string `false`, research UI and uploads stay off even if `config/odyssey.config.ts` says otherwise. When it is unset, the config flag is used. The shipped config sets `researchMode: false`.

When research mode is on:

- A dialog asks whether to keep anonymous events. It does not ask for a name or email.
- Events already sit in the local learner record either way. Consent controls the optional adapter.
- `VITE_STORAGE_MODE=local` uses `LocalAnalyticsAdapter`, which does not send anything.
- `VITE_STORAGE_MODE=supabase` with a URL and anon key inserts into `interaction_events`. A failed insert is logged with `console.warn` and the game continues.
- Missing Supabase settings fall back to the local adapter and show a banner.

The event fields are `eventId`, `sessionId`, `timestamp`, `gameId`, `roundId`, `actionType`, `success`, `durationMs`, and `metadata`.

This repository does not enroll public users in a study. It does not claim that a deployment shares an ethics approval. An institution that turns research mode on is responsible for its own review, consent language, and retention rules. Contact details, if a study needs them, must be stored somewhere other than `interaction_events`.
