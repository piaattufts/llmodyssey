import { Button } from "@/components/ui/button.tsx";
import { HINT_PENALTY_POINTS, MAX_HINTS } from "../../game-engine/scoring.ts";

const hintLabels = ["Conceptual cue", "Directional guidance", "Partial solution"];

export function HintPanel({
  hints,
  revealed,
  canReveal,
  onReveal,
}: {
  hints: string[];
  revealed: number;
  canReveal: boolean;
  onReveal: () => void;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <h3 className="font-medium">Hints</h3>
      <p className="text-sm text-muted-foreground">
        Hints used {revealed}/{MAX_HINTS}. Each hint subtracts {HINT_PENALTY_POINTS} point from this round after scoring, to a floor of 0.
      </p>
      <ol className="mt-2 space-y-2">
        {hints.slice(0, revealed).map((hint, index) => (
          <li key={hint}>
            <strong>{hintLabels[index]}. </strong>
            {hint}
          </li>
        ))}
      </ol>
      {canReveal ? (
        <Button variant="outline" className="mt-3 min-h-11" onClick={onReveal}>
          Reveal next hint
        </Button>
      ) : null}
    </div>
  );
}
