import type { GameOrientation, GameTeaching } from "../../game-engine/schema.ts";

export function RoundBrief({
  roundNumber,
  roundCount,
  concept,
  scenario,
  guide,
  note,
}: {
  roundNumber: number;
  roundCount: number;
  concept: string;
  scenario: string;
  guide: GameOrientation["roundGuides"][number];
  note: GameTeaching["roundNotes"][number];
}) {
  return (
    <section className="space-y-2 rounded-xl border border-border bg-muted/40 p-4" data-testid="round-brief">
      <p className="text-sm font-medium tracking-wide">
        Round {roundNumber} of {roundCount}
      </p>
      <p className="text-sm text-muted-foreground">Difficulty: {guide.difficulty}</p>
      <p>
        <strong>Concept being practiced. </strong>
        {concept}
      </p>
      <p>
        <strong>Scenario. </strong>
        {scenario}
      </p>
      <p>
        <strong>Goal. </strong>
        {guide.goal}
      </p>
      <h3 className="font-medium">What this round is practicing</h3>
      <p>{note.practicing}</p>
      <h3 className="font-medium">Why this example was chosen</h3>
      <p>{note.whyChosen}</p>
      <h3 className="font-medium">What to pay attention to</h3>
      <p>{note.watchFor}</p>
    </section>
  );
}
