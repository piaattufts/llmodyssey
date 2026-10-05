import { buildOrientation } from "./copy.ts";

const play = [
  "Read the round brief. It names the concept and the goal, not the answer.",
  "Inspect the scenario and the choices or controls.",
  "Make a decision that fits the goal.",
  "Submit the round.",
  "Read the feedback: your decision, the result, why, the trade-off, and the takeaway.",
  "Retry if you want another attempt, or continue.",
  "Finish every round, then review your result and self-check.",
];

export const tokenForgeOrientation = buildOrientation({
  tagline: "See how text becomes the units an LLM actually processes.",
  overview:
    "Token Forge is a comparison of tokenization strategies. You will see the same text split in more than one way, then decide which split fits the engineering goal.",
  whyItMatters:
    "LLMs do not normally process sentences as sequences of human-defined words. Text is converted into tokens first. That choice changes sequence length, context-window use, processing cost, and how unusual words, code, and multilingual text are represented. Tokenization is both a model-design concept and a practical engineering decision.",
  learningObjectives: [
    "Explain what a token is, and how it differs from a word.",
    "Compare BPE, WordPiece, SentencePiece, and Unigram approaches at a conceptual level.",
    "Recognize why different text types produce different tokenization behavior.",
    "Explain why token count can affect context usage, latency, and API cost.",
  ],
  whatYouWillDo:
    "You will work through five text scenarios of increasing complexity. For each one you read the text and the engineering goal, inspect several tokenizer representations, compare segmentation and token counts, choose the strategy you think best fits, submit, and read the feedback. You can retry or continue.",
  howToPlay: play,
  howItWorks:
    "The built-in segmentations are authored, precomputed educational examples. Every learner sees the same comparison. The application calculates token counts, comparative metrics, and displayed cost estimates from those representations. Token Forge is an educational tokenizer comparison. It is not a live implementation of a production tokenizer from a commercial LLM provider.",
  earns:
    "Your score reflects whether you identify an appropriate tokenization strategy for each scenario. The strategy marked best scores 10. An acceptable alternative scores 6. A poor fit scores 0.",
  roundCount: 5,
  efficiencyMatters:
    "Token count and the displayed cost matter, but the shortest segmentation is not automatically the goal. The round says what must stay recognizable.",
  multipleAcceptableAnswers:
    "Some rounds have an acceptable answer as well as a best answer. Acceptable earns partial credit. Poor earns none.",
  mastery:
    "You are demonstrating conceptual mastery when you can explain why two tokenizers may segment the same text differently, why code, morphology, or mixed-script text can behave differently from ordinary English, and why fewer tokens are sometimes useful without being the only goal.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "Plain English" },
    { label: "Round 2", difficulty: "Application", focus: "Code and Python-like text" },
    { label: "Round 3", difficulty: "More complex", focus: "Morphologically complex text" },
    { label: "Round 4", difficulty: "Cross-context", focus: "Multilingual or mixed-script text" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Domain text under a cost constraint" },
  ],
  recommendedNext: "Attention Architect, if you want to see what a model does with those tokens.",
  implementationNote:
    "Simulation disclosure: segmentations are authored illustrations, not the output of a production tokenizer library. Counts, efficiency figures, and dollar estimates are real arithmetic on the pieces shown on screen.",
  estimatedTime: "About 20 minutes",
  beforeYouStart: [
    "You do not need a tokenizer library or an API key.",
    "Count pieces, not characters.",
    "A familiar word can still be more than one token.",
  ],
  selfCheck: [
    "Can I explain why the same string can have different token counts?",
    "Can I say when a shorter segmentation would still be the wrong engineering choice?",
  ],
  reflectionPrompts: [
    "What trade-off in this game was most important?",
    "What would you inspect before choosing a model for a new kind of text?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Choose a representation for frequent English that does not spend tokens splitting words the sentence does not need to split.",
      tradeoff: "Keeping frequent words whole uses fewer tokens. Splitting them can still be readable, but it spends context and money the sentence did not require.",
      takeaway: "A token is a model unit, not a dictionary word.",
      realSystem: "An API bills and attends over tokens. A sentence that looks short in an editor can still be expensive after segmentation.",
    },
    {
      difficulty: "Application",
      goal: "Choose the representation that keeps the code structure recognizable, especially the identifier, at a lower token count.",
      tradeoff: "Splitting snake_case and punctuation makes the prompt longer and harder to align with the code. A compact row can keep the name intact.",
      takeaway: "Code is a different distribution from prose, so the preferred segmentation can change.",
      realSystem: "Code-review and tool-calling prompts often pay their token cost in identifiers and punctuation, not in English words.",
    },
    {
      difficulty: "More complex",
      goal: "Choose the representation that handles a compound efficiently while preserving meaningful subword units.",
      tradeoff: "A character-level split is always possible and usually expensive. A morpheme-like split stays shorter and still shows the parts of the word.",
      takeaway: "Subword tokenization is how models represent words that were rare or unseen as whole words.",
      realSystem: "Product names, compounds, and technical terms are where vocabulary design shows up in context length.",
    },
    {
      difficulty: "Cross-context",
      goal: "Choose the representation that handles mixed-script text without exploding the token count or dropping a name.",
      tradeoff: "A vocabulary built for English can slice another script into many pieces. A segmentation that keeps the name together changes both cost and fidelity.",
      takeaway: "Multilingual text is not a font change. It is a vocabulary problem.",
      realSystem: "A prompt that mixes languages or scripts can consume far more of the context window than the same message in plain English.",
    },
    {
      difficulty: "Trade-off",
      goal: "Choose the representation that stays cheaper at volume while keeping the operative legal language intact.",
      tradeoff: "The fewest tokens are useful only if the limitation language is still there. Dropping words to save tokens would change the clause.",
      takeaway: "Minimum token count is not automatically the only engineering goal.",
      realSystem: "High-volume calls turn a small per-call difference into a real invoice, which is why teams measure tokens before they pick a model.",
    },
  ],
});

export const attentionArchitectOrientation = buildOrientation({
  tagline: "See which token a simplified attention calculation actually emphasizes.",
  overview:
    "Attention Architect shows how attention changes the importance assigned to different positions when a representation is built. You read a tiny, fully visible calculation and choose the token it weights most.",
  whyItMatters:
    "Attention is how one token gathers information from others. Query, key, and value are the three roles in that operation. The attention score is a comparison, usually a dot product. Softmax turns scores into weights that sum to 1. Multiple heads can emphasize different positions. Position can change the winner. If you cannot read a small pattern, a production heatmap is only a picture.",
  learningObjectives: [
    "Explain the roles of query, key, and value in one attention step.",
    "Identify the token with the highest scaled dot-product attention weight.",
    "Explain why softmax keeps the winner while turning scores into weights.",
    "Contrast two heads that assign importance to different positions.",
  ],
  whatYouWillDo:
    "You will not edit the vectors. For each round you read a short token sequence and a simplified attention result, select the token you think receives the highest weight, and check that choice against the computed weights. Later rounds change what the query matches, including polarity, position, and a second head.",
  howToPlay: [
    "Read which head you are inspecting.",
    "Look at the tokens. One of them is your answer.",
    "Use the displayed weights. The largest weight is the winner.",
    "Select that token and submit.",
    "Read why that query-key match won, and what a different match would have gathered.",
    "Retry or continue until all five rounds are done.",
  ],
  howItWorks:
    "This is a simplified educational calculation, not transformer inference. The vectors are hand-authored for the lesson. The browser computes scores as query · key / scale, then softmax. The heatmap is those computed weights. It is not the attention of a trained model, and it is not a claim about hidden internal reasoning. Value mixing is described so you know what the weights would do. The question you answer is which key wins.",
  earns:
    "You earn 10 points by selecting the token with the highest simplified attention weight on the named head. Any other token scores 0. There is no partial credit on these rounds.",
  roundCount: 5,
  efficiencyMatters:
    "Efficiency is not the score. The score is whether you read the weight correctly. A grammatically important word can still lose.",
  multipleAcceptableAnswers:
    "Each round has one winning token under the shown math. A tie is not used. Two heads can have two different winners, and only the named head counts.",
  mastery:
    "Mastery here is being able to explain why changing the query, the keys, or the head changes which information contributes to a representation. Remembering a token from a previous round is not the same thing.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "A query matching one key" },
    { label: "Round 2", difficulty: "Application", focus: "What a pronoun points at" },
    { label: "Round 3", difficulty: "More complex", focus: "Polarity and contrast" },
    { label: "Round 4", difficulty: "Cross-context", focus: "Position changes the winner" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Two heads, two winners" },
  ],
  recommendedNext: "Context Compression, to see what happens when those tokens must fit in a budget.",
  implementationNote:
    "Simulation disclosure: the arithmetic is real for these toy vectors. The vectors are authored. There is no trained transformer, no residual stream, and no production-model attention to display. Do not describe the heatmap as the model's actual attention.",
  estimatedTime: "About 25 minutes",
  beforeYouStart: [
    "You select a token. You do not train a model or edit matrices.",
    "The largest displayed weight is the answer for the named head.",
    "A diagram's arrow is not a substitute for the number.",
  ],
  selfCheck: [
    "Can I explain why a different query or key would change the winner?",
    "Can I say what this heatmap is, and what it is not?",
  ],
  reflectionPrompts: [
    "What did a high attention weight actually claim in this game?",
    "What would be different if you were looking at a trained model's attention?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Select the token whose key best matches the query in this authored example.",
      tradeoff: "A nearby or grammatical word can look important and still receive less weight. The representation would then mix in a different value.",
      takeaway: "Attention weight is a computed match, not a grammar label.",
      realSystem: "In a real model the same three roles exist, but the vectors are learned and many layers deep. This page shows one step you can recompute.",
    },
    {
      difficulty: "Application",
      goal: "Find the token this head treats as the referent, using the weights rather than a hunch about the pronoun.",
      tradeoff: "If the weight lands on the wrong noun, later layers mix in the wrong information even if the sentence is obvious to you.",
      takeaway: "A pronoun is resolved here only if the query-key match says so.",
      realSystem: "Coreference in a production model is distributed across layers. One head is a clue, not the whole parse.",
    },
    {
      difficulty: "More complex",
      goal: "See how polarity changes which token the head emphasizes.",
      tradeoff: "Emphasizing the negated word and emphasizing the affirmative word support different representations.",
      takeaway: "The same sentence can point attention at opposite evidence.",
      realSystem: "Negation errors in applications often start when the important contrast is under-weighted.",
    },
    {
      difficulty: "Cross-context",
      goal: "Notice that position, not only word identity, can decide the winner.",
      tradeoff: "The same word in another position can lose. A model that ignores position would answer this round differently.",
      takeaway: "Positional information is part of what attention can use.",
      realSystem: "Production models add positional information so identical words in different places are not interchangeable.",
    },
    {
      difficulty: "Trade-off",
      goal: "Read the named head. Another head in the same round may prefer a different token.",
      tradeoff: "Multiple heads let one representation draw on more than one relationship. Averaging them blindly would hide the disagreement.",
      takeaway: "Heads specialize. There is not always one attention pattern.",
      realSystem: "Multi-head attention is how a layer looks at several relationships at once. This round shows two authored patterns, not a full multi-head layer.",
    },
  ],
});

export const contextCompressionOrientation = buildOrientation({
  tagline: "Keep what the task needs inside a hard token budget.",
  overview:
    "Context Compression is about fitting source text into a context window. The objective is not simply to make the text shorter. You have to preserve task-relevant information under a constraint.",
  whyItMatters:
    "A context window is a token budget. Relevance is what the task still needs after you cut. Information loss is a product bug when a negation, a deadline, or a required fact disappears. Extractive compression keeps original spans. Abstractive compression rewrites them. Hierarchical strategies summarize in layers. Each one can save tokens and each one can drop the sentence the answer depends on.",
  learningObjectives: [
    "Distinguish a shorter context from a context that still answers the task.",
    "Compare extractive, abstractive, and hierarchical compression.",
    "Reject a summary that drops a must-keep fact.",
    "Explain information loss as a relevance failure, not only a length failure.",
  ],
  whatYouWillDo:
    "You will receive passages with a token budget and a relevance requirement. You choose a compression strategy and, when the strategy asks for spans, you choose what to keep. Then you see whether the result fits the budget and still carries the required facts.",
  howToPlay: [
    "Read the budget and which facts must survive.",
    "Choose extractive selection, a prewritten summary, or hierarchical notes.",
    "If you are selecting spans, keep the ones the task cannot lose.",
    "Check the running token total against the budget.",
    "Submit and read what was kept, what was dropped, and why that mattered.",
    "Retry or continue through all five rounds.",
  ],
  howItWorks:
    "Token sums, budget checks, and relevance totals are calculated from the numbers in the round. Abstractive summaries are prewritten educational text. The game does not call a model to summarize. A summary that is under budget can still fail if it drops a must-keep fact.",
  earns:
    "A round scores 10 only when the strategy stays inside the token budget, meets the minimum relevance, and does not drop a must-keep fact. Otherwise it scores 0.",
  roundCount: 5,
  efficiencyMatters:
    "Length matters because of the budget. It does not replace relevance. The shortest option can be the failing one.",
  multipleAcceptableAnswers:
    "When the round requires a specific strategy, only that strategy can pass. When it does not, more than one selection can pass if the budget and the must-keep facts are satisfied.",
  mastery:
    "You can judge your own understanding by explaining what you kept, what you removed, and why. If you can only say that the text got shorter, the concept is not yet secure.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "Extract a required fact" },
    { label: "Round 2", difficulty: "Application", focus: "Do not drop a negation" },
    { label: "Round 3", difficulty: "More complex", focus: "Must-keep facts that do not fit" },
    { label: "Round 4", difficulty: "Cross-context", focus: "Hierarchical notes" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Relevance over raw length" },
  ],
  recommendedNext: "Promptsmith, where the compressed context becomes part of an instruction.",
  implementationNote:
    "Simulation disclosure: budget arithmetic is real. The summary sentences are authored ahead of time. Nothing on this page is a live compressor or a model-written abstract.",
  estimatedTime: "About 20 minutes",
  beforeYouStart: [
    "Shorter is not the goal. Surviving the task is the goal.",
    "Watch for negations, deadlines, and spans marked must-keep.",
    "A summary can be under the budget and still be wrong.",
  ],
  selfCheck: [
    "Can I name what I kept, what I removed, and why?",
    "Can I explain when an abstractive summary is riskier than a cut-and-keep?",
  ],
  reflectionPrompts: [
    "What information was most dangerous to drop?",
    "When would you refuse to compress further in a real system?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Keep the refund rule inside the budget. Do not spend the budget on background the task does not ask for.",
      tradeoff: "Extracting the rule preserves the original wording. Summarizing can be shorter and can also change the rule.",
      takeaway: "Compression is a relevance decision with a length constraint.",
      realSystem: "Retrieval and chat apps both hit context limits. The fact that answers the user has to remain after the cut.",
    },
    {
      difficulty: "Application",
      goal: "Fit the passage without dropping the negation that changes the meaning.",
      tradeoff: "A fluent shorter text that omits “not” is under budget and still the wrong policy.",
      takeaway: "Information loss includes changed meaning, not only deleted sentences.",
      realSystem: "Support and policy bots fail in production when a compressed policy flips a prohibition into permission.",
    },
    {
      difficulty: "More complex",
      goal: "Notice when the must-keep facts cannot all be pasted through, and choose a strategy that still carries them.",
      tradeoff: "Extractive selection is faithful and can overflow. A prewritten abstract fits only if those facts are still in it.",
      takeaway: "If the required spans do not fit, shortening by deletion is not available.",
      realSystem: "Long documents force a choice between quoting and summarizing. The choice should be explicit.",
    },
    {
      difficulty: "Cross-context",
      goal: "Use hierarchical notes when the source has layers and the budget cannot hold every detail.",
      tradeoff: "A flat extract keeps detail and blows the budget. A hierarchy keeps the decision and loses color. Know which one the task needs.",
      takeaway: "Hierarchical compression is a structure, not just a shorter paragraph.",
      realSystem: "Meeting notes, tickets, and multi-document packs are often summarized in layers so a later step can zoom back in.",
    },
    {
      difficulty: "Trade-off",
      goal: "Prefer the option that preserves task relevance, even when another option is shorter.",
      tradeoff: "Raw length is a cost. Relevance is whether the downstream answer can still be grounded.",
      takeaway: "The objective is not “make it shorter.”",
      realSystem: "Context-window pricing makes teams aggressive about cuts. The evaluation has to check the answer, not only the token bill.",
    },
  ],
});

export const promptsmithOrientation = buildOrientation({
  tagline: "Design a prompt as a specification, not as a magic phrase.",
  overview:
    "Promptsmith is practice in systematic prompt design. You match the shape of the instruction to the failure mode of the task.",
  whyItMatters:
    "A useful prompt specifies the task, the context, the constraints, and the output format. Examples support few-shot prompting when the pattern is easier to show than to define. A role can set voice when voice matters. Decomposition breaks a multi-step task into checks. Evaluation tells you whether the result is actually usable. None of that is a search for magical wording, and none of it requires exposing a model's hidden chain-of-thought.",
  learningObjectives: [
    "Match a prompting strategy to the way a task actually fails.",
    "Specify an output format when the caller must parse the result.",
    "Use examples, constraints, or decomposition on purpose.",
    "Compare reliability with token cost on authored cases.",
  ],
  whatYouWillDo:
    "You will read five tasks. For each one you compare prompting strategies, look at the authored quality and cost, and choose the strategy that makes the specification more reliable for that task. You then read why that change helped and what a weaker specification would have done.",
  howToPlay: [
    "Read the task and the failure you are trying to prevent.",
    "Compare the strategies. Look at format, examples, and cost.",
    "Choose the strategy that makes the result more reliable for this task.",
    "Submit and read which part of the specification did the work.",
    "Ignore any urge to ask for hidden reasoning. This game does not use it.",
    "Continue until all five tasks are done.",
  ],
  howItWorks:
    "The comparison is among authored strategies. Quality, token, and failure labels are written for the exercise. No language model is called. The page is not showing a model's private reasoning, and it will not ask you to extract one.",
  earns:
    "The strategy marked best scores 10. An acceptable strategy scores 6. A poor fit scores 0. You are scored on the design choice, not on prose style.",
  roundCount: 5,
  efficiencyMatters:
    "Token cost is one of the printed trade-offs. When two strategies both meet the task, the cheaper reliable one is the better engineering choice. Cheap and unparseable is not a win.",
  multipleAcceptableAnswers:
    "Yes. An acceptable strategy earns partial credit. There is still a best fit for the stated failure mode.",
  mastery:
    "Ask whether you can explain which change made the task specification more reliable, and why. Quoting a winning phrase without that explanation is not mastery.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "A parseable format" },
    { label: "Round 2", difficulty: "Application", focus: "Decomposition" },
    { label: "Round 3", difficulty: "More complex", focus: "Voice and role" },
    { label: "Round 4", difficulty: "Cross-context", focus: "Few-shot examples" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Quality against cost" },
  ],
  recommendedNext: "Gradient Playground, if you want the training side of model behavior.",
  implementationNote:
    "Simulation disclosure: outcome cards are authored. No model is queried, and no hidden chain-of-thought is displayed or requested.",
  estimatedTime: "About 25 minutes",
  beforeYouStart: [
    "Look for the failure mode before you look for clever wording.",
    "A role by itself does not create a schema.",
    "This game never asks you to reveal private model reasoning.",
  ],
  selfCheck: [
    "Can I explain which change made the specification more reliable?",
    "Can I say what that change cost in tokens?",
  ],
  reflectionPrompts: [
    "Which prompt change did the most work, and why?",
    "What would you measure besides fluency if this prompt ran in production?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Choose the strategy that makes invoice fields parseable, not merely fluent.",
      tradeoff: "A conversational answer can sound helpful and still omit a field the caller must parse. A schema costs a few tokens and prevents that miss.",
      takeaway: "Output format is part of the task, not a decoration.",
      realSystem: "Extraction pipelines fail in production when the model returns a paragraph where the code expected fields.",
    },
    {
      difficulty: "Application",
      goal: "Choose a decomposition when the task has more than one check.",
      tradeoff: "One vague instruction hides the steps. Splitting them makes a wrong quantity easier to catch, at the cost of a longer prompt.",
      takeaway: "Decomposition is a reliability tool.",
      realSystem: "Multi-step business tasks are usually safer as explicit steps with a check than as a single open prompt.",
    },
    {
      difficulty: "More complex",
      goal: "Use role or voice only where the task actually depends on voice.",
      tradeoff: "A persona can steer tone and do nothing for factual constraints. Add it when tone is the requirement.",
      takeaway: "A role is a tool with a purpose, not a default prefix.",
      realSystem: "Support replies often need voice and policy. Voice alone will not enforce the policy.",
    },
    {
      difficulty: "Cross-context",
      goal: "Use a few examples when the label set is easier to show than to define.",
      tradeoff: "Examples teach a rare pattern and spend context. A definition without examples can drift on unusual labels.",
      takeaway: "Few-shot prompting is for patterns, not for magic.",
      realSystem: "Classification with a small, unusual label set is a common reason to spend tokens on examples.",
    },
    {
      difficulty: "Trade-off",
      goal: "Choose the reliable strategy whose token cost you can justify.",
      tradeoff: "The richest prompt is not automatically the right one at volume. The cheapest prompt is not right if it fails the format.",
      takeaway: "Prompt design is a quality-cost trade-off.",
      realSystem: "High-volume features should be evaluated on task success and tokens per successful call, not on a single impressive demo.",
    },
  ],
});

export const gradientPlaygroundOrientation = buildOrientation({
  tagline: "Read an educational loss curve before anyone rents a GPU.",
  overview:
    "Gradient Playground lets you change learning rate, batch size, epochs, and full fine-tuning versus LoRA, then read what an educational model does to training loss and validation loss.",
  whyItMatters:
    "Fine-tuning conversations jump to recipes. Learning rate can stabilize or diverge. Batch size changes how noisy the update looks. Epochs can keep going after the model has started to overfit. Full fine-tuning can move the loss lower and can also overwrite earlier skills, which is catastrophic forgetting. LoRA updates fewer parameters, which in this lesson means a higher loss floor and less forgetting. You want to see those failure modes before treating a curve as a leaderboard.",
  learningObjectives: [
    "Identify divergence, underfitting, and overfitting on the educational curves.",
    "Separate training loss from validation loss.",
    "Choose LoRA or full fine-tuning based on the scenario's constraint.",
    "Justify a hyperparameter change from the curve, not from a slogan.",
  ],
  whatYouWillDo:
    "You set learning rate, epochs, batch size, and method. The chart updates from the educational formula. You submit when the curve meets the round's targets: validation loss, gap, stability, forgetting, and method when a method is required.",
  howToPlay: [
    "Read the targets before you move a control.",
    "Watch training loss and validation loss as separate lines.",
    "If the curve climbs, the learning rate is too high for this model.",
    "If the gap grows, more epochs are not helping generalization.",
    "Switch method when the scenario is about forgetting or about a loss floor.",
    "Submit, read the evidence, and retry or continue.",
  ],
  howItWorks:
    "The curves are simulated by a documented educational formula. Nothing is trained. There are no gradients, parameters, or datasets behind the chart. The picture is a teaching model of divergence, overfitting, LoRA's higher floor, and a forgetting penalty on full fine-tuning. It is not a fine-tune of a real language model.",
  earns:
    "A round scores 10 only when every target is met: validation loss, generalization gap, stability, forgetting, and method if the round requires one. Otherwise it scores 0.",
  roundCount: 5,
  efficiencyMatters:
    "Epochs and method affect the curve you are judged on. There is no separate speed score. A lower training loss that misses validation or forgetting still fails.",
  multipleAcceptableAnswers:
    "More than one combination can meet a round when the targets are inequalities. A required method means the other method cannot pass that round.",
  mastery:
    "You should be able to point at evidence of underfitting or overfitting and justify the hyperparameter change you would make. Matching a number without that explanation is only performance.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "Stop a divergent learning rate" },
    { label: "Round 2", difficulty: "Application", focus: "Close the validation gap" },
    { label: "Round 3", difficulty: "More complex", focus: "Avoid catastrophic forgetting" },
    { label: "Round 4", difficulty: "Cross-context", focus: "When LoRA cannot reach the floor" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Batch size and a tight gap" },
  ],
  recommendedNext: "Reasoning Reactor, which is about the procedure around a model rather than training it.",
  implementationNote:
    "Simulation disclosure: every plotted number comes from the educational formula in the loss-curve model. No parameters are updated and no dataset is loaded.",
  estimatedTime: "About 25 minutes",
  beforeYouStart: [
    "Training loss falling is not success by itself.",
    "Read the target for validation, gap, and forgetting.",
    "These curves are a formula, not a training run.",
  ],
  selfCheck: [
    "Can I point to underfitting or overfitting on the chart?",
    "Can I justify why I changed learning rate, epochs, batch size, or method?",
  ],
  reflectionPrompts: [
    "Which curve feature changed your decision?",
    "What would you refuse to conclude from a chart like this in a real training job?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Bring the learning rate down until the educational model stops diverging.",
      tradeoff: "A higher learning rate moves faster until it becomes unstable. Stability is the constraint in this round.",
      takeaway: "A climbing loss is evidence of a learning rate the scenario cannot tolerate.",
      realSystem: "Real training has more failure modes than this formula, but a diverging loss is still a reason to lower the learning rate before you buy more epochs.",
    },
    {
      difficulty: "Application",
      goal: "Reduce the gap between training loss and validation loss.",
      tradeoff: "More epochs can keep lowering training loss while validation gets worse. That gap is the overfitting signal in this model.",
      takeaway: "Validation loss is the check on training loss.",
      realSystem: "A fine-tune that only reports training loss can hide a model that memorized the set.",
    },
    {
      difficulty: "More complex",
      goal: "Choose the method that meets the loss target without entering the forgetting region.",
      tradeoff: "Full fine-tuning can fit more and, in this scenario, overwrite the prior task. LoRA gives up some fit to avoid that penalty.",
      takeaway: "Catastrophic forgetting is a constraint, not a footnote.",
      realSystem: "Teams choose parameter-efficient methods when they must keep earlier behavior, then measure that behavior instead of assuming it survived.",
    },
    {
      difficulty: "Cross-context",
      goal: "Switch to full fine-tuning when LoRA's floor cannot reach the required validation loss.",
      tradeoff: "LoRA is not always the safer choice. If the scenario demands a lower loss than LoRA can represent, the capacity limit is the failure.",
      takeaway: "Underfitting can be a capacity problem.",
      realSystem: "Adapters are a capacity choice. Some tasks need a fuller update, with the forgetting risk accepted and tested.",
    },
    {
      difficulty: "Trade-off",
      goal: "Use batch size and epochs together so the gap stays inside the limit.",
      tradeoff: "A tiny batch looks noisy. A long run with a large gap is overfit. The target is the gap, not the smoothest picture.",
      takeaway: "Batch size changes the curve you are reading. It is not a cosmetic setting.",
      realSystem: "Batch size affects noise, memory, and how long you can train. The evaluation is still held-out loss, not the smoothness of the plot.",
    },
  ],
});

export const reasoningReactorOrientation = buildOrientation({
  tagline: "Assemble a visible reasoning workflow. Do not confuse it with hidden thoughts.",
  overview:
    "Reasoning Reactor is about the procedure around a model: decomposition, verification, sampling, self-consistency, search, and temperature. The steps you see are a workflow you can specify. They are not a window into hidden chain-of-thought.",
  whyItMatters:
    "Some tasks need a check more than they need another sample. Temperature changes how diverse those samples are. Self-consistency is a vote across samples. Search keeps more than one candidate and rejects illegal ones. A structured workflow makes those choices explicit. Displayed educational steps are not claims about a model's private reasoning, and this game will not ask you to extract any.",
  learningObjectives: [
    "Choose a workflow that matches what can actually be checked.",
    "Include verification or branching when a single sample is a weak bet.",
    "Separate a public workflow from hidden model cognition.",
    "Pick a temperature for agreement or for diversity on purpose.",
  ],
  whatYouWillDo:
    "You assemble steps and choose a temperature. The page scores the checklist and shows prewritten samples for that temperature. You are deciding which procedure is appropriate, not watching a model think.",
  howToPlay: [
    "Read what would make a wrong answer expensive.",
    "Select the steps the task needs. Leave out steps marked as harmful.",
    "Choose a temperature that matches agreement or diversity.",
    "Submit and read which step changed the reliability.",
    "Do not add a step that demands a private reasoning trace.",
    "Finish all five rounds.",
  ],
  howItWorks:
    "Scoring is a checklist plus a lookup in a sample table written for the exercise. No model is sampled at runtime. The sample strings are educational props. They are not hidden internal chain-of-thought, and they are not live generations.",
  earns:
    "You need every required step, no harmful step, and a temperature marked best for 10 points. The right steps with an acceptable temperature score 6. Anything else scores 0.",
  roundCount: 5,
  efficiencyMatters:
    "Extra samples and extra checks have a cost in a real system. This game does not bill them. It does penalize a workflow that adds a harmful step or skips a required check.",
  multipleAcceptableAnswers:
    "An acceptable temperature earns partial credit when the steps are right. A harmful step, including a demand for hidden chain-of-thought, scores 0.",
  mastery:
    "You should be able to choose a workflow and explain why another sample, a vote, or a verifier is useful. Reciting a step list without that reason is not the goal.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "Check arithmetic outside the model" },
    { label: "Round 2", difficulty: "Application", focus: "Diversity without collapsing early" },
    { label: "Round 3", difficulty: "More complex", focus: "Self-consistency when you cannot check" },
    { label: "Round 4", difficulty: "Cross-context", focus: "Search with a rule checker" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Refuse a hidden trace" },
  ],
  recommendedNext: "Alignment Arena, where the question is which response should be preferred.",
  implementationNote:
    "Simulation disclosure: samples and temperatures are a precomputed table. The checklist is real scoring of the steps you select. Nothing here is a model's hidden chain-of-thought.",
  estimatedTime: "About 25 minutes",
  beforeYouStart: [
    "A written step is a workflow you specify, not a thought you uncovered.",
    "Higher temperature is not more intelligent.",
    "A verifier beats another sample when the answer can be recomputed.",
  ],
  selfCheck: [
    "Can I explain why this task needed a check, a vote, or a branch?",
    "Can I say why a hidden-trace step does not belong in the workflow?",
  ],
  reflectionPrompts: [
    "Where was additional verification more useful than another sample?",
    "What would you log so a person could review the workflow later?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Include a check that recomputes the result outside the model.",
      tradeoff: "Another sample can repeat the same arithmetic error. A calculator does not.",
      takeaway: "Verify when the answer is checkable.",
      realSystem: "Billing, dosage, and eligibility flows should recompute rather than trust a single completion.",
    },
    {
      difficulty: "Application",
      goal: "Ask for distinct options and do not force a winner before the list exists.",
      tradeoff: "Low diversity gives paraphrases. Collapsing to one title too early defeats the brainstorm.",
      takeaway: "Temperature and instructions have to match the need for variety.",
      realSystem: "Ideation features fail when the sampler and the prompt both push toward one safe phrasing.",
    },
    {
      difficulty: "More complex",
      goal: "Use a self-consistency vote when you cannot externally verify the answer.",
      tradeoff: "A vote costs extra samples and still does not prove truth. It reduces the chance of trusting one unlucky draw.",
      takeaway: "Self-consistency is a vote over outputs, not a view into hidden reasoning.",
      realSystem: "Teams use agreement across samples as a confidence signal, then still evaluate on a real task set.",
    },
    {
      difficulty: "Cross-context",
      goal: "Keep more than one candidate and reject moves the rules forbid.",
      tradeoff: "A single greedy step is cheaper and brittle. A small search with a checker spends compute to avoid illegal moves.",
      takeaway: "Search is useful when a rule can reject a candidate.",
      realSystem: "Planning and puzzle-like tools pair a proposer with a validator. The validator is the part you can trust.",
    },
    {
      difficulty: "Trade-off",
      goal: "Write the public formula and the source. Do not ask for a hidden trace.",
      tradeoff: "A private reasoning dump is not a verification method, and this assignment treats it as harmful.",
      takeaway: "Displayed educational steps are not hidden chain-of-thought.",
      realSystem: "Production reviews should ask for checkable work and sources, not for a model's private scratchpad.",
    },
  ],
});

export const alignmentArenaOrientation = buildOrientation({
  tagline: "Rank replies with an explicit policy, not a single notion of good.",
  overview:
    "Alignment Arena is an educational simulation of preference ranking. You apply weights for helpfulness, safety, and factuality, and you see which reply the policy prefers.",
  whyItMatters:
    "Preference data is a set of comparisons, not a universal score. Response ranking says which reply a policy prefers. Reward modeling, in a real RLHF pipeline, learns from comparisons like these. This game does not train that model. It does show the trade-off: a reply can be more helpful and still lose because safety or factuality is weighted higher. Alignment is not one scalar called “good.”",
  learningObjectives: [
    "Compute a preference from explicit helpfulness, safety, and factuality weights.",
    "Explain a ranking without treating it as a trained reward model.",
    "Name the dimension a rejected reply was better at.",
    "Prefer a safer refusal when the policy weights safety above completeness.",
  ],
  whatYouWillDo:
    "You read a request and two or more replies with printed scores. You choose the reply with the highest weighted total under the round's weights. Then you explain, from the feedback, which value won.",
  howToPlay: [
    "Read the weights. They are the policy for this round.",
    "Read each reply and its helpfulness, safety, and factuality scores.",
    "Prefer the reply with the higher weighted total.",
    "Submit and read which dimension decided it.",
    "Say the trade-off in your own words before you continue.",
    "Complete all five comparisons.",
  ],
  howItWorks:
    "The weighted sum is real arithmetic on the printed scores. The scores themselves are authored for the lesson. No preference model is trained, no raters were recruited, and no RLHF update is performed. The simulation shows how a rubric ranks replies. It does not claim to be a reward model.",
  earns:
    "Selecting the reply with the highest weighted score earns 10. Any other reply earns 0. There is no partial credit for a close second.",
  roundCount: 5,
  efficiencyMatters: "There is no efficiency term. A shorter reply is not better unless the weighted rubric says so.",
  multipleAcceptableAnswers:
    "No. Under a given weight vector there is one top score. A different policy could rank the same replies differently, which is the point of the next comparison.",
  mastery:
    "You should be able to justify why one response is preferable without collapsing alignment into a single universal “good.” Name the weight that decided it, and what the other reply did better.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "Apply the printed weights" },
    { label: "Round 2", difficulty: "Application", focus: "Fluency is not factuality" },
    { label: "Round 3", difficulty: "More complex", focus: "Helpful and safe together" },
    { label: "Round 4", difficulty: "Cross-context", focus: "A close trade-off" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Write the preference in words" },
  ],
  recommendedNext: "Ship-It Simulator, where the trade-offs are latency, cost, and reliability.",
  implementationNote:
    "Simulation disclosure: weights and scores are authored. The ranking math is computed in the browser. No reward model is trained and no human preference data was collected for this game.",
  estimatedTime: "About 25 minutes",
  beforeYouStart: [
    "Read the weights before you decide which reply feels better.",
    "A fluent reply can still be the wrong preference.",
    "This page does not train a reward model.",
  ],
  selfCheck: [
    "Can I justify the preference using the weights, not a vague sense of good?",
    "Can I name what the losing reply was better at?",
  ],
  reflectionPrompts: [
    "Which trade-off was hardest to defend?",
    "Where would you refuse to collapse safety, helpfulness, and factuality into one score?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Select the reply with the higher weighted total under the printed policy.",
      tradeoff: "The other reply may win a single dimension and still lose the policy.",
      takeaway: "A preference is a weighted comparison.",
      realSystem: "RLHF starts from comparisons like this. The training step is not happening on this page.",
    },
    {
      difficulty: "Application",
      goal: "Do not let fluency stand in for factuality.",
      tradeoff: "A smoother reply can be more helpful on the surface and still be the worse factual choice.",
      takeaway: "Helpfulness and factuality are different axes.",
      realSystem: "User ratings that only track tone will prefer confident errors.",
    },
    {
      difficulty: "More complex",
      goal: "Recognize when a reply can be both helpful and safe, and when those goals split.",
      tradeoff: "Refusing a disallowed request lowers a naive helpfulness reading and raises safety. The weights say which one the policy wants.",
      takeaway: "Safety is not the opposite of being useful. It is a constraint on what useful includes.",
      realSystem: "Production policies write this down so a more complete answer cannot outrank a required refusal.",
    },
    {
      difficulty: "Cross-context",
      goal: "Read a close trade-off carefully. Small score gaps still have a winner under the weights.",
      tradeoff: "Changing one weight could flip the ranking. That sensitivity is the lesson.",
      takeaway: "Close preferences are policy choices, not measurement noise you can ignore.",
      realSystem: "Reward models amplify whatever the preference data emphasized. A small weight change is a product decision.",
    },
    {
      difficulty: "Trade-off",
      goal: "Choose the preferred reply and be ready to say which value won.",
      tradeoff: "If you cannot name the losing reply's advantage, you have a winner and not yet an explanation.",
      takeaway: "Alignment is not a single scalar notion of good.",
      realSystem: "Reviewers should record the dimension that decided a preference so later data stays interpretable.",
    },
  ],
});

export const shipItOrientation = buildOrientation({
  tagline: "Meet a latency, cost, and reliability target with serving choices.",
  overview:
    "Ship-It Simulator puts you in a production scenario with numeric limits. You combine levers until the projection fits the service-level objective.",
  whyItMatters:
    "Serving an LLM is a set of competing constraints. Latency is how long a caller waits. Throughput is how much work you clear. Rate limits cap how fast you may call a dependency. Retries recover failures, and backoff keeps those retries from stampeding. Caching avoids repeat work. A model fallback can answer more cheaply or more slowly. Cost and the error budget move when any of those change. A fix for one SLO can break another.",
  learningObjectives: [
    "Project latency, cost, and reliability from a baseline plus lever effects.",
    "Choose retries with backoff, cache, or fallback for the constraint that is actually failing.",
    "Reject a lever that fixes one metric by breaking another.",
    "State an SLO as a numeric limit.",
  ],
  whatYouWillDo:
    "Each round states a production constraint. You turn levers on or off, read the projected metrics, and submit when every limit is satisfied. The scenario and the limits are visible before you commit.",
  howToPlay: [
    "Read the SLO limits before you touch a lever.",
    "Note which metric is outside the limit.",
    "Add the lever aimed at that metric.",
    "Recheck the others. A latency win can break cost or errors.",
    "Submit only when every projection is inside its limit.",
    "Read the trade-off, then continue.",
  ],
  howItWorks:
    "The projection is baseline plus the sum of the lever effects you select. That arithmetic is real. There is no cluster, queue, or live API. Effect sizes are authored for the scenario. This is a parameterized serving simulation.",
  earns:
    "You earn 10 points when every projected metric is inside its limit. Otherwise the round scores 0. There is no partial credit for fixing only one SLO.",
  roundCount: 5,
  efficiencyMatters:
    "Cost and latency are explicit limits. A design that is fast and over budget fails. A design that is cheap and too slow fails.",
  multipleAcceptableAnswers:
    "Any combination that lands inside every limit passes. There can be more than one. A combination that misses one limit does not.",
  mastery:
    "You should be able to justify the architecture under competing cost, latency, and reliability requirements, including which lever you refused.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "A support API over budget" },
    { label: "Round 2", difficulty: "Application", focus: "Retries that must back off" },
    { label: "Round 3", difficulty: "More complex", focus: "Stay under a rate limit" },
    { label: "Round 4", difficulty: "Cross-context", focus: "A shorter fallback" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Availability versus a single page" },
  ],
  recommendedNext: "Agent Architect, where the production question is what the system is allowed to do.",
  implementationNote:
    "Simulation disclosure: metric math is real given the authored effects. No service is deployed, and the numbers are not a vendor quote or a load test.",
  estimatedTime: "About 25 minutes",
  beforeYouStart: [
    "Read every limit. One green metric is not a passing design.",
    "Backoff is not the same thing as retrying faster.",
    "The page is a projection, not a cluster.",
  ],
  selfCheck: [
    "Can I justify this design against cost, latency, and reliability together?",
    "Can I name the lever I refused, and why?",
  ],
  reflectionPrompts: [
    "Which SLO was in tension with the others?",
    "What would you page a human for in a real serving stack?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Bring the support API back inside its cost and latency limits without ignoring errors.",
      tradeoff: "A larger model or extra replicas can fix latency and blow the budget. A cache can help only if the traffic actually repeats.",
      takeaway: "A serving change is a trade across the SLO, not a single knob.",
      realSystem: "Production incidents often start when a latency fix multiplies spend or retries.",
    },
    {
      difficulty: "Application",
      goal: "Recover failures without stampeding the dependency.",
      tradeoff: "Immediate retries amplify an outage. Backoff spreads them. No retries at all leaves the error budget red.",
      takeaway: "Retry policy is part of reliability, and it can cause the incident.",
      realSystem: "Clients that retry without backoff are a common way a dependency failure becomes a self-inflicted one.",
    },
    {
      difficulty: "More complex",
      goal: "Stay under the rate limit while still meeting latency.",
      tradeoff: "Bursting faster looks good until the limit rejects you. Queueing or a smaller model changes both latency and throughput.",
      takeaway: "A rate limit is a constraint you design for, not an error you ignore.",
      realSystem: "Vendor limits turn throughput goals into admission-control problems.",
    },
    {
      difficulty: "Cross-context",
      goal: "Use a fallback that is allowed to be shorter when the primary path cannot meet the SLO.",
      tradeoff: "The fallback saves latency or cost and may reduce answer quality. The round tells you whether that reduction is allowed.",
      takeaway: "Model fallback is a product decision with an explicit quality budget.",
      realSystem: "Tiered serving sends easy calls to a smaller model and keeps a larger model for the calls that need it.",
    },
    {
      difficulty: "Trade-off",
      goal: "Hold availability without treating one status page as the whole SLO.",
      tradeoff: "A green status page can hide a retry loop that is burning money. Availability, latency, and cost have to be read together.",
      takeaway: "An SLO is a set of numbers, not a status color.",
      realSystem: "Operators page on error budget and cost anomalies, not only on a binary up/down check.",
    },
  ],
});

export const agentArchitectOrientation = buildOrientation({
  tagline: "Decide when an agent should act, check, stop, or ask a person.",
  overview:
    "Agent Architect is about the agent loop: tools, state, memory, permissions, planning, verification, failure recovery, and human escalation. Adding tools does not automatically create a reliable agent.",
  whyItMatters:
    "A tool is authority. Read tools and write tools are different risks. State and memory decide what the loop remembers, and unbounded memory is a design choice with a failure mode. Planning says what happens next. Verification checks a result before a side effect. Failure recovery decides whether to retry or stop. Human escalation is how a high-impact action leaves the model. A loop with every tool turned on is not a plan.",
  learningObjectives: [
    "Select only the tools the task needs.",
    "Separate a read from a side effect.",
    "Add verification, a stopping rule, and escalation where the task requires them.",
    "Explain when the agent should act, retry, stop, or ask a person.",
  ],
  whatYouWillDo:
    "You will configure an agent for a stated goal by choosing tools and controls. The scorer checks that needed pieces are present and harmful pieces are absent. No agent runs and no tool is called.",
  howToPlay: [
    "Read the goal and what the agent must not do.",
    "Select the tools that goal actually needs.",
    "Select the controls: check, memory boundary, retry limit, or escalation.",
    "Leave out tools that create a side effect the task did not request.",
    "Submit and read when the loop should have stopped.",
    "Continue through all five goals.",
  ],
  howItWorks:
    "This is a checklist simulation. Scoring is whether needed tools and controls are selected and harmful ones are not. No agent runs, no API is called, and no memory store is written. The page teaches the shape of a loop. It does not execute one.",
  earns:
    "You earn 10 only when every needed tool and control is selected and no harmful tool or control is selected. Otherwise the round scores 0.",
  roundCount: 5,
  efficiencyMatters:
    "Fewer tools is not a separate score, but an extra harmful tool fails the round. Extra unused authority is the failure mode.",
  multipleAcceptableAnswers:
    "No. The needed set is defined by the scenario. Omitting a needed control fails, and adding a harmful one fails.",
  mastery:
    "You should be able to say when this agent should act, verify, retry, stop, or escalate. A list of tools without that policy is not a design.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "A read-only lookup" },
    { label: "Round 2", difficulty: "Application", focus: "A write that was actually requested" },
    { label: "Round 3", difficulty: "More complex", focus: "Memory with a boundary" },
    { label: "Round 4", difficulty: "Cross-context", focus: "Degrade when a tool fails" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Plan, act, and check" },
  ],
  recommendedNext: "Retrieval Lab, to see how an agent would know which document it is using.",
  implementationNote:
    "Simulation disclosure: the checklist score is real. No agent is executed and no tool is invoked. Adding a tool on this page does not make a system reliable.",
  estimatedTime: "About 25 minutes",
  beforeYouStart: [
    "Start from the goal, not from the longest tool list.",
    "A write tool is a different risk from a read tool.",
    "Nothing on this page actually runs.",
  ],
  selfCheck: [
    "Can I say when this agent should act, verify, retry, stop, or escalate?",
    "Can I name the tool I refused, and the side effect it would have had?",
  ],
  reflectionPrompts: [
    "Which action should have required a person?",
    "What should the loop do on the second tool failure?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Answer a refund question with a read tool and without sending mail.",
      tradeoff: "Sending mail is a side effect the user did not ask for. Extra tools add authority, not reliability.",
      takeaway: "Adding tools does not automatically create a reliable agent.",
      realSystem: "Production agents should default to the least authority that still completes the task.",
    },
    {
      difficulty: "Application",
      goal: "Allow the write the task requested, and put a check in front of it.",
      tradeoff: "Refusing every write fails a legitimate request. Writing without verification fails a different way.",
      takeaway: "A side effect needs a confirmation, not just a capable model.",
      realSystem: "Order changes, refunds, and emails should be confirmed or policy-checked before they commit.",
    },
    {
      difficulty: "More complex",
      goal: "Keep the memory the task needs and bound the memory it should not keep.",
      tradeoff: "No memory forces the user to repeat themselves. Unbounded memory keeps secrets and stale plans.",
      takeaway: "State is a design choice with a boundary.",
      realSystem: "Agent memory should have a scope and a retention rule, especially around personal data.",
    },
    {
      difficulty: "Cross-context",
      goal: "Stop or degrade when search fails, instead of inventing a result or looping.",
      tradeoff: "A retry can recover a blip. An unbounded retry hides an outage and spends money. Escalation is the recovery when the tool stays down.",
      takeaway: "Failure recovery includes a stop.",
      realSystem: "A loop that retries forever is an incident. The policy should say when to halt and tell a person.",
    },
    {
      difficulty: "Trade-off",
      goal: "Separate planning, action, and verification in the loop.",
      tradeoff: "Acting immediately is faster and skips the check. Planning forever never answers. The task needs both, in that order.",
      takeaway: "An agent loop is a policy for act, verify, retry, stop, and escalate.",
      realSystem: "Reliable agents log the plan, the tool result, and the check. The model is only one step in that loop.",
    },
  ],
});

export const retrievalLabOrientation = buildOrientation({
  tagline: "See why a document was retrieved, and whether it can answer the question.",
  overview:
    "Retrieval Lab is a small retrieval-augmented generation exercise. You choose how to search a toy corpus and then judge whether the retrieved set is actually useful.",
  whyItMatters:
    "RAG answers from what it retrieves. Chunking decides the pieces. Embeddings place those pieces in a vector space. Vector search finds neighbors. Keyword retrieval finds shared words. Hybrid retrieval uses both. Metadata filtering removes chunks that are out of scope. Reranking, in production, reorders the list. Precision is how much of the list is relevant. Recall is how much of the relevant set you found. Grounding fails when the answer is not supported by the chunks you kept.",
  learningObjectives: [
    "Contrast keyword overlap with vector similarity on an inspectable corpus.",
    "Compute precision and recall for a top-k list.",
    "Use a metadata filter when similar words belong to the wrong scope.",
    "Explain whether the retrieved set can actually answer the question.",
  ],
  whatYouWillDo:
    "You pick keyword, vector, or hybrid search, and sometimes a metadata filter. The page ranks the toy chunks and shows precision and recall. You are done with a round when both meet the minimums. Then you should be able to say why the top document ranked where it did.",
  howToPlay: [
    "Read the question and mark, in your head, which chunks truly answer it.",
    "Choose a retrieval method.",
    "Turn on the metadata filter only when the round's distractors are out of scope.",
    "Read the ranked list, precision, and recall.",
    "Submit when both minimums are met.",
    "Explain why the top hit ranked there before you continue.",
  ],
  howItWorks:
    "Cosine similarity, keyword overlap, hybrid scores, precision, and recall are computed in the browser. The vectors are 3-dimensional teaching examples, not the output of an embedding model. There is no separate reranker model. Top-k on the score is the only ranker. This is simplified educational retrieval, not a production index.",
  earns:
    "You earn 10 when precision and recall both meet the round's minimums. Otherwise the round scores 0.",
  roundCount: 5,
  efficiencyMatters:
    "There is no latency score. A method that looks sophisticated and returns the wrong chunk still fails.",
  multipleAcceptableAnswers:
    "Any method and filter combination that clears both minimums passes. Several setups will fail even if one number looks high.",
  mastery:
    "You should be able to explain why a document was retrieved and whether that set is useful for answering the question. A high similarity number is not that explanation.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "The nearest vector can be wrong" },
    { label: "Round 2", difficulty: "Application", focus: "Words that do not match" },
    { label: "Round 3", difficulty: "More complex", focus: "The right product scope" },
    { label: "Round 4", difficulty: "Cross-context", focus: "Hybrid when each method is fooled" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Recall across two clauses" },
  ],
  recommendedNext: "System Composer, where retrieval is one block in a larger design.",
  implementationNote:
    "Simulation disclosure: ranking math, precision, and recall are computed here. Embeddings are toy vectors, not a model. No reranker is running, and no LLM is answering from the chunks.",
  estimatedTime: "About 30 minutes",
  beforeYouStart: [
    "The nearest vector is not automatically the answer.",
    "Precision and recall answer different questions.",
    "You can inspect every chunk. Do that before you trust the rank.",
  ],
  selfCheck: [
    "Can I explain why this document was retrieved?",
    "Can I say whether the set is enough to answer the question?",
  ],
  reflectionPrompts: [
    "Which distractor fooled which method?",
    "What would you log so a later reviewer could see the grounding?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Do not trust the nearest vector when another chunk actually states the policy.",
      tradeoff: "Vector search recovers paraphrase and also promotes a neighbor that shares a direction without sharing the answer.",
      takeaway: "Similarity is not relevance.",
      realSystem: "RAG incidents often start with a near neighbor that is about the wrong policy.",
    },
    {
      difficulty: "Application",
      goal: "Use vectors when the question and the chunk do not share the obvious keywords.",
      tradeoff: "Keyword search is precise about words and blind to paraphrase. It misses the chunk that answers in different words.",
      takeaway: "Keyword and vector retrieval fail in different ways.",
      realSystem: "Hybrid search exists because each method covers the other's miss.",
    },
    {
      difficulty: "More complex",
      goal: "Filter to the product that is actually in scope.",
      tradeoff: "A filter raises precision when distractors share words, and it destroys recall if you filter out the only relevant chunk.",
      takeaway: "Metadata is part of retrieval, not an afterthought.",
      realSystem: "Tenant, product, and date filters are how production indexes keep a similar chunk from the wrong customer out of the prompt.",
    },
    {
      difficulty: "Cross-context",
      goal: "Use hybrid retrieval when keyword and vector each rank a distractor first.",
      tradeoff: "Either method alone looks confident and is wrong. Averaging them is a teaching hybrid, not a learned reranker.",
      takeaway: "A retrieved set can be high-scoring and still useless.",
      realSystem: "Production stacks often add a reranker after hybrid recall. This game stops at the score. It does not run that second model.",
    },
    {
      difficulty: "Trade-off",
      goal: "Bring back both relevant clauses, not a single tidy hit.",
      tradeoff: "A precise one-chunk list can have perfect precision and failed recall. The question needed both facts.",
      takeaway: "Grounding requires the set that answers the question, not the single nicest chunk.",
      realSystem: "Multi-hop and multi-clause questions fail when top-k is tuned only for a clean first hit.",
    },
  ],
});

export const systemComposerOrientation = buildOrientation({
  tagline: "Combine the pieces, and justify each one.",
  overview:
    "System Composer is where earlier games meet. You assemble a small LLM system and have to say why each block is there.",
  whyItMatters:
    "A production system routes easy calls, retrieves what must be grounded, chooses a model, calls tools, caches repeats, applies guardrails, verifies side effects, and records enough to debug Tuesday. Adding every available component is not an architecture. Each block has to earn its cost, latency, and failure mode.",
  learningObjectives: [
    "Map a constraint to a component instead of expecting the model to cover it.",
    "Stay inside a relative cost and latency budget.",
    "Leave out a component that does not serve the brief.",
    "Justify the design, including what you refused to add.",
  ],
  whatYouWillDo:
    "You select blocks for a scenario. The page adds relative cost and latency and checks whether the required concerns are covered without a conflict. You should be able to point at the block that carries each concern.",
  howToPlay: [
    "List the concerns the scenario names.",
    "Pick the smallest set of blocks that covers them.",
    "Watch relative cost and latency.",
    "Do not select two blocks the scenario marks as conflicting.",
    "Submit, then name the job of each block you kept.",
    "Finish all five compositions.",
  ],
  howItWorks:
    "Cost and latency are summed from authored teaching units. Coverage is a set check on the concerns each block claims. No services are deployed. The units are not a cloud quote. This is an architecture exercise on top of the mechanisms from earlier games.",
  earns:
    "You earn 10 when the selected blocks cover every required concern, stay within both budgets, and include no conflicting pair. Otherwise the round scores 0.",
  roundCount: 5,
  efficiencyMatters:
    "Yes. Relative cost and latency are hard limits. A complete design that is over budget fails.",
  multipleAcceptableAnswers:
    "Any non-conflicting set that covers the concerns inside the budgets passes. Adding every block usually fails the budget or a conflict.",
  mastery:
    "You should be able to justify every major component, and to say which component you left out on purpose. A diagram that contains every available box is not that justification.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "Ground a policy FAQ" },
    { label: "Round 2", difficulty: "Application", focus: "Cache repeated questions" },
    { label: "Round 3", difficulty: "More complex", focus: "A tool with a check" },
    { label: "Round 4", difficulty: "Cross-context", focus: "Route the easy calls" },
    { label: "Round 5", difficulty: "Trade-off", focus: "Observability after the fact" },
  ],
  recommendedNext: "ProdOps Gauntlet, which asks what you do when that system misbehaves.",
  implementationNote:
    "Simulation disclosure: sums and coverage checks are computed. No system is deployed. Cost and latency units are teaching numbers.",
  estimatedTime: "About 25 minutes",
  beforeYouStart: [
    "Start from the constraints, not from the component catalog.",
    "A larger model does not replace retrieval, a guardrail, or a log.",
    "The budgets are relative teaching units.",
  ],
  selfCheck: [
    "Can I justify every block I kept?",
    "Can I name a block I refused, and the constraint that made it unnecessary or harmful?",
  ],
  reflectionPrompts: [
    "Which component was doing real work, and which would have been decoration?",
    "What would you remove first if the latency budget were cut in half?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Cover grounding and the safety constraint without paying for a giant ungrounded model.",
      tradeoff: "A larger model can sound better and still invent policy. Retrieval plus a guardrail names who is responsible.",
      takeaway: "The model does not absorb every concern by getting bigger.",
      realSystem: "Policy assistants need a source of truth and a refusal path. Fluency is not either of those.",
    },
    {
      difficulty: "Application",
      goal: "Serve repeated questions without giving up grounding.",
      tradeoff: "A cache cuts latency and can serve a stale or ungrounded reply if it replaces retrieval instead of sitting in front of it.",
      takeaway: "Caching is a latency tool. It is not a grounding tool.",
      realSystem: "FAQ caches should key on the grounded answer, and they need an invalidation story when policy changes.",
    },
    {
      difficulty: "More complex",
      goal: "Include the tool the task needs and a verification step before any write.",
      tradeoff: "Auto-submitting is faster and removes the check. Showing the record first is the verification.",
      takeaway: "A tool call and a guardrail are different components.",
      realSystem: "Enrollment and account changes should confirm the record before they write.",
    },
    {
      difficulty: "Cross-context",
      goal: "Route easy calls to a smaller model and keep retrieval on the policy questions.",
      tradeoff: "Sending every call to the largest model spends latency and money. Routing without retrieval still hallucinates policy.",
      takeaway: "Routing and grounding solve different problems.",
      realSystem: "Model routers are a cost control. They do not decide whether an answer is sourced.",
    },
    {
      difficulty: "Trade-off",
      goal: "Add the trace that lets someone explain a later failure.",
      tradeoff: "Skipping observability is cheaper until the incident. A trace of route, chunk ids, and the guardrail decision is the component that makes the others debuggable.",
      takeaway: "If you cannot explain Tuesday, the architecture is incomplete.",
      realSystem: "Operators need the route, the retrieved ids, and the allow-or-refuse decision. A fluent answer log is not that.",
    },
  ],
});

export const prodopsOrientation = buildOrientation({
  tagline: "Name the failure, pick the evidence, and choose a response.",
  overview:
    "ProdOps Gauntlet is an incident exercise. You are responding to cost, latency, regressions, drift, and compliance questions. Treating the symptom is not the same as identifying the failure.",
  whyItMatters:
    "Observability is how you notice. Latency and cost tell you different stories. A regression often follows a prompt or index change. Drift is when the world or the corpus moved. An incident response should match the evidence. Compliance decides what you are allowed to store while you investigate. Restarting the model is not a universal response.",
  learningObjectives: [
    "Identify the likely failure from the evidence in the case.",
    "Choose a response aimed at that failure rather than at a generic restart.",
    "Separate a retrieval or prompt regression from a model outage.",
    "Prefer an audit log that does not create a second copy of private content.",
  ],
  whatYouWillDo:
    "You will read five operational cases. For each one you compare responses, look at the authored outcome, and choose the response that matches the evidence. Feedback tells you what that choice changes and what a symptomatic fix would have missed.",
  howToPlay: [
    "Read the shape of the evidence before you pick a component to blame.",
    "Name the likely failure in your own words.",
    "Choose the response that matches that failure.",
    "Submit and read the outcome card.",
    "Ask what you would watch next.",
    "Complete all five cases.",
  ],
  howItWorks:
    "The cases and outcome cards are authored. Scoring compares your choice with the labeled quality of each response. No production system is being monitored. The metrics are part of the case, not a live dashboard.",
  earns:
    "The best response scores 10. An acceptable response scores 6. A poor response scores 0. You are scored on the operational choice.",
  roundCount: 5,
  efficiencyMatters:
    "A response that cuts cost by deleting the evidence, or that adds load during an incident, is a poor fit even if one chart improves.",
  multipleAcceptableAnswers:
    "Yes. An acceptable response earns partial credit when it helps and is incomplete. The best response matches the evidence more directly.",
  mastery:
    "You should be able to identify the likely failure, say which evidence supports it, and propose a response that is not only a treatment of the symptom.",
  rounds: [
    { label: "Round 1", difficulty: "Introductory", focus: "A cost spike" },
    { label: "Round 2", difficulty: "Application", focus: "A prompt regression" },
    { label: "Round 3", difficulty: "More complex", focus: "A stale handbook" },
    { label: "Round 4", difficulty: "Cross-context", focus: "Instructions hidden in a chunk" },
    { label: "Round 5", difficulty: "Trade-off", focus: "An audit that must not store prompts" },
  ],
  recommendedNext: "Foundry Arena, where you design under a brief instead of responding to one incident.",
  implementationNote:
    "Simulation disclosure: incidents, metrics, and outcomes are authored cases. Nothing is connected to a live service, and the page is not an observability product.",
  estimatedTime: "About 25 minutes",
  beforeYouStart: [
    "Read the evidence before you restart anything.",
    "A cost spike and a quality drop are different incidents.",
    "The charts are part of the written case.",
  ],
  selfCheck: [
    "Can I name the likely failure and the evidence for it?",
    "Can I say why the tempting response would only treat a symptom?",
  ],
  reflectionPrompts: [
    "Which case was a cause, and which response was only a symptom treatment?",
    "What single signal would you want an alert to watch?",
  ],
  roundGuides: [
    {
      difficulty: "Introductory",
      goal: "Respond to the cost spike using the evidence about what multiplied, not a generic model restart.",
      tradeoff: "Restarting spends time and leaves a retry storm in place. Capping the retries addresses the multiplier.",
      takeaway: "Match the response to the shape of the incident.",
      realSystem: "A retry storm is a client behavior. It shows up as cost and load, and it is not fixed by swapping the model.",
    },
    {
      difficulty: "Application",
      goal: "Treat the evaluation drop after a prompt edit as a regression.",
      tradeoff: "Tuning the model ignores the change that just shipped. Rolling back the prompt is the reversible response.",
      takeaway: "A quality drop after a prompt change is a release incident.",
      realSystem: "Prompt and index changes need the same rollback path as code. An eval gate is the evidence.",
    },
    {
      difficulty: "More complex",
      goal: "Treat a changed handbook as a retrieval incident.",
      tradeoff: "Retraining or restarting the model does not refresh a stale index. Reindexing does.",
      takeaway: "Drift in the corpus is not the same failure as drift in the model.",
      realSystem: "RAG systems go stale when the source of truth changes and the index does not.",
    },
    {
      difficulty: "Cross-context",
      goal: "Respond to instructions hidden in retrieved content as a safety incident.",
      tradeoff: "Answering more helpfully would follow the injected instruction. Isolating untrusted chunks is the control.",
      takeaway: "Retrieved text is input. It can contain an attack, not only facts.",
      realSystem: "Indirect prompt injection shows up in documents, tickets, and web pages the retriever trusted.",
    },
    {
      difficulty: "Trade-off",
      goal: "Give the auditor evidence without storing a second copy of private prompts.",
      tradeoff: "Full transcripts are easier to debug and may violate the policy. Metadata can show the route and the decision without the content.",
      takeaway: "Compliance is part of the operational response.",
      realSystem: "Audit logs should be designed for the question an auditor will ask, not as a silent copy of user content.",
    },
  ],
});

export const foundryArenaOrientation = buildOrientation({
  tagline: "Design under a brief that does not have one correct architecture.",
  overview:
    "Foundry Arena is different from the earlier games. You integrate several LLM engineering ideas, and there may not be one correct answer. You are scored with a rubric that is shown before you design.",
  whyItMatters:
    "A real brief arrives as requirements and constraints, not as a multiple-choice key. Industry, healthcare, robotics, ethics, education, and sandbox paths ask you to choose components, justify them, name risks, and reflect on the trade-off. Technical appropriateness, constraint satisfaction, justification, safety and reliability, trade-off awareness, and reflection are the dimensions. A capable choice that misses a constraint is not a pass on that dimension.",
  learningObjectives: [
    "Translate a written constraint into a design choice that covers it.",
    "Reject a more capable option that misses a safety, privacy, or audit constraint.",
    "Justify the architecture, including the risk you accept.",
    "Use the rubric to evaluate your own design before you submit.",
  ],
  whatYouWillDo:
    "You pick a path: Industry, Healthcare, Robotics, Ethics, Education, or Sandbox. For that brief you identify requirements and constraints, select components, justify the architecture, name risks and trade-offs, and write a short reflection. The sandbox path asks you to state the problem yourself. There is not a hidden official architecture.",
  howToPlay: [
    "Read the path and every constraint before you choose.",
    "Read the rubric. Those dimensions are the grade.",
    "Select the option that covers each constraint.",
    "Write the reflection the rubric asks for, long enough to name a trade-off.",
    "Complete the self-rating. It is part of the round, separate from the score the rubric computes.",
    "Submit, read which constraints you covered, and continue to the other paths if you want.",
  ],
  howItWorks:
    "Coverage is computed from the covers and misses on the options you select, plus reflection length and whether every self-rating is filled in. No system is deployed. The rubric is not a claim that one architecture is universally correct. Partial coverage earns partial points.",
  earns:
    "Points follow the rubric printed on the round. A criterion is earned when a selected option covers it and no selected option misses it. Reflection and a completed self-rating are their own criteria. Ten points means every criterion is met. Partial designs earn partial credit.",
  roundCount: 6,
  penalties:
    "A choice that misses a constraint does not earn that criterion. A reflection that is too short does not earn the reflection criterion. Hints still subtract 1 point from the round, down to 0.",
  efficiencyMatters:
    "Cost and latency appear when the brief names them. They are constraints to satisfy, not a separate speed score. An overbuilt design can miss a cost constraint.",
  multipleAcceptableAnswers:
    "Yes. Foundry does not hide one correct architecture. Different options can cover the same constraint. An option that misses the constraint does not.",
  mastery:
    "Mastery is a design you can defend: what the user needs, which constraint each component carries, what you refused, and what risk remains. A high rubric score without that explanation is performance, not yet mastery.",
  rounds: [
    { label: "Industry", difficulty: "Application", focus: "Cost, grounding, and escalation" },
    { label: "Healthcare", difficulty: "Application", focus: "Privacy, chart grounding, clinician sign-off" },
    { label: "Robotics", difficulty: "More complex", focus: "Perception, limits, and a stop" },
    { label: "Ethics", difficulty: "More complex", focus: "Human decision, audit, and proxies" },
    { label: "Education", difficulty: "Cross-context", focus: "Hints, course grounding, and visibility" },
    { label: "Sandbox", difficulty: "Trade-off", focus: "Your own brief, with the same rubric habits" },
  ],
  recommendedNext: "Replay any earlier game whose component you could not justify in the design.",
  implementationNote:
    "Simulation disclosure: the rubric score is computed from your selections and the written reflection. No system is deployed, and the rubric is not a universal ranking of architectures.",
  estimatedTime: "About 40 minutes",
  beforeYouStart: [
    "Read the rubric before you design. It is the evaluation.",
    "There may not be one correct answer. There are constraints you can miss.",
    "A self-rating does not change the computed score. It asks you to judge the design yourself.",
  ],
  selfCheck: [
    "Can I map each constraint to the component that carries it?",
    "Can I name the risk I accepted and the option I refused?",
  ],
  reflectionPrompts: [
    "Which constraint was easiest to violate with a more capable option?",
    "What would you measure after this design shipped?",
  ],
  roundGuides: [
    {
      difficulty: "Application",
      goal: "Cover predictable spend, a citable return policy, and a person for high-value refunds.",
      tradeoff: "The largest model on every call ignores the cost cap. A refund issued by the model ignores escalation.",
      takeaway: "Each constraint needs an owner in the design.",
      realSystem: "Support automation is judged on cost, grounding, and the refund it is not allowed to issue alone.",
    },
    {
      difficulty: "Application",
      goal: "Keep the note in an approved environment, ground the draft in the chart, and stop before a medication change.",
      tradeoff: "A public API is more available and leaves the privacy boundary. A fluent draft without the chart is ungrounded.",
      takeaway: "Clinical assistance is a drafting tool with a hard stop.",
      realSystem: "Health workflows separate summarization from orders. The second one needs a clinician.",
    },
    {
      difficulty: "More complex",
      goal: "Take position from a sensor, enforce a workspace limit outside the model, and stop when confidence is low.",
      tradeoff: "Guessing coordinates from a sentence is a language answer to a perception problem. A prompt is not a geofence.",
      takeaway: "Language can name the block. It should not be the safety limit.",
      realSystem: "Robotics stacks keep perception and motion limits outside the language model.",
    },
    {
      difficulty: "More complex",
      goal: "Leave the hiring decision with a person, keep an audit of what was sent, and strip proxies.",
      tradeoff: "A hire score is simpler and makes the model the decision. A full PDF is easier and keeps the photo.",
      takeaway: "A summary for a human is a different system from an automated decision.",
      realSystem: "Hiring tools are judged on who decides, what was auditable, and which proxies never reached the model.",
    },
    {
      difficulty: "Cross-context",
      goal: "Hint instead of answering, ground explanations in the course notes, and limit what faculty can see.",
      tradeoff: "Handing over the final answer completes the homework. Full transcripts are more visible than the brief allows.",
      takeaway: "An education tool can optimize the wrong party’s goal.",
      realSystem: "Course tutors are specified by what they withhold, which source they may use, and who can read the log.",
    },
    {
      difficulty: "Trade-off",
      goal: "State a user and an action, name a grounding source, name a hard limit, and name how failure would be noticed.",
      tradeoff: "“Whatever the model knows” has no source. An unbounded action has no limit. A silent system has no operator.",
      takeaway: "A sandbox brief is still a brief. The rubric does not relax because you wrote the scenario.",
      realSystem: "The same questions show up in a design review: source, authority, limit, and signal.",
    },
  ],
});
