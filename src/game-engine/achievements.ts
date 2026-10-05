import { achievementCatalog } from "@content/achievements.ts";
import type { GameDefinition } from "./schema.ts";
import type { LearnerState } from "../storage/types.ts";

export function computeAchievementIds(state: LearnerState, games: GameDefinition[]): string[] {
  const records = Object.values(state.games);
  const mastered = records.filter((record) => record.mastered);
  const ids = new Set<string>();
  if (records.some((record) => record.completedAt)) ids.add("first-completion");
  if (mastered.length > 0) ids.add("first-mastery");
  if (mastered.some((record) => Object.values(record.rounds).every((round) => round.hintsOnBestAttempt === 0))) {
    ids.add("no-hint-mastery");
  }
  if (mastered.some((record) => Object.values(record.rounds).some((round) => round.totalHints > 0))) {
    ids.add("scaffolded-mastery");
  }
  if (records.some((record) => record.bestPercent >= 100)) ids.add("perfect-game");
  const masteredIds = new Set(mastered.map((record) => record.gameId));
  if (games.filter((game) => game.tier === 1).every((game) => masteredIds.has(game.id))) ids.add("cognitive-core");
  if (games.filter((game) => game.tier === 2).every((game) => masteredIds.has(game.id))) ids.add("systems-forge");
  if (masteredIds.has("foundry-arena")) ids.add("foundry");
  if (games.every((game) => masteredIds.has(game.id))) ids.add("odyssey-complete");
  if (state.assessments.pre && state.assessments.post) ids.add("both-assessments");
  return achievementCatalog.map((item) => item.id).filter((id) => ids.has(id));
}
