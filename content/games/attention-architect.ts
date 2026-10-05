import type { GameDefinition } from "../../src/game-engine/schema.ts";

const scoreRule =
  "10 points if you select the token with the highest simplified attention weight on the named head. Otherwise 0. The weights are recomputed in the browser as softmax(query · key / scale). Each hint subtracts 1 point, to a floor of 0.";

const attentionArchitect: GameDefinition = {
  id: "attention-architect",
  title: "Attention Architect",
  tier: 1,
  order: 2,
  summary: "Compute a tiny self-attention pattern and read which token receives the weight.",
  purpose: "Show query, key, value roles through the score that actually decides the pattern: the scaled dot product, then softmax.",
  whyItMatters:
    "Attention is the operation that lets a token gather information from other tokens. Reading a real, tiny weight vector is more precise than memorizing a diagram.",
  learningObjectives: [
    "Identify the query, key, and value roles in a one-step attention calculation.",
    "Compute which key wins a scaled dot-product comparison.",
    "Explain why softmax preserves the winner while turning scores into weights.",
    "Contrast a single head with a second head that emphasizes a different token.",
  ],
  concepts: ["Query", "Key", "Value", "Scaled dot-product", "Softmax", "Self-attention", "Multi-head attention", "Position"],
  bloomLevels: ["understand", "apply"],
  prerequisites: ["token-forge"],
  estimatedMinutes: 25,
  difficulty: "foundational",
  masteryThreshold: 70,
  misconception: "The previous token is not automatically the attention target, and a heatmap in this game is not a full transformer forward pass.",
  reflectionPrompt: "In your own words, what does a high attention weight claim, and what does it not claim about the model's internal reasoning?",
  workedExample: {
    title: "One query, three keys",
    steps: [
      "Treat the query as the token that is asking for information.",
      "Score each key by the dot product query · key, then divide by the scale.",
      "Softmax turns those scores into positive weights that sum to 1. The largest score is still the largest weight.",
      "The value vectors would be mixed by those weights. This game asks only for the winning key, and it shows the weights.",
    ],
  },
  furtherReadingIds: ["vaswani2017"],
  implementation: {
    type: "simplified-computation",
    label: "Simplified dot-product attention on toy vectors",
    whatIsReal: "Scores and softmax weights are computed in the browser from the vectors in the round.",
    whatIsSimulated:
      "The vectors are tiny and hand-authored. There is no trained transformer, no full residual stream, and no claim that these weights match any production model.",
  },
  rounds: [
    {
      id: "self-bias",
      title: "Round 1 · A token looking at itself",
      concept: "Query-key match",
      learnerTask: "Select the token that receives the highest weight from the query.",
      expectedReasoning: "The query matches the key of “sat” most strongly, so that token wins even though it is not the grammatical object.",
      scenario: "You are inspecting one head before you trust a classroom diagram. The only question is which key the math prefers.",
      hints: [
        "You do not need to guess the grammar first. Read the weights.",
        "The largest percentage is the winner. Softmax does not reorder them.",
        "The query was authored to align with the key of “sat”.",
      ],
      scoringRule: scoreRule,
      explanation: "A large weight means the query and that key point in a similar direction in this toy space. It does not mean the model “understands” the sentence.",
      feedbackCorrect: "The winning weight matches the key aligned with the query.",
      feedbackIncorrect: "Select the token whose displayed weight is largest on this head.",
      interaction: {
        type: "attention",
        prompt: "Which token receives the highest attention weight?",
        tokens: ["the", "cat", "sat", "mat"],
        scale: 1,
        answerHead: 0,
        formulaNote: "weight = softmax(query · key / scale). Values are not needed to name the winner.",
        heads: [
          {
            name: "Head A",
            query: [0, 1, 0],
            keys: [
              [1, 0, 0],
              [0, 0.2, 0],
              [0, 1, 0],
              [0, 0.3, 1],
            ],
          },
        ],
      },
    },
    {
      id: "coreference",
      title: "Round 2 · What “it” points at",
      concept: "A head can prefer a distant content word",
      learnerTask: "Select the token with the highest weight from the query attached to “it”.",
      expectedReasoning: "The authored query for “it” aligns with “wrench”, not with the immediately previous token.",
      scenario: "A debugging view shows one head while a student claims attention always looks at the previous word. Check the weights.",
      hints: [
        "Ignore linear order until you have read the weights.",
        "“picked” is adjacent and is a distractor in this round.",
        "The query aligns with the key of “wrench”.",
      ],
      scoringRule: scoreRule,
      explanation: "Position and content are separate signals. This round's vectors encode content match only, so adjacency does not win.",
      feedbackCorrect: "The weight lands on the content key, not on the neighbor.",
      feedbackIncorrect: "The previous token is not the winner in these vectors. Read the percentages.",
      interaction: {
        type: "attention",
        prompt: "From the query for “it”, which token wins?",
        tokens: ["Sam", "picked", "wrench", "it"],
        scale: 1,
        answerHead: 0,
        formulaNote: "Same scaled dot-product. No positional vector has been added yet.",
        heads: [
          {
            name: "Content head",
            query: [0, 0, 1],
            keys: [
              [1, 0, 0],
              [0, 1, 0.1],
              [0, 0.2, 1],
              [0, 0, 0.2],
            ],
          },
        ],
      },
    },
    {
      id: "negation",
      title: "Round 3 · Polarity",
      concept: "A function word can be the winner",
      learnerTask: "Select the token the polarity head emphasizes.",
      expectedReasoning: "The query was built to match “not”, because the exercise is about polarity rather than the noun.",
      scenario: "A classifier explanation highlights a noun, but this head's math highlights the negation. Decide from the weights, not from the noun's importance in English.",
      hints: [
        "A content word can matter to a human and still lose this head.",
        "Compare “not” with “refund”.",
        "The query matches the key of “not”.",
      ],
      scoringRule: scoreRule,
      explanation: "Different heads can specialize. This single head is only a 3-dimensional illustration of that idea.",
      feedbackCorrect: "This head's winner is the negation, which is what the vectors encode.",
      feedbackIncorrect: "Do not pick the noun only because it is meaningful in English. Use the weight.",
      interaction: {
        type: "attention",
        prompt: "Which token wins on the polarity head?",
        tokens: ["do", "not", "approve", "refund"],
        scale: 1,
        answerHead: 0,
        formulaNote: "scale is 1 in this exercise so the dot product and the pre-softmax score are equal.",
        heads: [
          {
            name: "Polarity head",
            query: [1, 0.1, 0],
            keys: [
              [0.2, 1, 0],
              [1, 0, 0],
              [0, 0.4, 1],
              [0.1, 0.2, 0.9],
            ],
          },
        ],
      },
    },
    {
      id: "position",
      title: "Round 4 · Position changes the winner",
      concept: "Positional information",
      learnerTask: "Select the winner after a position bias has been added to the keys.",
      expectedReasoning: "The two content keys are identical. The added position bias on the earlier token makes it win.",
      scenario: "Two copies of the word “bank” appear. Content keys match. A position bias was added to the first copy's key before this screen.",
      hints: [
        "If content keys match, a position term can break the tie.",
        "Look at the two copies of “bank”, not at “the”.",
        "The first “bank” has the larger key on the query's active dimension.",
      ],
      scoringRule: scoreRule,
      explanation:
        "Transformers add positional information because self-attention over content alone is order-invariant. Here the position effect is baked into the key numbers. The game does not run a sinusoidal positional encoder.",
      feedbackCorrect: "With content tied, the authored position bias selects the earlier copy.",
      feedbackIncorrect: "The content keys match. The bias is what separates the two copies of “bank”.",
      interaction: {
        type: "attention",
        prompt: "Which token wins once position bias is included in the keys?",
        tokens: ["bank", "on", "the", "bank"],
        scale: 1,
        answerHead: 0,
        formulaNote: "The position effect is already included in the key coordinates. It is not computed by a separate positional-encoding module.",
        heads: [
          {
            name: "Position-sensitive head",
            query: [1, 0],
            keys: [
              [1, 0.2],
              [0, 1],
              [0.1, 0.4],
              [0.4, 0.2],
            ],
          },
        ],
      },
    },
    {
      id: "two-heads",
      title: "Round 5 · Two heads, two winners",
      concept: "Multi-head attention",
      learnerTask: "Select the token that Head B emphasizes. Head A is visible so you can see that it disagrees.",
      expectedReasoning: "Head A prefers the subject. Head B prefers the instrument. The question names Head B.",
      scenario: "A single average attention map would hide the split. You have two heads. Answer for Head B only.",
      hints: [
        "Read the question: it names one head.",
        "Head A and Head B are allowed to disagree. That is the point of multiple heads.",
        "Head B's largest weight is on “wrench”.",
      ],
      scoringRule: scoreRule,
      explanation:
        "Multi-head attention runs several comparisons in parallel. This round really does compute two softmaxes. It does not project them with learned output matrices or mix them into a residual stream.",
      feedbackCorrect: "Head B's winner is independent of Head A's winner.",
      feedbackIncorrect: "You reported Head A's preference. The question asks for Head B.",
      interaction: {
        type: "attention",
        prompt: "Which token does Head B weight most?",
        tokens: ["Sam", "lifted", "wrench"],
        scale: 1,
        answerHead: 1,
        formulaNote: "Each head has its own query and keys. Only Head B is scored.",
        heads: [
          {
            name: "Head A · subject",
            query: [1, 0, 0],
            keys: [
              [1, 0, 0],
              [0, 1, 0],
              [0, 0, 1],
            ],
          },
          {
            name: "Head B · instrument",
            query: [0, 0, 1],
            keys: [
              [1, 0, 0],
              [0, 1, 0.2],
              [0, 0.1, 1],
            ],
          },
        ],
      },
    },
  ],
};

export default attentionArchitect;
