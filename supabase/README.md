# Optional Supabase analytics

LLM Odyssey does not need Supabase. Learner progress stays in the browser unless you opt into this adapter.

## What this stores

`public.interaction_events` holds the anonymous event already defined in the app: event id, random session id, time, game, round, action, success, duration, and a small metadata object.

It does not have columns for name, email, or IP address. Do not add them for a deployment that claims to use this schema.

There is an insert policy for the `anon` role and no select policy. The anon key can write events. It cannot read them back. Use the service role, which you do not put in the frontend, if an approved study needs to export rows.

## How to turn it on

1. Create a Supabase project.
2. Run `migrations/001_interaction_events.sql` in the SQL editor.
3. Set the frontend environment:

```
VITE_STORAGE_MODE=supabase
VITE_RESEARCH_MODE=true
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

4. Rebuild. `VITE_` variables are compiled into the static app.

If the URL or key is missing, the app keeps events in the browser and shows a short warning. Gameplay does not stop.

Research mode also asks the learner whether to keep anonymous events. A no skips the upload. Consent here is not an ethics approval. The institution running the deployment obtains its own review.
