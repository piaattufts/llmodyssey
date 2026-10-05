-- Optional analytics table. The app runs without this migration.
-- Columns match the anonymous InteractionEvent. Do not add name, email, or IP.

create table if not exists public.interaction_events (
  event_id text primary key,
  session_id text not null,
  occurred_at timestamptz not null,
  game_id text not null,
  round_id text,
  action_type text not null,
  success boolean,
  duration_ms integer,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.interaction_events enable row level security;

create policy interaction_events_insert_anon
  on public.interaction_events
  for insert
  to anon
  with check (true);
