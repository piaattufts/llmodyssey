import type { GameTeaching } from "../../src/game-engine/schema.ts";

/** Minimal teaching record so the custom-game example still parses. Not shown in the course. */
export const exampleTeaching: GameTeaching = {
  atAGlance: {
    tierExplanation: "An example file. It is not one of the thirteen course games.",
    recommendedLevel: "Introductory. This file exists so the schema test has a valid object.",
    timeExplanation: "About 5 minutes if someone were to play it. Learners never see it.",
    activityType: "A two-card choice used to prove the content schema.",
    masteryExplanation: "70% is the shared instructional line. This example is not a mastery claim.",
    statusExplanation: "Playable Prototype. The example is outside the course registry.",
  },
  whyThisGameExists: [
    "Authors need a smallest file that shows every required teaching field.",
    "The test parses this file so a missing field fails before a learner would see it.",
  ],
  bloomExplanation: "The example only checks that a learner can recognize the card the schema marks as the better fit.",
  misconceptions: [
    {
      statement: "A new game file does not need the teaching object because the orientation is enough.",
      howTheGameAddressesIt: "The schema requires teaching, and this file includes it so the test can catch a regression.",
    },
  ],
  assigning: {
    required: "Nothing. This example is for authors.",
    helpful: "Reading the game schema once.",
    notRequired: "Any LLM background.",
  },
  difficultyExplanation: "Introductory: one comparison, no algorithm.",
  roundNotes: [
    {
      practicing: "Selecting the card the example marks as the better fit.",
      whyChosen: "A single round is enough to exercise the schema.",
      watchFor: "The description that matches the task.",
      whatMattered: "The card that names the schema is the one this example treats as best.",
      alternatives: "The other card is present so a poor fit can score zero.",
    },
  ],
  scoringNarrative: "One round, 10 points maximum. The best card scores 10 and the other scores 0. A hint subtracts 1. This example is not in the course.",
  transferExplanation: "Transfer is not claimed. The file only has to parse.",
  selfEvaluationQuestions: [
    "Can I see that this file is not a course game?",
    "Can I name the card the example marks best?",
    "Can I see that teaching is required?",
    "Can I see that self-evaluation would not change the score?",
  ],
  guide: {
    title: "Understanding the example",
    overview: "This guide exists so the custom-game sample satisfies the same guide shape as a course game.",
    keyConcepts: [
      { term: "Schema", explanation: "The Zod object that rejects a game file missing orientation or teaching." },
      { term: "Round", explanation: "One decision the example can score." },
      { term: "Hint", explanation: "A scaffold that would subtract a point." },
      { term: "Registry", explanation: "The course list. This file is intentionally absent from it." },
    ],
    howItWorks: "The score is the label on the selected card. Nothing else runs.",
    workedExamples: [
      {
        title: "Read both cards",
        label: "Example only",
        body: "Compare the two descriptions and lock the card that matches the task. The example is not shown to learners.",
      },
    ],
    visualNote: "No diagram. The example is text.",
    applications: "Authors copying the sample into a real game.",
    tradeoffs: "A short example is easier to copy and omits the depth a course game needs.",
    bestPractices: ["Copy the sample.", "Replace the ids.", "Run the content test."],
    pitfalls: ["Registering the example in the course.", "Leaving placeholder text in a real game.", "Omitting round notes."],
    checkYourUnderstanding: ["Why is this file excluded?", "Which field is new relative to orientation?", "What does the test parse?"],
    whenToUse: "When adding a game definition.",
    whenNotToUse: "When teaching a class. Use the thirteen course games.",
    productionConsiderations: "None. This file does not describe a production system.",
  },
  educator: {
    whyTeach: "It is not taught. It documents the schema.",
    whatStudentsDo: "Students do not see this file.",
    evidencePrompts: ["Would a missing teaching field fail the test?", "Is this id in the course list?", "Does the sample include a round note?"],
    beforeClass: "Not applicable.",
    duringClass: "Not applicable.",
    afterClass: "Not applicable.",
    assignment: "Not applicable.",
    extension: "Add a field to the schema and update this sample in the same change.",
    relatedGames: "None. Start from Token Forge for a real activity.",
  },
  discussionQuestions: ["What should a new game file include?", "Why validate at load time?", "Why keep the example out of the registry?"],
  nextConnection: {
    headline: "Return to the course list.",
    body: "This example is a template. The teaching sequence for learners starts at Token Forge.",
    path: "example file → a real game definition → the course registry",
  },
};
