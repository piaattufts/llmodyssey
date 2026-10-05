# LLM Odyssey

Learn LLM Engineering Through Interactive Games

[Launch LLM Odyssey](https://piaattufts.github.io/llmodyssey/) · [Demo](https://piaattufts.github.io/llmodyssey/demo) · [Educator Guide](https://piaattufts.github.io/llmodyssey/educator) · [Latest Release](https://github.com/piaattufts/llmodyssey/releases)

13 games · 3 learning tiers · Browser-based · No paid API required · Open source · Educator reusable

## 1. What Is LLM Odyssey?

LLM Odyssey is an open-source, browser-based learning environment that turns core LLM engineering concepts into interactive decision-making activities.

Students move from foundational topics such as tokenization and attention to retrieval, agents, production operations, and system design. Each game asks for a decision, shows the consequence, and explains the trade-off. The public site runs in the browser. It does not require an account or a paid model API.

## 2. Why It Exists

Lectures can define a token, an attention weight, or a retrieval pipeline and still leave students unable to choose under a constraint. Odyssey holds a small, reproducible scenario still so a class can compare decisions. The games are practice, not a claim that a score measures professional competence.

## 3. Who It Is For

- An educator who has not seen the platform before and needs to know what a game teaches before assigning it.
- An undergraduate new to LLM engineering.
- A reviewer looking at the educational contribution.
- A conference or workshop audience with a few minutes.
- An instructor adopting one game, or the whole sequence.
- A developer extending the open-source project.
- A researcher reading the learning design. The public site does not enroll visitors in a study.

## 4. Launch Online

The hosted site is [https://piaattufts.github.io/llmodyssey/](https://piaattufts.github.io/llmodyssey/).

Direct links keep working on refresh because the Pages build includes a single-page fallback. Useful entry points:

- Course home: [https://piaattufts.github.io/llmodyssey/](https://piaattufts.github.io/llmodyssey/)
- Demo: [https://piaattufts.github.io/llmodyssey/demo](https://piaattufts.github.io/llmodyssey/demo)
- Guided tour: [https://piaattufts.github.io/llmodyssey/demo?tour=1](https://piaattufts.github.io/llmodyssey/demo?tour=1)
- Educator guide: [https://piaattufts.github.io/llmodyssey/educator](https://piaattufts.github.io/llmodyssey/educator)
- Concept index: [https://piaattufts.github.io/llmodyssey/guide](https://piaattufts.github.io/llmodyssey/guide)
- Token Forge: [https://piaattufts.github.io/llmodyssey/play/token-forge](https://piaattufts.github.io/llmodyssey/play/token-forge)

## 5. Start Here

Students: open the site and choose **Start Learning**. Read the orientation before round 1.

Educators: open the [Educator Guide](https://piaattufts.github.io/llmodyssey/educator), or choose **Explore as Educator** on the home page. You do not need to read the source to see objectives, scoring, or what is simulated.

Demonstrators: open [Demo Mode](https://piaattufts.github.io/llmodyssey/demo) and start the guided tour. Demo progress is stored separately from a learner record.

Developers: clone the repository and run it locally. Game text lives in `content/games/` and `content/teaching/`.

## 6. The Learning Journey

The path is a pedagogical sequence. It is not a claim that every production LLM system is built in this order.

Raw text → tokenization (Token Forge) → representation and attention (Attention Architect) → context management (Context Compression) → task specification (Promptsmith) → model adaptation (Gradient Playground) → reasoning and generation strategies (Reasoning Reactor) → alignment (Alignment Arena) → production deployment (Ship-It Simulator) → agents (Agent Architect) → retrieval (Retrieval Lab) → system integration (System Composer) → operations (ProdOps Gauntlet) → synthesis (Foundry Arena).

## 7. The Three Tiers

**Cognitive Core** isolates one mechanism at a time: tokens, attention, context, prompts, adaptation, decoding, and preference trade-offs.

**Systems Forge** asks students to judge a system: serving, agents, retrieval, composition, and operations.

**Foundry Arena** is a design brief. More than one architecture can be defended. The rubric is visible before submission.

## 8. The 13 Games

| # | Game | Tier | What Students Learn | Status |
| --- | --- | --- | --- | --- |
| 1 | Token Forge | Cognitive Core | How text becomes tokens, and what segmentation does to length, context, and an exercise cost | Reference Implementation |
| 2 | Attention Architect | Cognitive Core | How a simplified attention calculation combines values across positions | Playable Prototype |
| 3 | Context Compression | Cognitive Core | How to keep task-relevant information inside a token budget | Playable Prototype |
| 4 | Promptsmith | Cognitive Core | How to specify a task for a probabilistic model | Playable Prototype |
| 5 | Gradient Playground | Cognitive Core | How learning-rate, data, and update choices show up on a simulated loss curve | Playable Prototype |
| 6 | Reasoning Reactor | Cognitive Core | How decomposition, checks, and decoding settings change a workflow | Playable Prototype |
| 7 | Alignment Arena | Cognitive Core | How preference trade-offs are weighed when there is no single “good” | Playable Prototype |
| 8 | Ship-It Simulator | Systems Forge | How latency, retries, cache, routing, and cost interact under limits | Playable Prototype |
| 9 | Agent Architect | Systems Forge | When a tool loop is warranted, and which permissions to refuse | Playable Prototype |
| 10 | Retrieval Lab | Systems Forge | How a retrieved set is ranked, and why retrieval is not yet an answer | Playable Prototype |
| 11 | System Composer | Systems Forge | How each component should answer a named requirement | Playable Prototype |
| 12 | ProdOps Gauntlet | Systems Forge | How to respond to an incident from evidence | Playable Prototype |
| 13 | Foundry Arena | Foundry Arena | How to defend a design under a visible rubric | Playable Prototype |

Playable Prototype means the rounds, feedback, score, and teaching notes work, and the activity is still being refined. It does not describe the importance of the topic. Token Forge is the reference implementation of the pedagogical pattern the other games follow.

## 9. What Happens Before Every Game

Before gameplay, learners see:

- why the game exists
- what they will learn
- what they will do
- how the activity works
- how to play
- scoring
- the mastery threshold
- a self-evaluation preview
- a simulation disclosure

During gameplay:

- a contextual round introduction that does not reveal the answer
- a learner choice
- immediate feedback
- hints, framed as support
- a running score

After gameplay:

- performance (the score and grade)
- whether the mastery threshold was met
- a self-evaluation that does not change the score
- a reflection
- the concept guide
- a next step: replay, review the guide, or continue

## 10. How Each Game Teaches

Feedback names the decision, the result, why, what mattered in the scenario, why the alternatives were weaker, an engineering takeaway, and what would be true in a real system. A bare “correct” or “incorrect” is not the lesson.

Each game also has an illustrated concept guide (overview, concepts, how it works, worked examples, applications, trade-offs, best practices, pitfalls, checks, and further reading) and an expandable **For Educators** section.

## 11. Scoring, Completion, Mastery, and Transfer

These words are not interchangeable.

- **Completion** means the learner finished the activity.
- **Performance** is the numerical result on the game’s scenarios.
- **Mastery threshold** is the instructional benchmark for that activity, 70% by default. Meeting it is not a claim of professional expertise.
- **Transfer** is stronger evidence: the learner can explain the decision and apply the concept to a new case.

Most rounds are scored out of 10. A strong fit scores 10, an acceptable fit scores 6 where the game supports partial credit, and a poor fit scores 0. Some prototypes score 10 only when every required constraint is met. Each revealed hint subtracts 1 point from that round, down to 0. Retries keep the best score on the round. Grades are A 90–100, B 80–89, C 70–79, D 60–69, and F below 60. The self-evaluation stored after the game does not change the score. Foundry’s in-round self-rating is part of that activity’s rubric and is separate from the later self-evaluation.

## 12. Full Concept Guides

Every game page includes a complete guide, and **How this game works** opens the same material without resetting the round, score, hints, attempts, or selection. The [Concept Index](https://piaattufts.github.io/llmodyssey/guide) groups concepts under Foundations, Systems, and Production and links each one to a game.

References live in `content/references.ts`. They are original papers, standard technical references, and widely used tutorials. The interface does not invent citations.

## 13. Educator Use

An educator does not need to reverse-engineer the code to understand the lesson. Each game documents:

- learning objectives
- prerequisites, including what is not required
- Bloom level, explained in sentences
- misconceptions
- what students do
- how they are evaluated
- what the mastery threshold means
- what evidence of learning to look for (a correct selection is not sufficient)
- classroom use before, during, and after class
- discussion prompts
- what the simulation computes and what it only illustrates
- further reading

The educator page is a curriculum view of the same content, with links to preview a game as a student.

## 14. Example Course Sequences

**One week:** Token Forge, Attention Architect, Promptsmith.

**Two weeks:** the foundational games plus Retrieval Lab.

**Six weeks:**

1. Token Forge and Attention Architect
2. Context Compression and Promptsmith
3. Gradient Playground, Reasoning Reactor, and Alignment Arena
4. Retrieval Lab and Agent Architect
5. Ship-It Simulator, System Composer, and ProdOps Gauntlet
6. Foundry Arena

A single game is a valid assignment. The sequence can be reordered for a course.

## 15. Demo Mode

Demo Mode is for instructors, reviewers, workshops, and conference demonstrations. It uses a separate browser-local record and does not modify normal learner progress. No paid model API is required.

Open [the demo](https://piaattufts.github.io/llmodyssey/demo) and use **Start Guided Tour**, **Explore Any Game**, or **Open Educator Guide**. The tour is eleven steps, with Back, Next, and Exit. It is meant to run in about five to eight minutes.

## 16. Student Progress

The default record stores a random session id, scores, rounds, attempts, hints, mastery, and timestamps. Self-evaluation marks are stored separately in the browser and are not part of the scored record. Refresh does not erase the record. Progress can export CSV or JSON. **Reset progress** asks for confirmation and deletes the record for the current mode only. Resetting the learner record does not reset the demo record.

## 17. Data and Privacy

**Default educational mode** is local-first. There is no required backend, no mandatory API, and no mandatory account. Progress stays in this browser (IndexedDB, with localStorage as a fallback).

**Optional research mode** is disabled unless a build sets `VITE_RESEARCH_MODE`. Public visitors are not research participants. An institution that enables research mode is responsible for its own review. Educational feedback on the Feedback page is optional, stored locally unless you choose to send it yourself, and does not affect progress.

## 18. Simulation vs Real Computation

| Game | Current Implementation | Real Computation | Educational Abstraction |
| --- | --- | --- | --- |
| Token Forge | Reference Implementation. Precomputed segmentations. | Token counts, efficiency, and the exercise cost are arithmetic on the pieces shown. | The pieces are authored illustrations, not a live production tokenizer. In practice, use the tokenizer of the deployed model. |
| Attention Architect | Playable Prototype. | Scaled dot-product attention and softmax run in the browser on the given vectors. | The vectors are hand-written. Students select a token. They do not edit a transformer. The heatmap is not a trace of model reasoning. Head labels are educational abstractions, not universal categories. |
| Context Compression | Playable Prototype. | The budget, relevance, and must-keep checks are calculated. | Abstractive summary text is written ahead of time. No model summarizes. Shorter is not the goal. |
| Promptsmith | Playable Prototype. | The comparison among authored strategy cards is scored. | No model is called. Prompting is treated as specification, not as a view into hidden reasoning. |
| Gradient Playground | Playable Prototype. | A documented formula draws the chart from the controls. | No training run, gradients, parameters, or dataset. Costs and accuracy figures are simulated. Full fine-tuning is not presented as universally best. |
| Reasoning Reactor | Playable Prototype. | A checklist and a precomputed sample table are scored. | Nothing is sampled live. Temperature 0 is not described as a universal determinism guarantee. Visible intermediate text is not treated as hidden computation. |
| Alignment Arena | Playable Prototype. | A weighted sum of authored helpfulness, safety, and factuality ratings is calculated. | No reward model, no raters, and no policy update. Alignment is not one agreed scalar. PPO is not the only method discussed. |
| Ship-It Simulator | Playable Prototype. | Selected lever effects are added to a baseline and compared with limits. | No cluster, queue, or live API. |
| Agent Architect | Playable Prototype. | Needed and harmful controls are checked as a set. | No agent runs and no tool is called. A model call, a workflow, a tool-using agent, and a multi-agent system are distinguished. |
| Retrieval Lab | Playable Prototype. | Cosine similarity, keyword overlap, a hybrid average, precision, and recall are computed in the browser. | Vectors are toy 3-D coordinates, not embeddings from a model. There is no separate reranker and no generated answer. |
| System Composer | Playable Prototype. | Relative cost, relative latency, coverage, and conflicts are summed and checked. | Nothing is deployed. The numbers are teaching units, not vendor prices. More components are not automatically better. |
| ProdOps Gauntlet | Playable Prototype. | Authored responses are scored best, acceptable, or poor. | The incidents are written cases. Nothing is monitored live. |
| Foundry Arena | Playable Prototype. | Constraint coverage, reflection length, and a completed in-round self-rating are scored, with partial credit. | There is not one correct architecture. Nothing is deployed. The later self-evaluation does not change this score. |

## 19. Current Development Status

Version 0.1.0 is the tagged public snapshot. Token Forge is the reference implementation. The other twelve games are playable prototypes with working rounds, feedback, scores, guides, and educator notes. A game is not labeled Reference Implementation unless it has the full pedagogical pattern, including tests and a stable experience.

## 20. Customizing Odyssey

| What you want to change | Where it lives |
| --- | --- |
| Rounds, hints, scoring rules | `content/games/<id>.ts` |
| Orientation and teaching notes | `content/orientation/` and `content/teaching/` |
| Mastery threshold, enabled games, order, institution, logo | `config/odyssey.config.ts` |
| Pre/post items | `content/assessments/index.ts` |
| Citations | `content/references.ts` |

A tokenizer-only course can set `enabledGames` and `gameOrder` to `["token-forge"]`. Rebuild after editing config or content.

## 21. Running Locally

```bash
git clone https://github.com/piaattufts/llmodyssey.git
cd llmodyssey
npm install
npm run dev
```

Vite prints a local URL, usually http://localhost:5173/. The local site is served from `/`. Progress stays in that browser. Copy `.env.example` only if you are intentionally enabling an optional integration. The default experience needs no secrets.

## 22. Architecture

The app is a Vite + React + TypeScript single-page app. Game definitions are validated with Zod when they load. Scoring lives in `src/game-engine/`. The interface reads those definitions; it does not embed the long guides inside page components. Progress uses an IndexedDB repository with a localStorage fallback, namespaced for `learner` and `demo`. Optional Supabase or model-provider settings fail closed: if they are unset, the games still run.

## 23. Testing

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

Unit tests check the thirteen games, solvability, scoring, local records, orientation, and the teaching record on every game. Playwright checks the home page, Token Forge, the guide, progress, demo separation, educator notes, and an unknown route.

## 24. Deployment

GitHub Actions builds the site and publishes it to GitHub Pages at [https://piaattufts.github.io/llmodyssey/](https://piaattufts.github.io/llmodyssey/). The base path is set with `VITE_BASE_PATH`. Nested routes refresh because the build also writes `404.html` for the Pages single-page fallback.

## 25. Accessibility

The interface uses semantic headings, a skip link, visible focus, keyboard-reachable controls, and a reduced-motion preference for the feedback animation. Interactive controls use a minimum height of 44 pixels. Diagrams include text labels so meaning does not depend on color alone. Dialogs can be closed from the keyboard. This is an ongoing WCAG 2.2 AA effort, not a formal certification.

## 26. Research and Citation

Priyamvada Tripathi. Tufts Institute for Artificial Intelligence, Tufts University.

Preferred software citation: `CITATION.cff` in this repository.

Associated preprint: *WIP: LLM Odyssey: A Game-Based Platform for Teaching LLM Engineering Concepts*. arXiv:[2608.16924](https://arxiv.org/abs/2608.16924). DOI: 10.48550/arXiv.2608.16924.

Original development and the Winter 2026 classroom deployment were conducted while the author was at Durham College. Durham College is not the current affiliation.

Contact: [pia.tripathi@tufts.edu](mailto:pia.tripathi@tufts.edu).

## 27. Limitations

The games teach with authored scenarios and, where noted, small in-browser calculations. They are not benchmarks of commercial tokenizers, embedding models, training runs, or production clusters. A mastery flag is an instructional threshold on these items. It is not evidence of transfer by itself. Learning outcomes for a particular course remain an empirical question. Prototype games can still change.

## 28. Roadmap

Deepen the prototype games toward the Token Forge pattern where a mechanic is still thin. Keep simulation boundaries explicit. Add instructor-authored rounds without new React components when an existing interaction type is enough. Do not relabel a game as a reference implementation until the orientation, interaction, feedback, guide, educator notes, and tests meet that bar.

## 29. Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Issues and pedagogical corrections are welcome at [https://github.com/piaattufts/llmodyssey/issues](https://github.com/piaattufts/llmodyssey/issues).

## 30. License

MIT. See [LICENSE](LICENSE).
