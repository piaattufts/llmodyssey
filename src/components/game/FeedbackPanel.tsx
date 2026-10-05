import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button.tsx";
import { describeDecision, resultLabel, type Evaluation, type GameAction } from "../../game-engine/evaluate.ts";
import { ROUND_MAX_POINTS } from "../../game-engine/scoring.ts";
import type { GameOrientation, GameTeaching, RoundDefinition } from "../../game-engine/schema.ts";

export function FeedbackPanel({
  round,
  action,
  guide,
  note,
  evaluation,
  hints,
  score,
  isLastRound,
  onRetry,
  onNext,
}: {
  round: RoundDefinition;
  action: GameAction | null;
  guide: GameOrientation["roundGuides"][number];
  note: GameTeaching["roundNotes"][number];
  evaluation: Evaluation;
  hints: number;
  score: number;
  isLastRound: boolean;
  onRetry: () => void;
  onNext: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const result = resultLabel(evaluation.success, evaluation.partial);
  return (
    <motion.div
      className="space-y-3 rounded-xl border border-border p-4"
      data-testid="feedback"
      aria-live="polite"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold">Feedback</h3>
      <p>
        <strong>Your decision. </strong>
        {describeDecision(round, action)}
      </p>
      <p>
        <strong>Result. </strong>
        {result}
        {evaluation.success ? "" : evaluation.partial ? " — part of the target was met." : " — the round target was not met."}
      </p>
      <p>
        <strong>Why. </strong>
        {evaluation.feedback} {evaluation.explanation}
      </p>
      <p>
        <strong>What mattered in this scenario? </strong>
        {note.whatMattered}
      </p>
      <p>
        <strong>Why the alternatives were weaker. </strong>
        {note.alternatives}
      </p>
      <p>
        <strong>Trade-off. </strong>
        {guide.tradeoff}
      </p>
      <p>
        <strong>Engineering takeaway. </strong>
        {guide.takeaway}
      </p>
      <p>
        <strong>What would happen in a real system? </strong>
        {guide.realSystem}
      </p>
      <ul className="list-disc pl-5 text-sm">
        {evaluation.breakdown.map((line) => (
          <li key={line.detail}>{line.detail}</li>
        ))}
      </ul>
      <p className="text-sm">
        Raw points {evaluation.rawPoints}. Hint penalty {hints}. Round score {score} / {ROUND_MAX_POINTS}.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="min-h-11" onClick={onRetry}>
          Retry this round
        </Button>
        <Button className="min-h-11" onClick={onNext}>
          {isLastRound ? "See your result" : "Next round"}
        </Button>
      </div>
    </motion.div>
  );
}
