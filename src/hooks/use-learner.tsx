import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createAnalyticsAdapter } from "../analytics/create-adapter.ts";
import { games } from "../content/load-games.ts";
import { computeAchievementIds } from "../game-engine/achievements.ts";
import { researchModeEnabled } from "../research/mode.ts";
import { createRepository, type LearnerRepository } from "../storage/repository.ts";
import { appendEvent, emptyLearnerState, type InteractionEvent, type LearnerState } from "../storage/types.ts";

interface LearnerContextValue {
  namespace: string;
  bypassLocks: boolean;
  state: LearnerState | null;
  loading: boolean;
  error: string | null;
  update: (recipe: (state: LearnerState) => LearnerState) => Promise<void>;
  replace: (state: LearnerState) => Promise<void>;
  clear: () => Promise<void>;
  track: (event: Omit<InteractionEvent, "eventId" | "sessionId" | "timestamp">) => Promise<void>;
}

const LearnerContext = createContext<LearnerContextValue | null>(null);

export function LearnerProvider({
  namespace,
  bypassLocks = false,
  children,
}: {
  namespace: string;
  bypassLocks?: boolean;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const repository = useMemo<LearnerRepository>(() => createRepository(namespace), [namespace]);
  const adapter = useMemo(() => createAnalyticsAdapter(), []);
  const query = useQuery({
    queryKey: ["learner", namespace],
    queryFn: () => repository.load(),
  });

  async function persist(next: LearnerState): Promise<LearnerState> {
    const withAchievements = { ...next, achievements: computeAchievementIds(next, games) };
    await repository.save(withAchievements);
    queryClient.setQueryData(["learner", namespace], withAchievements);
    return withAchievements;
  }

  const value: LearnerContextValue = {
    namespace,
    bypassLocks,
    state: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    async update(recipe) {
      const current = queryClient.getQueryData<LearnerState>(["learner", namespace]) ?? query.data;
      if (!current) return;
      await persist(recipe(current));
    },
    async replace(state) {
      await persist(state);
    },
    async clear() {
      await repository.clear();
      await persist(emptyLearnerState(crypto.randomUUID()));
    },
    async track(event) {
      const current = queryClient.getQueryData<LearnerState>(["learner", namespace]) ?? query.data;
      if (!current) return;
      const full: InteractionEvent = {
        eventId: crypto.randomUUID(),
        sessionId: current.sessionId,
        timestamp: new Date().toISOString(),
        gameId: event.gameId,
        roundId: event.roundId,
        actionType: event.actionType,
        success: event.success,
        durationMs: event.durationMs,
        metadata: event.metadata,
      };
      await persist(appendEvent(current, full));
      const consent = typeof localStorage === "undefined" ? null : localStorage.getItem("llmodyssey.researchConsent");
      if (researchModeEnabled() && consent === "yes") {
        await adapter.track(full);
      }
    },
  };

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner(): LearnerContextValue {
  const value = useContext(LearnerContext);
  if (!value) throw new Error("useLearner must be used inside LearnerProvider");
  return value;
}
