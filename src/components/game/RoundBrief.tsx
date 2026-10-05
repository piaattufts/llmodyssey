import type { GameOrientation } from "../../game-engine/schema.ts";

export function RoundBrief({
  roundNumber,
  roundCount,
  concept,
  guide,
}: {
  roundNumber: number;
  roundCount: number;
  concept: string;
  guide: GameOrientation["roundGuides"][number];
}) {
  return (
    <section className="rounded-xl border border-border bg-muted/40 p-4" data-testid="round-brief">
      <p className="text-sm font-medium tracking-wide">
        Round {roundNumber} of {roundCount}
      </p>
      <p className="text-sm text-muted-foreground">Difficulty: {guide.difficulty}</p>
      <p>
        <strong>Concept. </strong>
        {concept}
      </p>
      <p>
        <strong>Your goal. </strong>
        {guide.goal}
      </p>
    </section>
  );
}
