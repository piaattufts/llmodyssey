import { gamePercent, isMastered, ROUND_MAX_POINTS } from "./scoring.ts";
import { completionAllowed, type GameDefinition } from "./schema.ts";
import type { GameRecord, RoundRecord } from "../storage/types.ts";

export function blankGameRecord(gameId: string): GameRecord {
  return {
    gameId,
    startedAt: null,
    completedAt: null,
    timeSpentMs: 0,
    attempts: 0,
    rounds: {},
    reflection: "",
    mastered: false,
    bestPercent: 0,
  };
}

export function projectRecord(game: GameDefinition, record: GameRecord, threshold: number): GameRecord {
  if (!completionAllowed(game.status)) {
    return {
      ...record,
      completedAt: null,
      bestPercent: 0,
      mastered: false,
      rounds: {},
    };
  }
  const earned = game.rounds.reduce((sum, round) => sum + (record.rounds[round.id]?.bestScore ?? 0), 0);
  const bestPercent = gamePercent(earned, game.rounds.length);
  const completed = game.rounds.every((round) => record.rounds[round.id]);
  return {
    ...record,
    bestPercent,
    mastered: completed && isMastered(bestPercent, threshold),
  };
}

export function upsertRound(record: GameRecord, round: RoundRecord): GameRecord {
  return {
    ...record,
    rounds: { ...record.rounds, [round.roundId]: round },
  };
}

export const roundMax = ROUND_MAX_POINTS;
