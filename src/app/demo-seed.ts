import { games } from "../content/load-games.ts";
import { projectRecord, blankGameRecord } from "../game-engine/records.ts";
import { thresholdFor } from "../game-engine/prerequisites.ts";
import { emptyLearnerState, type GameRecord, type LearnerState } from "../storage/types.ts";

function filled(gameId: string, scores: number[], hints: number[]): GameRecord {
  const game = games.find((item) => item.id === gameId);
  if (!game) throw new Error(`Demo seed is missing ${gameId}`);
  const record = blankGameRecord(gameId);
  record.startedAt = "2026-03-02T15:00:00.000Z";
  record.attempts = 1;
  record.timeSpentMs = 14 * 60 * 1000;
  record.reflection = "Sample reflection for the conference demo. It is not a research record.";
  game.rounds.forEach((round, index) => {
    const score = scores[index];
    if (score === undefined) return;
    record.rounds[round.id] = {
      roundId: round.id,
      bestScore: score,
      maxScore: 10,
      hintsOnBestAttempt: hints[index] ?? 0,
      totalHints: hints[index] ?? 0,
      attempts: 1,
      lastSuccess: score >= 6,
    };
  });
  if (game.rounds.every((round) => record.rounds[round.id])) {
    record.completedAt = "2026-03-02T15:20:00.000Z";
  }
  return projectRecord(game, record, thresholdFor(game));
}

export function sampleLearnerState(sessionId: string): LearnerState {
  const state = emptyLearnerState(sessionId);
  state.createdAt = "2026-03-02T14:55:00.000Z";
  state.games = {
    "token-forge": filled("token-forge", [10, 10, 10, 10, 9], [0, 0, 0, 0, 1]),
    "attention-architect": filled("attention-architect", [10, 10, 6, 10, 10], [0, 0, 1, 0, 0]),
    "context-compression": filled("context-compression", [10, 6], [0, 1]),
  };
  state.assessments.pre = {
    kind: "pre",
    scorePercent: 40,
    answers: {},
    completedAt: "2026-03-02T14:50:00.000Z",
    timeSpentMs: 180000,
  };
  state.events = [
    {
      eventId: "demo-event-1",
      sessionId,
      timestamp: "2026-03-02T15:01:00.000Z",
      gameId: "token-forge",
      roundId: "english-clause",
      actionType: "round_submit",
      success: true,
      durationMs: 42000,
      metadata: { sample: true },
    },
    {
      eventId: "demo-event-2",
      sessionId,
      timestamp: "2026-03-02T15:06:00.000Z",
      gameId: "token-forge",
      roundId: "legal-cost",
      actionType: "hint",
      success: null,
      durationMs: null,
      metadata: { level: 1, sample: true },
    },
    {
      eventId: "demo-event-3",
      sessionId,
      timestamp: "2026-03-02T15:12:00.000Z",
      gameId: "attention-architect",
      roundId: null,
      actionType: "game_start",
      success: null,
      durationMs: null,
      metadata: { sample: true },
    },
  ];
  return state;
}
