import { letterGrade } from "../../game-engine/scoring.ts";
import type { GameDefinition } from "../../game-engine/schema.ts";
import type { GameRecord } from "../../storage/types.ts";
import { NextGameCard } from "./NextGameCard.tsx";

export function GameCompletion({
  game,
  record,
  percent,
  threshold,
  nextGame,
  basePath,
}: {
  game: GameDefinition;
  record: GameRecord | undefined;
  percent: number;
  threshold: number;
  nextGame: GameDefinition | null;
  basePath: string;
}) {
  const shown = record?.bestPercent ?? percent;
  return (
    <section className="space-y-3" data-testid="game-complete">
      <h2 className="text-xl font-semibold">{record?.mastered ? "Mastered" : "Completed, not yet mastered"}</h2>
      <p>
        Best score {shown}%. Letter {letterGrade(shown)}. Mastery threshold {threshold}%.
      </p>
      <p>
        <strong>Concepts in this game. </strong>
        {game.concepts.join(", ")}
      </p>
      <p>You can retry any time. The best round scores are kept on this device.</p>
      <NextGameCard game={nextGame} basePath={basePath} />
    </section>
  );
}
