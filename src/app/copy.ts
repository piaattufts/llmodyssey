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
    title: "Tier structure",
    path: "/demo",
    body: "Odyssey is three tiers and thirteen games. Cognitive Core is mechanism. Systems Forge is production structure. Foundry Arena is a constrained design brief. Cards mark Token Forge as the reference implementation and the other games as prototypes. Plan on about one minute per step.",
  },
  {
    id: 2,
    title: "Open Token Forge",
    path: "/demo/play/token-forge",
    body: "Token Forge is the first game. The segmentations are precomputed illustrations. The counts and the dollar estimate are arithmetic on those pieces. Start the game when you are ready.",
  },
  {
    id: 3,
    title: "Immediate feedback",
    path: "/demo/play/token-forge",
    body: "Select a tokenizer family. The pieces, the count, and the estimated cost update before you lock the round. After you lock it, the score and the explanation appear immediately. You do not wait until the end of the game.",
  },
  {
    id: 4,
    title: "Scaffolded hints",
    path: "/demo/play/token-forge",
    body: "Hints open one at a time: a concept cue, then a direction, then a stronger explanation. Each hint subtracts one point from that round, and the penalty is printed. The third hint still does not paste the selected answer for you.",
  },
  {
    id: 5,
    title: "Progress",
    path: "/demo/progress",
    body: "The progress page is this browser’s demo record: scores, attempts, hints, time, and achievements. It is stored apart from a learner’s own record. Sample rows are loaded so the page is not empty during a talk.",
  },
  {
    id: 6,
    title: "Systems Forge",
    path: "/demo/play/ship-it-simulator",
    body: "Ship-It Simulator is a parameterized serving exercise. Latency, retries, cache, and cost move because lever effects are added to a baseline. There is no cluster behind the page.",
  },
  {
    id: 7,
    title: "Foundry Arena",
    path: "/demo/play/foundry-arena",
    body: "Foundry asks for a design under constraints: industry, healthcare, robotics, ethics, education, or a sandbox brief you write. The score is constraint coverage, a reflection, and a self-rating. It is not a single official architecture.",
  },
  {
    id: 8,
    title: "Educator dashboard",
    path: "/demo/educator",
    body: "Educator mode has no login. It lists objectives, Bloom levels, prerequisites, times, and assessments from the same content the games use. Export stays on this machine. Reset Classroom Demo restores the sample demo record.",
  },
  {
    id: 9,
    title: "Roadmap",
    path: "/demo",
    body: "This release does not pretend every game is equally finished. Token Forge is implemented. The other twelve are playable prototypes with real scores, hints, and local progress. A future game marked Planned would show its description only and could not be marked complete. After this page has loaded, the tour does not need Wi-Fi, an account, or an API key.",
  },
] as const;
