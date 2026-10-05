import type { InteractionEvent } from "../storage/types.ts";

export interface AnalyticsAdapter {
  readonly id: string;
  track(event: InteractionEvent): Promise<void>;
}

export const noopAdapter: AnalyticsAdapter = {
  id: "noop",
  async track() {
    return undefined;
  },
};

export const localAnalyticsAdapter: AnalyticsAdapter = {
  id: "local",
  async track() {
    return undefined;
  },
};
