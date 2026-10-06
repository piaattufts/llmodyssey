# FIE 2026 visual assets

The talk deck is `docs/presentation/fie26-tripathi.pptx`. The backup PDF is `docs/presentation/fie26-tripathi.pdf`. Slides 1–10 are the talk. Slides 11–15 are backup.

12-minute talk plus 3 minutes of questions. Widescreen 16:9. Use one or two visuals per slide. Diagrams are 1920×1080. Screenshots are the same viewport from the local app. SVG is the editable diagram. PNG is the backup.

Editable diagram source: `docs/presentation/source/build_diagrams.py`.
Rasterize: `node scripts/rasterize-diagrams.mjs`.
Screenshots: `node --experimental-strip-types scripts/capture-presentation-screenshots.ts` with the dev server on `http://127.0.0.1:43123`.
Crops and the annotated feedback shot: `python3 scripts/finish-presentation-assets.py`.

Color is consistent and is not the only cue. Cognitive Core is blue. Systems Forge is purple. Foundry Arena is gold. Token Forge is marked **Reference**. Games 2–13 are marked **playable prototypes**.

Game-name lines on the journey diagram are slightly under an 18 pt slide equivalent so thirteen steps still fit. Titles, tier names, and the short labels are at or above that size.

## Recommended assets

1. `docs/presentation/diagrams/01_curriculum_tiers.png` — the three tiers.
2. `docs/presentation/diagrams/03_game_learning_loop.png` — how one game teaches.
3. `docs/presentation/screenshots/05_token_forge_feedback.png` — one real decision and its feedback.
4. `docs/presentation/diagrams/10_assessment_model.png` — completion, score, 70% benchmark, transfer.
5. `docs/presentation/diagrams/07_platform_architecture.png` — local-first, no required backend, no paid API.

## Suggested 10-slide map

| Slide | Role | Visual |
| --- | --- | --- |
| 1 | Title | None, or the homepage hero |
| 2 | Problem | Spoken. No new diagram |
| 3 | Gap | Spoken. No new diagram |
| 4 | Curriculum | `01_curriculum_tiers` |
| 5 | Pedagogy | `04_pedagogy_mapping` |
| 6 | One game | `05_token_forge_feedback` or `04_token_forge_gameplay` |
| 7 | Learning loop | `03_game_learning_loop` |
| 8 | Platform or educator use | `07_platform_architecture` or `07_educator.png` |
| 9 | Evaluation protocol | `11_evaluation_flow` |
| 10 | Open source and next step | `12_platform_evolution` plus the live link |

Backup, not the main path: journey, tokenization pipeline, local data flow, educator workflow, assessment model, demo, Foundry, concept index.

## Diagrams

All of these are **current**, except where a box is explicitly dashed or labeled planned. Each PNG has a matching SVG.

### `01_curriculum_tiers`

Shows three tiers, Bloom emphasis, Token Forge as the reference game, and games 2–13 as playable prototypes.
Recommended slide: curriculum.
Speaker message: Foundations, then systems, then a design brief. Only Token Forge is the reference implementation.
Simplification: Bloom verbs are the tier emphasis, not a claim that every click is a separate assessment.

### `02_curriculum_journey`

Shows the 13-game teaching order in three rows, left to right.
Recommended slide: backup for the curriculum slide.
Speaker message: This is a pedagogical progression, not a universal production pipeline.
Simplification: concept names are shortened (Attention, not Representation and attention). Game-name type is slightly smaller than the titles.

### `03_game_learning_loop`

Shows orientation, an engineering decision, feedback, hint or continue, the next round, the concept guide, the 70% mastery check, and reflection.
Recommended slide: how one game works.
Speaker message: The guide can be reopened without resetting the round or the score. A hint costs one point. Self-evaluation does not change the score.
Simplification: retry keeps the best round score. The diagram does not draw every button.

### `04_pedagogy_mapping`

Shows five pairs from learning science to the mechanic: feedback, hints, difficulty, worked examples, authentic scenarios.
Recommended slide: why the games are built this way.
Speaker message: Black and Wiliam, Vygotsky, Sweller, and Bloom name the design sources. The platform supports practice. It does not report a measured learning gain.
Simplification: citations are in the footer, not on each pair.

### `05_token_forge_flow`

Shows one Token Forge round: the Python signature, four authored rows, comparison, arithmetic, and feedback.
Recommended slide: backup beside the Token Forge screenshot.
Speaker message: The pieces are authored examples. The count and the exercise cost are arithmetic on those pieces. This is not a live production tokenizer.
Simplification: the talk brief’s `import numpy as np` line is not the shipped round. Round 2 uses `def refund_total(items: list[str]) -> int:`.

### `06_tokenization_pipeline`

Shows raw text, pieces, illustrative IDs, vectors, and a transformer.
Recommended slide: backup while introducing Token Forge.
Speaker message: These IDs are a teaching example. They are not from a production tokenizer.
Simplification: embeddings are labeled “vector” rather than drawn as numeric matrices.

### `07_platform_architecture`

Shows the standalone path from the learner to the local progress store, plus optional analytics and LLM adapters that are off unless configured.
Recommended slide: architecture.
Speaker message: Core gameplay needs no backend and no paid model API. The 13 games do not call the LLM adapter. Supabase is used only when research mode and a project URL are set.
Simplification: the component list is the runtime shape, not every source folder.

### `08_local_first_data_flow`

Shows the browser path from an action to local progress, the progress page, and CSV/JSON export. Research upload is a separate branch and is off by default.
Recommended slide: backup for architecture or evaluation.
Speaker message: Public visitors are not research participants. Data stays in the browser unless research mode is turned on, and then only after consent.
Simplification: self-evaluation is named in the footer because it is stored separately from the score.

### `09_educator_workflow`

Shows eight steps from choosing a game through discussion. Students play locally. A score is not the whole evaluation.
Recommended slide: backup for the educator screenshot.
Speaker message: An educator can read the lesson without reading the source. Preview means opening the student view. There is no separate button named Preview as Student.
Simplification: the eight cards are a workflow, not eight required clicks.

### `10_assessment_model`

Shows completion, performance, the 70% mastery threshold, and transfer. Transfer is the widest bar.
Recommended slide: backup on the evaluation slide, or instead of the protocol diagram if time is short.
Speaker message: 70% is an instructional benchmark on these scenarios. It is not professional expertise. Transfer is whether the learner can explain a new case.
Simplification: the bars widen to show a stronger claim. They are not a statistical scale.

### `11_evaluation_flow`

Shows the documented protocol: optional local pre-assessment, use, local logs, optional local post-assessment. Study survey and interviews are outside the current app.
Recommended slide: evaluation.
Speaker message: This is the protocol for a future study. Learning effectiveness has not been established. The old Base44 survey is not in this release. The feedback page stores a local note. Interviews are planned and not shipped.
Simplification: log fields are four words, not the full event schema.

### `12_platform_evolution`

Shows the original Base44 prototype, what the migration preserved, and the standalone public platform.
Recommended slide: open source and next steps.
Speaker message: The prototype supplied the curriculum. This release stands alone: React and TypeScript, local-first, GitHub Pages, no paid API. Token Forge is the reference game.
Simplification: this is product evolution. It is not a defect list. No original Base44 screenshot is in the repository, so this diagram is the comparison.

## Screenshots

All current screenshots are from the local standalone app at 1920×1080. They are not Base44 images. `*_wide.png` is the same 16:9 viewport. `*_panel.png` crops the main column (1160×1080) and is not stretched.

Demo progress is the built-in conference sample (Token Forge and Attention Architect mastered, Context Compression in progress, pre-assessment 40%). It is not participant data. The session id on the progress page is a local browser id created for the capture.

### `01_home.png`

Shows the title, the tagline, the 13-game and 3-tier chips, and Start Learning, Explore as Educator, and Take the Demo Tour.
Recommended slide: title or opener.
Speaker message: A browser course for LLM engineering. Token Forge is the reference implementation. The other twelve games are playable prototypes. No paid API.
Current. The tier cards sit below this viewport.

### `02_game_arcade.png`

Shows the end of Cognitive Core, all of Systems Forge, and the Foundry Arena heading, with Prototype or Reference on each visible card. Locked Systems Forge cards name the mastery gate.
Recommended slide: backup for the curriculum slide.
Speaker message: Status is on the card. Later tiers stay locked until the mastery counts are met, unless Practice ahead is on.
Simplification: one viewport cannot show all 13 cards. The three tier headings are in this frame. The Foundry card is clipped at the bottom.

### `03_token_forge_orientation.png`

Shows Token Forge, the reference-implementation status, time, concepts, the mastery target, and the start of Why This Game Exists.
Recommended slide: backup before gameplay.
Speaker message: Students are not dropped into round 1. The mastery target is an instructional benchmark, not expertise.
Simplification: learning objectives, how to play, and Start Game continue below this viewport.

### `04_token_forge_gameplay.png`

Shows the Python signature, BPE, WordPiece, SentencePiece, and Unigram, with SentencePiece selected, 10 tokens, 86% vocabulary efficiency, a $3750 exercise cost, the pieces, and the hint control.
Recommended slide: alternate for “how one game works.”
Speaker message: The learner compares authored segmentations. The cost is arithmetic for this exercise, not a vendor invoice.
Simplification: the round-progress bar sits above this viewport.

### `05_token_forge_feedback.png`

Shows the locked SentencePiece result: pieces, count, efficiency, exercise cost, why, the trade-off, the weaker rows, and the round score of 10/10.
Recommended slide: how one game works.
Speaker message: Students make an engineering decision, receive immediate explanatory feedback, and can connect the result to the concept guide.
Current. This is the strongest gameplay still.

### `05_token_forge_feedback_annotated.png`

Same frame with four callouts, top to bottom: scenario pieces, count and cost, learner choice, immediate feedback.
Recommended slide: the same slide, if the room needs the pointers.
Speaker message: Same as the unmarked shot. The numbers follow the screen, not a second pedagogy model.

### `06_token_forge_guide.png`

Shows Understanding tokenization, the token-chip diagram, the overview, and the start of the key concepts.
Recommended slide: backup if someone asks where the guide lives.
Speaker message: The guide states that these segmentations are educational illustrations, not a live benchmark. Opening it does not reset the round.
Simplification: one section, not the whole guide.

### `07_educator.png`

Shows the educator table: game, tier, what students learn, status, minutes, Bloom, and the 70% mastery column.
Recommended slide: educator use, beside or instead of the architecture diagram.
Speaker message: An instructor can see objectives, level, time, and status before assigning a game. Game titles open the student view.
Current. There is no control labeled Preview as Student.

### `08_progress.png`

Shows the demo sample record: scores, grades, attempts, hints, mastery, and concept exposure. The sidebar says 2 of 13 games are at the mastery threshold.
Recommended slide: backup for local progress.
Speaker message: This is sample demo progress in a separate browser record. It is not a research dataset.
Simplification: achievements and the export buttons are below this viewport.

### `09_demo.png`

Shows About Demo Mode, the separate local record, guided tour step 1 of 11, and the demo homepage actions.
Recommended slide: backup when offering a live demo.
Speaker message: Demo mode does not change the learner record and does not call a model API.
Current.

### `10_systems_forge.png`

Shows Retrieval Lab, a playable prototype, on the refund-window round. Vector search is selected and ranks a price-match chunk above the refund policy.
Recommended slide: backup to show that Systems Forge is playable and still a prototype.
Speaker message: The ranking is a small local model of keyword, vector, and hybrid search. It is not a production retriever.
Choice: Retrieval Lab is the Systems Forge screen because the ranked chunks are visible in one viewport.

### `11_foundry.png`

Shows the industry brief, the three constraints, the design choices, the reflection box, and the start of the self-assessment rubric.
Recommended slide: backup for the capstone.
Speaker message: Foundry asks for a design under a brief. There is not one hidden correct architecture. The in-round self-rating is part of this rubric. It is separate from the post-game self-evaluation, which does not change the score.
Simplification: later rubric rows continue below the fold.

### `12_concept_index.png`

Shows Foundations and the start of Systems, with each concept linked to a game guide.
Recommended slide: backup if asked how concepts connect.
Speaker message: The same guide text is inside the game. Opening it does not reset a round.
Simplification: Production concepts are below this viewport.

## Not created

No original Base44 screenshots are in the repository. These files were not invented:

- `base44_*.png`
- `13_token_forge_evolution.png`

Use diagram `12_platform_evolution` for that comparison.

## Factual limits to keep in the talk

- Learning effectiveness is not established.
- The 70% line is an instructional benchmark, not expertise.
- Research mode is off by default. Public visitors are not participants.
- Gameplay does not require a backend or a paid model API.
- Token Forge does not call a commercial tokenizer library.
- Games 2–13 are playable prototypes. Their scores are calculated. Their software is still under refinement.
- The study survey from the Base44 prototype is not in this app. Interviews are planned and not shipped.
