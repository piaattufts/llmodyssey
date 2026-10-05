import { foundryArenaOrientation } from "../orientation/games.ts";
import type { GameDefinition } from "../../src/game-engine/schema.ts";

const scoreRule =
  "Points are proportional to the rubric. A criterion is covered when a selected option lists it and no selected option misses it. Reflection length and a completed self-rating are their own criteria. 10 points means every criterion is met. There is not a single hidden architecture. Each hint subtracts 1 point from the round score, to a floor of 0.";

const reflection = { id: "reflection", label: "Reflection names a tradeoff", points: 1 };
const selfCheck = { id: "self-assessment", label: "Self-assessment completed", points: 1 };

const foundryArena: GameDefinition = {
  id: "foundry-arena",
  status: "prototype",
  title: "Foundry Arena",
  tier: 3,
  order: 13,
  summary: "Design a constrained LLM system on an industry, healthcare, robotics, ethics, education, or sandbox brief.",
  purpose: "Ask learners to combine earlier ideas when the brief no longer has one labeled answer.",
  whyItMatters: "Production briefs arrive as constraints. The work is to show which constraint each part of the design carries, and which tradeoff you accept.",
  learningObjectives: [
    "Translate a written constraint into a design choice that covers it.",
    "Reject a choice that misses a constraint even if it is more capable on another axis.",
    "Write a reflection that names a tradeoff in the design you actually selected.",
    "Complete a self-assessment against the same rubric the game uses.",
  ],
  concepts: ["System design", "Constraints", "Tradeoffs", "Reflection", "Rubric"],
  bloomLevels: ["analyze", "evaluate", "create"],
  prerequisites: [],
  estimatedMinutes: 40,
  difficulty: "capstone",
  masteryThreshold: 70,
  misconception: "A fluent architecture diagram is not yet a design until each constraint is either covered or explicitly declined.",
  reflectionPrompt: "Which constraint was most in tension with answer quality, and what did your design give up?",
  workedExample: {
    title: "Reading a Foundry rubric",
    steps: [
      "Read the constraints before the options.",
      "For each decision, pick an option whose covers include the constraint you are worried about, and whose misses list does not cancel it.",
      "Write a reflection that names one tradeoff in those selections. Length is checked; a particular sentence is not.",
      "Rate yourself on each criterion. The rating is recorded. It does not secretly change the coverage score, but leaving it blank does.",
    ],
  },
  furtherReadingIds: ["huyen2022dmls", "bommasani2022foundation", "bloom1968mastery"],
  implementation: {
    type: "deterministic-simulation",
    label: "Constraint-coverage capstone",
    whatIsReal: "Coverage is computed from the covers and misses on the options you select, plus reflection length and whether every self-rating is filled in.",
    whatIsSimulated: "No system is deployed, and the rubric is not a claim that one architecture is universally correct.",
  },
  orientation: foundryArenaOrientation,
  rounds: [
    {
      id: "industry",
      title: "Industry · A support desk with a cost cap",
      concept: "Enterprise constraints",
      learnerTask: "Cover cost, grounding, and escalation for a customer-support assistant.",
      expectedReasoning: "The brief caps monthly spend, requires answers from the policy manual, and requires a human when the customer asks for a refund above $200.",
      scenario: "A regional retailer wants a support assistant. Monthly model spend must stay predictable. Answers about returns must quote the manual. Refunds above $200 go to a person. You do not have to pick a vendor.",
      hints: [
        "A giant model on every call misses the cost constraint in this brief.",
        "The manual has to be retrieved, not remembered.",
        "The high-value refund path is an escalation option, not a bigger model.",
      ],
      scoringRule: scoreRule,
      explanation: "Industry briefs often look like model selection problems and turn out to be routing, retrieval, and escalation problems. Several combinations can cover the three criteria.",
      feedbackCorrect: "Cost, grounding, and escalation are all covered by the options you selected.",
      feedbackIncorrect: "At least one of cost, grounding, or escalation is uncovered or explicitly missed.",
      interaction: {
        type: "foundry",
        pathId: "industry",
        prompt: "Choose one option in each decision, then reflect.",
        constraints: ["Predictable model spend", "Return answers quote the manual", "Refunds above $200 reach a person"],
        requiresProblemStatement: false,
        minProblemChars: 0,
        decisions: [
          {
            id: "route",
            prompt: "How do ordinary questions get a model?",
            options: [
              { id: "router", label: "Route repeats to a cache and a small model", detail: "Keeps spend predictable.", covers: ["cost"], misses: [] },
              { id: "giant", label: "Send every call to the largest model", detail: "Spend tracks traffic with no cap.", covers: [], misses: ["cost"] },
            ],
          },
          {
            id: "ground",
            prompt: "Where do return answers come from?",
            options: [
              { id: "manual", label: "Retrieve the return manual and cite the section", detail: "The answer can be checked.", covers: ["grounding"], misses: [] },
              { id: "memory", label: "Let the model recall store policy from training", detail: "No section to audit.", covers: [], misses: ["grounding"] },
            ],
          },
          {
            id: "human",
            prompt: "What happens above $200?",
            options: [
              { id: "escalate", label: "Open a ticket for a person", detail: "The model stops.", covers: ["escalation"], misses: [] },
              { id: "auto", label: "Let the model issue the refund", detail: "No person in the path.", covers: [], misses: ["escalation"] },
            ],
          },
        ],
        rubric: [
          { id: "cost", label: "Spend stays predictable", points: 2 },
          { id: "grounding", label: "Return answers are grounded in the manual", points: 2 },
          { id: "escalation", label: "High-value refunds reach a person", points: 2 },
          reflection,
          selfCheck,
        ],
        reflectionMinChars: 80,
      },
    },
    {
      id: "healthcare",
      title: "Healthcare · A clinic note assistant",
      concept: "Privacy and escalation",
      learnerTask: "Cover privacy, grounding, and escalation for a note-drafting assistant.",
      expectedReasoning: "Clinical text stays in an approved environment. Drafts cite the chart. Medication changes require a clinician.",
      scenario: "A clinic wants help drafting visit notes. Notes contain health information. The assistant may suggest wording. It may not change a medication, and it may not send the note to a public model API.",
      hints: [
        "A public API misses the privacy constraint even if the prose is better.",
        "The chart is the source for grounding.",
        "Medication changes are the escalation, not a tool the model should call.",
      ],
      scoringRule: scoreRule,
      explanation: "This is a design exercise, not a clinical device. The rubric checks whether the design keeps health information in bounds and keeps a clinician on medication changes.",
      feedbackCorrect: "Privacy, chart grounding, and clinician escalation are covered.",
      feedbackIncorrect: "A public API or an automatic medication change misses a required constraint.",
      interaction: {
        type: "foundry",
        pathId: "healthcare",
        prompt: "Design the note assistant within the clinic's constraints.",
        constraints: ["Health information stays in an approved environment", "Wording is grounded in the chart", "Medication changes require a clinician"],
        requiresProblemStatement: false,
        minProblemChars: 0,
        decisions: [
          {
            id: "placement",
            prompt: "Where does the model run?",
            options: [
              { id: "approved", label: "An environment the clinic has already approved", detail: "The note does not leave that boundary.", covers: ["privacy"], misses: [] },
              { id: "public", label: "A public model API", detail: "The note is sent off-site.", covers: [], misses: ["privacy"] },
            ],
          },
          {
            id: "source",
            prompt: "What may the draft rely on?",
            options: [
              { id: "chart", label: "Only passages retrieved from this chart", detail: "The clinician can see the source.", covers: ["grounding"], misses: [] },
              { id: "general", label: "General medical knowledge from the model", detail: "No chart passage is required.", covers: [], misses: ["grounding"] },
            ],
          },
          {
            id: "meds",
            prompt: "Who changes a medication?",
            options: [
              { id: "clinician", label: "The draft stops and asks the clinician", detail: "No write to the medication list.", covers: ["escalation"], misses: [] },
              { id: "auto", label: "The model updates the medication list", detail: "A write without a person.", covers: [], misses: ["escalation"] },
            ],
          },
        ],
        rubric: [
          { id: "privacy", label: "Health information stays in an approved environment", points: 2 },
          { id: "grounding", label: "Drafts are grounded in the chart", points: 2 },
          { id: "escalation", label: "Medication changes require a clinician", points: 2 },
          reflection,
          selfCheck,
        ],
        reflectionMinChars: 80,
      },
    },
    {
      id: "robotics",
      title: "Robotics · A lab arm that may not guess",
      concept: "Tool use under physical constraints",
      learnerTask: "Cover perception, limits, and a stop for a teaching arm.",
      expectedReasoning: "The arm needs a perception tool, a workspace limit, and a stop when confidence is low. Free-form motion from the language model misses the limit.",
      scenario: "A teaching lab has a small arm that may pick up blocks inside a marked tray. It must stop rather than reach outside the tray. Language can name a block. It cannot be the only source of position.",
      hints: [
        "Position should come from a sensor, not from the sentence alone.",
        "The tray is a hard workspace limit.",
        "Low confidence should stop the arm and ask, not improvise a reach.",
      ],
      scoringRule: scoreRule,
      explanation: "An embodied tool is still a tool with permissions. The language model does not become a controller by being fluent about blocks.",
      feedbackCorrect: "Perception, the tray limit, and a stop are all covered.",
      feedbackIncorrect: "Language-only motion misses the workspace limit or the need for a sensor.",
      interaction: {
        type: "foundry",
        pathId: "robotics",
        prompt: "Choose how language is allowed to move the arm.",
        constraints: ["Positions come from a sensor", "Motion stays inside the tray", "Low confidence stops and asks"],
        requiresProblemStatement: false,
        minProblemChars: 0,
        decisions: [
          {
            id: "sense",
            prompt: "Where does position come from?",
            options: [
              { id: "camera", label: "A camera localizes the block", detail: "Language only names which block.", covers: ["perception"], misses: [] },
              { id: "guess", label: "The model guesses coordinates from the sentence", detail: "No sensor.", covers: [], misses: ["perception"] },
            ],
          },
          {
            id: "limit",
            prompt: "What enforces the tray?",
            options: [
              { id: "geofence", label: "A workspace limit rejects out-of-tray targets", detail: "The limit is outside the model.", covers: ["limits"], misses: [] },
              { id: "prompt", label: "The prompt says please stay in the tray", detail: "No enforcement.", covers: [], misses: ["limits"] },
            ],
          },
          {
            id: "stop",
            prompt: "What if the camera is unsure?",
            options: [
              { id: "halt", label: "Stop and ask the student", detail: "No improvised reach.", covers: ["stop"], misses: [] },
              { id: "try", label: "Attempt the reach anyway", detail: "Acts under uncertainty.", covers: [], misses: ["stop"] },
            ],
          },
        ],
        rubric: [
          { id: "perception", label: "Position comes from a sensor", points: 2 },
          { id: "limits", label: "Motion is limited to the tray", points: 2 },
          { id: "stop", label: "Low confidence stops the arm", points: 2 },
          reflection,
          selfCheck,
        ],
        reflectionMinChars: 80,
      },
    },
    {
      id: "ethics",
      title: "Ethics · A hiring-screener review",
      concept: "Limits on automated decisions",
      learnerTask: "Cover human decision, audit, and a ban on proxy attributes.",
      expectedReasoning: "The model may summarize applications. It may not rank people as hire or no-hire. The summary must be auditable, and proxy attributes such as name and photo stay out.",
      scenario: "A company asks for an assistant that “screens resumes.” Your design may help a recruiter read. It may not be the decision. The review board wants an audit trail and wants names and photos excluded from the model input.",
      hints: [
        "A score that says hire or no-hire is the decision. The brief does not allow that.",
        "Audit means a person can see what text the model received.",
        "Stripping names and photos is the proxy control.",
      ],
      scoringRule: scoreRule,
      explanation: "The exercise does not declare a universal hiring system. It checks whether this brief's three limits are actually implemented in the choices.",
      feedbackCorrect: "A person decides, the input can be audited, and the named proxies are removed.",
      feedbackIncorrect: "An automatic hire/no-hire label misses the human-decision constraint.",
      interaction: {
        type: "foundry",
        pathId: "ethics",
        prompt: "Design the resume tool inside the review board's limits.",
        constraints: ["A person makes the hiring decision", "The model input can be audited", "Names and photos are not model inputs"],
        requiresProblemStatement: false,
        minProblemChars: 0,
        decisions: [
          {
            id: "decision",
            prompt: "What does the model output?",
            options: [
              { id: "summary", label: "A summary the recruiter must still judge", detail: "No hire label.", covers: ["human"], misses: [] },
              { id: "score", label: "A hire or no-hire score", detail: "The model is the decision.", covers: [], misses: ["human"] },
            ],
          },
          {
            id: "audit",
            prompt: "What is retained for review?",
            options: [
              { id: "log", label: "The redacted text that was actually sent", detail: "A reviewer can see the input.", covers: ["audit"], misses: [] },
              { id: "none", label: "Nothing", detail: "The decision cannot be reconstructed.", covers: [], misses: ["audit"] },
            ],
          },
          {
            id: "proxy",
            prompt: "What is removed before the call?",
            options: [
              { id: "strip", label: "Names, photos, and email handles", detail: "Those fields never reach the model.", covers: ["proxies"], misses: [] },
              { id: "keep", label: "The full PDF, including the photo", detail: "Proxies stay in the input.", covers: [], misses: ["proxies"] },
            ],
          },
        ],
        rubric: [
          { id: "human", label: "A person makes the hiring decision", points: 2 },
          { id: "audit", label: "The model input can be audited", points: 2 },
          { id: "proxies", label: "Names and photos are excluded", points: 2 },
          reflection,
          selfCheck,
        ],
        reflectionMinChars: 80,
      },
    },
    {
      id: "education",
      title: "Education · A tutor that does not hand over the answer",
      concept: "Learning constraints",
      learnerTask: "Cover hints instead of answers, grounding in the course materials, and instructor visibility.",
      expectedReasoning: "The tutor gives a hint and a check question. It quotes the course notes. The instructor can see usage without seeing a hidden chain-of-thought dump.",
      scenario: "An introductory course wants a tutor for homework. Faculty do not want final answers posted. Explanations must come from the course notes. Faculty want a weekly count of topics asked, not a transcript of every student sentence.",
      hints: [
        "Pasting the solution misses the hint constraint.",
        "Course notes are the grounding source.",
        "Topic counts are the visibility option that does not archive every sentence.",
      ],
      scoringRule: scoreRule,
      explanation: "An educational system has learning constraints that are easy to violate with a more helpful model. Helpfulness is not the objective in this brief.",
      feedbackCorrect: "Hints, course grounding, and aggregate visibility are covered.",
      feedbackIncorrect: "A full-solution mode misses the faculty constraint even though students would rate it as helpful.",
      interaction: {
        type: "foundry",
        pathId: "education",
        prompt: "Design the tutor the faculty actually asked for.",
        constraints: ["No final answers", "Explanations come from course notes", "Faculty see topic counts, not full transcripts"],
        requiresProblemStatement: false,
        minProblemChars: 0,
        decisions: [
          {
            id: "help",
            prompt: "What may the tutor show?",
            options: [
              { id: "hint", label: "A hint and a check question", detail: "The student still does the step.", covers: ["hints"], misses: [] },
              { id: "answer", label: "The final answer", detail: "The homework is completed by the model.", covers: [], misses: ["hints"] },
            ],
          },
          {
            id: "source",
            prompt: "What is the tutor allowed to quote?",
            options: [
              { id: "notes", label: "The course notes for this week", detail: "A citation the instructor recognizes.", covers: ["grounding"], misses: [] },
              { id: "web", label: "Any page on the web", detail: "Not the course.", covers: [], misses: ["grounding"] },
            ],
          },
          {
            id: "visibility",
            prompt: "What does faculty see?",
            options: [
              { id: "counts", label: "Weekly topic counts", detail: "No full transcript.", covers: ["visibility"], misses: [] },
              { id: "transcripts", label: "Every student sentence", detail: "More data than the brief allows.", covers: [], misses: ["visibility"] },
            ],
          },
        ],
        rubric: [
          { id: "hints", label: "The tutor withholds final answers", points: 2 },
          { id: "grounding", label: "Explanations come from course notes", points: 2 },
          { id: "visibility", label: "Faculty see topic counts rather than full transcripts", points: 2 },
          reflection,
          selfCheck,
        ],
        reflectionMinChars: 80,
      },
    },
    {
      id: "sandbox",
      title: "Sandbox · Your own brief",
      concept: "Framing a problem",
      learnerTask: "Write a brief, then cover grounding, a limit, and an operator signal. There is no hidden correct domain.",
      expectedReasoning: "The sandbox still requires a specific problem statement and three structural choices. It does not require a particular industry.",
      scenario: "Name a real task you would not want a model to handle unconstrained. Then choose how it is grounded, what it is forbidden to do, and how an operator would notice a failure.",
      hints: [
        "The problem statement has to name the user and the action. A single noun is not enough.",
        "Grounding, a limit, and a signal are the three structural choices.",
        "The option that says “the model will just know” misses grounding.",
      ],
      scoringRule: scoreRule,
      explanation: "Sandbox mode is still a rubric. It checks that you framed a problem and covered three structural concerns. It does not score creativity against a secret ideal system.",
      feedbackCorrect: "The brief is specific, and grounding, a limit, and an operator signal are covered.",
      feedbackIncorrect: "Either the problem statement is too short, or one of the three structural concerns is missed.",
      interaction: {
        type: "foundry",
        pathId: "sandbox",
        prompt: "Write the brief, then make the three structural choices.",
        constraints: ["A specific user and action", "A grounding source", "A hard limit", "A way to notice failure"],
        requiresProblemStatement: true,
        minProblemChars: 80,
        decisions: [
          {
            id: "ground",
            prompt: "What is the model allowed to rely on?",
            options: [
              { id: "source", label: "A named source you can show later", detail: "A document, tool result, or dataset.", covers: ["grounding"], misses: [] },
              { id: "know", label: "Whatever the model already knows", detail: "No source to inspect.", covers: [], misses: ["grounding"] },
            ],
          },
          {
            id: "limit",
            prompt: "What is it forbidden to do?",
            options: [
              { id: "bound", label: "A named action it must not take", detail: "For example, it must not send the email.", covers: ["limit"], misses: [] },
              { id: "open", label: "Nothing in particular", detail: "No limit.", covers: [], misses: ["limit"] },
            ],
          },
          {
            id: "signal",
            prompt: "How would an operator notice a failure?",
            options: [
              { id: "trace", label: "A log of the source and the decision", detail: "Someone can review it.", covers: ["signal"], misses: [] },
              { id: "silent", label: "They would not", detail: "Failures stay invisible.", covers: [], misses: ["signal"] },
            ],
          },
        ],
        rubric: [
          { id: "problem-statement", label: "The brief names a user and an action", points: 2 },
          { id: "grounding", label: "A grounding source is named", points: 2 },
          { id: "limit", label: "A hard limit is named", points: 2 },
          { id: "signal", label: "An operator can notice failure", points: 2 },
          reflection,
          selfCheck,
        ],
        reflectionMinChars: 80,
      },
    },
  ],
};

export default foundryArena;
