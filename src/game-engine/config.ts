import courseConfig from "@config/odyssey.config.ts";

export interface OdysseyConfig {
  title: string;
  tagline: string;
  institution: string;
  logoSrc: string;
  researchMode: boolean;
  enforcePrerequisites: boolean;
  tier2UnlockMastered: number;
  tier3UnlockMastered: number;
  masteryThreshold: number;
  overrideGameThresholds: boolean;
  showFoundry: boolean;
  enabledGames: string[];
  gameOrder: string[];
}

export const odysseyConfig: OdysseyConfig = courseConfig;

export function effectiveMasteryThreshold(gameThreshold: number): number {
  if (odysseyConfig.overrideGameThresholds) return odysseyConfig.masteryThreshold;
  return gameThreshold;
}
