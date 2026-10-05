import { createClient } from "@supabase/supabase-js";
import { researchModeEnabled } from "../research/mode.ts";
import type { InteractionEvent } from "../storage/types.ts";
import { localAnalyticsAdapter, noopAdapter, type AnalyticsAdapter } from "./adapter.ts";

export function createAnalyticsAdapter(): AnalyticsAdapter {
  if (!researchModeEnabled()) return noopAdapter;
  const mode = import.meta.env.VITE_STORAGE_MODE ?? "local";
  if (mode !== "supabase") return localAnalyticsAdapter;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return localAnalyticsAdapter;
  return new SupabaseAnalyticsAdapter(url, key);
}

class SupabaseAnalyticsAdapter implements AnalyticsAdapter {
  readonly id = "supabase";
  private readonly client: ReturnType<typeof createClient>;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  async track(event: InteractionEvent): Promise<void> {
    try {
      const table = this.client.from("interaction_events") as unknown as {
        insert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
      };
      const { error } = await table.insert({
        event_id: event.eventId,
        session_id: event.sessionId,
        occurred_at: event.timestamp,
        game_id: event.gameId,
        round_id: event.roundId,
        action_type: event.actionType,
        success: event.success,
        duration_ms: event.durationMs,
        metadata: event.metadata,
      });
      if (error) {
        console.warn(`Odyssey analytics insert failed: ${error.message}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      console.warn(`Odyssey analytics was skipped: ${message}`);
    }
  }
}
