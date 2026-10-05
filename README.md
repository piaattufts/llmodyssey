[![Launch LLM Odyssey](https://img.shields.io/badge/LAUNCH-LLM%20ODYSSEY-15803d?style=for-the-badge)](https://piaattufts.github.io/llmodyssey/)
[![GitHub Release](https://img.shields.io/github/v/release/piaattufts/llmodyssey?style=flat-square)](https://github.com/piaattufts/llmodyssey/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](https://github.com/piaattufts/llmodyssey/blob/main/LICENSE)
[![CI](https://github.com/piaattufts/llmodyssey/actions/workflows/ci.yml/badge.svg)](https://github.com/piaattufts/llmodyssey/actions/workflows/ci.yml)

# LLM Odyssey

**Learn LLM engineering through interactive games.**

LLM Odyssey is an open-source, browser-based educational platform that teaches Large Language Model engineering through 13 interactive learning experiences spanning foundational concepts, system design, and applied LLM engineering.

[Launch LLM Odyssey](https://piaattufts.github.io/llmodyssey/)
· [Educator Guide](https://piaattufts.github.io/llmodyssey/educator)
· [Demo](https://piaattufts.github.io/llmodyssey/demo)
· [GitHub Release](https://github.com/piaattufts/llmodyssey/releases/latest)

13 games · 3 learning tiers · Browser-based · No paid API required · Open source · Educator reusable

Token Forge is the reference implementation in v0.1.0. The remaining games are playable educational prototypes. Prototype status is shown on every game card and in the table below.

## Why LLM Odyssey?

Students can finish a machine learning course and still have little practice with the decisions that appear once a language model is part of a system. Those decisions include:

- tokenization
- attention
- context limitations
- prompting
- fine-tuning
- retrieval-augmented generation
- agent design
- alignment
- production deployment
- latency
- reliability
- cost
- monitoring

A lecture can name each of those topics. It is harder, on a slide, to show that a segmentation changed a bill, that two attention patterns can disagree, or that a retry loop multiplied a vendor invoice while the status page stayed green.

LLM Odyssey turns those situations into short exercises. Learners make an engineering choice and see an immediate result: a score, an explanation, and, where the round computes something, a number they can recompute. The platform is designed to support that kind of practice. It is not evidence, by itself, that the practice improves learning. A formal estimate of learning outcomes remains an empirical research question for anyone who studies a particular course.

## Start Here

### I am a student

Open **[Launch LLM Odyssey](https://piaattufts.github.io/llmodyssey/)** and begin with [Token Forge](https://piaattufts.github.io/llmodyssey/play/token-forge). It is the reference game in this release. You need a modern browser. You do not need an account or an API key.

### I am an educator

Open **[Educator Mode](https://piaattufts.github.io/llmodyssey/educator)**. You can inspect learning objectives, concepts, Bloom mapping, implementation status, expected time, and course-integration ideas. You do not have to assign all 13 games.

### I am demonstrating the project

Open **[Demo Mode](https://piaattufts.github.io/llmodyssey/demo)**. It is a short guided walkthrough on a separate sample record. It does not change a student’s own progress, and it does not call a model API.

### I am a developer

Local setup is in [Run locally](#run-locally) and [For developers](#for-developers), after the teaching sections.

## The learning journey

The course is three tiers. Early tasks ask students to inspect a mechanism. Later tasks ask them to judge a system against a constraint. The last task asks them to propose a design. The questions get more open because the earlier games have already made the parts visible.

| Tier | Games | Learning focus | Bloom emphasis |
| --- | --- | --- | --- |
| Cognitive Core | 1–7 | foundations | Remember, Understand, Apply |
| Systems Forge | 8–12 | system design and production | Apply, Analyze, Evaluate |
| Foundry Arena | 13 | synthesis | Analyze, Evaluate, Create |

Individual games also record their own Bloom labels. Those labels are the author’s classification of the task.

## The 13 games

| # | Game | Tier | What students learn | Status |
| --- | --- | --- | --- | --- |
| 1 | Token Forge | Cognitive Core | How subword segmentation changes token count and cost | Implemented |
| 2 | Attention Architect | Cognitive Core | How a tiny attention pattern chooses a token | Prototype |
| 3 | Context Compression | Cognitive Core | How to fit a needed fact inside a token budget | Prototype |
| 4 | Promptsmith | Cognitive Core | How prompting strategies trade quality against cost and failure | Prototype |
| 5 | Gradient Playground | Cognitive Core | How learning-rate and fine-tuning choices move a loss curve | Prototype |
| 6 | Reasoning Reactor | Cognitive Core | How a visible check-and-sample workflow is assembled | Prototype |
| 7 | Alignment Arena | Cognitive Core | How a rubric ranks helpfulness, safety, and factuality | Prototype |
| 8 | Ship-It Simulator | Systems Forge | How serving levers move latency, cost, and reliability | Prototype |
| 9 | Agent Architect | Systems Forge | How an agent loop limits tools, checks work, and stops | Prototype |
| 10 | Retrieval Lab | Systems Forge | How keyword, vector, and hybrid search change what is retrieved | Prototype |
| 11 | System Composer | Systems Forge | How grounding, safety, latency, and operations fit in one design | Prototype |
| 12 | ProdOps Gauntlet | Systems Forge | How to respond to cost, regression, drift, and audit cases | Prototype |
| 13 | Foundry Arena | Foundry Arena | How to design under a brief that has no single correct architecture | Prototype |

Prototype games are playable. Their scores are calculated. They are not reference implementations of equal maturity to Token Forge.

## Detailed game explanations

### Game 1 — Token Forge

**Students learn.** What a token is, how subword families segment the same string differently, and how token count relates to API cost.

**What they do.** They compare authored segmentations, read the pieces on the screen, and choose the segmentation that fits the round.

**Why it matters.** Model APIs bill and attend over tokens, not characters. A string that looks cheap in an editor can be expensive after segmentation.

**Example activity.** For a plain English sentence, compare a compact segmentation with one that splits common words into extra pieces, then read the token count and the estimated cost.

**Implementation status.** Implemented. This is the reference game in v0.1.0.

**Estimated time.** 20 minutes.

**Bloom level.** Remember, understand, apply.

### Game 2 — Attention Architect

**Students learn.** The roles of query, key, and value, and how a scaled dot-product plus softmax decides which token receives the weight.

**What they do.** They inspect a tiny, fully visible attention example and identify the token the pattern selects.

**Why it matters.** Attention is easier to talk about than to read. A small computed pattern shows that “the model looks at the important word” is a weighted choice, not a metaphor.

**Example activity.** Given a short token list and hand-written vectors, find the token with the highest attention weight.

**Implementation status.** Prototype. The arithmetic is live. The vectors are written for the lesson. This is not a transformer.

**Estimated time.** 25 minutes.

**Bloom level.** Understand, apply.

### Game 3 — Context Compression

**Students learn.** The difference between keeping a needed fact and merely shortening a passage, under a hard token budget.

**What they do.** They choose what to keep, summarize, or drop so the task still has the fact it needs.

**Why it matters.** A context window is a budget. Cutting tokens can also cut the sentence the answer depends on.

**Example activity.** Fit a source passage into a stated budget without dropping the required fact.

**Implementation status.** Prototype. Budget checks are calculated. Summary text in the exercise is written ahead of time.

**Estimated time.** 20 minutes.

**Bloom level.** Understand, apply.

### Game 4 — Promptsmith

**Students learn.** When a direct instruction, a role, a few examples, a structured output, or a decomposed task is the better fit.

**What they do.** They match a prompting strategy to a task and read the quality, token, and failure tradeoff printed for that choice.

**Why it matters.** Prompting is a design choice with a cost, not a magic phrase.

**Example activity.** Choose a strategy for a task that needs a predictable format, then read why a cheaper prompt can fail the format.

**Implementation status.** Prototype. The comparison is among authored strategies. No model is called.

**Estimated time.** 25 minutes.

**Bloom level.** Apply, analyze.

### Game 5 — Gradient Playground

**Students learn.** How learning rate, epochs, batch size, and full fine-tuning versus LoRA move training loss, validation loss, overfitting, and forgetting on a teaching model.

**What they do.** They set those controls and read the resulting curve.

**Why it matters.** Fine-tuning conversations often jump to a recipe. The curve is a way to see the failure mode before anyone rents a GPU.

**Example activity.** Compare a learning rate that settles with one that overshoots, using the documented loss formula.

**Implementation status.** Prototype. The chart uses an educational formula. No parameters are trained and no dataset is loaded.

**Estimated time.** 25 minutes.

**Bloom level.** Understand, apply, analyze.

### Game 6 — Reasoning Reactor

**Students learn.** How to assemble a visible workflow: break a problem down, check a step, draw more than one sample, and choose a temperature.

**What they do.** They build that workflow from the pieces on the screen and read what the checklist scores.

**Why it matters.** A displayed step is not the same thing as a model’s hidden computation. Students practice the workflow they can actually specify.

**Example activity.** Add a verification step to a workflow that otherwise accepts the first sample.

**Implementation status.** Prototype. Scoring uses the checklist and a written sample table. Nothing is sampled from a live model.

**Estimated time.** 25 minutes.

**Bloom level.** Apply, analyze.

### Game 7 — Alignment Arena

**Students learn.** How a weighted rubric for helpfulness, safety, and factuality changes which reply ranks first.

**What they do.** They rank replies and see the weighted result of the printed scores.

**Why it matters.** Alignment choices are tradeoffs. A reply can be helpful and still fail a safety or factuality weight the instructor cares about.

**Example activity.** Rank two replies when safety is weighted more heavily than fluency.

**Implementation status.** Prototype. The sum is live. The scores and replies are written for the case. No reward model is trained.

**Estimated time.** 25 minutes.

**Bloom level.** Understand, analyze, evaluate.

### Game 8 — Ship-It Simulator

**Students learn.** How caching, retries, backoff, fallback models, and replicas move latency, cost, and reliability together.

**What they do.** They set serving levers against a latency, cost, and reliability target.

**Why it matters.** A demo that looks fine in a notebook can miss a service objective once retries and cache misses are counted.

**Example activity.** Lower tail latency without letting retries multiply the bill.

**Implementation status.** Prototype. The numbers are a baseline plus authored lever effects. There is no cluster behind the page.

**Estimated time.** 25 minutes.

**Bloom level.** Apply, analyze, evaluate.

### Game 9 — Agent Architect

**Students learn.** That an agent is a loop with tools, permissions, checks, and a stop condition.

**What they do.** They choose which tools are allowed, what gets checked, and when a person should take over.

**Why it matters.** Turning on every tool is not a design. The harm is often a permission the task never needed.

**Example activity.** Remove a tool the task does not need and add a check before a write action.

**Implementation status.** Prototype. Needed and harmful flags are scored locally. No tool is executed.

**Estimated time.** 25 minutes.

**Bloom level.** Apply, analyze, evaluate.

### Game 10 — Retrieval Lab

**Students learn.** How chunking, keyword search, vector search, hybrid search, and a metadata filter change precision, recall, and grounding.

**What they do.** They compare those methods on a tiny corpus they can read.

**Why it matters.** A generated answer cannot cite a passage the retriever never returned.

**Example activity.** Compare keyword and hybrid search on a question whose answer is in a short passage with different wording.

**Implementation status.** Prototype. Cosine, overlap, precision, and recall are computed. The vectors are small teaching examples, not the output of an embedding model.

**Estimated time.** 30 minutes.

**Bloom level.** Apply, analyze, evaluate.

### Game 11 — System Composer

**Students learn.** How to place retrieval, guardrails, verification, caching, and tool use in one small design.

**What they do.** They assemble blocks so the design covers the constraints named in the round.

**Why it matters.** A technique that worked in an earlier game can still leave a hole when the system has to ground, refuse, and stay within a latency budget at once.

**Example activity.** Add a grounding step to a design that otherwise answers from the model alone.

**Implementation status.** Prototype. Coverage is calculated from the blocks the student selects. No service is deployed.

**Estimated time.** 25 minutes.

**Bloom level.** Analyze, evaluate.

### Game 12 — ProdOps Gauntlet

**Students learn.** How to respond when cost spikes, a prompt regresses, behavior drifts, or an audit asks what the system did.

**What they do.** They choose an operational action and read the labeled consequence.

**Why it matters.** Monitoring and incident response are part of LLM engineering, not a separate course that starts after the demo works.

**Example activity.** Choose a response to a cost spike that does not hide the regression that caused it.

**Implementation status.** Prototype. The comparison is among written responses. The metrics are part of the case, not a live dashboard.

**Estimated time.** 25 minutes.

**Bloom level.** Analyze, evaluate.

### Game 13 — Foundry Arena

**Students learn.** How to combine earlier ideas when the brief no longer has one labeled answer.

**What they do.** They design against a constraint set for industry, healthcare, robotics, ethics, education, or a sandbox brief, then name a tradeoff.

**Why it matters.** Professional judgment starts where the exercise stops telling the student which card is best.

**Example activity.** Cover grounding, a human escalation path, and a cost limit in one short design, then write the tradeoff the design accepts.

**Implementation status.** Prototype. The score is constraint coverage, a reflection, and a completed self-rating. It is not a universal design grade.

**Estimated time.** 40 minutes.

**Bloom level.** Analyze, evaluate, create.

## Token Forge — reference implementation

Token Forge is the game to assign when you want the full documented loop. Students work through five cases:

1. Simple English.
2. Python-like code, including a function signature.
3. A morphologically complex German word.
4. Mixed-script text, with Latin and Japanese characters in one string.
5. A legal clause under a cost constraint.

On each case they compare:

- BPE
- WordPiece
- SentencePiece
- Unigram

They see visual token segmentation, token counts, and a cost estimate computed from the pieces on the screen. Feedback explains why a segmentation was a better or worse fit for that text. Hints open one at a time: a concept cue, then a direction, then a stronger explanation. Each hint subtracts one point from that round, down to zero. The game keeps the best score, compares it with a 70% mastery line, asks for a short reflection, and recommends a next game. Progress is saved in the browser.

The built-in segmentations are authored educational illustrations. Token counts and the displayed cost are arithmetic on those illustrations. Token Forge does not run a production tokenizer, and it does not claim that the pieces match a vendor’s current vocabulary.

The same game is also available at [games/token-forge](https://piaattufts.github.io/llmodyssey/games/token-forge).

## Pedagogical design

### Immediate formative feedback

Students learn a decision better when the consequence arrives while the choice is still in view. Odyssey scores a round as soon as the student locks it, and the explanation says what was stronger or weaker about that choice. In Token Forge, the pieces, the count, and the cost are visible before the round is locked. After it is locked, the score and the reason appear immediately.

### Scaffolded hints

Hints are graduated. The first hint names the idea. The second points at what to inspect. The third explains more of the pattern without pasting the selected answer. Each revealed hint costs one point on that round. The penalty is printed. Students can retry, and the best score is the one that is kept.

### Progressive difficulty

Rounds inside a game start with a smaller case and add a complication: code-like text, morphology, another script, or a budget. Across the course, the task itself opens up, from reading a mechanism to judging a system to proposing a design.

### Worked examples

Each game opens with its objectives, a misconception worth watching, a worked example, and a concept guide with further reading. The worked example shows the kind of step the round expects. It does not reveal later answers.

### Authentic engineering scenarios

The cases use constraints that show up in practice: a price per million tokens, a context budget, a latency target, a tool permission, a passage that must be retrieved, an audit question. The numbers are teaching numbers. The constraint is the point.

### Mastery-oriented retries

The default mastery threshold is 70%. Letter bands are A at 90 and above, B from 80 to 89, C from 70 to 79, D from 60 to 69, and F below 60. A student can finish a game below 70%. That completion is stored. It is not labeled mastery. Retrying a round replaces a score only when the new score is higher.

### Reflection

After the rounds, the student is asked to say what they would measure or decide in a real setting. The prompt is there so the choice is not only a click. Skipping the reflection is allowed. Saving it stores the text on that device.

### Tiered progression

Cognitive Core makes the mechanisms inspectable. Systems Forge asks whether a design meets cost, latency, grounding, and failure constraints. Foundry Arena asks for a design and a named tradeoff. Later tiers can stay locked until earlier games are mastered. Students can turn on Practice ahead. The listed prerequisites remain visible either way.

## How an educator can use LLM Odyssey

You can use one game, one tier, or the whole sequence. The public site needs no installation.

### 1. Lecture companion

Teach the idea in class, then assign the matching game. A tokenization lecture is followed by Token Forge. Students arrive at the next meeting having compared segmentations, not only having heard the vocabulary.

### 2. Lab exercise

Students complete one or more games in a scheduled lab. Ask them to export the progress CSV from the Progress page before they leave. The file contains the record on that browser.

### 3. Independent module

Students complete a tier on their own, with the optional pre-check and post-check if you want a before-and-after snapshot. Those items are a classroom check. They are not a validated instrument.

### 4. Capstone / design activity

Students use Foundry Arena to bring several earlier ideas into one brief. Grade the constraints they covered and the tradeoff they named. Do not treat the score as the only professional judgment. The exercise says so on the page.

## Example course plan

This six-week sequence is an example. Reorder it, or assign a single week.

| Week | Games |
| --- | --- |
| 1 | Token Forge and Attention Architect |
| 2 | Context Compression and Promptsmith |
| 3 | Gradient Playground, Reasoning Reactor, and Alignment Arena |
| 4 | Retrieval Lab and Agent Architect |
| 5 | Ship-It Simulator, System Composer, and ProdOps Gauntlet |
| 6 | Foundry Arena |

## What students need

For the hosted site:

- a modern browser
- no installation
- no API key
- no account

For a local run:

- Node.js 22
- npm

Supabase is not required. A paid model API is not required.

## Run LLM Odyssey online

Open:

https://piaattufts.github.io/llmodyssey/

No installation is required.

Demo:

https://piaattufts.github.io/llmodyssey/demo

Educator guide:

https://piaattufts.github.io/llmodyssey/educator

Token Forge:

https://piaattufts.github.io/llmodyssey/play/token-forge

Direct links such as `/demo`, `/educator`, `/progress`, `/play/token-forge`, and `/games/token-forge` load the app. An unknown path shows a page-not-found message inside the app.

## Run locally

```bash
git clone https://github.com/piaattufts/llmodyssey.git
cd llmodyssey
npm install
npm run dev
```

This launches the same educational platform on your machine. Vite prints a local URL, usually http://localhost:5173/. Progress stays in that browser. The local site is served from `/`, not from `/llmodyssey/`.

## Student progress

The default record stores:

- a random session ID
- games started
- games completed
- score
- attempts
- rounds
- hints
- mastery
- timestamps

In the default local mode, that record stays in the browser, using IndexedDB with localStorage as a fallback. Refresh does not erase it. The Progress page can export CSV and JSON. **Reset progress** asks for confirmation, then deletes the record for the mode you are in. Resetting the learner record does not reset the demo record.

## Data and privacy

The public educational site is local-first. It does not require a backend, an account, a paid model API, or a research upload. Playing the public site does not make someone a research participant.

Research mode is optional and off unless a build sets `VITE_RESEARCH_MODE=true`. When it is on, the app asks whether to keep anonymous events. Declining leaves the games playable. Consent in that dialog is not an ethics approval. This repository does not claim that every deployment is covered by an existing institutional review, and an approval from another institution does not travel with the code. Original development and a Winter 2026 classroom deployment were conducted while the author was at Durham College. That is history. It is not an approval for your course.

## Simulation versus real execution

| Game | Current implementation | Educational abstraction |
| --- | --- | --- |
| Token Forge | Implemented. Counts, efficiency, and cost are computed from the pieces on the screen. | The segmentations are precomputed illustrations. They are not a live production tokenizer. |
| Attention Architect | Prototype. Scaled dot-product and softmax run on the given vectors. | The vectors are hand-written. This is not a transformer. |
| Context Compression | Prototype. Budget, relevance, and must-keep checks are calculated. | Abstractive summary text is written ahead of time. |
| Promptsmith | Prototype. The comparison among authored strategies is scored. | No model response is requested. |
| Gradient Playground | Prototype. A documented loss formula draws the chart. | No training run, parameters, or data. |
| Reasoning Reactor | Prototype. A checklist and a sample table are scored. | The strings were written ahead of time. Nothing is sampled live. |
| Alignment Arena | Prototype. A weighted sum of printed scores is calculated. | No reward model and no live raters. |
| Ship-It Simulator | Prototype. Lever effects are added to a baseline. | No cluster, queue, or live API. |
| Agent Architect | Prototype. Needed and harmful flags are scored. | No tool is called. |
| Retrieval Lab | Prototype. Cosine, overlap, hybrid score, precision, and recall are computed. | Vectors are small examples. There is no neural embedding model. |
| System Composer | Prototype. Sums and set coverage are calculated. | Units are teaching numbers. Nothing is deployed. |
| ProdOps Gauntlet | Prototype. Written responses are compared. | The metrics belong to the case. There is no live monitor. |
| Foundry Arena | Prototype. Coverage, reflection length, and completed self-ratings are scored. | The rubric is not a universal design. Nothing is deployed. |

## Customizing for a course

Instructors edit data, then rebuild.

| What you want to change | Where it lives |
| --- | --- |
| Challenge text, hints, objectives, scenarios | `content/games/<game-id>.ts` |
| Mastery threshold, enabled games, order, institution name, logo | `config/odyssey.config.ts` |
| Optional pre/post items | `content/assessments/index.ts` |
| Tier descriptions on the home page | `src/app/copy.ts` |

`config/odyssey.config.ts` already sets the course-wide mastery line and the game list. A tokenizer-only section looks like this:

```ts
masteryThreshold: 70,
enabledGames: ["token-forge"],
gameOrder: ["token-forge"],
```

Set `institution` and `logoSrc` in the same file when you want them in the sidebar. Leave research mode off unless you have a separate plan for event collection.

## Using only part of the Odyssey

You do not have to use all 13 games.

- Tokenizer lesson: Token Forge only.
- Retrieval lesson: Retrieval Lab.
- Production module: Ship-It Simulator, System Composer, and ProdOps Gauntlet.
- Agent module: Agent Architect, Retrieval Lab, and System Composer.

Remove the other ids from `enabledGames` in `config/odyssey.config.ts` if you do not want them on the course page.

## For developers

```bash
git clone https://github.com/piaattufts/llmodyssey.git
cd llmodyssey
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

`npm run dev` serves the app at the site root. The GitHub Pages build sets `VITE_BASE_PATH=/llmodyssey/` so assets and the router resolve under https://piaattufts.github.io/llmodyssey/. `.github/workflows/deploy-pages.yml` runs typecheck, lint, unit tests, the production build, and the Pages deploy on every push to `main`. The Playwright smoke test needs a Chromium install the first time: `npx playwright install chromium`.

Project layout:

```text
content/games/          game definitions, one file per game
config/odyssey.config.ts  branding, order, mastery, enabled games
src/app/                routes, home, educator, progress, demo
src/components/game/    shared game loop components
src/game-engine/        scoring, evaluation, schema
src/storage/            browser progress repository
tests/                  unit tests
e2e/                    Playwright smoke test
```

## Architecture

```text
Learner
   ↓
React Interface
   ↓
Shared Game Components
   ↓
Game Definitions
   ↓
Local Progress Storage
   ↓
Optional Analytics / Backend
```

The teaching path stops at local progress storage. Optional analytics and a model adapter exist in the repository and stay off in the default build. The games do not need them.

## Current release status

Current stable public release: [v0.1.0](https://github.com/piaattufts/llmodyssey/releases/tag/v0.1.0).

Token Forge is the reference implementation. The other twelve games are playable prototypes. They do not have the same maturity, and the interface says so.

## Roadmap

The items below are **future work**. They are not in v0.1.0.

- Mature prototype games into full reference implementations.
- Adaptive difficulty.
- LMS integration.
- Additional Foundry challenges.
- Additional instructor analytics.
- Optional live model integrations.
- Accessibility refinement.
- Multi-institution evaluation of learning outcomes.

## Research and citation

Priyamvada Tripathi  
Tufts Institute for Artificial Intelligence  
Tufts University

Project: LLM Odyssey: A Game-Based Platform for Teaching LLM Engineering Concepts.

Please cite the software and, where relevant, the preprint recorded in [CITATION.cff](CITATION.cff):

Priyamvada Tripathi. *LLM Odyssey: A Game-Based Platform for Teaching LLM Engineering Concepts.* Software, version 0.1.0. https://github.com/piaattufts/llmodyssey

Priyamvada Tripathi. *WIP: LLM Odyssey: A Game-Based Platform for Teaching LLM Engineering Concepts.* arXiv:2608.16924, 2026. https://arxiv.org/abs/2608.16924. DOI: 10.48550/arXiv.2608.16924.

Original development and the Winter 2026 classroom deployment were conducted while the author was at Durham College. The present project is maintained at Tufts University.

## Limitations

- Many current games are prototypes.
- The simulations simplify production systems.
- Precomputed examples do not reproduce every behavior of production LLM systems.
- Tokenizer, model, and API behavior changes quickly. The illustrations are pinned to this release.
- Learning effectiveness requires empirical evaluation. This repository does not claim that evaluation has already been done.
- Open-ended Foundry tasks do not have a single correct answer.

## Contributing

Issues and pedagogical corrections are welcome at https://github.com/piaattufts/llmodyssey/issues. See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE). Copyright Priyamvada Tripathi.
