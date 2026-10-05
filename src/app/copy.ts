export const tierCopy: Record<1 | 2 | 3, { name: string; bloom: string; goal: string }> = {
  1: {
    name: "Cognitive Core",
    bloom: "Remember, understand, apply",
    goal: "Make tokenization, attention, context, prompting, training dynamics, reasoning workflows, and alignment tradeoffs concrete.",
  },
  2: {
    name: "Systems Forge",
    bloom: "Apply, analyze, evaluate",
    goal: "Judge serving, agents, retrieval, architecture, and operations when the constraint is a system rather than a single mechanism.",
  },
  3: {
    name: "Foundry Arena",
    bloom: "Analyze, evaluate, create",
    goal: "Assemble a constrained design and defend the tradeoff. There is not one hidden correct architecture.",
  },
};

export const tourSteps = [
  {
    id: 1,
    title: "What is LLM Odyssey?",
    path: "/demo",
    body: "LLM Odyssey is an open-source, browser-based learning environment. Students make engineering decisions about language-model systems and see the consequence immediately. No paid model API is required.",
  },
  {
    id: 2,
    title: "The three learning tiers",
    path: "/demo",
    body: "Cognitive Core isolates a mechanism. Systems Forge asks you to judge a system. Foundry Arena is a design brief with more than one defensible answer. The order is a teaching sequence, not a claim that every production system is built this way.",
  },
  {
    id: 3,
    title: "Token Forge orientation",
    path: "/demo/play/token-forge",
    body: "Every game starts with an orientation: why it exists, what you will do, how scoring works, and what the simulation is. Token Forge is the reference implementation of that pattern. You are not dropped into round 1.",
  },
  {
    id: 4,
    title: "One Token Forge round",
    path: "/demo/play/token-forge",
    body: "Start the game, then compare authored segmentations of the same text. The piece count is the token count in the exercise. The segmentations are illustrations, not a live vendor tokenizer.",
  },
  {
    id: 5,
    title: "Immediate feedback",
    path: "/demo/play/token-forge",
    body: "After you lock a round you see your decision, the result, why, what mattered, why the alternatives were weaker, and what a real system would require. Hints are learning support. Each one subtracts one point on that round.",
  },
  {
    id: 6,
    title: "Concept guide",
    path: "/demo/play/token-forge",
    body: "How this game works opens a guide with overview, scoring, concepts, examples, applications, pitfalls, and further reading. Opening it does not reset the round, the score, or your selection.",
  },
  {
    id: 7,
    title: "Progress and mastery",
    path: "/demo/progress",
    body: "Completion means the activity was finished. Performance is the score. The mastery threshold, usually 70%, is an instructional benchmark, not professional expertise. Transfer is whether a learner can explain a new case. Demo progress is a separate browser record.",
  },
  {
    id: 8,
    title: "Educator notes",
    path: "/demo/educator",
    body: "The educator guide explains objectives, prerequisites, Bloom levels, misconceptions, classroom use, and what a correct click does not prove. Each game page also has a For Educators section.",
  },
  {
    id: 9,
    title: "A Systems Forge example",
    path: "/demo/play/ship-it-simulator",
    body: "Ship-It Simulator is a playable prototype. Latency, retries, cache, and cost move because lever effects are added to a baseline. There is no cluster behind the page. Prototype status describes the software, not the importance of the topic.",
  },
  {
    id: 10,
    title: "Foundry Arena",
    path: "/demo/play/foundry-arena",
    body: "Foundry asks for a design under a brief: industry, healthcare, robotics, ethics, education, or a sandbox you write. The rubric is visible before you submit. There is not one official architecture.",
  },
  {
    id: 11,
    title: "Open-source reuse",
    path: "/demo",
    body: "The course content lives in content/games and content/teaching. You can assign one game or the whole path. After this site has loaded, the tour does not need an account, a secret, or a model API.",
  },
] as const;
