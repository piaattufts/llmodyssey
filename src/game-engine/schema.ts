import { z } from "zod";

export const bloomLevelSchema = z.enum([
  "remember",
  "understand",
  "apply",
  "analyze",
  "evaluate",
  "create",
]);

export const qualitySchema = z.enum(["best", "acceptable", "poor"]);

export const metricToneSchema = z.enum(["good", "poor", "neutral"]);

export const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  tone: metricToneSchema,
});

export const implementationSchema = z.object({
  type: z.enum([
    "precomputed",
    "simplified-computation",
    "educational-simulation",
    "deterministic-simulation",
    "mixed",
  ]),
  label: z.string().min(1),
  whatIsReal: z.string().min(1),
  whatIsSimulated: z.string().min(1),
});

const choiceOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  metrics: z.array(metricSchema),
  quality: qualitySchema,
});

const interactionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("choice"),
    prompt: z.string().min(1),
    options: z.array(choiceOptionSchema).min(2),
  }),
  z.object({
    type: z.literal("tokenizer"),
    text: z.string().min(1),
    objective: z.string().min(1),
    pricePerMillionTokensUsd: z.number().positive(),
    calls: z.number().int().positive(),
    strategies: z
      .array(
        z.object({
          id: z.string().min(1),
          name: z.string().min(1),
          summary: z.string().min(1),
          tokens: z.array(z.string().min(1)).min(1),
          vocabEfficiency: z.number().min(0).max(100),
          quality: qualitySchema,
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal("attention"),
    prompt: z.string().min(1),
    tokens: z.array(z.string().min(1)).min(2),
    scale: z.number().positive(),
    heads: z
      .array(
        z.object({
          name: z.string().min(1),
          query: z.array(z.number()).min(1),
          keys: z.array(z.array(z.number()).min(1)).min(2),
        }),
      )
      .min(1),
    answerHead: z.number().int().nonnegative(),
    formulaNote: z.string().min(1),
  }),
  z.object({
    type: z.literal("budget"),
    prompt: z.string().min(1),
    budgetTokens: z.number().int().positive(),
    minRelevance: z.number().nonnegative(),
    strategies: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          description: z.string().min(1),
          mode: z.enum(["select-spans", "fixed-summary"]),
          summaryTokens: z.number().int().positive().optional(),
          summaryRelevance: z.number().nonnegative().optional(),
          summaryText: z.string().optional(),
          dropsMustKeep: z.boolean(),
        }),
      )
      .min(2),
    requiredStrategyId: z.string().min(1).nullable(),
    spans: z
      .array(
        z.object({
          id: z.string().min(1),
          text: z.string().min(1),
          tokens: z.number().int().positive(),
          relevance: z.number().nonnegative(),
          mustKeep: z.boolean(),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal("curve"),
    prompt: z.string().min(1),
    scenario: z.object({
      baseLoss: z.number().positive(),
      lrStableMax: z.number().positive(),
      overfitEpoch: z.number().int().positive(),
      loraFloor: z.number().positive(),
      fullFloor: z.number().positive(),
      forgettingEpoch: z.number().int().positive().nullable(),
    }),
    targets: z.object({
      maxFinalValLoss: z.number().positive(),
      maxGap: z.number().nonnegative(),
      forbidDivergence: z.boolean(),
      forbidForgetting: z.boolean(),
      requiredMethod: z.enum(["full", "lora"]).nullable(),
    }),
    initial: z.object({
      learningRate: z.number().positive(),
      epochs: z.number().int().positive(),
      batchSize: z.number().int().positive(),
      method: z.enum(["full", "lora"]),
    }),
    lrMin: z.number().positive(),
    lrMax: z.number().positive(),
    epochMin: z.number().int().positive(),
    epochMax: z.number().int().positive(),
  }),
  z.object({
    type: z.literal("workflow"),
    prompt: z.string().min(1),
    steps: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          description: z.string().min(1),
          required: z.boolean(),
          harmful: z.boolean(),
        }),
      )
      .min(2),
    temperatures: z
      .array(
        z.object({
          value: z.number().nonnegative(),
          label: z.string().min(1),
          samples: z.array(z.string().min(1)).min(1),
          agreement: z.number().min(0).max(1),
          quality: qualitySchema,
          note: z.string().min(1),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal("rank"),
    prompt: z.string().min(1),
    userRequest: z.string().min(1),
    weights: z.object({
      helpfulness: z.number().nonnegative(),
      safety: z.number().nonnegative(),
      factuality: z.number().nonnegative(),
    }),
    responses: z
      .array(
        z.object({
          id: z.string().min(1),
          text: z.string().min(1),
          helpfulness: z.number().min(0).max(5),
          safety: z.number().min(0).max(5),
          factuality: z.number().min(0).max(5),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal("levers"),
    prompt: z.string().min(1),
    baseline: z.record(z.string(), z.number()),
    metrics: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          unit: z.string(),
          direction: z.enum(["max", "min"]),
          limit: z.number(),
        }),
      )
      .min(1),
    levers: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          description: z.string().min(1),
          effects: z.record(z.string(), z.number()),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal("agent"),
    prompt: z.string().min(1),
    goal: z.string().min(1),
    tools: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          description: z.string().min(1),
          needed: z.boolean(),
          harmful: z.boolean(),
        }),
      )
      .min(2),
    controls: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          description: z.string().min(1),
          needed: z.boolean(),
          harmful: z.boolean(),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal("retrieval"),
    prompt: z.string().min(1),
    query: z.string().min(1),
    queryVector: z.array(z.number()).min(1),
    queryKeywords: z.array(z.string().min(1)).min(1),
    topK: z.number().int().positive(),
    minRecall: z.number().min(0).max(1),
    minPrecision: z.number().min(0).max(1),
    initialMethod: z.enum(["keyword", "vector", "hybrid"]),
    filter: z
      .object({
        field: z.string().min(1),
        value: z.string().min(1),
        label: z.string().min(1),
      })
      .nullable(),
    chunks: z
      .array(
        z.object({
          id: z.string().min(1),
          title: z.string().min(1),
          text: z.string().min(1),
          vector: z.array(z.number()).min(1),
          keywords: z.array(z.string()),
          metadata: z.record(z.string(), z.string()),
          relevant: z.boolean(),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal("composer"),
    prompt: z.string().min(1),
    maxCost: z.number().nonnegative(),
    maxLatency: z.number().nonnegative(),
    requiredCovers: z.array(z.string().min(1)).min(1),
    blocks: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          description: z.string().min(1),
          covers: z.array(z.string()),
          cost: z.number().nonnegative(),
          latency: z.number().nonnegative(),
          conflicts: z.array(z.string()),
        }),
      )
      .min(2),
  }),
  z.object({
    type: z.literal("foundry"),
    pathId: z.enum(["industry", "healthcare", "robotics", "ethics", "education", "sandbox"]),
    prompt: z.string().min(1),
    constraints: z.array(z.string().min(1)).min(1),
    requiresProblemStatement: z.boolean(),
    minProblemChars: z.number().int().nonnegative(),
    decisions: z
      .array(
        z.object({
          id: z.string().min(1),
          prompt: z.string().min(1),
          options: z
            .array(
              z.object({
                id: z.string().min(1),
                label: z.string().min(1),
                detail: z.string().min(1),
                covers: z.array(z.string()),
                misses: z.array(z.string()),
              }),
            )
            .min(2),
        }),
      )
      .min(1),
    rubric: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          points: z.number().positive(),
        }),
      )
      .min(1),
    reflectionMinChars: z.number().int().positive(),
  }),
]);

export const roundSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  concept: z.string().min(1),
  learnerTask: z.string().min(1),
  expectedReasoning: z.string().min(1),
  scenario: z.string().min(1),
  hints: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
  scoringRule: z.string().min(1),
  explanation: z.string().min(1),
  feedbackCorrect: z.string().min(1),
  feedbackIncorrect: z.string().min(1),
  interaction: interactionSchema,
});

export const gameDefinitionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  order: z.number().int().positive(),
  summary: z.string().min(1),
  purpose: z.string().min(1),
  whyItMatters: z.string().min(1),
  learningObjectives: z.array(z.string().min(1)).min(1),
  concepts: z.array(z.string().min(1)).min(1),
  bloomLevels: z.array(bloomLevelSchema).min(1),
  prerequisites: z.array(z.string()),
  estimatedMinutes: z.number().int().positive(),
  difficulty: z.enum(["foundational", "intermediate", "advanced", "capstone"]),
  masteryThreshold: z.number().min(0).max(100),
  misconception: z.string().min(1),
  reflectionPrompt: z.string().min(1),
  workedExample: z.object({
    title: z.string().min(1),
    steps: z.array(z.string().min(1)).min(1),
  }),
  furtherReadingIds: z.array(z.string().min(1)).min(1),
  implementation: implementationSchema,
  rounds: z.array(roundSchema).min(1),
});

export type GameDefinition = z.infer<typeof gameDefinitionSchema>;
export type RoundDefinition = z.infer<typeof roundSchema>;
export type Interaction = RoundDefinition["interaction"];
export type BloomLevel = z.infer<typeof bloomLevelSchema>;
export type Quality = z.infer<typeof qualitySchema>;

export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
}

export function parseGame(input: unknown, source: string): GameDefinition {
  const parsed = gameDefinitionSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid game content in ${source}:\n${formatZodError(parsed.error)}`);
  }
  validateGame(parsed.data, source);
  return parsed.data;
}

function validateGame(game: GameDefinition, source: string): void {
  const ids = new Set<string>();
  for (const round of game.rounds) {
    if (ids.has(round.id)) {
      throw new Error(`${source}: duplicate round id ${round.id}`);
    }
    ids.add(round.id);
    const interaction = round.interaction;
    if (interaction.type === "attention") {
      if (interaction.answerHead >= interaction.heads.length) {
        throw new Error(`${source} ${round.id}: answerHead is out of range`);
      }
      interaction.heads.forEach((head, headIndex) => {
        if (head.keys.length !== interaction.tokens.length) {
          throw new Error(`${source} ${round.id}: head ${headIndex} key count must match tokens`);
        }
        const width = head.query.length;
        head.keys.forEach((key, keyIndex) => {
          if (key.length !== width) {
            throw new Error(`${source} ${round.id}: head ${headIndex} key ${keyIndex} width mismatch`);
          }
        });
      });
    }
    if (interaction.type === "retrieval") {
      for (const chunk of interaction.chunks) {
        if (chunk.vector.length !== interaction.queryVector.length) {
          throw new Error(`${source} ${round.id}: chunk ${chunk.id} vector width mismatch`);
        }
      }
    }
    if (interaction.type === "levers") {
      for (const metric of interaction.metrics) {
        if (!(metric.id in interaction.baseline)) {
          throw new Error(`${source} ${round.id}: baseline missing ${metric.id}`);
        }
      }
    }
    if (interaction.type === "rank") {
      const weightSum =
        interaction.weights.helpfulness + interaction.weights.safety + interaction.weights.factuality;
      if (weightSum <= 0) {
        throw new Error(`${source} ${round.id}: rank weights must sum to more than 0`);
      }
    }
  }
}
