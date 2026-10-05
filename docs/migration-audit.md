# Migration audit

Source inspected: the Base44 export `llm-odyssey-0544b844.zip` (179 files, package name `base44-app`). The public GitHub repository was empty when the standalone app was first written. This audit is a feature classification of that export, not a claim that every sentence was copied.

The export’s client is `src/api/base44Client.js`, which imports `@base44/sdk`. Game completion writes `base44.entities.GameProgress`. That client, the Vite Base44 plugin, Stripe, and the generated entity files under `base44/entities/` are not dependencies of this repository.

## Runtime and platform

| Prototype feature | Status | What this repository does |
| --- | --- | --- |
| `@base44/sdk` client and `VITE_BASE44_APP_ID` | REMOVED | No Base44 package. `npm run dev` needs no platform id. |
| Base44 entity store (`GameProgress`, `InteractionLog`, `FeedbackSurvey`, `FoundrySolution`, and the rest) | REMOVED | Progress is IndexedDB with a localStorage fallback. |
| Auth layout, protected route, OAuth consent, user-not-registered page | REMOVED | No accounts. |
| Player name prompt | REMOVED | No name field. |
| Approved-instructor gate and research dashboard | REMOVED | `/educator` is open and reads this browser only. |
| REB application pages, completed REB form, institutional permission, email template | REMOVED | Not shipped. This repo does not claim an ethics approval. |
| Feedback survey with a separate contact record | REMOVED | No email capture. Optional research mode logs anonymous events only. |
| Foundry community board | REMOVED | No votes and no shared solutions. |
| Climate AI Studio page | REMOVED | The export’s page is a “Coming Soon” stub. |
| FIE paper pages and simulated-results page | OPTIONAL | Not part of the learner app. The citation is the arXiv record in `CITATION.cff`. |
| Stripe | REMOVED | Unused in the games. Not installed. |
| Anonymous `localStorage` session id | PRESERVED | Keys are `llmodyssey.sessionId` and `llmodyssey.demo.sessionId`. |
| Purple-to-cyan game identity | REIMPLEMENTED | Dark laboratory theme in `src/index.css`. The export’s default Tailwind tokens were neutral. |

## Games

The export registers twelve game pages plus Foundry paths. Home lists Token Forge through ProdOps Gauntlet, then Foundry. Retrieval Lab is titled “Knowledge Nexus” on the home card. Promptsmith is “Promptsmith’s Workshop.” This release uses the shorter titles from the course spec.

Tier 1 pages (`TokenForge.jsx`, `AttentionArchitect.jsx`, `ContextCompression.jsx`, `Promptsmith.jsx`, `GradientPlayground.jsx`, `ReasoningReactor.jsx`, `AlignmentArena.jsx`) each shuffle a pool of eight challenges and play five. Hints are a shared list, and each use subtracts one point. Tier 2 pages (`ShipItSimulator.jsx`, `AgentArchitect.jsx`, `RetrievalLab.jsx`, `SystemComposer.jsx`, `ProdOpsGauntlet.jsx`) use five fixed rounds. Foundry paths are separate pages, with a progress widget that expects five challenges per path. Education is present as `FoundryEducation.jsx`. The hub copy names industry, healthcare, robotics, and ethics and also links a sandbox.

| Prototype feature | Status | What this repository does |
| --- | --- | --- |
| Token Forge text types: English, code, Japanese, German, Spanish, mixed technical, Python, URL | REIMPLEMENTED | Rounds cover frequent English, code, a German compound, mixed script, and a cost clause. Round 1 uses the export’s sentence “The quick brown fox jumps over the lazy dog,” with BPE marked best, matching that exercise’s label. |
| Token Forge `tokenizeText` (3-character slices called BPE, 4-character slices called WordPiece, 2-character slices called SentencePiece, characters called Unigram) | REMOVED | It is not those algorithms. Segments here are authored and labeled as precomputed. Counts and cost are arithmetic on those pieces. |
| Attention as picking one or two named heads (syntax, semantic, positional, coreference) for sentences such as “The cat sat on the mat because it was comfortable” | REIMPLEMENTED | The same ideas are taught with computed scaled dot-product attention on toy vectors, so a heatmap is a calculation rather than a head name. |
| Context compression strategies: extractive, abstractive, key points, smart chunking, with legal, support, paper, meeting, docs, news, specs, and narrative sources | REIMPLEMENTED | Budget arithmetic on spans, including must-keep facts. The support-ticket and contract cases from the export are the teaching situation for round 1. |
| “Lost in the Middle” link in the compression page | PRESERVED | `content/references.ts` id `liu2023lost`, https://arxiv.org/abs/2307.03172 |
| Promptsmith technique cards | REIMPLEMENTED | Deterministic prompt cases. No model call. |
| Gradient Playground hyperparameter cards and a chart | REIMPLEMENTED | Curves come from the documented formula in `src/game-engine/models/loss-curve.ts`, not from a training job. |
| Reasoning Reactor strategy cards | REIMPLEMENTED | Checklist plus prewritten samples. Not hidden chain-of-thought. |
| Alignment Arena objective weights | REIMPLEMENTED | Weighted sum of authored helpfulness, safety, and factuality scores. No reward model is trained. |
| Ship-It rounds: e-commerce launch, traffic spike, incident, cost cut, global regions | REIMPLEMENTED | Lever simulation of latency, retries, cache, fallback, and cost. The cases are not a line copy of the five option tables. |
| Agent Architect, Retrieval Lab, System Composer, ProdOps Gauntlet rounds | REIMPLEMENTED | Checklists, toy retrieval math, block assembly, and authored incidents. |
| Foundry paths: Industry, Healthcare, Robotics, Ethics, Education, Sandbox | REIMPLEMENTED | One constraint-coverage brief per path. |
| Five challenges per Foundry path and community sharing | REMOVED | One brief per path. Sharing is future work. |
| Score out of 100 with partial credit from token-count distance, or 200 points per correct Ship-It card | IMPROVED | Every round is 10 points before a 1-point hint penalty. Mastery is 70 percent. The rule is printed on the round. |
| Random five-round draw from a pool of eight | IMPROVED | Rounds are fixed so a class sees the same exercise. |
| Concept guide component | PRESERVED | Opened from the game introduction and listed at `/guide`. |

## What was deliberately not copied

The export tells learners that the character slicer is BPE, WordPiece, SentencePiece, or Unigram, and one hint says “GPT-4 uses BPE.” This release keeps the text-type lesson and drops the slicer. A hint must not describe that function as a production tokenizer.

Pages that exist only to operate the Base44 study (REB form, contact email, instructor allow-list, community votes) are not recreated. Institutions that want a study use the optional research mode and their own review.
