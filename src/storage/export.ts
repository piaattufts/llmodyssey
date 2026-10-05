import type { LearnerState } from "./types.ts";

function csvCell(value: string | number | boolean | null | undefined): string {
  const text = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function toCsv(headers: string[], rows: Array<Array<string | number | boolean | null | undefined>>): string {
  return [headers.join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n");
}

export function progressCsv(state: LearnerState): string {
  return toCsv(
    ["gameId", "bestPercent", "mastered", "attempts", "timeSpentMs", "hints", "roundsAttempted", "completedAt", "reflection"],
    Object.values(state.games).map((game) => {
      const hints = Object.values(game.rounds).reduce((sum, round) => sum + round.totalHints, 0);
      return [
        game.gameId,
        game.bestPercent,
        game.mastered,
        game.attempts,
        game.timeSpentMs,
        hints,
        Object.keys(game.rounds).length,
        game.completedAt,
        game.reflection,
      ];
    }),
  );
}

export function assessmentCsv(state: LearnerState): string {
  const rows = [state.assessments.pre, state.assessments.post].flatMap((record) =>
    record
      ? [[record.kind, record.scorePercent, record.completedAt, record.timeSpentMs, JSON.stringify(record.answers)]]
      : [],
  );
  return toCsv(["kind", "scorePercent", "completedAt", "timeSpentMs", "answers"], rows);
}

export function eventsCsv(state: LearnerState): string {
  return toCsv(
    ["eventId", "sessionId", "timestamp", "gameId", "roundId", "actionType", "success", "durationMs", "metadata"],
    state.events.map((event) => [
      event.eventId,
      event.sessionId,
      event.timestamp,
      event.gameId,
      event.roundId,
      event.actionType,
      event.success,
      event.durationMs,
      JSON.stringify(event.metadata),
    ]),
  );
}

export function eventsJson(state: LearnerState): string {
  return JSON.stringify(state.events, null, 2);
}

export function downloadText(filename: string, contents: string, type = "text/plain"): void {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
