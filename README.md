# LLM Odyssey

LLM Odyssey is an open-source, browser-based game-based learning platform for teaching Large Language Model engineering through 13 interactive learning experiences.

13 games · 3 learning tiers · No API key required · Open source · Instructor customizable

The course is three tiers. Cognitive Core covers mechanisms. Systems Forge covers production structure. Foundry Arena is a constrained design brief. The default install is local. Scoring, hints, progress, assessments, and the demo run in the browser with no database and no paid model API. Educational simulations are labeled in the interface. Educator content is data, validated at startup. Research collection is optional and off unless you turn it on.

This repository does not use Base44, and it does not require an account.

## If you use LLM Odyssey in teaching or research, please cite

Priyamvada Tripathi. *LLM Odyssey: A Game-Based Platform for Teaching LLM Engineering Concepts.* Software, version 0.1.0. <https://github.com/piaattufts/llmodyssey>

Priyamvada Tripathi. *WIP: LLM Odyssey: A Game-Based Platform for Teaching LLM Engineering Concepts.* arXiv:2608.16924, 2026. <https://arxiv.org/abs/2608.16924>. DOI: 10.48550/arXiv.2608.16924.

`CITATION.cff` carries the same metadata. The author is Priyamvada Tripathi at the Tufts Institute for Artificial Intelligence, Tufts University. Original development and the Winter 2026 classroom deployment were conducted while the author was at Durham College. That historical note is not a claim that the present repository, or your deployment of it, is covered by any ethics approval.

## Why LLM Odyssey exists

Students can finish a general machine learning course and still have little practice with the decisions that show up once a language model is part of a system. Those decisions include how text is segmented into tokens, what a context window will actually hold, how a prompt constrains a parser, what a learning-rate choice does to a validation curve, how a retriever can miss the passage the answer depends on, and what latency, retries, and cost do to a service that looked fine in a notebook.

LLM-specific work also includes alignment tradeoffs, tool permissions, and incident response. A lecture can name those topics. It is harder, in a slide, to show that a segmentation changed a bill, that two attention heads can disagree, or that a retry loop multiplied a vendor invoice while the status page stayed green.

Odyssey turns each of those situations into a short exercise with an immediate result. The result is a score, an explanation, and, where the round computes something, a number the learner can recompute. The platform is designed to support that kind of practice. It is not evidence, by itself, that the practice improves learning. A formal estimate of learning effectiveness remains an empirical question for anyone who studies a particular deployment.

## Pedagogical design

### 1. Immediate formative feedback

Learners should not wait until the end of a game to learn whether a decision did what they thought. After each action, the shell updates a readout. After the learner locks the round, the score, the explanation, and a short breakdown appear before the next round.

In Token Forge, choosing a tokenizer family updates the segmentation, the token count, the efficiency figure, and the estimated cost before the round is locked. The feedback after locking says whether that family was the best, acceptable, or poor fit for the authored comparison.

### 2. Scaffolded hints

A hint should narrow the problem without replacing the decision. Each round has three hints. The first is a conceptual cue. The second is directional. The third is a stronger explanation or a partial view of the reasoning. The third hint still does not select the answer.

In Attention Architect, the first hint points at the query-key comparison, the second points at softmax, and the third points at which head the question asked about. The learner still clicks a token.

### 3. Progressive difficulty

Early rounds use a small case and name the feature that matters. Later rounds add a constraint: a mixed-script string, a budget that cannot hold every relevant span, a serving limit and a cost limit together.

Context Compression starts by asking which spans fit a small budget and later asks for a hierarchical cut where a flat summary drops a required fact.

### 4. Worked examples

A worked example shows the shape of a good solution on a problem that is not the graded round. Every game has one, opened from the introduction, before Start.

Gradient Playground's worked example walks through reading a training curve and a validation curve on a tiny setting before the learner changes learning rate, epochs, batch size, or method.

### 5. Authentic engineering scenarios

The fiction is specific: a support macro, a clinic note, a robot tray, a hiring packet, an invoice that tripled at 14:10. The scenario says who is affected and which constraint is in force.

Ship-It Simulator's first rounds are a latency and error budget on a service that already has a cache, a fallback model, and a retry policy. The learner changes those levers. The page projects the metrics. It does not claim to be a cluster.

### 6. Mastery-oriented retries

A missed round can be retried. Hints reset on the retry. The best score for that round is kept, and the hint count on that best attempt is the one that matters for the independent-mastery achievement. Total hints are still stored.

Promptsmith uses this directly. A learner can submit a vague instruction, read why a schema would have been a better fit, and submit again without losing the rest of the game.

### 7. Reflection

After the last round, the game asks a question that the score cannot answer. The text is stored on the local record and included in the progress CSV. Skipping is allowed and stores an empty reflection.

Foundry Arena also has a reflection inside the round, because the brief asks the learner to name a tradeoff in the design they actually selected. That in-round reflection is part of the rubric. The end-of-game reflection is separate.

### 8. Tiered progression

The course is ordered so that mechanisms come before systems, and systems come before an open brief. Systems Forge opens after four Cognitive Core games are mastered. Foundry Arena opens after three Systems Forge games are mastered. Practice ahead, and demo mode, open the later games without those counts. Listed per-game prerequisites are shown to instructors. They are advisory. The lock that blocks play is the tier count, the enabled-game list, and the Foundry switch.

## Learning model and Bloom's taxonomy

Tier 1, Cognitive Core, emphasizes remember, understand, and apply. Learners name a mechanism and use it on a small case. Tier 2, Systems Forge, emphasizes apply, analyze, and evaluate. Learners compare designs against constraints that can conflict. Tier 3, Foundry Arena, emphasizes analyze, evaluate, and create. The brief no longer has a single labeled architecture.

Tasks get more open because the earlier games have already made the parts inspectable. Foundry still scores constraint coverage. It does not pretend that coverage is the only professional judgment.

| Tier | Games | Primary learning goal | Bloom levels |
| --- | --- | --- | --- |
| 1 Cognitive Core | Token Forge, Attention Architect, Context Compression, Promptsmith, Gradient Playground, Reasoning Reactor, Alignment Arena | Make the mechanisms visible and usable on a small case | Remember, understand, apply |
| 2 Systems Forge | Ship-It Simulator, Agent Architect, Retrieval Lab, System Composer, ProdOps Gauntlet | Judge a system against cost, latency, grounding, and failure | Apply, analyze, evaluate |
| 3 Foundry Arena | Foundry Arena | Produce a constrained design and name the tradeoff | Analyze, evaluate, create |

Individual games record their own Bloom labels. Those labels are the author's classification of the task.

## Complete guide to all 13 games

### Game 1 — Token Forge

**Purpose.** Token Forge makes segmentation visible, because model APIs bill and attend over tokens rather than characters.

**Concepts.** Tokens, byte-pair encoding (BPE), WordPiece, SentencePiece, Unigram, vocabulary tradeoffs, multilingual segmentation, token cost.

**Why this matters.** A string that looks cheap in a text editor can be expensive after segmentation. Rare words, code, and mixed scripts often split into more pieces than a word count suggests. At a million calls, a small difference in tokens is a real invoice difference.

**What the learner does.** The learner receives a text sample, selects a tokenizer family, and sees the authored pieces, the count, an efficiency figure, and a cost computed as tokens times price per million times the number of calls. The learner can open hints and then lock the round. Later rounds use code, a less common word, a mixed-script string, and a clause at high volume.

**Example challenge.** Round 5 uses the sentence "The contractor's aggregate liability under this schedule is limited to fees paid in the prior three months." The authored SentencePiece row has 19 pieces. The authored WordPiece row has 23. At one million calls and 10 dollars per million tokens, the learner can compute both bills from the counts on the cards.

**Feedback.** Before locking, the readout shows the count and the estimated cost. After locking, the round says whether the family was the best, acceptable, or poor fit, and it explains the linguistic feature the comparison was written to show.

**Common misconception addressed.** A token is not a word, and a shorter character string is not automatically cheaper.

**Learning objectives.** Compare BPE, WordPiece, SentencePiece, and Unigram segmentations of the same string. Compute a token count from a displayed segmentation. Estimate call cost from a token count and a per-million-token price. Explain one case where a morphologically rich or mixed-script string changes the preferred segmentation.

**Bloom level.** Remember, understand, apply.

**Estimated time.** 20 minutes.

**Implementation note.** Precomputed educational segmentations. Token counts, efficiency figures, and dollar estimates are arithmetic on the segments shown. The segments are authored illustrations of how these families often behave. They are not the output of a production tokenizer library. A real Unigram or SentencePiece model can segment the same string differently.

What a token is, in this course, is one piece from the model's segmentation. Vocabulary size and the training text change which pieces exist. BPE repeatedly merges the most frequent pair. WordPiece is the subword family associated with that line of work and often marks continuations. SentencePiece treats the input as a raw stream and can keep a visible marker for whitespace, which is why the pieces in this game often start with U+2581. Unigram is a language-model tokenizer that can keep a frequent piece when that piece has high probability. Those are the teaching distinctions used in the cards. They are not a claim that the card was produced by the reference implementation of each paper.

### Game 2 — Attention Architect

**Purpose.** Show query, key, value, scores, and softmax on vectors small enough to inspect, including a case where two heads disagree.

**Concepts.** Query, key, value, attention score, softmax, self-attention, multi-head attention, positional information.

**Why this matters.** Attention is the operation that lets a position gather information from other positions. If learners only see a heatmap from a black-box demo, they cannot tell a score from a weight, or a head from the whole layer.

**What the learner does.** The learner reads a short sentence whose tokens have hand-authored vectors. They click the token they think receives the highest weight for the head the question names. The page computes scaled dot-product scores and the softmax, and it draws a bar for each weight. One round asks the learner to notice that head A and head B do not highlight the same token. Positional information is discussed as something the toy vectors do not learn: the vectors were written, so position is not emerging from training.

**Example challenge.** A sentence contains two mentions that could be antecedents. The learner selects the token with the largest softmax weight for the named head. The correct index is the argmax of the computed weights, not a separately stored answer key.

**Feedback.** The readout lists scores and weights before submit. After submit, the feedback says whether the selected index was the unique winner and restates the formula used.

**Common misconception addressed.** Attention weights are not the value vectors, and two heads are not required to agree.

**Learning objectives.** Compute the relationship between a query, keys, and softmax weights on a given set of vectors. Identify the token with the highest weight. Explain a case where two heads highlight different tokens.

**Bloom level.** Understand, apply.

**Estimated time.** 25 minutes.

**Implementation note.** Simplified dot-product attention on toy vectors. Scores and softmax weights are computed in the browser. The vectors are tiny and hand-authored. There is no trained transformer, no residual stream, and no claim that these weights match any production model.

A query is the vector for the position that is gathering context. A key is the vector each position offers for comparison. The score is the dot product of the query and a key, divided by the scale stored on the round. Softmax turns the scores into weights that sum to one. The value is what would be mixed by those weights. This game asks which key wins. It does not multiply the weights by values and it does not run a stack of layers. Calling that a transformer inference would be false, so the page does not say that.

### Game 3 — Context Compression

**Purpose.** Practice fitting a source into a token budget without dropping a fact the question needs.

**Concepts.** Context window, token budget, relevance, information loss, extractive compression, abstractive compression, hierarchical summarization.

**Why this matters.** A context window is finite. Stuffing a document until the call fails, or summarizing so hard that the answer's evidence disappears, are both production failures.

**What the learner does.** The learner sees spans with token counts, relevance scores, and a must-keep flag, plus a budget. Some strategies are "select these spans." Others are a prewritten abstractive or hierarchical summary with its own token count and relevance. The learner picks a strategy and, when the strategy says so, the spans to keep. The readout sums tokens and relevance and flags a dropped must-keep span.

**Example challenge.** A budget cannot hold every high-relevance span. An extractive selection that keeps the must-keep spans and stays under the budget beats a shorter abstractive summary that omits one of them. The summary text is prewritten. The game does not call a model to write it.

**Feedback.** The learner sees the total tokens against the budget and which required spans survived. The explanation distinguishes "shorter" from "still answers the question."

**Common misconception addressed.** The shortest summary is not automatically the best compression.

**Learning objectives.** Stay inside a stated token budget. Preserve required evidence. Distinguish extractive selection from a prewritten abstractive summary.

**Bloom level.** Understand, apply.

**Estimated time.** 20 minutes.

**Implementation note.** Deterministic budget arithmetic. Token sums, budget checks, and relevance totals are computed from the numbers in the round. Abstractive summaries are prewritten.

### Game 4 — Promptsmith

**Purpose.** Compare prompt designs on a task that has a checkable output, including quality and token cost.

**Concepts.** Instruction specificity, role and context, few-shot examples, structured output, task decomposition, evaluation, quality and cost.

**Why this matters.** A prompt is an interface. A persona line does not name the fields a parser needs. A long few-shot prompt can raise quality and also raise the bill. Decomposition helps when the intermediate results are things a person can check.

**What the learner does.** The learner reads a task and several authored prompt strategies. Each card describes the strategy and shows a token estimate and a quality label. The learner selects one. The outcome text is written for the exercise. No model is called. The game does not ask the learner to extract a hidden chain of thought, and it does not treat private model reasoning as something a product should demand.

**Example challenge.** An invoice must yield total, currency, and due date. A schema that names the three fields is the better fit. "You are a helpful assistant" does not name the fields. A few-shot card may be acceptable and more expensive.

**Feedback.** The feedback says what the selected strategy made easy or left unspecified, and it shows the quality points before the hint penalty.

**Common misconception addressed.** A polite or role-heavy prompt is not a specification.

**Learning objectives.** Choose a prompt that names the required output. Compare a short instruction with a few-shot or structured alternative on quality and cost. Use a visible decomposition when the task has checkable steps.

**Bloom level.** Apply, analyze.

**Estimated time.** 25 minutes.

**Implementation note.** Deterministic prompt cases. The comparison among authored strategies is real. No live language model is called.

### Game 5 — Gradient Playground

**Purpose.** Let learners see how learning rate, epochs, batch size, and full fine-tuning versus LoRA move a training curve and a validation curve, including overfitting and a simple picture of catastrophic forgetting.

**Concepts.** Learning rate, epochs, batch size, training loss, validation loss, full fine-tuning, LoRA, parameter-efficient fine-tuning, overfitting, catastrophic forgetting.

**Why this matters.** Fine-tuning advice is full of curves. Learners need a picture of divergence, of a widening train-validation gap, and of why a low-rank update is sometimes chosen when a full update would move more weights.

**What the learner does.** The learner sets learning rate, epochs, batch size, and method. A chart updates from the formula in `src/game-engine/models/loss-curve.ts`. The round is met when the final validation loss, the gap, divergence, and forgetting flags satisfy the round's targets. Some rounds require LoRA. Some forbid a learning rate above the scenario's stable maximum.

**Example challenge.** A high learning rate is marked divergent and the curves climb. A moderate learning rate with too many epochs can drive training loss down while validation loss rises after the overfitting epoch. LoRA in this model approaches a higher floor and grows the overfitting gap more slowly than full fine-tuning. Full fine-tuning can add a forgetting penalty on and after `forgettingEpoch`.

**Feedback.** The chart is the feedback before submit. After submit, the breakdown lists final validation loss, gap, and whether the run diverged or forgot, against the targets.

**Common misconception addressed.** A falling training loss is not, by itself, a successful fine-tune.

**Learning objectives.** Relate learning rate to stability. Read a train-validation gap as overfitting in this model. Choose LoRA or full fine-tuning when the round requires one of them. Explain forgetting as an extra penalty this model applies only to full fine-tuning.

**Bloom level.** Understand, apply, analyze.

**Estimated time.** 25 minutes.

**Implementation note.** Educational loss curves. The plotted numbers are computed from a documented formula. Nothing is trained. There are no gradients, parameters, or datasets behind the curves. The progress term is `1 - exp(-learningRate * 4000 * epoch)`. Training loss moves from a base toward a method floor, plus a small batch-size noise term. Validation loss adds an overfitting gap after `overfitEpoch`. Learning rates above `lrStableMax` are treated as divergent.

### Game 6 — Reasoning Reactor

**Purpose.** Practice a visible reasoning workflow: which steps to include, which temperature to use, and how to read agreement across prewritten samples.

**Concepts.** Decomposition, verification, sampling, self-consistency, search, temperature, structured reasoning.

**Why this matters.** Teams sometimes ask a model to "think step by step" and then treat the paragraph as if it were a trace of hidden computation. A workflow a person can check is a different object. Sampling several answers and looking for agreement is also different from believing one fluent answer.

**What the learner does.** The learner selects steps, including required steps and avoiding steps marked harmful, and selects a temperature. The temperature row shows prewritten samples, an agreement figure, and a note. The samples do not change if you click twice. They were written for the row.

**Example challenge.** A brainstorm wants a higher temperature and a diversity step, and it does not want a factuality verifier that the task did not require. A later round wants a low temperature and a verification step when the output must be stable.

**Feedback.** The breakdown lists missing required steps, included harmful steps, and the quality of the temperature row.

**Common misconception addressed.** An educational reasoning script is not a window onto a model's private computation. This game never asks for hidden chain-of-thought extraction.

**Learning objectives.** Assemble a workflow whose steps match the task. Choose a temperature whose prewritten sample behavior matches the goal. Distinguish agreement across samples from truth.

**Bloom level.** Apply, analyze.

**Estimated time.** 25 minutes.

**Implementation note.** Precomputed samples and a workflow checklist. No model was sampled at runtime.

### Game 7 — Alignment Arena

**Purpose.** Make preference comparisons explicit: helpfulness, safety, and factuality have weights, and the winner is the weighted sum.

**Concepts.** Preference data, response ranking, reward modeling as an idea, RLHF as an idea, helpfulness, safety, factuality, tradeoffs.

**Why this matters.** A more helpful reply can be the wrong one to prefer if the weights put safety or factuality higher. Learners should see that a preference is a decision with a rubric, not a vibe, and that a rubric is not yet a trained reward model.

**What the learner does.** The learner reads a user request and several replies. Each reply has authored scores from 0 to 5 on helpfulness, safety, and factuality. The round prints the weights. The learner ranks by selecting the reply they would prefer. The page computes the weighted sum.

**Example challenge.** One reply is friendly and concrete but repeats an unsafe instruction. Another is less complete and refuses the unsafe part. If safety has a high weight, the refusal wins even when its helpfulness score is lower.

**Feedback.** The breakdown shows each reply's weighted total and the weights that produced it.

**Common misconception addressed.** The highest helpfulness score does not automatically win, and clicking a winner does not train a reward model.

**Learning objectives.** Compute a weighted preference. Explain a case where safety or factuality outranks helpfulness. Describe RLHF as a pipeline that uses preferences, without claiming this page ran that pipeline.

**Bloom level.** Understand, analyze, evaluate.

**Estimated time.** 25 minutes.

**Implementation note.** Educational preference simulation. The weighted sum is computed from the printed scores and weights. No preference model is trained, no human raters were collected for this app, and the scores are authored for the lesson. InstructGPT and the earlier preference-learning papers are cited as background, not as something this browser session reproduced.

### Game 8 — Ship-It Simulator

**Purpose.** Practice serving choices: latency, throughput, retries, backoff, caching, fallback models, rate limits, cost, and a service-level target.

**Concepts.** Latency, throughput, retries, exponential backoff, caching, fallback models, rate limits, cost, availability, service-level objectives.

**Why this matters.** A model that is accurate and slow, or cheap and failing open, does not meet a service objective. Retries without backoff can turn a blip into an outage and a bill.

**What the learner does.** The learner toggles levers. Each lever has an authored effect on baseline metrics. The readout projects latency, error rate, cost, and the other metrics the round names. The round is met when every metric lands inside its bound. The arithmetic is real. The cluster is not.

**Example challenge.** A product page must stay under a latency objective during a traffic spike without blowing a cost budget. Caching repeated prompts and backing off retries can meet the objective. Tight retries with no delay, or sending every call to the largest model, miss it. One concrete picture used in the course: a client deploy retries immediately, the provider status page is green, and the bill moves because the client multiplied calls.

**Feedback.** Each metric is marked met or not met in text, not only in color.

**Common misconception addressed.** Retrying faster is not the same thing as becoming more reliable.

**Learning objectives.** Project a metric from a baseline and a lever. Meet a latency and cost bound together. Explain why backoff and a cache change call volume.

**Bloom level.** Apply, analyze, evaluate.

**Estimated time.** About 25 minutes.

**Implementation note.** Parameterized serving simulation. The arithmetic from baseline and lever effects is computed. There is no cluster, queue, or live API. Effect sizes are authored.

### Game 9 — Agent Architect

**Purpose.** Separate an agent loop from "a model with several tools." The loop has state, permissions, a plan, a check, a retry, and a point where a person takes over.

**Concepts.** Agent loop, tool selection, tool permissions, state, memory, planning, verification, retries, graceful degradation, human escalation.

**Why this matters.** A tool the model can call is also a tool it can call at the wrong time. Permission, a stopping rule, and a person in the path are part of the design. Memory is not free: storing the wrong thing is its own failure.

**What the learner does.** The learner selects tools and control steps. Each item is flagged needed or harmful for that scenario. The score requires the needed items and rejects the harmful ones. No tool is invoked.

**Example challenge.** A refund agent may look up an order and draft a reply. It may not issue the refund itself. The needed controls include a verification step and an escalation. A "retry forever" control is harmful.

**Feedback.** The breakdown names missing needed items and any harmful item that was selected.

**Common misconception addressed.** An agent is not defined by the number of tools. It is defined by the loop: observe, choose, act within permission, check, and stop.

**Learning objectives.** Select tools that match the task. Leave out tools that exceed permission. Include a check and an escalation where the scenario requires them.

**Bloom level.** Apply, analyze, evaluate.

**Estimated time.** 25 minutes.

**Implementation note.** Agent-loop checklist. The scoring of needed and harmful items is real. No agent runs and no tools are called.

### Game 10 — Retrieval Lab

**Purpose.** Show retrieval-augmented generation as a retrieval decision: chunking is given, the query is a small vector, and the learner chooses keyword, vector, or hybrid search, plus an optional metadata filter.

**Concepts.** RAG, chunking, embeddings as an idea, vector search, keyword search, hybrid retrieval, metadata filtering, reranking as top-k on a score, recall, precision, grounding.

**Why this matters.** A fluent answer that is not grounded in the retrieved text is a different system from one that cites a passage. Recall asks whether the needed chunks came back. Precision asks whether the returned chunks were needed.

**What the learner does.** The learner picks a method and whether to apply the metadata filter. The page scores every chunk. Keyword overlap is a token overlap with the query string. Vector score is cosine similarity on a 3-dimensional vector. Hybrid is the average of those two scores. Chunks are ranked by score, with id as a tie break. Precision and recall are computed against the chunks marked relevant, inside the top-k window. There is no separate neural reranker.

**Example challenge.** A query shares words with a distractor chunk and is geometrically closer to a relevant chunk. Keyword search ranks the distractor highly. Vector search ranks the relevant chunk highly. A later round needs the metadata filter because an unfiltered vector search returns a passage from the wrong document. The walkthrough on the page lists the ranked chunks and the precision and recall figures before the learner locks the round.

**Feedback.** The list of chunks is the live feedback. After submit, the breakdown states precision and recall against the round's thresholds.

**Common misconception addressed.** Embedding search is not automatically better than keyword search. It depends on whether the needed text is the nearest vector in this toy space.

**Learning objectives.** Compute or read cosine and overlap scores. Choose keyword, vector, or hybrid for a given failure. Use a metadata filter when the relevant text is not the globally nearest chunk. Define precision and recall for a top-k list.

**Bloom level.** Apply, analyze, evaluate.

**Estimated time.** 30 minutes.

**Implementation note.** Local retrieval over toy vectors. Cosine similarity, keyword overlap, hybrid scores, precision, and recall are computed in the browser. The vectors are 3-dimensional teaching examples, not the output of an embedding model.

### Game 11 — System Composer

**Purpose.** Move from one component to a small architecture: model, retrieval, router, verification, guardrail, cache, tool, and a trace.

**Concepts.** Model routing, retrieval, guardrails, verification, caching, tool use, observability.

**Why this matters.** A larger model does not replace a source of truth, a refusal rule, or a log. Systems fail when a concern is nobody's component.

**What the learner does.** The learner toggles blocks. Each block covers zero or more named concerns and adds authored cost and latency. Some blocks conflict. The round is met when the required concerns are covered, cost and latency stay inside the budget, and no conflict pair is both selected.

**Example challenge.** A policy FAQ must ground answers in a manual and refuse a class of requests. Retrieval plus a guardrail covers those concerns. Selecting only a larger model covers neither. A later round wants a cache on repeated lookups, and another wants a trace so an operator can see which document was used.

**Feedback.** Covered and missing concerns, total cost, total latency, and conflicts are listed before and after submit.

**Common misconception addressed.** Adding a larger model is not a substitute for retrieval, a guardrail, or a log.

**Learning objectives.** Cover each named concern with a component. Stay inside a cost and latency budget. Avoid a pair of blocks the round marks as conflicting.

**Bloom level.** Analyze, evaluate.

**Estimated time.** About 25 minutes.

**Implementation note.** Architecture assembly with relative units. Sums of authored cost and latency, and set coverage, are computed. No services are deployed. The units are teaching numbers, not a cloud quote.

### Game 12 — ProdOps Gauntlet

**Purpose.** Practice the first move in an incident: read the signal, then choose a response that matches the failure rather than a generic restart.

**Concepts.** Monitoring, cost anomalies, model drift as a change in what the system serves, prompt regressions, incident response, evaluation, compliance, observability.

**Why this matters.** Production language-model systems fail in ways that look like product bugs and are actually client retries, stale indexes, prompt edits, or logs that kept data they should not have kept.

**What the learner does.** The learner reads a short incident and selects a response card. Each card states what happens to the signal. The best card is the one that matches the cause written in the scenario.

**Example challenge.** At 14:10 the bill tripled. A client deploy at 14:08 retries with no delay. The provider status page is green. Capping retries and restoring backoff is the response that matches the evidence. Flushing a healthy cache or switching to a larger model does not. Another round is an evaluation drop right after a prompt-template edit: roll back the template. Another is a handbook that changed while the index still serves the old chunk: reindex and gate on version. A compliance round asks for a log of the decision, the policy version, and a hash, not a second copy of the raw prompt.

**Feedback.** The card's outcome is restated, and the explanation names the signal that should have driven the choice.

**Common misconception addressed.** Restarting the model is not the response to every incident, and a compliance log should not become a second copy of private prompts.

**Learning objectives.** Match a response to a cost anomaly, a prompt regression, a stale index, an instruction in retrieved text, and a logging constraint.

**Bloom level.** Analyze, evaluate.

**Estimated time.** About 25 minutes.

**Implementation note.** Authored incident cases. The comparison among written responses is the exercise. No production system is being monitored. The metrics on each card are part of the case.

### Game 13 — Foundry Arena

**Purpose.** Foundry is the synthesis tier. The learner gets a problem and constraints rather than a single prescribed architecture.

**Concepts.** System design, constraints, tradeoffs, reflection, rubric, self-assessment.

**Why this matters.** Course problems often end when a component is correct. A deployment brief ends when someone can say which constraint each choice carries and what was given up.

**What the learner does.** Six paths are six rounds: Industry, Healthcare, Robotics, Ethics, Education, and Sandbox. Each round has a scenario, constraints, and a few decisions. Every option lists the rubric ids it covers and the ids it misses. The learner writes a reflection of at least the required length and fills a self-rating for each rubric row. Sandbox also requires a problem statement of at least the required number of characters, so the learner defines the user and the action before choosing components.

**Example challenge.** Industry: a support desk with a cost cap. Route repeated calls to a cache and a smaller model, retrieve the return manual and cite the section, and open a ticket for a person before a high-value refund. Sending every call to the largest model misses the cost constraint. Letting the model issue the refund misses escalation. The reflection has to name a tradeoff in that design, for example quality on unusual tickets versus a predictable bill.

The other briefs are a clinic note that stays in an approved environment and does not write medications, a lab arm that localizes with a camera and stops when confidence is low, a hiring screener that does not emit a hire score and does not receive photos, a tutor that gives a hint rather than the final answer and cites course notes, and a sandbox brief the learner writes.

**Feedback.** The breakdown lists covered criteria, missed criteria, whether the reflection is long enough, and whether every self-rating was filled in. Self-ratings do not secretly define a second correct architecture. They are part of the rubric because the learner has to judge their own design against the same rows.

**Common misconception addressed.** A fluent diagram is not yet a design until each constraint is covered or explicitly declined.

**Learning objectives.** Translate a written constraint into a choice that covers it. Reject a more capable choice that misses a constraint. Write a reflection that names a tradeoff. Complete a self-assessment against the printed rubric.

**Bloom level.** Analyze, evaluate, create.

**Estimated time.** About 40 minutes for the six briefs.

**Implementation note.** Constraint-coverage capstone. Coverage is computed from the covers and misses on the selected options, plus reflection length and completed self-ratings. No system is deployed. The rubric is not a claim that one architecture is universally correct. There is one challenge per path in this release, not a library of three to five, and there is no community sharing board.

## Complete learning session walkthrough

1. The learner opens the app. The home page lists the three tiers and the games the config has enabled.
2. The pre-assessment is optional. Ten questions, scored as percent correct, stored only after submit. Explanations appear after submit.
3. The learner starts Token Forge, reads the implementation note and the worked example, and starts the game.
4. Rounds get more specific: a plain clause, then code, then cases where the segmentation family matters more.
5. Selecting a family updates the pieces and the cost immediately. Locking the round shows the score.
6. If the learner is stuck, they reveal hint 1, then 2, then 3. Each hint subtracts one point from that round, down to zero.
7. At the end, the best round scores are summed. Mastery is 70 percent unless the config changed it. The record is written to IndexedDB, or to localStorage if IndexedDB is unavailable.
8. The progress page recommends the next unlocked game that is not yet mastered.
9. After four Cognitive Core games are mastered, Systems Forge opens. The learner can instead turn on Practice ahead.
10. Systems games ask for a design under numeric or checklist constraints.
11. After three Systems Forge games are mastered, Foundry opens. The learner completes a brief, a reflection, and the self-ratings.
12. From the progress page the learner can export CSV and JSON, or delete the local record. The post-assessment is the same ten items, stored separately from the pre-assessment.

## Scoring and mastery

Every round is worth 10 points before hints. On card-style rounds, the best fit scores 10, an acceptable fit scores 6, and a poor fit scores 0. Computed rounds score 10 when every target is met and 0 otherwise, except where the evaluator marks a partial success. Partial successes are labeled in the feedback. They are not a hidden curve.

Each revealed hint subtracts 1 point from that round after the raw score, with a floor of 0. At most three hints can be revealed. The penalty is printed on the hint box and again in the feedback: raw points, hint count, round score.

A retry replaces the action and clears the hint counter for the new attempt. If the new score is lower, the previous best is kept. The game percent is `round(earned / (rounds × 10) × 100)` using each round's best score. Letter grades, when shown, are A for 90 and above, B for 80–89, C for 70–79, D for 60–69, and F below 60.

Mastery is that percent at or above the threshold, and only after every round has a score. The default threshold is 70. `config/odyssey.config.ts` replaces each game's own threshold while `overrideGameThresholds` is true, which it is in the shipped file. Set the flag to false to honor the number inside the game file. The educator page shows the threshold that will actually be used.

Foundry uses the same 10-point scale. Points are proportional to the rubric. A criterion counts as covered when a selected option lists it and no selected option misses it. Reflection length and a completed self-rating are their own criteria. There is not a second, hidden answer.

## Hint system

Hints are graduated because an immediate answer ends the practice. The first hint names the idea. The second says where to look. The third gives away more of the reasoning and still leaves the selection to the learner.

The penalty is small on purpose. Three hints on a perfect raw score leave 7 out of 10. A learner can use hints and still master the game. The achievement list treats that as scaffolded success, and it treats a mastered game with no hints on the best attempts as independent mastery. Both are recorded. Neither is required.

Hint use is stored on the round as `totalHints` and as `hintsOnBestAttempt`.

## Progress and achievements

The progress page shows overall status, per-tier mastery counts, a concept list, scores, attempts, hints, time on the game page, and the recommended next game. Concept "mastery" on that page means a game that lists the concept has been mastered. It is a summary of progress, not a psychometric scale.

Achievements are derived from the record every time it is saved. They are not a separate score. The learning-oriented ones are mastery, independent mastery, scaffolded mastery, full marks, Cognitive Core, Systems Forge, Foundry, and both assessments. Completion of a game without meeting the threshold is recorded and is not called mastery. The "Odyssey complete" achievement requires mastery of all 13 games, not merely opening them.

Tier unlocks follow the counts above. They are educational structure. The badges are labels for those states.

## Educator use

Educator mode is `/educator`. It does not ask for a password. It is generated from the game files, so the objectives on the page are the objectives in the content.

### Lecture companion

Teach the idea, then open the matching game and play one round where the class can see the readout change.

### Lab

Assign one or two games. Ask students to export the progress CSV at the end of the period. The CSV has scores, attempts, time, hints, and the reflection.

### Independent module

Assign a tier plus the optional pre-assessment and post-assessment. Students can practice ahead if you want them to sample later games, or you can leave the locks on.

### Capstone

Assign a Foundry path. Read the reflection and the self-ratings. The in-app score is the coverage rubric. Your grade can weigh the reflection more heavily than the app does. Say that in the syllabus if you do.

### Six-week example

| Week | Assignment |
| --- | --- |
| 1 | Token Forge and Attention Architect |
| 2 | Context Compression and Promptsmith |
| 3 | Gradient Playground, Reasoning Reactor, and Alignment Arena |
| 4 | Retrieval Lab and Agent Architect |
| 5 | System Composer and ProdOps Gauntlet |
| 6 | Foundry Arena |

Week 4 is inside Systems Forge, so students need four mastered Cognitive Core games, or Practice ahead, or a config change, before those links open.

For a live class demo that should not touch anyone's record, use `/demo`. Reset Classroom Demo on the educator page restores the sample demo record. It does not delete the learner record.

## Customization

Interface code reads content. It does not contain the challenge sentences. Edit `content/games/token-forge.ts` to change Token Forge. The same pattern holds for the other twelve files in `content/games/`.

A round looks like this, abbreviated from the real schema:

```ts
{
  id: "english-clause",
  title: "Round 1 · A plain English clause",
  concept: "Word-like pieces versus subwords",
  learnerTask: "Choose the segmentation with the best cost-quality fit.",
  hints: ["Start by counting pieces, not characters.", "Look at the possessive.", "The Unigram row keeps it in one piece."],
  scoringRule: "Best scores 10. Acceptable scores 6. Poor scores 0. Each hint subtracts 1.",
  interaction: { type: "tokenizer", text: "The contractor's liability is limited.", strategies: [] }
}
```

The real objects are longer. Zod requires every field. A mistake names the file and the path when the app loads.

To change challenge text, edit `scenario`, `learnerTask`, or the option labels. To add a round, append an object with a new `id` and three hints. To change hints, edit the `hints` tuple. To change the mastery threshold for the whole course, edit `masteryThreshold` in `config/odyssey.config.ts`. To disable a game, remove its id from `enabledGames`. To reorder, edit `gameOrder`. To add a citation, add an object to `content/references.ts` and put its id in `furtherReadingIds`. To set branding, set `title`, `institution`, and `logoSrc`. Put a logo file in `public/` and point `logoSrc` at it, for example `/institution.svg`.

`config/odyssey.config.ts` in the repository starts as:

```ts
export default {
  title: "LLM Odyssey",
  institution: "",
  researchMode: false,
  masteryThreshold: 70,
  showFoundry: true,
  enabledGames: ["token-forge", "attention-architect", "..."],
};
```

The shipped file also sets tagline, logo, unlock counts, `overrideGameThresholds`, and the full id lists. Research mode in the running app prefers `VITE_RESEARCH_MODE` when that variable is `true` or `false`.

A new Foundry brief is a new round in `content/games/foundry-arena.ts` whose interaction type is `foundry`, with a `pathId` of industry, healthcare, robotics, ethics, education, or sandbox. `content/challenges/foundry.ts` lists those rounds for anything that wants the path ids without parsing React.

## Adding a new game

1. Create `src/games/<id>/index.ts` that re-exports the definition.
2. Write `content/games/<id>.ts` as a `GameDefinition`. `examples/custom-game/sample.ts` is a minimal valid file. It is not registered, and learners do not see it.
3. Put rounds, hints, objectives, the misconception, the worked example, and the implementation note in that file.
4. If you use an existing interaction type, you do not write a new component. A new interaction type needs a Zod variant, a branch in `src/game-engine/evaluate.ts`, and a branch in `src/components/game/InteractionHost.tsx`.
5. Import the file from `src/content/load-games.ts` and `src/games/register.ts`. Add the id to `enabledGames` and `gameOrder`. The loader currently expects 13 games and throws otherwise, so change that check and the test together.
6. The route `/play/:gameId` already exists. Add a route only if the game needs a page that is not the shared shell.
7. `npm test` runs `gameIsSolvable` on every registered game.
8. Add citations to `content/references.ts` and reference them from the game.
9. `npm run build`.

## Architecture

```
Learner
   |
React UI
   |
Shared Game Engine
   |
Game Definitions
   |
Local Progress Store
   |
Optional Analytics Adapter
   |
Optional Backend
```

The React UI is `src/app` for pages and `src/components/game` for the shell and the interaction boards. The shell runs the lifecycle: introduction, round, action, evaluation, feedback, hint or retry, next round, reflection, completion, and a link to the recommended next game.

The shared engine is `src/game-engine`. It owns the Zod schema, scoring, unlock rules, achievements, and `evaluateRound`. Models for attention, the educational loss curve, retrieval, and lever arithmetic live in `src/game-engine/models` so the readout and the grader call the same functions.

Game definitions are `content/games/*.ts`. They are parsed by `src/content/load-games.ts` before the course renders.

The local progress store is IndexedDB through `idb`, database `llmodyssey-learner` or `llmodyssey-demo`, with a localStorage fallback. Session ids live in localStorage.

The optional analytics adapter is created in `src/analytics/create-adapter.ts`. With research mode off it is a no-op. With research mode on and local storage it keeps events only in the learner record. With Supabase configured it also inserts a row. A failed insert does not stop the game.

The optional backend is documented in `supabase/`. The optional model proxy is `examples/llm-proxy/server.mjs`. Gameplay does not start either one.

## Why local-first

A classroom, a conference network, and a lab behind a firewall should be able to run the course without an account on someone else's platform. Local play has no per-student API bill, fewer services that can be down during a demo, and a clear privacy story: the record is on the machine that played. The same inputs produce the same scores, which is what you want if two students are comparing work or if you are writing a worksheet from a round.

The optional backend does not add gameplay. It can store anonymous events if you configure it. The optional model proxy does not add gameplay either. It exists so a later lesson can call a vendor without putting a key in the frontend. The thirteen games do not call it.

## Data and privacy

Default local mode stores a random session id, game progress, scores, attempts, hints, reflections, assessment answers, and anonymous interaction events. Settings such as Practice ahead are in the same record. Research consent, only relevant if you enable research mode, is a separate localStorage flag, `llmodyssey.researchConsent`.

That data remains in the browser. Export it from `/progress` or `/educator` as progress CSV, assessment CSV, events CSV, or events JSON. Delete it with "Delete local data" on the progress page. That control deletes the record for the mode you are in. Deleting the learner record does not delete the demo record, and the reverse is also true.

Using this public repository does not make a player a research participant. The app does not ask for a name or an email.

## Research mode

Research mode is disabled by default with `VITE_RESEARCH_MODE=false`. When it is enabled, the app asks whether to keep anonymous events. A yes allows the adapter to run. A no leaves gameplay intact and skips the adapter. The session id is a random id created in the browser. Events use the schema above. They do not include an IP address collected by this app, a name, an email, or a device fingerprint.

Consent in the dialog is not an ethics approval. This repository does not state that every deployment is IRB or REB approved. It does not state that players of the public project are enrolled in a study. An institution that enables research mode obtains its own approval where one is required, and it keeps any contact list apart from the event table. The SQL in `supabase/migrations` has no contact columns on purpose.

## Simulation versus real execution

| Game | Implementation type | What is real | What is simulated |
| --- | --- | --- | --- |
| Token Forge | Precomputed segmentations | Counts and cost arithmetic on the pieces shown | The pieces themselves; not a live tokenizer |
| Attention Architect | Simplified computation | Scaled dot-product and softmax on the given vectors | A transformer; the vectors are hand-written |
| Context Compression | Deterministic simulation | Budget, relevance, and must-keep checks | Abstractive summary text, which is prewritten |
| Promptsmith | Deterministic simulation | The comparison among authored strategies | Any model response; none is requested |
| Gradient Playground | Educational simulation | The documented loss formula and the chart | Training; there are no parameters or data |
| Reasoning Reactor | Deterministic simulation | Checklist scoring and the sample table lookup | Sampling; the strings were written ahead of time |
| Alignment Arena | Educational simulation | The weighted sum of printed scores | Reward-model training and real raters |
| Ship-It Simulator | Deterministic simulation | Baseline plus authored lever effects | A cluster, queue, or live API |
| Agent Architect | Deterministic simulation | Needed and harmful flags | Tool execution; nothing is called |
| Retrieval Lab | Simplified computation | Cosine, overlap, hybrid scores, precision, recall | Embeddings; vectors are 3-D examples; no neural reranker |
| System Composer | Deterministic simulation | Sums and set coverage | Deployed services; units are teaching numbers |
| ProdOps Gauntlet | Deterministic simulation | The labeled comparison among written responses | Monitoring; the metrics are part of the case |
| Foundry Arena | Deterministic simulation | Coverage, reflection length, completed self-ratings | A deployment; the rubric is not a universal design |

## Technical setup

Prerequisites: Node.js 22, npm, and git. No API key. No database.

```bash
git clone https://github.com/piaattufts/llmodyssey.git
cd llmodyssey
npm install
npm run dev
```

Vite prints a local URL. The development default is port 5173 unless you pass another port.

```bash
npm run build
npm run preview
```

`npm run build` typechecks and writes `dist/`.

Environment variables, all optional:

| Variable | Default | Role |
| --- | --- | --- |
| `VITE_STORAGE_MODE` | `local` | `supabase` selects the optional analytics insert. Anything else stays local. |
| `VITE_RESEARCH_MODE` | `false` | `true` shows the consent dialog and allows the adapter. |
| `VITE_SUPABASE_URL` | empty | Used only with the Supabase adapter. |
| `VITE_SUPABASE_ANON_KEY` | empty | Used only with the Supabase adapter. Never a service-role key. |
| `VITE_LLM_PROVIDER` | `mock` | `mock` unless this is something else and the proxy URL is set. |
| `VITE_LLM_PROXY_URL` | empty | Browser calls this URL. The proxy holds vendor keys. |
| `VITE_BASE_PATH` | `/` | Set to `/llmodyssey/` for GitHub Pages. |

Copy `.env.example` to `.env` only if you are changing one of these. A stock clone does not need the file. `VITE_` values are compiled into the static build. Do not put secrets in them.

## Demo mode

Open `/demo`.

It is for conferences, faculty demonstrations, classroom previews, and workshops. It does not ask for an API key. After the page has loaded, the games, the sample record, and the tour do not need the network. If Supabase, a model provider, or analytics is misconfigured, the course still runs and a short banner explains the fallback.

Demo mode uses a separate browser record, so it does not overwrite a learner who later uses the same machine. It opens every tier. It loads a sample record the first time the demo store is empty: Token Forge and Attention Architect mastered, Context Compression started, a sample pre-assessment, and three sample events. Reset Classroom Demo on `/educator` or `/demo/educator` restores that sample.

The guided tour is eight steps, meant to take about five to eight minutes. Start it from the demo home.

1. Show the three tiers.
2. Open Token Forge.
3. Show immediate feedback on a tokenizer choice.
4. Show the three hint levels and the printed penalty.
5. Open the progress page.
6. Open Ship-It Simulator for Systems Forge.
7. Open Foundry Arena.
8. Open the educator page.

Each step is a link with a `tour` query parameter. The bar on the page says what to click.

## Deployment

Build with `npm run build`. Publish the `dist` directory.

### GitHub Pages

This repository's project site is served under `/llmodyssey/`.

```bash
VITE_BASE_PATH=/llmodyssey/ npm run build
```

The build copies `dist/index.html` to `dist/404.html` so a refresh on a client route still loads the app. Point GitHub Pages at that `dist` output. Do not add secret environment variables.

### Vercel

Import the Git repository `https://github.com/piaattufts/llmodyssey`. Use the Vite preset if offered. Build command `npm run build`. Output directory `dist`. `vercel.json` rewrites all paths to `index.html`. Leave Supabase and LLM variables empty for a faithful demo.

### Netlify

Build command `npm run build`. Publish directory `dist`. `public/_redirects` is included in the build and rewrites `/*` to `/index.html` with status 200.

### Docker

From the repository root:

```bash
docker compose up --build
```

The site is at `http://127.0.0.1:8088`. The image runs `npm run build` and serves the result with nginx. Unknown paths fall back to `index.html`.

### Institutional static server

Copy `dist/` to the web root, or to a subdirectory if you also set `VITE_BASE_PATH` to that subdirectory. Configure the server so routes such as `/play/token-forge` return `index.html`. `nginx.conf` is a working configuration. No database has to be reachable from the browser.

## Repository structure

```
llmodyssey/
├── README.md
├── LICENSE
├── CITATION.cff
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CHANGELOG.md
├── .env.example
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── eslint.config.js
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── vercel.json
├── config/odyssey.config.ts
├── content/
│   ├── games/                 # one definition per game
│   ├── challenges/foundry.ts  # path ids taken from Foundry rounds
│   ├── assessments/index.ts   # pre/post items
│   ├── concept-guides/index.ts
│   ├── references.ts
│   └── achievements.ts
├── docs/                      # educator, student, deployment, customization, research, design, pedagogy, architecture, adding a game, migration audit
├── examples/
│   ├── custom-game/sample.ts  # valid, unregistered example
│   └── llm-proxy/server.mjs   # sample server-side proxy, not started by the app
├── public/
├── src/
│   ├── app/                   # routes, pages, demo seed, tour
│   ├── components/            # game shell, interaction boards, UI primitives
│   ├── games/                 # one folder per game, re-exporting its definition
│   ├── game-engine/           # schema, scoring, evaluation, models
│   ├── content/load-games.ts
│   ├── storage/               # IndexedDB repository and CSV export
│   ├── analytics/             # noop, local, and optional Supabase adapters
│   ├── research/mode.ts
│   ├── llm/providers.ts
│   ├── hooks/use-learner.tsx
│   └── site.ts                # canonical repository URL and citation fields
├── supabase/migrations/       # optional anonymous event table
├── tests/engine.test.ts
└── e2e/smoke.spec.ts
```

`src/instructor` is not a separate package. Instructor screens are `src/app/pages/EducatorPage.tsx`. `src/pedagogy` is not a separate package. Unlock and mastery rules are in `src/game-engine`, and the narrative is in `docs/pedagogy.md`.

## Testing

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

`npm test` runs Vitest. It checks that both registries contain the same 13 games, that every round has a successful solver action, that the Token Forge volume round really has 19 and 23 pieces, that attention winners are unique and match the clicked index, that hint penalties and letter grades match the published bands, that 35 out of 50 is 70 percent and is mastery, that Systems Forge and Foundry honor the unlock counts and Practice ahead, that a memory repository saves, exports, and deletes, that research mode defaults off, that the model provider defaults to the mock, and that the README, citation file, and package metadata point at `https://github.com/piaattufts/llmodyssey`. It also checks that `src/` does not mention Base44.

`npm run test:e2e` runs a Playwright smoke test: open the home page, enter Token Forge, complete round 1, read the feedback, open progress. Install browsers with `npx playwright install chromium` before the first e2e run. Continuous integration runs typecheck, lint, unit tests, and the production build. It does not need secrets.

## Accessibility

The interface uses semantic regions: navigation, main, headings, and buttons. The course menu is a persistent sidebar from the `md` breakpoint up. On smaller screens it is a button that opens a drawer. Interactive controls in the course are at least 44 pixels on the short side. Focus uses a visible ring, and `:focus-visible` adds an outline.

Correctness is not communicated by color alone. Selected cards say "selected." Metrics say "met" or "not met." Feedback says "Met the round target," "Partly met," or "Not met." Progress is text as well as a bar, and the bar has an accessible name. A `prefers-reduced-motion` stylesheet collapses animation and transition duration. The feedback panel also skips its entrance animation when reduced motion is requested.

Contrast uses light text on a dark laboratory background, with muted text kept light enough for body copy. This is an intentional effort toward WCAG 2.2 AA, not a formal audit certificate.

## References

Technical background used by the games is listed in `content/references.ts` and linked from each concept guide. The main works are:

- Vaswani et al., "Attention Is All You Need," 2017. <https://arxiv.org/abs/1706.03762>
- Sennrich, Haddow, and Birch, "Neural Machine Translation of Rare Words with Subword Units," 2016. <https://aclanthology.org/P16-1162/>
- Schuster and Nakajima, "Japanese and Korean Voice Search," 2012, for WordPiece. <https://doi.org/10.1109/ICASSP.2012.6289079>
- Kudo and Richardson, "SentencePiece," 2018. The ACL Anthology entry is linked from `content/references.ts`.
- Kudo, "Subword Regularization: Improving Neural Network Translation Models with Multiple Subword Candidates," 2018, for the Unigram language model.
- Hu et al., "LoRA: Low-Rank Adaptation of Large Language Models," 2021. <https://arxiv.org/abs/2106.09685>
- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," 2020. <https://arxiv.org/abs/2005.11401>
- Karpukhin et al., "Dense Passage Retrieval for Open-Domain Question Answering," 2020.
- Ouyang et al., "Training language models to follow instructions with human feedback," 2022. <https://arxiv.org/abs/2203.02155>
- Christiano et al., "Deep Reinforcement Learning from Human Preferences," 2017.
- Brown et al., "Language Models are Few-Shot Learners," 2020.
- Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models," 2022.
- Wang et al., "Self-Consistency Improves Chain of Thought Reasoning in Language Models," 2022.
- Yao et al., "Tree of Thoughts," 2023.
- Bommasani et al., "On the Opportunities and Risks of Foundation Models," 2021.
- Huyen, *Designing Machine Learning Systems*, 2022, for production constraints.
- Zamfirescu-Pereira et al., "Why Johnny Can't Prompt," 2023.

Pedagogical background, also in `content/references.ts`: Black and Wiliam on formative assessment; Vygotsky on the zone the hints are meant to occupy; Sweller on cognitive load; Bloom, "Learning for Mastery," 1968; Anderson and Krathwohl's revision of Bloom's taxonomy; Deci and Ryan on self-determination; Brown, Collins, and Duguid on situated cognition; Hamari, Koivisto, and Sarsa on gamification evidence; Csikszentmihalyi, *Flow*, 1990; Piaget, *The Construction of Reality in the Child*. Book entries that do not have a verified DOI point at a WorldCat search rather than at an invented identifier.

The Odyssey paper itself is Tripathi, arXiv:2608.16924.

## Research and citation

LLM Odyssey is the software described in "WIP: LLM Odyssey: A Game-Based Platform for Teaching LLM Engineering Concepts" by Priyamvada Tripathi. The current affiliation is the Tufts Institute for Artificial Intelligence at Tufts University. Original development and the Winter 2026 deployment were conducted while the author was at Durham College.

The verified paper record used here is arXiv:2608.16924, <https://arxiv.org/abs/2608.16924>, DOI 10.48550/arXiv.2608.16924. No other DOI is stated because none has been verified for this software release.

`CITATION.cff` is the machine-readable citation. GitHub and many reference managers read it from the repository root. Please cite both the software and the paper when the distinction matters: the paper is the design report, and this repository is the implementation you can run.

Contact for the author of the software: pia.tripathi@tufts.edu. Please use the scholarly name Priyamvada Tripathi in citations.

## Limitations

The simulations simplify production systems. A 3-dimensional vector is not an embedding model. An authored segmentation is not the tokenizer you will call next year. The loss formula is not a training run. Deterministic exercises do not show the variance of a real model at a non-zero temperature.

Some ideas are abstracted on purpose: positional encodings are discussed rather than trained, reranking is top-k on a score rather than a second model, and agent tools are flags rather than APIs. Those abstractions can teach the decision and still leave out failure modes you will meet in a codebase.

LLM engineering practice changes quickly. Content will go stale and should be revised in `content/` rather than defended as complete.

Learning effectiveness is not established by shipping the software. The pre/post check is available for a class or a study. This repository does not report a treatment effect.

Foundry scoring is a rubric, not a unique correct design. Two learners can cover the same constraints with different reflections, and a human reader may value those reflections differently. The app will give them the same coverage score.

Listed per-game prerequisites are visible and are not a second lock. If you need "finish Token Forge before Attention Architect" as a hard gate, that is a change to `unlockStatus`, not a setting that already exists.

Each Foundry path has one brief. A community board for sharing solutions is not part of this release.

## Contributing

Educators and developers can contribute new rounds, new games, translations, accessibility improvements, corrections to the technical content, bug fixes, and written reports of classroom use. Issues are at <https://github.com/piaattufts/llmodyssey/issues>. Please read `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.

Do not file learner exports or participant data. If a study needs a data deposit, that deposit belongs in the institution's approved archive, not in this gameplay repository.

## Future work

The following are not implemented. They are listed so they are not confused with the current app.

- More than one challenge per Foundry path.
- Optional sharing of Foundry write-ups through a backend.
- Live tokenizer libraries behind Token Forge, still labeled as such.
- A training run behind Gradient Playground.
- Adaptive difficulty that changes rounds from performance.
- SCORM or LTI packaging.
- A graded instructor view of many students at once. The current educator page reads one browser.

## License

MIT. See `LICENSE`.
