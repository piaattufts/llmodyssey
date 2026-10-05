import type { GameTeaching } from "../../src/game-engine/schema.ts";

export const shipItTeaching: GameTeaching = {
  atAGlance: {
    tierExplanation: "Systems Forge. Students judge a serving system rather than a single model mechanism.",
    recommendedLevel: "Advanced. Comfort with the idea of an API call, a timeout, and a budget is enough to start.",
    timeExplanation: "About 25 minutes for five serving scenarios, plus the concept guide if you want the vocabulary first.",
    activityType: "Adjust serving levers and check whether latency, error rate, and cost stay inside the stated limits.",
    masteryExplanation:
      "70% is the instructional line for these five scenarios. Meeting it means the choices fit the authored limits. It is not a claim that you can operate a production cluster.",
    statusExplanation:
      "Playable Prototype. The rounds, feedback, hints, and score work. The lever effects are authored. This is not yet the reference implementation.",
  },
  whyThisGameExists: [
    "A model that answers well in a notebook can still fail the moment many people call it at once. Latency, rate limits, retries, and cost are easy to mention in a lecture and hard to feel until a number moves.",
    "Ship-It holds a small serving picture still: a baseline, a few levers, and limits you can read. Students see that a retry without a cap can raise load, and that a cache can help only the calls it actually hits.",
    "The activity is appropriate because the decision is a trade-off, not a definition. Students choose a combination and immediately see which limit they met or missed.",
  ],
  bloomExplanation:
    "Bloom's taxonomy here runs Understand → Apply → Analyze. Students recognize latency, throughput, and retry behavior, apply a combination of levers to a scenario, and analyze which limit the combination still misses.",
  misconceptions: [
    {
      statement: "A common misconception is that retrying a failed call is always safer.",
      howTheGameAddressesIt: "One scenario shows a retry storm: more attempts raise concurrency and can make the outage worse.",
    },
    {
      statement: "Another misconception is that the largest model should serve every request.",
      howTheGameAddressesIt: "A cost-spike round asks which traffic actually needs the expensive model.",
    },
    {
      statement: "Students sometimes think the page is watching a live cluster.",
      howTheGameAddressesIt: "The disclosure says each lever adds an authored effect to a baseline. No queue or provider is contacted.",
    },
  ],
  assigning: {
    required: "The idea that an application calls a model over a network and that calls can fail or be slow.",
    helpful: "Having heard the words timeout, cache, and rate limit. The guide defines them if not.",
    notRequired: "Experience operating Kubernetes, a cloud queue, or a vendor status page.",
  },
  difficultyExplanation:
    "Advanced: students must satisfy several limits at once. They do not configure a real load balancer or write client code.",
  roundNotes: [
    {
      practicing: "A traffic spike and which lever absorbs repeated calls.",
      whyChosen: "Spikes are the first production surprise after a demo that worked for one user.",
      watchFor: "Whether latency and error rate can both stay inside the limits, not only whether one number improved.",
      whatMattered: "A cache or a queue helps when the extra traffic is repetitive. Adding concurrency without a limit can miss the latency target.",
      alternatives: "Levers that only make the model larger do not absorb a spike, and they raise cost.",
    },
    {
      practicing: "What to do when the provider starts refusing calls.",
      whyChosen: "Rate limits are a normal API behavior, not a rare disaster.",
      watchFor: "Whether the response backs off instead of immediately retrying every refusal.",
      whatMattered: "Honoring the limit, with backoff and jitter, keeps the client from hammering the same window.",
      alternatives: "Immediate retries and a bigger concurrency setting treat a refusal as a reason to send more traffic.",
    },
    {
      practicing: "How retries interact with a partial outage.",
      whyChosen: "A retry storm is a failure mode students cause while trying to be reliable.",
      watchFor: "A cap on attempts, and a fallback that does not depend on the same failing call.",
      whatMattered: "Unbounded retries multiply load. A capped retry plus a fallback can keep a degraded answer available.",
      alternatives: "Retrying forever, or failing with no fallback, both miss the reliability target in different ways.",
    },
    {
      practicing: "A provider outage and where traffic should go.",
      whyChosen: "Routing and fallbacks only matter when the primary path is actually down.",
      watchFor: "Whether the fallback is a real second path, not another call to the same endpoint.",
      whatMattered: "A timeout that fails over to a smaller model or a cached answer can keep the product usable.",
      alternatives: "Waiting longer on the same provider spends the user's time without creating a second path.",
    },
    {
      practicing: "A cost spike from sending routine traffic to an expensive model.",
      whyChosen: "Token cost is a serving decision, not only a tokenizer lesson.",
      watchFor: "Which requests actually need the expensive model.",
      whatMattered: "Routing easy calls to a smaller model, and caching repeats, can bring spend back inside the budget.",
      alternatives: "Serving every call with the expensive model, or disabling measurement, hides the spike instead of containing it.",
    },
  ],
  scoringNarrative:
    "Five rounds, 10 points each, 50 maximum. A lever set that brings every displayed metric inside the round's limits scores 10. A set that misses a limit scores 0. More than one combination can pass. Each revealed hint subtracts 1 point from that round, down to 0. Retries keep the best score. There is no separate efficiency bonus. Mastery is 70% of this activity, not certification as an operator. Grades follow A 90–100, B 80–89, C 70–79, D 60–69, F below 60.",
  transferExplanation:
    "Transfer would be explaining, for a new service, which limit you would measure first and which lever you would not pull until you had that measurement. A score on these five cards is not that explanation.",
  selfEvaluationQuestions: [
    "Can I explain latency, throughput, and a timeout in this serving picture?",
    "Can I say why a retry needs a cap, backoff, and jitter?",
    "Can I explain when a cache helps and when it does not?",
    "Can I separate token cost from a claim about model quality?",
    "Can I name one service-level indicator I would watch before changing a lever in a real system?",
  ],
  guide: {
    title: "Understanding production serving",
    overview:
      "Ship-It Simulator is an educational serving exercise. A baseline describes latency, errors, concurrency, and cost. Each lever adds an authored change. The page then checks those numbers against the round's limits. Nothing is deployed.",
    keyConcepts: [
      { term: "Latency", explanation: "How long one call takes from the user's point of view. A slow call can be unacceptable even if it eventually succeeds." },
      { term: "Throughput", explanation: "How many calls the service completes in a period. High throughput does not guarantee a low latency for each call." },
      { term: "Rate limit", explanation: "A cap a provider or gateway places on how many calls it will accept. Crossing it produces refusals, not a faster answer." },
      { term: "Timeout, retry, backoff, jitter", explanation: "A timeout stops waiting. A retry tries again. Exponential backoff waits longer after each failure. Jitter spreads those waits so many clients do not retry together." },
      { term: "Cache, batch, fallback, route", explanation: "A cache reuses a previous answer. Batching groups work. A fallback is a second path. Routing sends different calls to different models or providers." },
      { term: "SLI and SLO", explanation: "A service-level indicator is a measured number, such as p95 latency or error rate. A service-level objective is the target you promised for that number." },
    ],
    howItWorks:
      "The browser starts from a baseline and adds the effects written on the levers you select. If every displayed metric is inside the limits, the round scores full credit. The numbers are teaching values, not a benchmark of a cloud region.",
    workedExamples: [
      {
        title: "A retry without a cap",
        label: "Simplified educational illustration",
        body: "Suppose 100 calls fail and each client immediately retries three times. The provider now sees 400 attempts, not 100. If the failure was overload, the extra attempts make it worse. A cap of one retry, with backoff and jitter, keeps the extra load bounded.",
      },
    ],
    visualNote: "The serving diagram labels the user, the gateway, the model route, the cache, and the fallback. Patterns and text identify each box. Color is not the only cue.",
    applications:
      "These choices show up in chat products, document assistants, and any feature that calls a model API on behalf of many users. A classroom demo with one user will not reveal them.",
    tradeoffs:
      "A cache lowers latency and cost for repeats and can serve a stale answer. A smaller model is cheaper and may be worse on the hard cases. A fallback keeps the product up and may be less capable. The right combination depends on the limit you are missing.",
    bestPractices: [
      "Name the indicator and the objective before you change a lever.",
      "Cap retries and add backoff with jitter.",
      "Route or cache only the traffic that is actually repetitive or easy.",
      "Measure token cost per route, not only end-to-end latency.",
    ],
    pitfalls: [
      "Treating a retry as free reliability.",
      "Sending every request to the most expensive model by default.",
      "Caching personalized or time-sensitive answers without a freshness rule.",
      "Reading a green vendor status page as proof that your own client is healthy.",
    ],
    checkYourUnderstanding: [
      "Why can retries increase error rate during an outage?",
      "What is the difference between an indicator and an objective?",
      "When would a cache be the wrong lever?",
    ],
    whenToUse: "Use this frame when the requirement is about load, latency, spend, or a dependency failing.",
    whenNotToUse: "Do not use serving levers to fix a wrong specification or a missing source of truth. Those are prompt, retrieval, or product problems.",
    productionConsiderations:
      "In practice, measure the deployed route: latency percentiles, error codes, retry counts, cache hit rate, and token spend. This page cannot tell you those numbers.",
  },
  educator: {
    whyTeach: "Students otherwise leave a model course without a picture of what happens when many clients call at once.",
    whatStudentsDo: "They select levers, read the resulting metrics, and lock a combination that meets the stated limits.",
    evidencePrompts: [
      "Which limit was the binding one, and how do you know?",
      "Why was an extra retry the wrong response in that scenario?",
      "What would you measure on a real service before copying this lever?",
    ],
    beforeClass: "Define latency, a timeout, and a rate limit with one diagram.",
    duringClass: "Ask students to predict which metric will break before they submit.",
    afterClass: "Compare one scenario with a published API retry guide from the provider they actually use.",
    assignment: "Write a one-page serving note: the indicator, the objective, the fallback, and what you would not retry.",
    extension: "Add a lever to a local copy of the game and say which limit it is meant to protect.",
    relatedGames: "Token Forge (token cost), System Composer (which component exists), and ProdOps Gauntlet (what to do when a live indicator breaks).",
  },
  discussionQuestions: [
    "Is the cheapest configuration always the one you should ship?",
    "Why can a well-meaning retry policy become the incident?",
    "What is the difference between a fallback and a second copy of the same call?",
    "Which number would you alert on first?",
  ],
  nextConnection: {
    headline: "From a served model call to a system that can act.",
    body: "Ship-It is about getting a model call back reliably and affordably. Agent Architect asks when that call should be allowed to use tools, remember state, or stop and ask a person. A fast API is not yet an agent.",
    path: "model call → latency, cost, and fallbacks → tools, permissions, and stopping rules",
  },
};

export const agentTeaching: GameTeaching = {
  atAGlance: {
    tierExplanation: "Systems Forge. The question is when a model should be allowed to act, not how to draw a chatbot.",
    recommendedLevel: "Advanced. Students should already know that a model call returns text and can be wrong.",
    timeExplanation: "About 25 minutes for five design checks.",
    activityType: "Choose the tools and controls a task actually needs, and leave out the ones that add risk without a requirement.",
    masteryExplanation: "70% means the selected sets matched the authored requirements on these tasks. It does not certify an agent framework.",
    statusExplanation: "Playable Prototype. No agent runs and no tool is called. The score checks the selected set against needed and harmful controls.",
  },
  whyThisGameExists: [
    "Wrapping a model in a loop and a list of tools is easy to demo and easy to over-trust. Students need a place to decide what the system is allowed to do before anyone calls it autonomous.",
    "A lecture can list memory, planning, and tools. It rarely forces the question of which permission is unnecessary. The game rejects both missing controls and extra tools that the brief marked harmful.",
    "In engineering, an agent is a system with a goal, observations, actions, and a stop rule. A single model call, a fixed workflow, a tool-using agent, and a multi-agent setup are different designs.",
  ],
  bloomExplanation:
    "The activity moves from remembering the agent loop, to understanding why a tool needs a permission and a check, to applying that judgment to tasks where autonomy is unnecessary.",
  misconceptions: [
    {
      statement: "A common misconception is that adding tools turns a chatbot into a reliable agent.",
      howTheGameAddressesIt: "Rounds mark some tools as harmful for that task. Selecting them does not earn credit.",
    },
    {
      statement: "Another misconception is that every workflow should be autonomous.",
      howTheGameAddressesIt: "At least one scenario is better as a fixed step or a human handoff than as an open loop.",
    },
    {
      statement: "Students may think the page executed the tools they selected.",
      howTheGameAddressesIt: "The disclosure says the score is a checklist. Nothing is invoked.",
    },
  ],
  assigning: {
    required: "Knowing that a language model produces text and does not, by itself, have permission to act on other systems.",
    helpful: "Promptsmith and Ship-It, so a prompt and a model call are already familiar.",
    notRequired: "Experience with a particular agent framework or with multi-agent orchestration.",
  },
  difficultyExplanation: "Advanced: students must include every needed control and exclude harmful ones. They do not implement a loop.",
  roundNotes: [
    {
      practicing: "The difference between one model call and a workflow with a stop.",
      whyChosen: "The smallest distinction is the one vendors blur in product language.",
      watchFor: "Whether the task needs tools at all.",
      whatMattered: "A fixed workflow can be the right design when the steps are known and a tool would only add ways to fail.",
      alternatives: "An open tool list looks capable and can be the wrong scope.",
    },
    {
      practicing: "Which observation the loop is allowed to see.",
      whyChosen: "Agents fail when the state they act on is the wrong state.",
      watchFor: "A source the operator can check, and a limit on what is stored.",
      whatMattered: "Memory and tools should match the goal. Extra memory can keep data the task does not need.",
      alternatives: "Remembering everything, or remembering nothing when a later step depends on an observation, both miss the brief.",
    },
    {
      practicing: "Permissions and a check before a side effect.",
      whyChosen: "The dangerous moment is the write, the send, or the purchase, not the draft.",
      watchFor: "A verification step and a human escalation for the irreversible action.",
      whatMattered: "A tool permission without a check is how an agent takes an action nobody reviewed.",
      alternatives: "Letting the model both propose and commit the action removes the control the round is about.",
    },
    {
      practicing: "Retries and stopping criteria.",
      whyChosen: "A loop without a stop will spend the budget trying again.",
      watchFor: "A maximum number of attempts and a condition that counts as done or blocked.",
      whatMattered: "Stopping and asking a person is a successful design when the observation is insufficient.",
      alternatives: "Retrying until the model sounds confident confuses fluency with completion.",
    },
    {
      practicing: "Failure recovery that does not hide the failure.",
      whyChosen: "Recovery is part of the design, not an afterthought.",
      watchFor: "A visible failure and a path back to a person or a safe state.",
      whatMattered: "A recovery step should preserve an audit of what was attempted.",
      alternatives: "Silently trying a more powerful tool can widen the permission at the worst moment.",
    },
  ],
  scoringNarrative:
    "Five rounds, 10 points each, 50 maximum. Selecting every needed control and none of the harmful ones scores 10. Any missing need or included harmful control scores 0. Partial checklists do not earn 6 in this prototype. Each hint subtracts 1 point, down to 0. Retries keep the best score. Mastery is 70% on these checklists, not evidence that an agent would succeed in production.",
  transferExplanation:
    "Transfer is being able to take a new task and say whether it should be one call, a workflow, a tool-using agent, or a handoff to a person, and which permission you would refuse.",
  selfEvaluationQuestions: [
    "Can I distinguish a model call, a workflow, a tool-using agent, and a multi-agent system?",
    "Can I name the goal, the observation, and the stop rule for one round?",
    "Can I explain why a tool permission needs a check?",
    "Can I point to a task where autonomy was unnecessary?",
    "Can I say what this page did not execute?",
  ],
  guide: {
    title: "Understanding agents",
    overview:
      "An agent, in this course, is a loop that uses a model to choose actions in pursuit of a goal, given observations, under permissions and a stopping rule. Agent Architect asks you to design that boundary. It does not run the loop.",
    keyConcepts: [
      { term: "Agent loop", explanation: "Observe, decide, act, and check, until a stop condition. The model is one part of the loop." },
      { term: "Goal, observation, state", explanation: "The goal is what done means. An observation is evidence from outside the model. State is what the loop is allowed to remember." },
      { term: "Tools and permissions", explanation: "A tool is a capability, such as search or send. A permission is the decision that this loop may use it." },
      { term: "Plan and verify", explanation: "A plan is a proposed sequence. Verification checks an action or a result against a rule that is not just the model's confidence." },
      { term: "Escalation and recovery", explanation: "Escalation hands the case to a person. Recovery returns the system to a safe state after a failed action." },
    ],
    howItWorks:
      "Each round lists controls. Some are required by the brief. Some are marked harmful because they widen action or hide failure. The score is whether your set matches that authored split. No tool is called.",
    workedExamples: [
      {
        title: "When not to use an agent",
        label: "Simplified educational illustration",
        body: "A nightly report that always pulls the same three tables, formats them, and emails a fixed list is a workflow. An agent with a general email tool can send the report to the wrong person. The extra autonomy does not serve a requirement.",
      },
    ],
    visualNote: "The loop diagram labels goal, observation, model, tool, check, and stop. Text labels carry the meaning.",
    applications:
      "Support tools, research assistants, and operations bots are common places this boundary matters. The question is which actions are reversible and which need a person.",
    tradeoffs:
      "More tools can cover more tasks and create more ways to do the wrong thing. More memory can help a long task and retain data you did not need to store. A human check adds delay and catches irreversible mistakes.",
    bestPractices: [
      "Write the goal and the stop condition before choosing tools.",
      "Give the narrowest permission that completes the task.",
      "Separate proposing an action from committing it when the action is hard to undo.",
      "Log what was observed and what was attempted.",
    ],
    pitfalls: [
      "Calling any model call an agent.",
      "Treating a confident paragraph as verification.",
      "Adding a second agent instead of fixing a missing check.",
      "Storing full transcripts when the task needed a status.",
    ],
    checkYourUnderstanding: [
      "What makes a workflow different from a tool-using agent?",
      "Why is a stop rule part of the design?",
      "What evidence would show that a tool call was the right one?",
    ],
    whenToUse: "Use an agent when the next step depends on an observation you cannot fully script, and the actions are permissioned.",
    whenNotToUse: "Do not use an agent when the steps are known, the action is irreversible and unchecked, or a single retrieval would answer the question.",
    productionConsiderations:
      "A production design names the tools, the identity they act as, the spend cap, the audit log, and the human path. This game does not provide those systems.",
  },
  educator: {
    whyTeach: "Product language collapses chat, workflows, and agents into one word. Students need the distinctions before they build.",
    whatStudentsDo: "They select a set of controls for each brief and see whether required checks were missing or extra tools were included.",
    evidencePrompts: [
      "Which control was required, and which requirement did it serve?",
      "Why was an extra tool a worse design here?",
      "What would you log if this loop ran for real?",
    ],
    beforeClass: "Draw one model call, one workflow, and one tool loop on the board.",
    duringClass: "Have students name the irreversible action before they select tools.",
    afterClass: "Read a short tool-use paper or a vendor's permission model and map its words onto this loop.",
    assignment: "Take a campus workflow and argue for a model call, a workflow, or an agent, including the stop rule.",
    extension: "Add a harmful control to a round and write the requirement it violates.",
    relatedGames: "Promptsmith (the instruction), Retrieval Lab (observations that should come from documents), and ProdOps (what you monitor after it runs).",
  },
  discussionQuestions: [
    "When is a workflow the more responsible design?",
    "What should a system do when it is not confident enough to act?",
    "Why is permission different from capability?",
    "How would you audit an action after the fact?",
  ],
  nextConnection: {
    headline: "Many agent observations should be retrieved, not remembered.",
    body: "Agent Architect decides what the loop may do. Retrieval Lab asks how a question becomes a set of passages the model is allowed to use. A tool that searches is only as useful as the retrieval underneath it.",
    path: "permissions and a stop rule → documents, queries, and ranked passages → a grounded answer",
  },
};

export const retrievalTeaching: GameTeaching = {
  atAGlance: {
    tierExplanation: "Systems Forge. Students see retrieval as a pipeline that builds context, not as a guarantee of a correct answer.",
    recommendedLevel: "Advanced. Token Forge and Context Compression make the token budget easier to interpret.",
    timeExplanation: "About 25 minutes for five retrieval setups.",
    activityType: "Choose a retrieval setup and read precision and recall against the round's minimums.",
    masteryExplanation: "70% means the setups met the authored precision and recall floors. It is not a claim about a production search engine.",
    statusExplanation:
      "Playable Prototype. Ranking uses toy 3-D vectors, cosine similarity, and keyword overlap in the browser. There is no embedding model, no separate reranker, and no generated answer.",
  },
  whyThisGameExists: [
    "Students hear that retrieval-augmented generation 'grounds' a model and then cannot say what was retrieved, what was missed, or why a fluent answer can still be wrong.",
    "The game makes the pipeline visible: a question, a query representation, candidates, a filter, a rank, and a context set. The score is about that set, not about a paragraph the model might write later.",
    "That separation is the engineering point. Good retrieval does not automatically produce a good answer, and a good-sounding answer does not prove the passages were relevant.",
  ],
  bloomExplanation:
    "Students remember the pipeline, understand why precision and recall answer different questions, and apply a setup to a small corpus with a known relevant set.",
  misconceptions: [
    {
      statement: "A common misconception is that a retrieved passage will be used faithfully by the model.",
      howTheGameAddressesIt: "The page never generates an answer. It asks whether the retrieved set itself is good enough to hand over.",
    },
    {
      statement: "Another misconception is that vector search replaces lexical search in every collection.",
      howTheGameAddressesIt: "Rounds include keyword overlap and a hybrid score so students can see a case where wording still matters.",
    },
    {
      statement: "Students may think the 3-D numbers are real embeddings.",
      howTheGameAddressesIt: "The disclosure calls them toy coordinates chosen so cosine similarity is reproducible in the browser.",
    },
  ],
  assigning: {
    required: "The idea that a model answers from a context you assembled, and that context has a size.",
    helpful: "Context Compression, so a token budget is already a familiar constraint.",
    notRequired: "Linear algebra beyond 'closer vectors score higher,' or experience with a vector database.",
  },
  difficultyExplanation: "Advanced: students must meet two floors at once, precision and recall. They do not train an embedding model.",
  roundNotes: [
    {
      practicing: "What a chunk is, and why the unit of retrieval is not always a whole document.",
      whyChosen: "The first failure in a corpus is often the wrong granularity.",
      watchFor: "Whether the relevant fact is in the set you would pass forward.",
      whatMattered: "A chunk that contains the fact can be retrieved. A document that only mentions the topic may look related and still omit the fact.",
      alternatives: "Taking the whole document, or a tiny fragment that drops the condition, both weaken the context.",
    },
    {
      practicing: "Lexical overlap versus a vector score.",
      whyChosen: "The two signals fail in different ways.",
      watchFor: "Exact terms the question depends on, and neighbors that share a topic without those terms.",
      whatMattered: "Keyword overlap helps when the rare term must appear. A vector score can surface a paraphrase and can also surface a topical neighbor.",
      alternatives: "Using only one signal is weaker when the round's relevant set needs both the term and the paraphrase.",
    },
    {
      practicing: "A metadata filter before ranking.",
      whyChosen: "Filters are how you stop a global corpus from answering a local question.",
      watchFor: "The field that actually distinguishes the right documents.",
      whatMattered: "A filter on source, date, or collection can remove lookalikes before top-k is chosen.",
      alternatives: "Ranking the unfiltered corpus can fill the context with fluent, wrong-scope passages.",
    },
    {
      practicing: "Top-k, precision, and recall on a known relevant set.",
      whyChosen: "Students need to see that a high score is not the same as a complete set.",
      watchFor: "Relevant items left out, and irrelevant items let in.",
      whatMattered: "Raising k can raise recall and lower precision. The round asks for both floors.",
      alternatives: "A very small k looks precise and can miss a required passage. A very large k looks complete and crowds the context.",
    },
    {
      practicing: "Context construction and citations, still without a generated answer.",
      whyChosen: "The last step students skip is deciding what the model will be allowed to see.",
      watchFor: "Whether a citation could point at the passage that supports the claim.",
      whatMattered: "Assembly is a selection. Extra passages spend the budget and can distract. Missing passages leave nothing to cite.",
      alternatives: "Passing the raw ranking with no selection treats retrieval as finished when the context is not.",
    },
  ],
  scoringNarrative:
    "Five rounds, 10 points each, 50 maximum. A setup that meets both the precision floor and the recall floor scores 10. Missing either floor scores 0. This prototype does not award 6 for a near miss. Precision and recall are computed in the browser from the labeled relevant set. Each hint subtracts 1, down to 0. Retries keep the best score. Mastery is 70% on these corpora, not a production search evaluation.",
  transferExplanation:
    "Transfer is designing an evaluation for a new collection: what counts as relevant, which metric you would not trade away, and why a retrieved set still needs a generation check.",
  selfEvaluationQuestions: [
    "Can I state the retrieval pipeline in order?",
    "Can I define precision and recall for a retrieved set?",
    "Can I explain why a hybrid score can beat either signal alone on some collections?",
    "Can I say why a good retrieval set is not yet a good answer?",
    "Can I explain what the 3-D vectors are and are not?",
  ],
  guide: {
    title: "Understanding retrieval",
    overview:
      "Retrieval Lab is a small, labeled corpus. You choose how candidates are scored and filtered. The browser computes cosine similarity on toy vectors, keyword overlap, or a hybrid average, then precision and recall against passages marked relevant. No language model writes an answer.",
    keyConcepts: [
      { term: "Chunk", explanation: "A piece of a document you are willing to retrieve and possibly pass to a model. The size changes what a hit contains." },
      { term: "Embedding and vector retrieval", explanation: "An embedding maps text to a vector so that some similar texts land nearby. Vector retrieval returns the nearest stored vectors. These rounds use toy coordinates, not a trained embedding model." },
      { term: "Lexical search and BM25", explanation: "Lexical search matches terms. BM25 is a standard ranking function for that match. This page uses a simple overlap, not a full BM25 index." },
      { term: "Hybrid retrieval and filters", explanation: "Hybrid methods combine signals. Metadata filters drop candidates that fail a structured condition before or after scoring." },
      { term: "Precision, recall, top-k", explanation: "Precision asks how much of the returned set is relevant. Recall asks how much of the relevant set was returned. Top-k keeps the first k after ranking." },
      { term: "Grounding and citations", explanation: "Grounding means the answer is tied to a source the user can check. A citation is only meaningful if that source was actually in the context." },
    ],
    howItWorks:
      "Question, then a query representation (the toy vector and the keywords), then candidate scores, then an optional filter, then top-k. There is no separate reranker model. Context assembly is the set you would hand on. Generation is deliberately absent.",
    workedExamples: [
      {
        title: "Precision without recall",
        label: "Simplified educational illustration",
        body: "Suppose three passages are relevant and you return one of them and nothing else. Precision is 1. Recall is 1/3. A product that shows only that passage looks clean and still cannot support a question that needed the other two facts.",
      },
    ],
    visualNote: "The pipeline diagram lists every stage in text, from question to context. Ranked chunks show a score and a relevant or not label in words, not only in color.",
    applications:
      "Handbook assistants, clinical draft support, and course tutors all depend on this pipeline. The collection, the chunking, and the evaluation set are part of the system.",
    tradeoffs:
      "Smaller chunks can raise the chance of a precise hit and lose surrounding conditions. Larger k can raise recall and overflow the context. Lexical search is strong on rare identifiers and weaker on paraphrase.",
    bestPractices: [
      "Write down what relevant means before you tune a score.",
      "Report precision and recall, not only a vibe that the hits look good.",
      "Filter on metadata when the scope is part of the question.",
      "Evaluate the generated answer separately from the retrieved set.",
    ],
    pitfalls: [
      "Assuming the top vector hit is the supporting evidence.",
      "Filling the prompt with the top 20 chunks and calling it grounding.",
      "Citing a document the model did not receive.",
      "Treating a toy cosine as a benchmark of a production embedding model.",
    ],
    checkYourUnderstanding: [
      "What question does recall answer that precision does not?",
      "Where would a metadata filter sit in the pipeline?",
      "Why is generation a separate evaluation?",
    ],
    whenToUse: "Use retrieval when the answer must come from a collection you can update and cite.",
    whenNotToUse: "Do not add a vector index when the task is a fixed computation, a tool call, or a short instruction with no source documents.",
    productionConsiderations:
      "A real system chooses an embedding model, a chunk policy, an index, and an evaluation set of questions with known relevant passages. Measure those. This lab's vectors will not match that index.",
  },
  educator: {
    whyTeach: "Grounding is often taught as a slogan. The measurable object is the retrieved set.",
    whatStudentsDo: "They pick a scoring and filtering setup and read precision and recall for a labeled corpus.",
    evidencePrompts: [
      "Which relevant passage was missing, and why did the score miss it?",
      "What did you include that a model could misuse?",
      "Why would you still evaluate the written answer after a perfect retrieval score?",
    ],
    beforeClass: "Define chunk, top-k, precision, and recall with a three-item example.",
    duringClass: "Ask for a prediction of which signal will fail before students submit.",
    afterClass: "Run one question through the tokenizer and retriever of a real stack, if the course has one, and compare the unit of retrieval.",
    assignment: "Label ten passages for one question and compute precision and recall at two values of k.",
    extension: "Argue for or against a hybrid setup on a collection of identifiers, such as error codes.",
    relatedGames: "Context Compression (what you can afford to pass), Promptsmith (how the context is specified), and System Composer (where retrieval sits in an architecture).",
  },
  discussionQuestions: [
    "Why can a retrieved set be excellent and the answer still be wrong?",
    "When is keyword overlap the signal you should not drop?",
    "How does chunk size interact with a context budget?",
    "What would you need before trusting a citation?",
  ],
  nextConnection: {
    headline: "Retrieval is one component. The system still has to justify the others.",
    body: "Retrieval Lab isolates search. System Composer asks which other pieces a requirement needs: a router, a guardrail, a cache, a check, a fallback. A retriever is not an architecture.",
    path: "question → retrieved set → the rest of the system that uses it",
  },
};

export const composerTeaching: GameTeaching = {
  atAGlance: {
    tierExplanation: "Systems Forge. Students compose an architecture from components that each answer a stated requirement.",
    recommendedLevel: "Advanced. The earlier systems games make the component names concrete.",
    timeExplanation: "About 25 minutes for five briefs.",
    activityType: "Select components that cover the required concerns without blowing the relative cost and latency budgets.",
    masteryExplanation: "70% means the selections covered the authored concerns inside the budgets. It is not a preferred production topology.",
    statusExplanation:
      "Playable Prototype. Cost and latency are relative teaching units written on the cards. No services are called. More components are not automatically a better score.",
  },
  whyThisGameExists: [
    "Architecture diagrams grow by accumulation. Students add a cache, a second model, and a guardrail because each one sounds professional, then cannot say which failure mode any box prevents.",
    "System Composer scores coverage of named concerns, a budget, and conflicts. A component that does not cover a required concern is not a free decoration, and a conflicting pair is not a richer design.",
    "The lesson is that every component should answer a concrete requirement. A smaller diagram that meets the brief is a better design than a larger one that misses it.",
  ],
  bloomExplanation:
    "Students understand what each component is for, apply a set to a brief, and evaluate whether an extra box created cost, latency, or a conflict without covering a requirement.",
  misconceptions: [
    {
      statement: "A common misconception is that a more elaborate diagram is a more mature system.",
      howTheGameAddressesIt: "Budgets and conflicts punish components that do not earn their place.",
    },
    {
      statement: "Another misconception is that a base model alone can satisfy grounding, safety, and latency requirements.",
      howTheGameAddressesIt: "The cards state what each component covers. The model card often covers none of the extra concerns.",
    },
    {
      statement: "Students may read the cost numbers as vendor prices.",
      howTheGameAddressesIt: "The page calls them relative teaching units, not a quote.",
    },
  ],
  assigning: {
    required: "A sense that a product requirement can be missed even when a model writes fluent text.",
    helpful: "Retrieval Lab and Ship-It, so retrieval and latency already have meanings.",
    notRequired: "Experience drawing cloud architecture or choosing a vendor.",
  },
  difficultyExplanation: "Advanced: several constraints must hold together. Students do not deploy the diagram.",
  roundNotes: [
    {
      practicing: "Grounding and a refusal for a policy FAQ.",
      whyChosen: "The smallest useful system is often a model plus the one source and the one refusal the brief names.",
      watchFor: "Which concern the model card does not cover.",
      whatMattered: "Retrieval covers the source. A guardrail covers the forbidden action. A larger model covers neither by itself.",
      alternatives: "Adding a giant model spends budget and still leaves the handbook uncited.",
    },
    {
      practicing: "Latency when the same questions repeat.",
      whyChosen: "A cache is justified by repetition, not by fashion.",
      watchFor: "Whether the cache is allowed to sit on top of a grounded answer.",
      whatMattered: "A cache can meet a latency concern. A giant uncached model can miss both latency and grounding.",
      alternatives: "A component that conflicts with the cache is a worse design even if it sounds more capable.",
    },
    {
      practicing: "A tool that needs a check.",
      whyChosen: "Tools are components with side effects, not just another box.",
      watchFor: "The verification or permission that makes the tool acceptable.",
      whatMattered: "The tool covers the action. The check covers the failure mode of a wrong action.",
      alternatives: "The tool without the check meets the capability and misses the safety concern.",
    },
    {
      practicing: "Observability and a fallback.",
      whyChosen: "A system you cannot see fail, or cannot degrade, is unfinished.",
      watchFor: "A signal an operator could read, and a path when the primary model is unavailable.",
      whatMattered: "Logging and a fallback cover different requirements. One does not substitute for the other.",
      alternatives: "A second copy of the same model is not a fallback if it fails for the same reason.",
    },
    {
      practicing: "Leaving components out on purpose.",
      whyChosen: "The last brief is where extra boxes are the mistake.",
      watchFor: "The budget, and concerns that are already covered.",
      whatMattered: "An unused memory store or a second retriever can overflow cost without covering a new requirement.",
      alternatives: "Selecting every available card feels thorough and can fail the budget or a conflict rule.",
    },
  ],
  scoringNarrative:
    "Five rounds, 10 points each, 50 maximum. Covering every required concern, staying within the relative cost and latency budgets, and avoiding conflicts scores 10. Missing any of those scores 0. Partial architectures do not earn 6 in this prototype. Each hint subtracts 1, down to 0. Retries keep the best score. Mastery is 70% on these briefs. The numbers are teaching units, not prices.",
  transferExplanation:
    "Transfer is taking a new brief, listing the failure modes, and refusing any component that does not address one of them or that breaks a constraint.",
  selfEvaluationQuestions: [
    "Can I name the requirement a component was covering?",
    "Can I explain why a larger model did not replace retrieval or a guardrail?",
    "Can I read a relative budget without treating it as a vendor price?",
    "Can I justify leaving a component out?",
    "Can I say what this page did not deploy?",
  ],
  guide: {
    title: "Understanding system composition",
    overview:
      "System Composer is a constrained design game. Components have authored coverage, relative cost, relative latency, and conflicts. You assemble a set. The browser checks coverage, budgets, and conflicts. No service starts.",
    keyConcepts: [
      { term: "Component", explanation: "A part with a job: model, router, retriever, tool, guardrail, verifier, cache, memory, log, fallback, or escalation." },
      { term: "Requirement", explanation: "A concern the brief names, such as grounding or a human handoff. If nothing covers it, the design misses it." },
      { term: "Budget", explanation: "A cap on the sum of the relative cost and latency figures. It is a teaching constraint, not an invoice." },
      { term: "Conflict", explanation: "A pair the round says should not be combined, because one undoes the other or double-counts a path." },
      { term: "Fallback and escalation", explanation: "A fallback is a degraded automatic path. Escalation hands the case to a person." },
    ],
    howItWorks:
      "The score adds the coverage tags of the selected cards and the cost and latency numbers. Required tags must all be present. Totals must sit within the caps. Conflict ids must be absent. Fluency is not a tag.",
    workedExamples: [
      {
        title: "A box that does not earn its place",
        label: "Simplified educational illustration",
        body: "A policy FAQ requires grounded answers and a refusal of grade changes. A handbook retriever covers grounding. A guardrail covers the refusal. A second, larger model adds cost and latency and covers neither tag. The smaller set is the one that meets the brief.",
      },
    ],
    visualNote: "The architecture graph labels every selected box and the concern it covers. A missing concern is named in text.",
    applications:
      "Campus assistants, support desks, and internal tools are usually compositions of this kind. The diagram is a claim about requirements, not a decoration.",
    tradeoffs:
      "Each added component can cover a failure mode and can add latency, cost, and operational surface. Memory helps long tasks and creates a data store to govern. A cache helps repeats and can freeze a bad answer.",
    bestPractices: [
      "List requirements before components.",
      "Map each component to one failure mode.",
      "Prefer the smallest set that covers the brief inside the budget.",
      "Name what you would measure to know the component is doing its job.",
    ],
    pitfalls: [
      "Adding a larger model instead of a source of truth.",
      "Drawing a guardrail you never defined.",
      "Treating the relative numbers as a cloud quote.",
      "Calling the diagram finished because it looks complete.",
    ],
    checkYourUnderstanding: [
      "What requirement is left open if you select only a model?",
      "Why can two components conflict even if both sound useful?",
      "What would you measure to know a cache is safe here?",
    ],
    whenToUse: "Use a component when the brief names a failure mode that component actually addresses.",
    whenNotToUse: "Do not add a component to make the diagram look like a reference architecture.",
    productionConsiderations:
      "A real design also names owners, data boundaries, and how each box fails. This game stops at coverage and a teaching budget.",
  },
  educator: {
    whyTeach: "Students collect components from talks. They need practice refusing one.",
    whatStudentsDo: "They select a set of cards and see which required concern, budget, or conflict decided the score.",
    evidencePrompts: [
      "Which requirement did each selected component cover?",
      "Which component did you refuse, and why?",
      "What would the relative budget fail to tell you about a real deployment?",
    ],
    beforeClass: "Pick one product and list three failure modes before showing any diagram.",
    duringClass: "Require a spoken justification before the set is locked.",
    afterClass: "Redraw one round as a sequence: request, route, retrieve, check, respond.",
    assignment: "Write a one-page architecture for a campus tool with a requirement list and a component you deliberately omitted.",
    extension: "Add a conflict to a local round and explain the failure mode it represents.",
    relatedGames: "Retrieval Lab, Agent Architect, Ship-It Simulator, and ProdOps Gauntlet, which is what happens after the diagram is live.",
  },
  discussionQuestions: [
    "Why is a larger model not a substitute for a source you can cite?",
    "When is a human escalation a component rather than a failure?",
    "What budget in a real system is doing the job these relative numbers do here?",
    "How would you know a guardrail is actually running?",
  ],
  nextConnection: {
    headline: "A diagram still has to be operated.",
    body: "System Composer stops at a justified design. ProdOps Gauntlet starts when an indicator moves: cost, a bad prompt release, a stale index, an injected instruction, or an audit question.",
    path: "requirements → components → live signals and an incident response",
  },
};

export const prodopsTeaching: GameTeaching = {
  atAGlance: {
    tierExplanation: "Systems Forge. Students practice an incident workflow on authored cases.",
    recommendedLevel: "Advanced. System Composer and Ship-It supply the vocabulary of components and indicators.",
    timeExplanation: "About 25 minutes for five incidents.",
    activityType: "Choose a response to an incident card. Some responses are acceptable but weaker than the one that matches the evidence.",
    masteryExplanation: "70% is the line for these cases. It is not an on-call certification.",
    statusExplanation: "Playable Prototype. The incidents, metrics, and outcomes are written in advance. Nothing is monitored live.",
  },
  whyThisGameExists: [
    "Operations is where a design meets a change: a client retry, a prompt edit, a new handbook, a hostile chunk, an auditor. Students who can draw a system still need practice choosing a response from evidence.",
    "The game uses short incident cards so the class can compare responses. The point is the workflow: detect, diagnose, mitigate, verify, document, and prevent the same failure.",
    "A correct-looking action that destroys evidence or hides a citation is part of what the cases are built to catch.",
  ],
  bloomExplanation:
    "Students remember the incident steps, understand which signal distinguishes the cases, and apply a response that matches the evidence rather than a generic 'restart it.'",
  misconceptions: [
    {
      statement: "A common misconception is that every quality drop should be fixed by changing the model.",
      howTheGameAddressesIt: "Cases include a client retry bug, a prompt rollback, and a stale index, where a bigger model is the weaker move.",
    },
    {
      statement: "Another misconception is that deleting logs makes an incident smaller.",
      howTheGameAddressesIt: "The audit and injection rounds treat destroyed evidence as a poor response.",
    },
    {
      statement: "Students may think the metrics are from a live dashboard.",
      howTheGameAddressesIt: "The disclosure says the cards are authored. The score does not query a monitoring system.",
    },
  ],
  assigning: {
    required: "Willingness to read a short timeline and name what changed.",
    helpful: "Ship-It Simulator, so latency, retries, and cost are familiar.",
    notRequired: "On-call experience or access to a production account.",
  },
  difficultyExplanation: "Advanced: the tempting response is often the one that treats the wrong layer. Students do not touch a real system.",
  roundNotes: [
    {
      practicing: "A cost spike that lines up with a client change.",
      whyChosen: "Spend incidents are often caused upstream of the model.",
      watchFor: "The time the client behavior changed, not only the time the bill moved.",
      whatMattered: "Capping the new retries addresses the cause. Flushing a cache or upsizing the model spends more.",
      alternatives: "Waiting on a provider status page is weaker when the page is not the source of the extra calls.",
    },
    {
      practicing: "A measured drop after a prompt edit.",
      whyChosen: "Prompt changes are releases. They deserve the same rollback habit as code.",
      watchFor: "The evaluation that was green before the edit.",
      whatMattered: "Restoring the previous template and the eval gate returns to a known result. Fine-tuning overnight does not.",
      alternatives: "Adding 'be correct' does not restore a measured template. Disabling the eval removes the signal.",
    },
    {
      practicing: "Answers that cite a handbook version that is no longer current.",
      whyChosen: "Retrieval failures often look like model failures.",
      watchFor: "The version or date on the chunk, not the fluency of the sentence.",
      whatMattered: "Reindexing and gating on version updates the source. Restarting the model leaves the old chunk in place.",
      alternatives: "Telling the model to ignore old policies fails if the old policy is still the retrieved text.",
    },
    {
      practicing: "A retrieved chunk that tries to give the model new instructions.",
      whyChosen: "Indirect prompt injection is an operations problem as well as a prompting problem.",
      watchFor: "Whether retrieved text is treated as data.",
      whatMattered: "Quarantine and an instruction hierarchy stop the chunk from overriding policy. Obeying it because retrieval is 'trusted' is the failure.",
      alternatives: "Upgrading the model does not define that hierarchy. Deleting logs hides the event.",
    },
    {
      practicing: "An audit question that must be answerable without storing forbidden text.",
      whyChosen: "Compliance is a design constraint on logs, not a speech at the end.",
      watchFor: "What the auditor needs to know, and what the policy says not to copy.",
      whatMattered: "A decision record, a policy version, and a hash can answer the question without a raw transcript.",
      alternatives: "Keeping full prompts, emailing them, or deleting every log each miss a different part of the constraint.",
    },
  ],
  scoringNarrative:
    "Five rounds, 10 points each, 50 maximum. The response marked best scores 10. An acceptable but weaker response scores 6. A poor response scores 0. Each hint subtracts 1, down to 0. Retries keep the best score. Mastery is 70% on these cases. Grades use the shared A–F bands. The cases are not a live incident log.",
  transferExplanation:
    "Transfer is writing the same workflow for a new symptom: what you would detect, which layer you would check first, how you would mitigate without destroying evidence, and what you would change so it does not recur.",
  selfEvaluationQuestions: [
    "Can I walk the steps detect, diagnose, mitigate, verify, document, prevent?",
    "Can I tell a retrieval failure from a model failure in one of these cases?",
    "Can I explain why a prompt edit is a release?",
    "Can I say what an audit log needs, and what it should not store, in the last case?",
    "Can I explain why these metrics are authored?",
  ],
  guide: {
    title: "Understanding LLM operations",
    overview:
      "ProdOps Gauntlet is a set of incident cards. Each card has a timeline, a few metrics, and responses. You choose a response. The outcome text is written in advance so every student can discuss the same case.",
    keyConcepts: [
      { term: "Observability", explanation: "The signals that let someone notice and explain a change: traces, latency, token use, cost, errors, and evaluation results." },
      { term: "Regression", explanation: "A measured drop after a change, such as a prompt edit, a model swap, or a new index." },
      { term: "Drift", explanation: "A slow change in inputs, retrieved documents, or behavior. A stale handbook is a concrete version of content drift." },
      { term: "Incident workflow", explanation: "Detect, diagnose, mitigate, verify, document, and prevent recurrence. Skipping verify leaves you unsure the mitigation worked." },
      { term: "Rollback", explanation: "Returning to a previous known configuration, prompt, or index, rather than inventing a new fix under pressure." },
      { term: "Safety monitoring and compliance", explanation: "Watching for policy failures, and keeping the records an audit needs without creating a forbidden copy of sensitive text." },
    ],
    howItWorks:
      "You read the card and select a response. Best, acceptable, and poor are labels in the content, not a judgment from a monitoring vendor. Hints explain the evidence without pasting the selection.",
    workedExamples: [
      {
        title: "The bill moved because the client moved",
        label: "Simplified educational illustration",
        body: "A cost chart triples at 14:10. A client deploy at 14:08 removed backoff. The provider status page is green. The layer that changed is the client. Capping retries is a mitigation aimed at that layer. Changing the model is aimed at a layer that did not change.",
      },
    ],
    visualNote: "The incident timeline lists times and events in text. Metric chips include a word such as higher or baseline, not only a color.",
    applications:
      "Any course that ships a class demo toward a shared tool will meet these cases: a prompt someone 'improved,' a PDF that changed, a cost surprise, and a request for logs.",
    tradeoffs:
      "Rich logs explain incidents and can violate a data rule. Fast rollback restores a known state and pauses a fix you still need. An eval gate slows a release and catches a silent quality drop.",
    bestPractices: [
      "Name the layer that changed before you change a different layer.",
      "Keep an evaluation you can rerun on the same items.",
      "Treat prompt and index updates as releases with a rollback.",
      "Store the minimum record that answers the audit question.",
    ],
    pitfalls: [
      "Upsizing a model to fix a client bug.",
      "Disabling an evaluation because it became inconvenient.",
      "Hiding citations that would have shown a stale chunk.",
      "Deleting logs as a form of mitigation.",
    ],
    checkYourUnderstanding: [
      "What is the difference between mitigate and verify?",
      "Why can a retrieval incident look like a model incident?",
      "What would you refuse to store in the audit round, and why?",
    ],
    whenToUse: "Use this workflow whenever a measured signal moves and more than one layer could be responsible.",
    whenNotToUse: "Do not open an incident ritual for a single local experiment that has no users and no saved baseline. Write the baseline first.",
    productionConsiderations:
      "A real on-call setup has owners, alerts, traces, and a place to write the review. This gauntlet only rehearses the reasoning.",
  },
  educator: {
    whyTeach: "Students otherwise meet operations as a list of tools. The transferable skill is the response to evidence.",
    whatStudentsDo: "They read a card, choose a response, and compare it with the alternatives in the feedback.",
    evidencePrompts: [
      "Which fact in the timeline identified the layer?",
      "What would the weaker response have made worse?",
      "What would you write down so the same case is easier next time?",
    ],
    beforeClass: "Walk one cost chart and ask which layer changed.",
    duringClass: "Have pairs disagree out loud before locking a response.",
    afterClass: "Draft a five-line incident note for one round: detect, diagnose, mitigate, verify, prevent.",
    assignment: "Write an on-call card for a campus bot: the alert, the first dashboard, and the rollback.",
    extension: "Add an acceptable-but-weaker response to a case and say what evidence it ignores.",
    relatedGames: "Ship-It Simulator, Retrieval Lab, Alignment Arena for policy, and Foundry Arena for designing the constraints before the incident.",
  },
  discussionQuestions: [
    "Why is 'use a bigger model' a weak default response?",
    "What makes a prompt change similar to a code release?",
    "How do you answer an auditor without copying the sensitive text?",
    "What evidence would you refuse to delete?",
  ],
  nextConnection: {
    headline: "Operations assumes a system. Foundry asks you to design one under a brief.",
    body: "ProdOps is how you respond when a system is already live. Foundry Arena steps back to a domain brief where more than one architecture can be defended, and the rubric is visible before you submit.",
    path: "signals and incidents → a domain brief, stakeholders, and a defended design",
  },
};

export const foundryTeaching: GameTeaching = {
  atAGlance: {
    tierExplanation: "Foundry Arena. This tier is synthesis. A brief can have more than one defensible design.",
    recommendedLevel: "Advanced synthesis. Students should be able to name constraints from earlier games, even if they have not mastered every one.",
    timeExplanation: "About 40 minutes if you work one path carefully. There are six domain briefs.",
    activityType: "Cover the brief's constraints, name a trade-off in a reflection, and complete the self-rating. The rubric is visible before you submit.",
    masteryExplanation:
      "70% means the response covered the authored constraints and included a reflection and self-rating. It is not a single correct architecture and not a professional design review.",
    statusExplanation:
      "Playable Prototype. Scoring is constraint coverage, a reflection, and a completed self-rating. Paths are Industry, Healthcare, Robotics, Ethics, Education, and Sandbox.",
  },
  whyThisGameExists: [
    "The earlier games isolate one decision. A real brief arrives with stakeholders, a budget, a harm, and a source of truth all at once. Students need practice holding those together without being told there is one official diagram.",
    "Foundry is a design studio, not a quiz with a hidden answer key. The rubric is on the page before submission so students can see how coverage, justification, and reflection are weighed.",
    "The interaction fits because the learning goal is justification under constraints. A multiple-choice 'correct stack' would teach the opposite lesson.",
  ],
  bloomExplanation:
    "The emphasis is Analyze → Evaluate → Create. Students analyze a brief's stakeholders and constraints, evaluate options against a visible rubric, and create a defended design rather than recall a single pattern.",
  misconceptions: [
    {
      statement: "A common misconception is that a capstone has one architecture the instructor is hiding.",
      howTheGameAddressesIt: "The page says more than one covering set can score, and the rubric is shown first.",
    },
    {
      statement: "Another misconception is that a fluent reflection can replace a missed constraint.",
      howTheGameAddressesIt: "Coverage and the reflection are separate parts of the score. A long paragraph does not check a constraint box.",
    },
    {
      statement: "Students may treat the in-round self-rating as the private self-evaluation stored after the game.",
      howTheGameAddressesIt: "The in-round rating is part of this activity's rubric. The later 'How well do I understand this?' marks are stored separately and do not change the score.",
    },
  ],
  assigning: {
    required: "Enough of the earlier vocabulary to recognize grounding, a limit, a person in the loop, and a way to notice failure.",
    helpful: "System Composer and one domain the student cares about. Mastery of all twelve earlier games is not required to open a single path.",
    notRequired: "A correct answer from an answer key, or permission to build the system for real.",
  },
  difficultyExplanation:
    "Advanced synthesis: the brief is under-specified on purpose, and the work is to make the constraints and the trade-off explicit. Students are not implementing the system.",
  roundNotes: [
    {
      practicing: "A support desk with a cost cap, a citable policy, and a human for high-value actions.",
      whyChosen: "Industry is the clearest place to see cost, grounding, and escalation together.",
      watchFor: "Whether spend, the manual, and the refund path are all addressed.",
      whatMattered: "A route and a cache can hold cost down. A cited manual covers grounding. A person covers the refund. The largest model does not cover those by itself.",
      alternatives: "Sending every call to the largest model, recalling policy from memory, or auto-issuing the refund each miss a named constraint.",
    },
    {
      practicing: "A clinic note where privacy, the chart, and medication changes have different owners.",
      whyChosen: "Healthcare makes data boundaries and clinical authority concrete.",
      watchFor: "Where the note is allowed to go, what it may quote, and what it must not write.",
      whatMattered: "An approved environment, chart passages, and a clinician for medication changes are different constraints.",
      alternatives: "A public API, general medical knowledge, or an automatic medication write each fail a part of the brief.",
    },
    {
      practicing: "A lab arm that may not invent a position or a motion.",
      whyChosen: "Robotics shows why language is not perception or a safety limit.",
      watchFor: "A sensor, a limit outside the prompt, and a stop.",
      whatMattered: "The camera localizes. A workspace limit rejects a bad target. Low confidence stops the arm.",
      alternatives: "Guessing coordinates, a polite prompt, or trying the reach anyway leave the physical constraint unenforced.",
    },
    {
      practicing: "A hiring workflow where the model must not be the decision.",
      whyChosen: "Ethics is about authority, proxies, and an audit, not a softer prompt.",
      watchFor: "Who decides, what a reviewer can see, and which fields never reach the model.",
      whatMattered: "A summary a person judges, a redacted input log, and stripped proxies cover the brief.",
      alternatives: "A hire score, no log, or the full PDF including a photo miss human authority, audit, or proxy control.",
    },
    {
      practicing: "A tutor that helps without completing the assignment, grounded in the course.",
      whyChosen: "Education is a domain where the wrong success metric is handing over the answer.",
      watchFor: "Hints versus finals, course notes versus the open web, and what faculty are allowed to see.",
      whatMattered: "A hint and a check, a citation to the week's notes, and topic counts rather than full transcripts match the brief.",
      alternatives: "The final answer, an arbitrary web page, or every student sentence each violate a different constraint.",
    },
    {
      practicing: "A brief the student writes, with a source, a hard limit, and a way to notice failure.",
      whyChosen: "The sandbox checks whether the student can state constraints, not only recognize them.",
      watchFor: "A user, an action, a source you could show later, a forbidden action, and a log.",
      whatMattered: "The score looks for those named pieces. A vague 'the model will know' does not ground the design.",
      alternatives: "Skipping the limit or the signal leaves a demo with no boundary and no way to see that it failed.",
    },
  ],
  scoringNarrative:
    "Six briefs. Each brief scores up to 10 from the rubric printed on the page: points for constraints the selected options cover, points for a reflection that names a trade-off, and a point for completing the in-round self-rating. Partial credit is possible. A missed constraint is not repaired by a longer reflection. Hints subtract 1 point from that brief, down to 0. Retries keep the best score. The maximum is 60. Mastery is 70% of that total. The in-round self-rating is part of this rubric. The separate self-evaluation after the game does not change the score. There is not one correct architecture.",
  transferExplanation:
    "Transfer is carrying the same rubric to a brief the game does not contain: stakeholders, requirements, constraints, components, risks, an evaluation plan, and a trade-off you can defend out loud.",
  selfEvaluationQuestions: [
    "Can I list the stakeholders and the constraint I was unwilling to drop?",
    "Can I explain a trade-off without claiming a single correct stack?",
    "Can I say how I would evaluate the design later?",
    "Can I separate the in-round rubric rating from the private self-evaluation?",
    "Can I point to one risk the design still carries?",
  ],
  guide: {
    title: "Understanding a design brief",
    overview:
      "Foundry Arena is the synthesis activity. You pick a domain path or write a sandbox brief, cover the constraints the rubric lists, and write the trade-off you are accepting. The game records coverage and the reflection. It does not build or deploy the system.",
    keyConcepts: [
      { term: "Stakeholder", explanation: "A person or group the design can help or harm, including the operator who has to notice a failure." },
      { term: "Requirement and constraint", explanation: "A requirement is what the system must do. A constraint is a limit on how, such as cost, privacy, or a human decision." },
      { term: "Architecture decision", explanation: "The components you include and the ones you refuse, tied to those constraints." },
      { term: "Risk and evaluation", explanation: "A risk is how the design can still fail. An evaluation plan is what you would measure or review later." },
      { term: "Rubric", explanation: "The visible scoring guide: technical fit, constraint coverage, justification, reliability, safety, evaluation, trade-off awareness, and reflection." },
    ],
    howItWorks:
      "Each path has options that cover or miss named constraints, plus a reflection and an in-round self-rating. Points come from the covers you select and from completing the written parts. The sandbox path scores whether you named a user, a source, a limit, and a signal. No model is called to grade the prose beyond those checks.",
    workedExamples: [
      {
        title: "Two designs that can both cover a desk",
        label: "Simplified educational illustration",
        body: "A support desk must stay inside a cost cap, cite the return manual, and send high-value refunds to a person. One design uses a small model, a cache, and the manual. Another uses a medium model and the same manual and escalation, without a cache, if the volume is low enough to meet the cap. Both can cover the constraints. 'Always use the largest model and let it refund' covers none of them cleanly.",
      },
    ],
    visualNote: "The design canvas labels scenario, stakeholders, requirements, constraints, components, risks, and evaluation. The rubric is text, readable before you submit.",
    applications:
      "Use the paths as studio briefs: a campus support bot, a clinic note, a lab robot, a hiring aid, or a tutor. The sandbox is there for a local problem the six paths do not name.",
    tradeoffs:
      "Privacy can compete with a richer log. A human check competes with speed. A smaller model competes with fluency. The reflection is where you say which side you are taking and what risk remains.",
    bestPractices: [
      "Read the rubric before choosing options.",
      "Name who is affected, not only which component is fashionable.",
      "State the constraint you refuse to drop.",
      "Write how someone would notice the design failing.",
    ],
    pitfalls: [
      "Hunting for a single official architecture.",
      "Writing a long reflection that never names a trade-off.",
      "Letting the model be the hiring decision, the medication change, or the robot's safety limit.",
      "Treating the sandbox as finished because the paragraph sounds plausible.",
    ],
    checkYourUnderstanding: [
      "What is the difference between covering a constraint and describing a component?",
      "Why can two different sets both be acceptable?",
      "What would you measure after a Foundry design left the classroom?",
    ],
    whenToUse: "Use Foundry when the learning goal is a defended design under a brief.",
    whenNotToUse: "Do not use Foundry as the first activity for a brand-new concept such as tokenization. Use the earlier game that isolates that concept.",
    productionConsiderations:
      "A classroom rubric is not a security review, a clinical validation, or an institutional approval. Those require the processes of the organization that would deploy the system.",
  },
  educator: {
    whyTeach: "Synthesis is where students show whether earlier concepts can travel together. The rubric makes that judgment discussable.",
    whatStudentsDo: "They choose a path, select options against visible constraints, write a trade-off, and rate their own brief as part of the rubric.",
    evidencePrompts: [
      "Which constraint was non-negotiable, and what did you give up to keep it?",
      "Who is affected if this design fails?",
      "What would you measure in the first week if this were more than a classroom brief?",
      "Why is there no single correct architecture on this page?",
    ],
    beforeClass: "Pick one path and read the rubric aloud. Tell students there is not a hidden answer key.",
    duringClass: "Pairs compare two covering designs and one design that misses a constraint.",
    afterClass: "Collect the reflections. Grade the constraint and the trade-off, not prose length alone.",
    assignment: "Extend the sandbox brief with a stakeholder your path did not name, and a measurement plan of five lines.",
    extension: "Write a second design that also covers the rubric and say which risk each design keeps.",
    relatedGames: "Every earlier game is a component skill. System Composer and ProdOps are the closest practice for coverage and operations.",
  },
  discussionQuestions: [
    "Which constraint would you refuse to trade away in the healthcare brief, and why?",
    "Why is a prompt an insufficient safety limit for the robot?",
    "What would a hiring audit need to see?",
    "How should a tutor be evaluated if the wrong success metric is 'the answer appeared'?",
    "What remains unfinished when the sandbox score is full credit?",
  ],
  nextConnection: {
    headline: "The sequence returns you to the work of building and measuring.",
    body: "Foundry is the end of this pedagogical path, not the end of engineering. A defended brief still needs the tokenizer of the real model, a retrieval evaluation, an operations signal, and a review by the people who carry the risk. The course order is a teaching sequence. Production systems are not required to be built in this order.",
    path: "a defended brief → measurement, review, and the people who would live with the system",
  },
};
