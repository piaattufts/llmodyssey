export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  kind: "progress" | "learning";
}

export const achievementCatalog: AchievementDefinition[] = [
  {
    id: "first-completion",
    title: "First completion",
    description: "Finish every round of one game. Completion is not the same as mastery.",
    kind: "progress",
  },
  {
    id: "first-mastery",
    title: "Mastery recorded",
    description: "Reach the mastery threshold on any game.",
    kind: "learning",
  },
  {
    id: "no-hint-mastery",
    title: "Independent mastery",
    description: "Master a game without using a hint on the attempt that set the best score.",
    kind: "learning",
  },
  {
    id: "scaffolded-mastery",
    title: "Scaffolded success",
    description: "Use at least one hint and still reach mastery. Hints are part of the design, not a failure.",
    kind: "learning",
  },
  {
    id: "perfect-game",
    title: "Full marks",
    description: "Score 100% on a game.",
    kind: "learning",
  },
  {
    id: "cognitive-core",
    title: "Cognitive Core",
    description: "Master all seven Cognitive Core games.",
    kind: "learning",
  },
  {
    id: "systems-forge",
    title: "Systems Forge",
    description: "Master all five Systems Forge games.",
    kind: "learning",
  },
  {
    id: "foundry",
    title: "Foundry synthesis",
    description: "Master Foundry Arena.",
    kind: "learning",
  },
  {
    id: "odyssey-complete",
    title: "Odyssey complete",
    description: "Master all 13 games.",
    kind: "learning",
  },
  {
    id: "both-assessments",
    title: "Pre and post check",
    description: "Finish both the optional pre-assessment and post-assessment.",
    kind: "learning",
  },
];
