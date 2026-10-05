import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button.tsx";
import type { Evaluation } from "../../game-engine/evaluate.ts";
import { ROUND_MAX_POINTS } from "../../game-engine/scoring.ts";

export function FeedbackPanel({
  evaluation,
  hints,
  score,
  isLastRound,
  onRetry,
  onNext,
}: {
  evaluation: Evaluation;
  hints: number;
  score: number;
  isLastRound: boolean;
  onRetry: () => void;
  onNext: () => void;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="space-y-3 rounded-xl border border-border p-4"
      data-testid="feedback"
      aria-live="polite"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-lg font-semibold">{evaluation.success ? "Met the round target" : evaluation.partial ? "Partly met" : "Not met"}</p>
      <p>{evaluation.feedback}</p>
      <p>{evaluation.explanation}</p>
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
          {isLastRound ? "Continue to reflection" : "Next round"}
        </Button>
      </div>
    </motion.div>
  );
}
