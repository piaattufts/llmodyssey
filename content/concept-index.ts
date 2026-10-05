/** Browsable concepts. Each entry points at the game whose guide teaches it. */

export const conceptGroups = [
  {
    id: "foundations",
    title: "Foundations",
    concepts: [
      { name: "Tokenization", gameId: "token-forge", note: "Tokens, subwords, vocabulary, and sequence length." },
      { name: "Embeddings", gameId: "attention-architect", note: "Token representations that attention combines. The vectors in Retrieval Lab are a separate toy." },
      { name: "Attention", gameId: "attention-architect", note: "Queries, keys, values, masks, and multiple heads as an educational calculation." },
      { name: "Context windows", gameId: "context-compression", note: "What must stay inside a token budget." },
      { name: "Prompting", gameId: "promptsmith", note: "Instructions, examples, and output constraints as a specification." },
      { name: "Fine-tuning", gameId: "gradient-playground", note: "Loss, overfitting, and parameter-efficient updates in a simulation." },
      { name: "Reasoning strategies", gameId: "reasoning-reactor", note: "Decomposition, checks, and decoding settings." },
      { name: "Alignment", gameId: "alignment-arena", note: "Preferences, trade-offs, and the limits of a single score." },
    ],
  },
  {
    id: "systems",
    title: "Systems",
    concepts: [
      { name: "Latency", gameId: "ship-it-simulator", note: "How long a call takes, and which lever moves it." },
      { name: "Cost", gameId: "ship-it-simulator", note: "Token spend and routing. Exercise prices are not vendor rates." },
      { name: "Retrieval", gameId: "retrieval-lab", note: "Chunks, ranking, precision, and recall." },
      { name: "Agents", gameId: "agent-architect", note: "Tools, permissions, and when not to use a loop." },
      { name: "Routing", gameId: "system-composer", note: "Sending a request to the component the requirement needs." },
      { name: "Verification", gameId: "system-composer", note: "A check that is not the model's confidence." },
      { name: "Caching", gameId: "ship-it-simulator", note: "Reusing a result, and the staleness that comes with it." },
      { name: "Observability", gameId: "prodops-gauntlet", note: "The signals that make a change explainable." },
    ],
  },
  {
    id: "production",
    title: "Production",
    concepts: [
      { name: "Reliability", gameId: "ship-it-simulator", note: "Timeouts, capped retries, and fallbacks." },
      { name: "Evaluation", gameId: "prodops-gauntlet", note: "A measurement you can rerun after a prompt or model change." },
      { name: "Monitoring", gameId: "prodops-gauntlet", note: "Cost, errors, and quality signals on an incident card." },
      { name: "Incident response", gameId: "prodops-gauntlet", note: "Detect, diagnose, mitigate, verify, document, prevent." },
      { name: "Safety", gameId: "alignment-arena", note: "Harm, over-refusal, and value disagreement. Foundry applies the same idea to a brief." },
      { name: "Compliance", gameId: "prodops-gauntlet", note: "What an audit needs, and what a log must not copy." },
    ],
  },
] as const;
