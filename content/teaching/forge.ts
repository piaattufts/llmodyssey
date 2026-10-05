import type { GameTeaching } from "../../src/game-engine/schema.ts";

export const tokenForgeTeaching: GameTeaching = {
  atAGlance: {
    tierExplanation: "Cognitive Core. This tier makes a single mechanism visible before students are asked to design a system.",
    recommendedLevel: "Introductory. No previous tokenization experience is required.",
    timeExplanation: "About 20 minutes for the five rounds, plus optional time in the concept guide.",
    activityType: "Compare authored segmentations and choose the one that fits the engineering goal.",
    masteryExplanation:
      "70% is an instructional performance threshold on these scenarios. It is not a claim of professional expertise, and it is not the same thing as being able to transfer the idea to a new text.",
    statusExplanation:
      "Reference Implementation. Token Forge currently demonstrates the most complete Odyssey pedagogical pattern: orientation, rounds, feedback, hints, scoring, a concept guide, and educator notes.",
  },
  whyThisGameExists: [
    "Students can leave a lecture able to say “models use tokens” and still be unable to predict what a tokenizer will do to code, a compound, or a mixed-script sentence. The difficulty is not the definition. It is that the split is invisible in ordinary writing tools.",
    "A lecture slide can define BPE. It cannot make two students look at the same pieces and argue about cost. Token Forge holds the segmentations still so the comparison is reproducible, then asks for a decision with a consequence.",
    "In engineering, tokenization sits on the path from raw text to token IDs, embeddings, and the transformer. It changes sequence length, how much of a context window is already spent, and what an API call costs in this exercise. Those are practical consequences, not trivia about vocabulary algorithms.",
  ],
  bloomExplanation:
    "Bloom's taxonomy here runs Remember → Understand → Apply. The activity begins by recognizing that a token is not a word, moves to understanding why the same string can be segmented differently, and then asks learners to apply that judgment to code, morphology, mixed script, and a cost constraint. It does not ask them to train a tokenizer.",
  misconceptions: [
    {
      statement: "A common misconception is that one word corresponds to one token. A tokenizer may represent a word as one token, several subword pieces, characters, or other learned units.",
      howTheGameAddressesIt: "Every round shows more than one segmentation of the same string, with the piece count used as the token count in this exercise.",
    },
    {
      statement: "Another misconception is that the shortest segmentation is automatically the best engineering choice.",
      howTheGameAddressesIt: "Later rounds keep a constraint besides length, such as keeping an identifier or a legal limitation recognizable.",
    },
    {
      statement: "Learners sometimes treat these pieces as the output of a vendor tokenizer.",
      howTheGameAddressesIt: "The page says the segmentations are authored illustrations. Counts and the displayed cost are arithmetic on those pieces.",
    },
  ],
  assigning: {
    required: "A basic idea that a language model consumes a sequence, not a picture of a paragraph.",
    helpful: "Familiarity with reading a short program or a non-English word. Neither is required to start round 1.",
    notRequired: "Knowledge of tokenizer training, merge algorithms, or any production tokenizer library.",
  },
  difficultyExplanation:
    "Introductory: students compare visible examples. They do not implement byte-pair encoding, train a vocabulary, or call a model API.",
  roundNotes: [
    {
      practicing: "Word-like pieces versus unnecessary splits in ordinary English.",
      whyChosen: "Frequent English is the case students think they already understand, which makes a hidden split easier to notice.",
      watchFor: "Whether frequent words stay whole, and what that does to the piece count.",
      whatMattered: "The sentence did not need extra splits. Extra pieces spend context and the exercise budget.",
      alternatives: "More fragmented rows can still be readable and still be a worse fit when the goal is a compact representation of ordinary English.",
    },
    {
      practicing: "How punctuation and snake_case change segmentation.",
      whyChosen: "Code is a different distribution from prose. Identifiers and brackets are where token counts often surprise people.",
      watchFor: "Whether the function name stays recognizable, not only whether the row is short.",
      whatMattered: "A split identifier is harder to align with the code the caller meant, and it is longer.",
      alternatives: "Rows that slice the name into many pieces can look thorough and still fail the goal of keeping the identifier intact.",
    },
    {
      practicing: "Subword pieces inside a morphologically complex word.",
      whyChosen: "Compounds show why subwords exist: a whole-word vocabulary cannot list every possible word.",
      watchFor: "Whether the pieces still look like meaningful parts, and how many of them there are.",
      whatMattered: "A character-level split is always possible and usually expensive. A morpheme-like split can stay shorter without erasing the word.",
      alternatives: "Over-splitting preserves every letter and loses the efficiency subwords were introduced to provide.",
    },
    {
      practicing: "Mixed-script text and names that an English-heavy vocabulary may slice apart.",
      whyChosen: "Multilingual text is not a font change. It is a question about what the vocabulary has seen.",
      watchFor: "Whether a name survives as a small number of pieces.",
      whatMattered: "Distribution shift can make the same message consume far more of a context window.",
      alternatives: "A segmentation that is compact in English can be a poor fit as soon as another script appears. That is not evidence that one algorithm is universally best.",
    },
    {
      practicing: "A domain sentence under a volume and cost constraint.",
      whyChosen: "Legal-style wording is where “just use fewer tokens” can damage the meaning.",
      watchFor: "Whether the limitation language is still present in the pieces you prefer.",
      whatMattered: "At high volume, a small per-call difference becomes a large bill, but only if the clause is still the clause.",
      alternatives: "The shortest row is weaker if it drops operative words. Length is a cost, not the whole specification.",
    },
  ],
  scoringNarrative:
    "Five rounds, 10 points each, 50 points maximum. The segmentation marked best scores 10. An acceptable alternative scores 6. A poor fit scores 0. Each revealed hint subtracts 1 point from that round, down to 0. Retries keep the best score. There is no separate efficiency bonus: token count is part of the judgment, not an extra prize. The game percent is the sum of best round scores. Grades are A 90–100, B 80–89, C 70–79, D 60–69, and F below 60. The mastery threshold is 70% of this activity, not expert competence.",
  transferExplanation:
    "Transfer is whether you can explain a new string: why the pieces differ, what property of the text mattered, and what you would measure with the tokenizer of the model you actually deploy. A 70% score is performance on these five cases. It does not by itself show transfer.",
  selfEvaluationQuestions: [
    "Can I explain why a token is not the same as a word?",
    "Can I calculate a token count from a segmentation shown on the page?",
    "Can I explain why two tokenizers may divide the same text differently?",
    "Can I explain why code or multilingual text may behave differently from ordinary English?",
    "Can I explain how tokenization affects context use?",
    "Can I explain why fewer tokens are not automatically evidence of a better tokenizer?",
  ],
  guide: {
    title: "Understanding tokenization",
    overview:
      "Tokenization transforms raw text into discrete units that a model can map to vocabulary identifiers. The path is raw text, then tokenization, then token IDs, then embeddings, then the transformer. Odyssey stops at the first step and makes the pieces inspectable. A token is not a promise about meaning. It is a unit the vocabulary can index. How that unit is chosen changes sequence length, which changes how much context is already used and what this exercise's cost estimate shows. The segmentations in Token Forge are simplified educational illustrations. They are not a live benchmark of commercial tokenizer libraries.",
    keyConcepts: [
      {
        term: "Characters, words, subwords, and tokens",
        explanation:
          "Characters are the symbols in the string. Words are a human convention and depend on the writing system. Subwords are pieces smaller than a word and larger than a character, learned or designed so the vocabulary can cover new words. A token is whichever unit the model’s vocabulary actually indexes.",
      },
      {
        term: "Token IDs and vocabulary",
        explanation:
          "After segmentation, each piece is mapped to an integer in a fixed vocabulary. The model does not see the letters. It sees those IDs. Vocabulary size is the number of distinct IDs. A larger vocabulary can keep more words whole and makes the embedding table larger. A smaller vocabulary splits more often and makes sequences longer.",
      },
      {
        term: "BPE",
        explanation:
          "Byte-pair encoding starts from small units and repeatedly merges the pair that is most frequent in the training data. The intuition is compression: frequent pairs become single tokens. A simplified illustration is the word “lower”: if “l o”, “lo w”, “low e”, and “lowe r” were merged in that frequency order, you might end with “low” and “er”. Real BPE is trained on a corpus, often on bytes, and will not follow this toy merge. Label: simplified educational illustration.",
      },
      {
        term: "WordPiece",
        explanation:
          "WordPiece is also a subword method. Conceptually it became widely known through a likelihood-based merge criterion rather than raw pair counts, and continuation marks such as “##” are a common way to show that a piece is not the start of a word. That mark is a convention of a particular implementation, not a law of language. Do not treat WordPiece as “the German tokenizer” or as universally better for compounds.",
      },
      {
        term: "SentencePiece",
        explanation:
          "SentencePiece is a framework that can train subword models, including BPE and unigram, directly from raw text. It does not require a separate pre-tokenizer that splits on spaces, which is one reason it is widely used for multilingual text. It is not universally the best choice for every multilingual task. The right comparison is against the tokenizer of the model you will deploy.",
      },
      {
        term: "Unigram",
        explanation:
          "Unigram language-model tokenization keeps a large candidate vocabulary and drops pieces that contribute least to the likelihood of the corpus, so several segmentations of one string can be scored. Subword regularization can even sample among them during training. In this game, the Unigram row is an authored illustration of a more fragmented segmentation, not a trained unigram model.",
      },
    ],
    howItWorks:
      "Token Forge is an educational simulation rather than a live benchmark of commercial tokenizer libraries. The built-in segmentations are authored so that every learner encounters the same reproducible examples. The application calculates token count and the displayed exercise cost from those representations. The purpose is to teach the engineering implications of segmentation, not to claim that a production tokenizer would emit the same pieces. In practice, use the tokenizer associated with the deployed model and measure the actual input.",
    workedExamples: [
      {
        title: "A toy BPE merge",
        label: "Simplified educational illustration",
        body: "Suppose a tiny corpus contains many copies of “low” and “lower”. Starting from characters, the most frequent pair might be “l” + “o” → “lo”, then “lo” + “w” → “low”. “lower” can then be “low” + “er” if that pair was also merged. Nothing in this story says a production BPE vocabulary still has those merges. It shows why frequent sequences become cheap and rare sequences stay split.",
      },
      {
        title: "Counting the exercise cost",
        label: "Arithmetic on the pieces shown",
        body: "If a row has 9 pieces, the price in the round is $5 per million tokens, and the scenario says 1,000,000 calls, the displayed cost is 9 × $5. Change the piece count and the cost changes. The price is an exercise price for comparison. It is not a current vendor rate, and it should not be quoted as one.",
      },
    ],
    visualNote:
      "The token chips are the pieces of the selected row. The count under the chips is the length of that list. Compare chips across rows before you treat a number as an answer. The diagram on this page is the path from raw text to token IDs. It is not a model forward pass.",
    applications:
      "Tokenization shows up when a prompt is longer than it looks, when code-review tools blow a context budget on identifiers, when a product name or compound is shredded, and when a multilingual message costs more than the English version of the same request. It also shows up in evaluation: if you count words and the API counts tokens, your length limit is wrong.",
    tradeoffs:
      "A larger vocabulary often shortens sequences and enlarges the embedding matrix. A smaller vocabulary does the opposite. Subwords help with rare words and can also split a meaningful identifier. Whitespace, punctuation, and script all change the outcome. Fewer tokens can be useful and can still be the wrong choice if the pieces no longer preserve what the task needed.",
    bestPractices: [
      "Measure with the tokenizer that belongs to the model you will call.",
      "Inspect code, names, and non-English text, not only a short English sentence.",
      "Treat token count as an input to context and cost, then check whether the content survived.",
      "Keep exercise prices labeled as exercise prices.",
    ],
    pitfalls: [
      "Assuming one word is one token.",
      "Assuming the segmentation in this game is what a vendor library returns today.",
      "Choosing a family because a slogan said it is best for code, German, or multilingual text.",
      "Optimizing token count by deleting words the task required.",
    ],
    checkYourUnderstanding: [
      "Why can two vocabularies segment one string differently?",
      "What is the difference between a word and a token?",
      "When would a shorter segmentation still be a worse engineering choice?",
    ],
    whenToUse:
      "Use this kind of comparison when students need to see segmentation before they hear about context windows, prompts, or API bills.",
    whenNotToUse:
      "Do not use Token Forge as a benchmark of production tokenizers or as a substitute for measuring a real prompt with the deployed tokenizer.",
    productionConsiderations:
      "In production, tokenize with the model’s tokenizer, count input and expected output separately, and re-measure when you change models. A context window is a token budget. Historical provider prices and context sizes go out of date; cite them only with a date and a source, which this exercise deliberately does not pretend to do.",
  },
  educator: {
    whyTeach:
      "Tokenization is the first place a written assignment becomes a model input. Students who cannot see the pieces will mis-explain later topics: context limits, prompt cost, retrieval chunks, and even attention, which operates over positions in the token sequence.",
    whatStudentsDo:
      "They read a string and a goal, compare four authored segmentations, and choose one. Feedback shows the piece counts, the exercise cost, and why length was or was not the right objective.",
    evidencePrompts: [
      "Why did the segmentation differ?",
      "What property of the input mattered?",
      "What engineering consequence followed?",
      "Would the same result necessarily hold for another model?",
      "What would you measure in a real production system?",
    ],
    beforeClass: "Introduce the words vocabulary, subword, and token. A five-minute demonstration that “tokenization” is not spell-check is enough.",
    duringClass: "Ask students to predict which row is shorter before they submit. The prediction is the point of the comparison.",
    afterClass: "If you have a real tokenizer for a model you teach, paste one of the strings and compare. Differences are a feature of the lesson, not a defect, as long as you say the game was illustrative.",
    assignment:
      "Collect three domain-specific examples from the students’ field and compare them with the tokenizer of a model that is actually deployed or documented. Ask what they would measure besides the count.",
    extension: "Have students write the cost formula for their own volume and price assumption, clearly labeled as an assumption.",
    relatedGames: "Attention Architect uses the resulting sequence. Context Compression spends the token budget those pieces created.",
  },
  discussionQuestions: [
    "Is the segmentation with the fewest tokens always best?",
    "Why might tokenization vary across languages even when the message is a translation?",
    "How can vocabulary construction influence who is represented cheaply and who is split into many pieces?",
    "Why should the tokenizer of the deployed model be tested directly?",
    "How can tokenization interact with a fixed context budget?",
  ],
  nextConnection: {
    headline: "From pieces to interactions",
    body: "Token Forge is about the units that enter the model. Attention Architect moves one step deeper and asks how positions in that sequence exchange information. The sequence is still the sequence Token Forge just made visible.",
    path: "Raw text → tokens → token representations → attention",
  },
};
