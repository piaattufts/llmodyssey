import { promptsmithOrientation } from "../orientation/games.ts";
import { promptsmithTeaching } from "../teaching/core.ts";
import type { GameDefinition } from "../../src/game-engine/schema.ts";

const scoreRule =
  "Best strategy: 10 points. Acceptable strategy: 6. Poor strategy: 0. Metrics shown on a card are authored outcomes for that strategy, not a live model call. Each hint subtracts 1 point, to a floor of 0.";

const promptsmith: GameDefinition = {
  id: "promptsmith",
  status: "prototype",
  title: "Promptsmith",
  tier: 1,
  order: 4,
  summary: "Match a prompting strategy to a task and read the quality, token, and failure tradeoff.",
  purpose: "Practice direct instructions, role context, few-shot examples, structured outputs, and task decomposition without asking a model to reveal hidden reasoning.",
  whyItMatters:
    "Prompt design changes reliability and cost. A strategy that helps a classification task can waste tokens on a high-volume extraction task.",
  learningObjectives: [
    "Choose a prompting strategy that matches the failure mode of a task.",
    "Compare output quality with input-token cost on authored cases.",
    "Specify an output constraint when the caller needs a parseable result.",
    "Decompose a multi-step task instead of hiding the steps inside one vague instruction.",
  ],
  concepts: ["Direct prompting", "Role context", "Few-shot prompting", "Structured output", "Task decomposition", "Evaluation", "Quality-cost tradeoff"],
  bloomLevels: ["apply", "analyze"],
  prerequisites: ["context-compression"],
  estimatedMinutes: 25,
  difficulty: "intermediate",
  masteryThreshold: 70,
  misconception: "A longer prompt is not automatically a better prompt, and chain-of-thought wording is not a request to extract private model reasoning.",
  reflectionPrompt: "Which task in your own course would you evaluate with a fixed output schema, and what would you measure besides fluency?",
  workedExample: {
    title: "Extraction with a schema",
    steps: [
      "Name the fields the caller must parse.",
      "Give the schema, not only a persona.",
      "Read the authored failure mode. A fluent paragraph that omits a field fails extraction.",
      "If two strategies both parse, prefer the one with the lower token cost.",
    ],
  },
  furtherReadingIds: ["brown2020gpt3", "wei2022cot", "zamfirescu2023prompt"],
  implementation: {
    type: "deterministic-simulation",
    label: "Deterministic prompt cases",
    whatIsReal: "The comparison among authored strategies, including their token and quality labels.",
    whatIsSimulated: "No live language model is called. Outcome cards are written for the exercise.",
  },
  orientation: promptsmithOrientation,
  teaching: promptsmithTeaching,
  rounds: [
    {
      id: "invoice-fields",
      title: "Round 1 · Parse an invoice",
      concept: "Structured output",
      learnerTask: "Choose the prompt that returns parseable invoice fields.",
      expectedReasoning: "A schema beats a persona when the caller needs fields, not prose.",
      scenario: "Accounting will reject any reply that is not JSON with total, currency, and due date.",
      hints: [
        "The caller is a parser, not a reader.",
        "A role prompt can still return a paragraph.",
        "The structured prompt is the one that names the three fields.",
      ],
      scoringRule: scoreRule,
      explanation: "Output constraints belong in the prompt when a downstream system must parse the reply. This case does not require hidden reasoning traces.",
      feedbackCorrect: "The schema matches the parser. The persona does not.",
      feedbackIncorrect: "Look for the strategy whose failure mode is not “unparseable prose”.",
      interaction: {
        type: "choice",
        prompt: "Which prompt should go to production for this extractor?",
        options: [
          {
            id: "direct",
            label: "Direct",
            description: "“Read the invoice and tell me about it.”",
            quality: "poor",
            metrics: [
              { label: "Parse rate", value: "15%", tone: "poor" },
              { label: "Input tokens", value: "40", tone: "good" },
            ],
          },
          {
            id: "role",
            label: "Role",
            description: "“You are a careful accountant. Summarize the invoice.”",
            quality: "poor",
            metrics: [
              { label: "Parse rate", value: "28%", tone: "poor" },
              { label: "Input tokens", value: "70", tone: "neutral" },
            ],
          },
          {
            id: "schema",
            label: "Structured",
            description: "Return JSON with keys total, currency, and due_date. Use null if a field is absent.",
            quality: "best",
            metrics: [
              { label: "Parse rate", value: "96%", tone: "good" },
              { label: "Input tokens", value: "110", tone: "neutral" },
            ],
          },
          {
            id: "fewshot",
            label: "Few-shot prose",
            description: "Three sample invoices answered as paragraphs.",
            quality: "acceptable",
            metrics: [
              { label: "Parse rate", value: "70%", tone: "neutral" },
              { label: "Input tokens", value: "640", tone: "poor" },
            ],
          },
        ],
      },
    },
    {
      id: "word-problem",
      title: "Round 2 · A two-step quantity",
      concept: "Task decomposition",
      learnerTask: "Choose a prompt that separates the two calculations without asking for hidden chain-of-thought.",
      expectedReasoning: "Asking for labeled intermediate results is a public workflow. Asking the model to reveal private reasoning is not required.",
      scenario: "Students compute a discount and then tax. The grader needs both numbers, each labeled.",
      hints: [
        "The task has two arithmetic steps that the grader must see.",
        "A persona does not name the steps.",
        "The decomposition prompt asks for discount_total and taxed_total as visible fields.",
      ],
      scoringRule: scoreRule,
      explanation: "Decomposition here means a public structure the learner can check. It is not a demand that a model expose internal reasoning.",
      feedbackCorrect: "The labeled fields make both steps available to the grader.",
      feedbackIncorrect: "Choose the prompt that names the two public results, not a prompt that only says “think carefully”.",
      interaction: {
        type: "choice",
        prompt: "Which prompt fits the grader?",
        options: [
          {
            id: "vague",
            label: "Direct",
            description: "“What is the final price?”",
            quality: "poor",
            metrics: [
              { label: "Both fields present", value: "No", tone: "poor" },
              { label: "Input tokens", value: "30", tone: "good" },
            ],
          },
          {
            id: "think",
            label: "Hidden-reasoning request",
            description: "“Think silently and only show the final price.”",
            quality: "poor",
            metrics: [
              { label: "Both fields present", value: "No", tone: "poor" },
              { label: "Input tokens", value: "45", tone: "good" },
            ],
          },
          {
            id: "decompose",
            label: "Decomposition",
            description: "Show discount_total, then taxed_total. Do not describe private reasoning.",
            quality: "best",
            metrics: [
              { label: "Both fields present", value: "Yes", tone: "good" },
              { label: "Input tokens", value: "90", tone: "neutral" },
            ],
          },
          {
            id: "role",
            label: "Role",
            description: "“You are a math tutor. Be encouraging.”",
            quality: "acceptable",
            metrics: [
              { label: "Both fields present", value: "Sometimes", tone: "neutral" },
              { label: "Input tokens", value: "60", tone: "neutral" },
            ],
          },
        ],
      },
    },
    {
      id: "tone",
      title: "Round 3 · A reply in a known voice",
      concept: "Role and context",
      learnerTask: "Choose the prompt that supplies the missing audience and voice.",
      expectedReasoning: "When the facts are fixed and the failure is tone, role and audience context matter more than extra examples.",
      scenario: "Facilities must tell residents about a water shutoff. The facts are already bulletproof. Last week's reply sounded like a legal filing.",
      hints: [
        "The facts are not the failure. The audience is.",
        "Few-shot legal memos would reinforce the wrong voice.",
        "The role prompt names residents and a calm, specific voice.",
      ],
      scoringRule: scoreRule,
      explanation: "Role context is useful when it constrains audience and tone. It does not replace facts, and it is the wrong tool when the failure is parsing.",
      feedbackCorrect: "The audience constraint matches the failure mode.",
      feedbackIncorrect: "More examples of legal prose would not fix a voice problem.",
      interaction: {
        type: "choice",
        prompt: "Which prompt corrects the voice?",
        options: [
          {
            id: "direct",
            label: "Direct",
            description: "“Rewrite this.”",
            quality: "poor",
            metrics: [
              { label: "Resident-appropriate", value: "Unstable", tone: "poor" },
              { label: "Facts kept", value: "Yes", tone: "good" },
            ],
          },
          {
            id: "role",
            label: "Role and audience",
            description: "“Write to residents in plain sentences. State the time, the location, and what they should do.”",
            quality: "best",
            metrics: [
              { label: "Resident-appropriate", value: "Stable", tone: "good" },
              { label: "Facts kept", value: "Yes", tone: "good" },
            ],
          },
          {
            id: "fewshot",
            label: "Few-shot legal",
            description: "Two sample legal memos as style examples.",
            quality: "poor",
            metrics: [
              { label: "Resident-appropriate", value: "Worse", tone: "poor" },
              { label: "Input tokens", value: "800", tone: "poor" },
            ],
          },
          {
            id: "schema",
            label: "Structured only",
            description: "JSON with time and location, no audience note.",
            quality: "acceptable",
            metrics: [
              { label: "Facts kept", value: "Yes", tone: "good" },
              { label: "Resident-appropriate", value: "Not specified", tone: "neutral" },
            ],
          },
        ],
      },
    },
    {
      id: "labels",
      title: "Round 4 · A rare label set",
      concept: "Few-shot prompting",
      learnerTask: "Choose few-shot examples when the label set is unusual and the instruction alone is ambiguous.",
      expectedReasoning: "Three examples teach a local label set that a general instruction does not contain.",
      scenario: "A newsroom uses the labels hold, spike, and brief. Those words do not mean the same thing in ordinary English.",
      hints: [
        "The labels are private jargon.",
        "A dictionary definition of the English words will not teach the newsroom.",
        "The few-shot card is the one that includes one example of each label.",
      ],
      scoringRule: scoreRule,
      explanation: "Few-shot prompts are a way to show a decision boundary. They cost tokens, so they earn their cost when the category system is local.",
      feedbackCorrect: "The examples define the local labels. A bare instruction does not.",
      feedbackIncorrect: "Ordinary definitions of those English words miss the newsroom's meaning.",
      interaction: {
        type: "choice",
        prompt: "How should the labeler be prompted?",
        options: [
          {
            id: "direct",
            label: "Direct",
            description: "“Label the story hold, spike, or brief.”",
            quality: "poor",
            metrics: [
              { label: "Label accuracy", value: "41%", tone: "poor" },
              { label: "Input tokens", value: "50", tone: "good" },
            ],
          },
          {
            id: "fewshot",
            label: "Few-shot",
            description: "One short example of hold, spike, and brief from the newsroom guide.",
            quality: "best",
            metrics: [
              { label: "Label accuracy", value: "88%", tone: "good" },
              { label: "Input tokens", value: "320", tone: "neutral" },
            ],
          },
          {
            id: "role",
            label: "Role",
            description: "“You are an experienced editor.”",
            quality: "poor",
            metrics: [
              { label: "Label accuracy", value: "46%", tone: "poor" },
              { label: "Input tokens", value: "70", tone: "good" },
            ],
          },
          {
            id: "schema",
            label: "Schema without examples",
            description: "JSON label field, no examples of the jargon.",
            quality: "acceptable",
            metrics: [
              { label: "Label accuracy", value: "63%", tone: "neutral" },
              { label: "Parse rate", value: "99%", tone: "good" },
            ],
          },
        ],
      },
    },
    {
      id: "volume-cost",
      title: "Round 5 · Quality against cost",
      concept: "Quality-cost tradeoff",
      learnerTask: "Choose the strategy that stays above the quality bar at the lowest token cost.",
      expectedReasoning: "The verbose few-shot prompt is slightly more accurate and far more expensive. The compact structured prompt clears the 90 percent bar.",
      scenario: "Support classifies 200,000 tickets a day. The quality bar is 90 percent agreement with a gold set. Finance will not pay for a prompt that is only two points better at triple the tokens.",
      hints: [
        "Read the quality bar before you read the highest accuracy.",
        "Reject anything under 90 percent.",
        "Among strategies at or above 90 percent, take the smaller token count.",
      ],
      scoringRule: scoreRule,
      explanation: "Evaluation turns prompting into an engineering choice. The highest score on one metric is not the specification.",
      feedbackCorrect: "The compact structured prompt clears 90 percent and spends fewer tokens than the long few-shot prompt.",
      feedbackIncorrect: "A strategy under 90 percent fails the bar. Above the bar, prefer fewer tokens.",
      interaction: {
        type: "choice",
        prompt: "Which strategy meets the written bar?",
        options: [
          {
            id: "direct",
            label: "Direct",
            description: "“Classify the ticket.”",
            quality: "poor",
            metrics: [
              { label: "Agreement", value: "72%", tone: "poor" },
              { label: "Input tokens", value: "25", tone: "good" },
            ],
          },
          {
            id: "schema",
            label: "Compact structured",
            description: "One-sentence instruction plus the label list and a JSON key.",
            quality: "best",
            metrics: [
              { label: "Agreement", value: "93%", tone: "good" },
              { label: "Input tokens", value: "140", tone: "good" },
            ],
          },
          {
            id: "fewshot",
            label: "Long few-shot",
            description: "Twelve full ticket transcripts as examples.",
            quality: "acceptable",
            metrics: [
              { label: "Agreement", value: "95%", tone: "good" },
              { label: "Input tokens", value: "1800", tone: "poor" },
            ],
          },
          {
            id: "role",
            label: "Role only",
            description: "“You are a tier-one support agent.”",
            quality: "poor",
            metrics: [
              { label: "Agreement", value: "80%", tone: "poor" },
              { label: "Input tokens", value: "60", tone: "good" },
            ],
          },
        ],
      },
    },
  ],
};

export default promptsmith;
