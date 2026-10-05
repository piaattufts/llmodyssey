import { effectiveMasteryThreshold, odysseyConfig } from "./config.ts";
import type { GameDefinition } from "./schema.ts";
import type { LearnerState } from "../storage/types.ts";

export interface UnlockStatus {
  unlocked: boolean;
  reason: string;
}

export function countMastered(state: LearnerState, games: GameDefinition[], tier: 1 | 2 | 3): number {
  return games.filter((game) => game.tier === tier && state.games[game.id]?.mastered).length;
}

export function unlockStatus(
  game: GameDefinition,
  games: GameDefinition[],
  state: LearnerState,
  bypassLocks = false,
): UnlockStatus {
  if (!odysseyConfig.showFoundry && game.tier === 3) {
    return { unlocked: false, reason: "Foundry Arena is turned off in config/odyssey.config.ts." };
  }
  if (odysseyConfig.enabledGames.length > 0 && !odysseyConfig.enabledGames.includes(game.id)) {
    return { unlocked: false, reason: "This game is disabled in the course config." };
  }
  if (!odysseyConfig.enforcePrerequisites || bypassLocks || state.exploreAhead) {
    return { unlocked: true, reason: bypassLocks || state.exploreAhead ? "Practice-ahead is on." : "Prerequisite gates are off." };
  }
  if (game.tier === 2) {
    const mastered = countMastered(state, games, 1);
    if (mastered < odysseyConfig.tier2UnlockMastered) {
      return {
        unlocked: false,
        reason: `Master ${odysseyConfig.tier2UnlockMastered} Cognitive Core games to open Systems Forge (${mastered} mastered).`,
      };
    }
  }
  if (game.tier === 3) {
    const mastered = countMastered(state, games, 2);
    if (mastered < odysseyConfig.tier3UnlockMastered) {
      return {
        unlocked: false,
        reason: `Master ${odysseyConfig.tier3UnlockMastered} Systems Forge games to open Foundry Arena (${mastered} mastered).`,
      };
    }
  }
  return { unlocked: true, reason: "Tier prerequisite met." };
}

export function recommendedNext(games: GameDefinition[], state: LearnerState, bypassLocks = false): GameDefinition | null {
  const ordered = orderGames(games);
  return (
    ordered.find((game) => {
      const record = state.games[game.id];
      const open = unlockStatus(game, games, state, bypassLocks).unlocked;
      return open && !record?.mastered;
    }) ?? null
  );
}

export function orderGames(games: GameDefinition[]): GameDefinition[] {
  const rank = new Map(odysseyConfig.gameOrder.map((id, index) => [id, index]));
  return [...games].sort((left, right) => {
    const leftRank = rank.get(left.id) ?? left.order;
    const rightRank = rank.get(right.id) ?? right.order;
    return leftRank - rightRank;
  });
}

export function courseGames(games: GameDefinition[]): GameDefinition[] {
  return orderGames(games).filter((game) => {
    if (!odysseyConfig.showFoundry && game.tier === 3) return false;
    if (odysseyConfig.enabledGames.length > 0 && !odysseyConfig.enabledGames.includes(game.id)) return false;
    return true;
  });
}

export function thresholdFor(game: GameDefinition): number {
  return effectiveMasteryThreshold(game.masteryThreshold);
}
