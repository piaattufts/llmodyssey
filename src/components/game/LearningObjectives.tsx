import type { ReactNode } from "react";
import type { GameDefinition } from "../../game-engine/schema.ts";

export function LearningObjectives({ game, actions }: { game: GameDefinition; actions: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Learning objectives</h2>
      <ul className="list-disc space-y-1 pl-5">
        {game.learningObjectives.map((objective) => (
          <li key={objective}>{objective}</li>
        ))}
      </ul>
      <p>
        <strong>Bloom levels. </strong>
        {game.bloomLevels.join(", ")}
      </p>
      <p>
        <strong>Misconception in view. </strong>
        {game.misconception}
      </p>
      <div className="flex flex-wrap gap-2">{actions}</div>
    </section>
  );
}
