import type { GameOrientation, ReleaseStatus } from "../../src/game-engine/schema.ts";

export const universalSelfEvaluation = {
  heading: "How should I evaluate myself?",
  intro:
    "A score tells you how this attempt went. It does not, by itself, tell you whether you can use the idea. Ask yourself:",
  questions: [
    "Did I choose the correct or defensible answer?",
    "Can I explain why it was appropriate?",
    "Can I explain why the alternatives were weaker?",
    "Did I need hints?",
    "Did my decisions improve over later rounds?",
    "Could I apply the concept to a new example?",
    "Can I describe the trade-off rather than merely remember the answer?",
  ],
  completion: "I finished the activity.",
  performance: "I earned a particular score.",
  mastery: "I can explain and apply the underlying concept.",
};

export function learnerStatusCopy(status: ReleaseStatus): { title: string; detail: string } {
  if (status === "implemented") {
    return {
      title: "Reference Implementation",
      detail:
        "This is the reference game in this release. Its activity, scoring, and explanations are the model the other games are moving toward.",
    };
  }
  if (status === "prototype") {
    return {
      title: "Playable Prototype",
      detail:
        "This game contains a functioning educational activity and scoring flow, but its instructional mechanics and content are still being refined. Playable means the rounds, feedback, and score work. It does not mean this game has the same validation as the reference implementation.",
    };
  }
  return {
    title: "Planned",
    detail: "This game is described so you can see where it fits. It cannot be scored or marked complete in this release.",
  };
}

export function buildOrientation(input: {
  tagline: string;
  overview: string;
  whyItMatters: string;
  learningObjectives: [string, string, string, ...string[]];
  whatYouWillDo: string;
  howToPlay: string[];
  howItWorks: string;
  earns: string;
  roundCount: number;
  efficiencyMatters: string;
  multipleAcceptableAnswers: string;
  penalties?: string;
  mastery: string;
  rounds: Array<{ label: string; difficulty: string; focus: string }>;
  recommendedNext: string;
  implementationNote: string;
  estimatedTime: string;
  beforeYouStart: string[];
  selfCheck: string[];
  reflectionPrompts: [string, string];
  roundGuides: GameOrientation["roundGuides"];
}): GameOrientation {
  const maximum = input.roundCount * 10;
  return {
    tagline: input.tagline,
    overview: input.overview,
    whyItMatters: input.whyItMatters,
    learningObjectives: input.learningObjectives,
    whatYouWillDo: input.whatYouWillDo,
    howToPlay: input.howToPlay,
    howItWorks: input.howItWorks,
    evaluation: {
      whatEarnsPoints: input.earns,
      maximumScore: `Each round is scored out of 10. This game has ${input.roundCount} rounds, so the maximum is ${maximum} points. Your percent is the sum of your best score on each round, divided by ${maximum}.`,
      penalties:
        input.penalties ??
        "A poor fit scores 0 on that round. Missing a required constraint also scores 0, even if another part of the answer looked reasonable.",
      hintEffect:
        "Each hint you reveal subtracts 1 point from that round, down to 0. Using a hint is not treated as failure. The penalty distinguishes an independent solution from a scaffolded one.",
      retryEffect:
        "You can retry any round. Hints reset when you retry. The best score on that round is the one that is kept.",
      masteryThreshold: "70%",
      efficiencyMatters: input.efficiencyMatters,
      multipleAcceptableAnswers: input.multipleAcceptableAnswers,
    },
    mastery: input.mastery,
    progress: {
      rounds: input.rounds,
      afterIncorrect:
        "An incorrect or partial decision stays on screen with the reason, the trade-off, and a takeaway. You can retry that round or continue. Continuing does not erase the feedback.",
      retry: "Retry is available on every round. A retry does not wipe your best earlier score.",
      completedWhen:
        "The game counts as completed when you finish every round and open the result screen. Completion is recorded even if the score is under the mastery line.",
      belowMastery:
        "If your score is under the mastery threshold, the game is completed and mastery is not yet reached. Replay is recommended. You can still open the next game. A later tier stays locked only when the course setting requires a mastery count, not because this one score was low.",
      recommendedNext: input.recommendedNext,
    },
    implementationNote: input.implementationNote,
    estimatedTime: input.estimatedTime,
    beforeYouStart: input.beforeYouStart,
    selfCheck: input.selfCheck,
    reflectionPrompts: input.reflectionPrompts,
    roundGuides: input.roundGuides,
  };
}
