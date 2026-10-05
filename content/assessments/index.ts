export interface AssessmentItem {
  id: string;
  domain: string;
  prompt: string;
  choices: Array<{ id: string; label: string }>;
  correctChoiceId: string;
  explanation: string;
}

export const assessmentItems: AssessmentItem[] = [
  {
    id: "tokens-1",
    domain: "Tokenization",
    prompt: "A token, in the sense that matters for an API bill, is best described as:",
    choices: [
      { id: "a", label: "Always one English word" },
      { id: "b", label: "A piece from the model's segmentation, which may be smaller or larger than a word" },
      { id: "c", label: "One character, in every modern tokenizer" },
      { id: "d", label: "A paragraph" },
    ],
    correctChoiceId: "b",
    explanation: "Subword tokenizers split some words and merge others. Billing and context limits follow those pieces.",
  },
  {
    id: "tokens-2",
    domain: "Tokenization",
    prompt: "Why can a long German compound change cost more than its character length suggests?",
    choices: [
      { id: "a", label: "Compounds are billed as images" },
      { id: "b", label: "A tokenizer may break an unfamiliar compound into many pieces" },
      { id: "c", label: "Cost depends only on the font" },
      { id: "d", label: "Compounds are always one token" },
    ],
    correctChoiceId: "b",
    explanation: "Rare or morphologically rich strings often become several subword pieces.",
  },
  {
    id: "attn-1",
    domain: "Attention",
    prompt: "In scaled dot-product attention, the weights over keys come from:",
    choices: [
      { id: "a", label: "Softmax of scaled query-key scores" },
      { id: "b", label: "The alphabetical order of the tokens" },
      { id: "c", label: "The value vectors alone" },
      { id: "d", label: "The number of layers only" },
    ],
    correctChoiceId: "a",
    explanation: "Queries and keys produce scores. Softmax turns those scores into a distribution. Values are mixed afterward.",
  },
  {
    id: "attn-2",
    domain: "Attention",
    prompt: "What is a fair description of two attention heads?",
    choices: [
      { id: "a", label: "They must always highlight the same token" },
      { id: "b", label: "They can emphasize different tokens because each head has its own comparison" },
      { id: "c", label: "They replace the need for positional information in every architecture" },
      { id: "d", label: "They are only a visualization and are not computed" },
    ],
    correctChoiceId: "b",
    explanation: "Multi-head attention runs more than one comparison. The heads are allowed to disagree.",
  },
  {
    id: "prompt-1",
    domain: "Prompting",
    prompt: "You need a program to parse total, currency, and due date. Which prompt is the better fit?",
    choices: [
      { id: "a", label: "“You are a friendly assistant.”" },
      { id: "b", label: "A schema that names the three fields" },
      { id: "c", label: "“Think silently and surprise me.”" },
      { id: "d", label: "No instruction, only the invoice" },
    ],
    correctChoiceId: "b",
    explanation: "A parser needs a constraint on the output. A persona does not name the fields.",
  },
  {
    id: "prompt-2",
    domain: "Prompting",
    prompt: "A public decomposition prompt is useful when:",
    choices: [
      { id: "a", label: "You need hidden model reasoning for a grade" },
      { id: "b", label: "The task has visible intermediate results a person can check" },
      { id: "c", label: "You want the shortest possible prompt at any quality" },
      { id: "d", label: "The label set is ordinary English" },
    ],
    correctChoiceId: "b",
    explanation: "Decomposition in Odyssey means a workflow someone can inspect, not a request for private cognition.",
  },
  {
    id: "train-1",
    domain: "Fine-tuning and alignment",
    prompt: "A falling training loss with a rising validation loss is a sign of:",
    choices: [
      { id: "a", label: "Guaranteed success" },
      { id: "b", label: "A generalization gap, often called overfitting in this setting" },
      { id: "c", label: "A tokenizer bug only" },
      { id: "d", label: "Perfect calibration" },
    ],
    correctChoiceId: "b",
    explanation: "The model is fitting the training signal better than it is fitting held-out data.",
  },
  {
    id: "train-2",
    domain: "Fine-tuning and alignment",
    prompt: "In a preference comparison, a higher helpfulness score wins only if:",
    choices: [
      { id: "a", label: "Helpfulness is the only value that exists" },
      { id: "b", label: "The stated weights make its total larger than the alternative" },
      { id: "c", label: "The reply is longer" },
      { id: "d", label: "A reward model was trained in the browser" },
    ],
    correctChoiceId: "b",
    explanation: "A rubric can weight safety or factuality above helpfulness. The total depends on those weights.",
  },
  {
    id: "prod-1",
    domain: "Retrieval and production",
    prompt: "Retrieval recall for a two-fact question is 0.5 when:",
    choices: [
      { id: "a", label: "Both required chunks are in the top-k list" },
      { id: "b", label: "Only one of the two required chunks is retrieved" },
      { id: "c", label: "The model is large" },
      { id: "d", label: "The prompt is polite" },
    ],
    correctChoiceId: "b",
    explanation: "Recall compares the relevant set with what the retriever returned. Missing one of two facts is recall 0.5.",
  },
  {
    id: "prod-2",
    domain: "Retrieval and production",
    prompt: "A bill triples immediately after a client deploy that retries with no delay. The provider status page is green. The better first response is:",
    choices: [
      { id: "a", label: "Cap the retries and restore backoff" },
      { id: "b", label: "Fine-tune the model overnight" },
      { id: "c", label: "Delete all logs" },
      { id: "d", label: "Flush a healthy cache" },
    ],
    correctChoiceId: "a",
    explanation: "The incident description points at a retry storm, which multiplies calls without a provider outage.",
  },
];

export function scoreAssessment(answers: Record<string, string>): number {
  const correct = assessmentItems.filter((item) => answers[item.id] === item.correctChoiceId).length;
  return Math.round((correct / assessmentItems.length) * 100);
}
