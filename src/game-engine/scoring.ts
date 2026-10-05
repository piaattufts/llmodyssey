export const ROUND_MAX_POINTS = 10;
export const HINT_PENALTY_POINTS = 1;
export const MAX_HINTS = 3;
export const DEFAULT_MASTERY_THRESHOLD = 70;

export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export function pointsForQuality(quality: "best" | "acceptable" | "poor"): number {
  if (quality === "best") return ROUND_MAX_POINTS;
  if (quality === "acceptable") return 6;
  return 0;
}

export function applyHintPenalty(rawPoints: number, hintsUsed: number): number {
  const safeHints = Math.max(0, Math.min(MAX_HINTS, hintsUsed));
  return Math.max(0, rawPoints - safeHints * HINT_PENALTY_POINTS);
}

export function gamePercent(earnedPoints: number, roundCount: number): number {
  const possible = roundCount * ROUND_MAX_POINTS;
  if (possible <= 0) return 0;
  return Math.round((earnedPoints / possible) * 100);
}

export function letterGrade(percent: number): LetterGrade {
  if (percent >= 90) return "A";
  if (percent >= 80) return "B";
  if (percent >= 70) return "C";
  if (percent >= 60) return "D";
  return "F";
}

export function isMastered(percent: number, threshold: number): boolean {
  return percent >= threshold;
}

export function gradeBandLabel(grade: LetterGrade): string {
  if (grade === "A") return "A (90–100)";
  if (grade === "B") return "B (80–89)";
  if (grade === "C") return "C (70–79)";
  if (grade === "D") return "D (60–69)";
  return "F (below 60)";
}
