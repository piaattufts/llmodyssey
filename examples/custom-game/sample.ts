import { parseGame } from "../../src/game-engine/schema.ts";

const sample = {
  id: "example-custom-game",
  title: "Example custom game",
  tier: 1,
  order: 99,
  summary: "A minimal game used by the documentation and the content test. It is not registered in the course.",
  purpose: "Show the smallest definition the schema accepts.",
  whyItMatters: "Educators can add a round without editing React when an existing interaction type is enough.",
  learningObjectives: ["Identify the option marked best in a two-choice round."],
  concepts: ["Content schema"],
  bloomLevels: ["understand"],
  prerequisites: [],
  estimatedMinutes: 5,
  difficulty: "foundational",
  masteryThreshold: 70,
  misconception: "A new challenge does not require a new component when the interaction type already exists.",
  reflectionPrompt: "What would you change in the hint text?",
  workedExample: { title: "Read the card", steps: ["Compare the two descriptions.", "Lock the round."] },
  furtherReadingIds: ["vaswani2017"],
  implementation: {
    type: "deterministic-simulation",
    label: "Example only",
    whatIsReal: "The score for the selected card.",
    whatIsSimulated: "Nothing is executed beyond the card label.",
  },
  rounds: [
    {
      id: "only-round",
      title: "One choice",
      concept: "Content schema",
      learnerTask: "Select the card marked as the better fit.",
      expectedReasoning: "The best card is the one whose description matches the task.",
      scenario: "This round exists so a test can parse educator content outside the 13 games.",
      hints: ["Read both cards.", "The task asks for the better fit.", "The card that names the schema is the best fit in this example."],
      scoringRule: "Best scores 10. Poor scores 0. Each hint subtracts 1.",
      explanation: "The example is not part of the learner course.",
      feedbackCorrect: "That card is the one the example marks best.",
      feedbackIncorrect: "The other card is the one the example marks best.",
      interaction: {
        type: "choice",
        prompt: "Which card fits?",
        options: [
          {
            id: "schema",
            label: "Use the schema",
            description: "Validate the definition before shipping it.",
            metrics: [{ label: "Fits", value: "Yes", tone: "good" }],
            quality: "best",
          },
          {
            id: "skip",
            label: "Skip validation",
            description: "Ship the file and hope the UI notices.",
            metrics: [{ label: "Fits", value: "No", tone: "poor" }],
            quality: "poor",
          },
        ],
      },
    },
  ],
};

export const customGame = parseGame(sample, "examples/custom-game/sample.ts");
