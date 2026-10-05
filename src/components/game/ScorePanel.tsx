import { gradeBandLabel, letterGrade } from "../../game-engine/scoring.ts";

export function ScorePanel({ earned, possible, percent }: { earned: number; possible: number; percent: number }) {
  return (
    <p className="text-sm">
      Score so far {earned}/{possible} · {percent}% · {gradeBandLabel(letterGrade(percent))}
    </p>
  );
}
