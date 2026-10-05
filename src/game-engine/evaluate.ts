import { attend } from "./models/attention.ts";
import { curveMeetsTargets, simulateLoss } from "./models/loss-curve.ts";
import { allMetricsSatisfied, metricSatisfied, projectMetrics } from "./models/levers.ts";
import { rankChunks, retrievalQuality } from "./models/retrieval.ts";
import type { GameDefinition, RoundDefinition } from "./schema.ts";
import { pointsForQuality, ROUND_MAX_POINTS } from "./scoring.ts";

export type GameAction =
  | { type: "choice"; optionId: string }
  | { type: "tokenizer"; strategyId: string }
  | { type: "attention"; tokenIndex: number }
  | { type: "budget"; strategyId: string; spanIds: string[] }
  | { type: "curve"; learningRate: number; epochs: number; batchSize: number; method: "full" | "lora" }
  | { type: "workflow"; stepIds: string[]; temperature: number }
  | { type: "rank"; responseId: string }
  | { type: "levers"; leverIds: string[] }
  | { type: "agent"; toolIds: string[]; controlIds: string[] }
  | { type: "retrieval"; method: "keyword" | "vector" | "hybrid"; useFilter: boolean }
  | { type: "composer"; blockIds: string[] }
  | {
      type: "foundry";
      choices: Record<string, string>;
      reflection: string;
      problemStatement: string;
      selfRatings: Record<string, number>;
    };

export interface BreakdownLine {
  label: string;
  detail: string;
}

export interface Evaluation {
  rawPoints: number;
  maxPoints: number;
  success: boolean;
  partial: boolean;
  feedback: string;
  explanation: string;
  breakdown: BreakdownLine[];
}

export interface ReadoutLine {
  label: string;
  value: string;
  tone: "good" | "poor" | "neutral";
}

export interface LiveReadout {
  lines: ReadoutLine[];
  detail: string;
}

export function initialAction(round: RoundDefinition): GameAction | null {
  const interaction = round.interaction;
  if (interaction.type === "curve") {
    return { type: "curve", ...interaction.initial };
  }
  if (interaction.type === "retrieval") {
    return { type: "retrieval", method: interaction.initialMethod, useFilter: false };
  }
  if (interaction.type === "levers") return { type: "levers", leverIds: [] };
  if (interaction.type === "budget") return { type: "budget", strategyId: interaction.strategies[0]?.id ?? "", spanIds: [] };
  if (interaction.type === "workflow") return { type: "workflow", stepIds: [], temperature: interaction.temperatures[0]?.value ?? 0 };
  if (interaction.type === "agent") return { type: "agent", toolIds: [], controlIds: [] };
  if (interaction.type === "composer") return { type: "composer", blockIds: [] };
  if (interaction.type === "foundry") {
    return { type: "foundry", choices: {}, reflection: "", problemStatement: "", selfRatings: {} };
  }
  return null;
}

export function liveReadout(round: RoundDefinition, action: GameAction | null): LiveReadout {
  if (!action || action.type !== round.interaction.type) {
    return { lines: [], detail: "Make a selection to see this round update." };
  }
  const interaction = round.interaction;
  if (interaction.type === "choice" && action.type === "choice") {
    const option = interaction.options.find((item) => item.id === action.optionId);
    return {
      lines: option?.metrics ?? [],
      detail: option ? option.description : "Select a strategy.",
    };
  }
  if (interaction.type === "tokenizer" && action.type === "tokenizer") {
    const strategy = interaction.strategies.find((item) => item.id === action.strategyId);
    if (!strategy) return { lines: [], detail: "Select a tokenizer family." };
    const cost = tokenCost(strategy.tokens.length, interaction.pricePerMillionTokensUsd, interaction.calls);
    return {
      lines: [
        { label: "Tokens", value: String(strategy.tokens.length), tone: "neutral" },
        { label: "Vocabulary efficiency", value: `${strategy.vocabEfficiency}%`, tone: "neutral" },
        { label: `Cost for ${interaction.calls.toLocaleString()} calls`, value: currency(cost), tone: "neutral" },
      ],
      detail: strategy.tokens.join(" | "),
    };
  }
  if (interaction.type === "attention" && action.type === "attention") {
    const head = interaction.heads[interaction.answerHead];
    if (!head) return { lines: [], detail: "" };
    const result = attend(head.query, head.keys, interaction.scale);
    return {
      lines: interaction.tokens.map((token, index) => ({
        label: token,
        value: `${((result.weights[index] ?? 0) * 100).toFixed(1)}%`,
        tone: index === action.tokenIndex ? "neutral" : "neutral",
      })),
      detail: `Simplified weights for ${head.name}. The largest weight is the current winner under dot-product attention.`,
    };
  }
  if (interaction.type === "budget" && action.type === "budget") {
    const strategy = interaction.strategies.find((item) => item.id === action.strategyId);
    const selected = interaction.spans.filter((span) => action.spanIds.includes(span.id));
    const tokens =
      strategy?.mode === "fixed-summary" ? (strategy.summaryTokens ?? 0) : selected.reduce((sum, span) => sum + span.tokens, 0);
    const relevance =
      strategy?.mode === "fixed-summary"
        ? (strategy.summaryRelevance ?? 0)
        : selected.reduce((sum, span) => sum + span.relevance, 0);
    return {
      lines: [
        {
          label: "Tokens used",
          value: `${tokens} / ${interaction.budgetTokens}`,
          tone: tokens <= interaction.budgetTokens ? "good" : "poor",
        },
        {
          label: "Relevance kept",
          value: `${relevance} / ${interaction.minRelevance} needed`,
          tone: relevance >= interaction.minRelevance ? "good" : "poor",
        },
      ],
      detail: strategy?.description ?? "",
    };
  }
  if (interaction.type === "curve" && action.type === "curve") {
    const series = simulateLoss(interaction.scenario, action);
    return {
      lines: [
        { label: "Final training loss", value: series.finalTrain.toFixed(3), tone: "neutral" },
        {
          label: "Final validation loss",
          value: series.finalVal.toFixed(3),
          tone: series.finalVal <= interaction.targets.maxFinalValLoss ? "good" : "poor",
        },
        {
          label: "Generalization gap",
          value: series.gap.toFixed(3),
          tone: series.gap <= interaction.targets.maxGap ? "good" : "poor",
        },
        {
          label: "Run status",
          value: series.diverged ? "Diverging" : series.forgetting ? "Forgetting prior task" : "Stable",
          tone: series.diverged || series.forgetting ? "poor" : "good",
        },
      ],
      detail: "Curves come from the documented educational model, not from training a neural network.",
    };
  }
  if (interaction.type === "workflow" && action.type === "workflow") {
    const temperature = interaction.temperatures.find((item) => item.value === action.temperature);
    return {
      lines: [
        { label: "Steps selected", value: String(action.stepIds.length), tone: "neutral" },
        {
          label: "Sample agreement",
          value: temperature ? `${Math.round(temperature.agreement * 100)}%` : "—",
          tone: "neutral",
        },
      ],
      detail: temperature ? temperature.samples.join(" · ") : "Choose a temperature to see the precomputed samples.",
    };
  }
  if (interaction.type === "rank" && action.type === "rank") {
    const response = interaction.responses.find((item) => item.id === action.responseId);
    if (!response) return { lines: [], detail: "" };
    const reward = weightedReward(interaction.weights, response);
    return {
      lines: [
        { label: "Helpfulness", value: `${response.helpfulness}/5`, tone: "neutral" },
        { label: "Safety", value: `${response.safety}/5`, tone: "neutral" },
        { label: "Factuality", value: `${response.factuality}/5`, tone: "neutral" },
        { label: "Weighted rubric score", value: reward.toFixed(2), tone: "neutral" },
      ],
      detail: "These rubric scores are authored for the exercise. They are not the output of a trained reward model.",
    };
  }
  if (interaction.type === "levers" && action.type === "levers") {
    const projected = projectMetrics(interaction.baseline, interaction.levers, action.leverIds);
    return {
      lines: interaction.metrics.map((metric) => {
        const value = projected[metric.id] ?? 0;
        return {
          label: metric.label,
          value: `${formatNumber(value)}${metric.unit}`,
          tone: metricSatisfied(metric, value) ? "good" : "poor",
        };
      }),
      detail: "Projected from the scenario baseline plus the selected levers. This is a parameterized simulation.",
    };
  }
  if (interaction.type === "agent" && action.type === "agent") {
    return {
      lines: [
        { label: "Tools", value: String(action.toolIds.length), tone: "neutral" },
        { label: "Controls", value: String(action.controlIds.length), tone: "neutral" },
      ],
      detail: interaction.goal,
    };
  }
  if (interaction.type === "retrieval" && action.type === "retrieval") {
    const ranked = rankChunks({
      method: action.method,
      queryVector: interaction.queryVector,
      queryKeywords: interaction.queryKeywords,
      chunks: interaction.chunks,
      topK: interaction.topK,
      filter: interaction.filter,
      useFilter: action.useFilter,
    });
    const quality = retrievalQuality(ranked, interaction.chunks);
    return {
      lines: [
        { label: "Precision", value: percent(quality.precision), tone: quality.precision >= interaction.minPrecision ? "good" : "poor" },
        { label: "Recall", value: percent(quality.recall), tone: quality.recall >= interaction.minRecall ? "good" : "poor" },
        { label: "Top hit", value: ranked[0]?.chunk.title ?? "none", tone: "neutral" },
      ],
      detail: ranked.map((row) => `${row.chunk.title} (${row.score.toFixed(2)})`).join(" · ") || "No chunks passed the filter.",
    };
  }
  if (interaction.type === "composer" && action.type === "composer") {
    const selected = interaction.blocks.filter((block) => action.blockIds.includes(block.id));
    const cost = selected.reduce((sum, block) => sum + block.cost, 0);
    const latency = selected.reduce((sum, block) => sum + block.latency, 0);
    const covers = new Set(selected.flatMap((block) => block.covers));
    return {
      lines: [
        { label: "Relative cost", value: `${cost} / ${interaction.maxCost}`, tone: cost <= interaction.maxCost ? "good" : "poor" },
        { label: "Relative latency", value: `${latency} / ${interaction.maxLatency}`, tone: latency <= interaction.maxLatency ? "good" : "poor" },
        {
          label: "Concerns covered",
          value: `${interaction.requiredCovers.filter((cover) => covers.has(cover)).length} / ${interaction.requiredCovers.length}`,
          tone: interaction.requiredCovers.every((cover) => covers.has(cover)) ? "good" : "poor",
        },
      ],
      detail: "Costs and latencies are relative teaching units, not a vendor quote.",
    };
  }
  if (interaction.type === "foundry" && action.type === "foundry") {
    const coverage = foundryCoverage(interaction, action);
    return {
      lines: coverage.lines,
      detail: "Foundry scores whether the design addresses the stated constraints. It does not hide a single correct architecture.",
    };
  }
  return { lines: [], detail: "" };
}

export function describeDecision(round: RoundDefinition, action: GameAction | null): string {
  if (!action || action.type !== round.interaction.type) return "No decision was submitted.";
  const interaction = round.interaction;
  if (interaction.type === "choice" && action.type === "choice") {
    return interaction.options.find((item) => item.id === action.optionId)?.label ?? "An unrecognized option.";
  }
  if (interaction.type === "tokenizer" && action.type === "tokenizer") {
    const strategy = interaction.strategies.find((item) => item.id === action.strategyId);
    return strategy ? `${strategy.name} (${strategy.tokens.length} authored tokens)` : "An unrecognized strategy.";
  }
  if (interaction.type === "attention" && action.type === "attention") {
    return interaction.tokens[action.tokenIndex] ?? "An unrecognized token.";
  }
  if (interaction.type === "budget" && action.type === "budget") {
    const strategy = interaction.strategies.find((item) => item.id === action.strategyId);
    const spans = interaction.spans.filter((span) => action.spanIds.includes(span.id)).map((span) => span.text);
    const kept = strategy?.mode === "fixed-summary" ? "prewritten summary" : spans.join("; ") || "no spans";
    return `${strategy?.label ?? "Unknown strategy"} — ${kept}`;
  }
  if (interaction.type === "curve" && action.type === "curve") {
    const method = action.method === "lora" ? "LoRA" : "Full fine-tuning";
    return `${method}, learning rate ${action.learningRate}, ${action.epochs} epochs, batch ${action.batchSize}`;
  }
  if (interaction.type === "workflow" && action.type === "workflow") {
    const steps = interaction.steps.filter((step) => action.stepIds.includes(step.id)).map((step) => step.label);
    const temperature = interaction.temperatures.find((item) => item.value === action.temperature);
    return `Steps: ${steps.join(", ") || "none"}. Temperature: ${temperature?.label ?? String(action.temperature)}.`;
  }
  if (interaction.type === "rank" && action.type === "rank") {
    return interaction.responses.find((item) => item.id === action.responseId)?.text ?? "An unrecognized response.";
  }
  if (interaction.type === "levers" && action.type === "levers") {
    const labels = interaction.levers.filter((lever) => action.leverIds.includes(lever.id)).map((lever) => lever.label);
    return labels.length ? labels.join(", ") : "No levers selected.";
  }
  if (interaction.type === "agent" && action.type === "agent") {
    const tools = interaction.tools.filter((tool) => action.toolIds.includes(tool.id)).map((tool) => tool.label);
    const controls = interaction.controls.filter((control) => action.controlIds.includes(control.id)).map((control) => control.label);
    return `Tools: ${tools.join(", ") || "none"}. Controls: ${controls.join(", ") || "none"}.`;
  }
  if (interaction.type === "retrieval" && action.type === "retrieval") {
    return `${action.method} retrieval${action.useFilter ? " with the metadata filter" : " without the metadata filter"}`;
  }
  if (interaction.type === "composer" && action.type === "composer") {
    const blocks = interaction.blocks.filter((block) => action.blockIds.includes(block.id)).map((block) => block.label);
    return blocks.length ? blocks.join(", ") : "No components selected.";
  }
  if (interaction.type === "foundry" && action.type === "foundry") {
    return interaction.decisions
      .map((decision) => {
        const option = decision.options.find((item) => item.id === action.choices[decision.id]);
        return `${option?.label ?? "not chosen"}`;
      })
      .join(" · ");
  }
  return "Decision recorded.";
}

export function resultLabel(success: boolean, partial: boolean): "Correct" | "Partially appropriate" | "Incorrect" {
  if (success) return "Correct";
  if (partial) return "Partially appropriate";
  return "Incorrect";
}

export function evaluateRound(round: RoundDefinition, action: GameAction | null): Evaluation {
  const empty = baseEvaluation(round, 0, false, round.feedbackIncorrect, ["No answer was submitted."]);
  if (!action || action.type !== round.interaction.type) return empty;
  const interaction = round.interaction;

  if (interaction.type === "choice" && action.type === "choice") {
    const option = interaction.options.find((item) => item.id === action.optionId);
    if (!option) return empty;
    const points = pointsForQuality(option.quality);
    return baseEvaluation(
      round,
      points,
      points === ROUND_MAX_POINTS,
      points === ROUND_MAX_POINTS ? round.feedbackCorrect : round.feedbackIncorrect,
      [`Selected “${option.label}”, scored as ${option.quality}.`, ...option.metrics.map((metric) => `${metric.label}: ${metric.value}`)],
    );
  }

  if (interaction.type === "tokenizer" && action.type === "tokenizer") {
    const strategy = interaction.strategies.find((item) => item.id === action.strategyId);
    if (!strategy) return empty;
    const points = pointsForQuality(strategy.quality);
    const comparisons = [...interaction.strategies]
      .sort((left, right) => left.tokens.length - right.tokens.length)
      .map((item) => `${item.name}: ${item.tokens.length} tokens`);
    return baseEvaluation(
      round,
      points,
      points === ROUND_MAX_POINTS,
      points === ROUND_MAX_POINTS ? round.feedbackCorrect : round.feedbackIncorrect,
      [
        `${strategy.name} is scored as ${strategy.quality} for this precomputed exercise.`,
        `Token counts — ${comparisons.join("; ")}.`,
        `Estimated cost for ${interaction.calls.toLocaleString()} calls: ${currency(tokenCost(strategy.tokens.length, interaction.pricePerMillionTokensUsd, interaction.calls))}.`,
      ],
    );
  }

  if (interaction.type === "attention" && action.type === "attention") {
    const head = interaction.heads[interaction.answerHead];
    if (!head) return empty;
    const result = attend(head.query, head.keys, interaction.scale);
    const chosen = interaction.tokens[action.tokenIndex] ?? "unknown";
    const winner = interaction.tokens[result.winner] ?? "unknown";
    const success = action.tokenIndex === result.winner;
    return baseEvaluation(round, success ? ROUND_MAX_POINTS : 0, success, success ? round.feedbackCorrect : round.feedbackIncorrect, [
      `Your selection: ${chosen}.`,
      `Highest simplified attention weight on ${head.name}: ${winner} (${((result.weights[result.winner] ?? 0) * 100).toFixed(1)}%).`,
      interaction.formulaNote,
    ]);
  }

  if (interaction.type === "budget" && action.type === "budget") {
    const strategy = interaction.strategies.find((item) => item.id === action.strategyId);
    if (!strategy) return empty;
    const selected = interaction.spans.filter((span) => action.spanIds.includes(span.id));
    const tokens = strategy.mode === "fixed-summary" ? (strategy.summaryTokens ?? Number.POSITIVE_INFINITY) : selected.reduce((sum, span) => sum + span.tokens, 0);
    const relevance = strategy.mode === "fixed-summary" ? (strategy.summaryRelevance ?? 0) : selected.reduce((sum, span) => sum + span.relevance, 0);
    const missingMustKeep =
      strategy.mode === "select-spans" && interaction.spans.some((span) => span.mustKeep && !action.spanIds.includes(span.id));
    const strategyOk = interaction.requiredStrategyId === null || interaction.requiredStrategyId === strategy.id;
    const success =
      strategyOk &&
      tokens <= interaction.budgetTokens &&
      relevance >= interaction.minRelevance &&
      !missingMustKeep &&
      !strategy.dropsMustKeep;
    return baseEvaluation(round, success ? ROUND_MAX_POINTS : 0, success, success ? round.feedbackCorrect : round.feedbackIncorrect, [
      `Strategy: ${strategy.label}.`,
      `Tokens ${tokens} against a budget of ${interaction.budgetTokens}.`,
      `Relevance ${relevance} against a minimum of ${interaction.minRelevance}.`,
      missingMustKeep || strategy.dropsMustKeep ? "A required fact was dropped." : "Required facts were kept.",
    ]);
  }

  if (interaction.type === "curve" && action.type === "curve") {
    const series = simulateLoss(interaction.scenario, action);
    const success = curveMeetsTargets(series, action, interaction.targets);
    return baseEvaluation(round, success ? ROUND_MAX_POINTS : 0, success, success ? round.feedbackCorrect : round.feedbackIncorrect, [
      `Method ${action.method}, learning rate ${action.learningRate}, epochs ${action.epochs}, batch ${action.batchSize}.`,
      `Final validation loss ${series.finalVal.toFixed(3)} (limit ${interaction.targets.maxFinalValLoss}).`,
      `Gap ${series.gap.toFixed(3)} (limit ${interaction.targets.maxGap}).`,
      series.diverged ? "The educational model marks this learning rate as divergent." : "The run stays numerically stable in the educational model.",
      series.forgetting ? "Full fine-tuning has entered the forgetting region of this scenario." : "No forgetting penalty is active.",
    ]);
  }

  if (interaction.type === "workflow" && action.type === "workflow") {
    const missing = interaction.steps.filter((step) => step.required && !action.stepIds.includes(step.id));
    const harmful = interaction.steps.filter((step) => step.harmful && action.stepIds.includes(step.id));
    const temperature = interaction.temperatures.find((item) => item.value === action.temperature);
    const quality = temperature?.quality ?? "poor";
    const points = missing.length === 0 && harmful.length === 0 ? pointsForQuality(quality) : 0;
    return baseEvaluation(round, points, points === ROUND_MAX_POINTS, points === ROUND_MAX_POINTS ? round.feedbackCorrect : round.feedbackIncorrect, [
      missing.length ? `Missing required steps: ${missing.map((step) => step.label).join(", ")}.` : "Required steps are present.",
      harmful.length ? `Harmful steps selected: ${harmful.map((step) => step.label).join(", ")}.` : "No harmful steps selected.",
      temperature ? `Temperature ${temperature.label} is ${temperature.quality}. ${temperature.note}` : "Unknown temperature.",
    ]);
  }

  if (interaction.type === "rank" && action.type === "rank") {
    const scored = interaction.responses.map((response) => ({
      response,
      reward: weightedReward(interaction.weights, response),
    }));
    const best = Math.max(...scored.map((item) => item.reward));
    const chosen = scored.find((item) => item.response.id === action.responseId);
    const success = chosen !== undefined && Math.abs(chosen.reward - best) < 1e-9;
    return baseEvaluation(round, success ? ROUND_MAX_POINTS : 0, success, success ? round.feedbackCorrect : round.feedbackIncorrect, scored.map((item) => `${item.response.id}: weighted score ${item.reward.toFixed(2)}`));
  }

  if (interaction.type === "levers" && action.type === "levers") {
    const projected = projectMetrics(interaction.baseline, interaction.levers, action.leverIds);
    const success = allMetricsSatisfied(interaction.metrics, projected);
    return baseEvaluation(
      round,
      success ? ROUND_MAX_POINTS : 0,
      success,
      success ? round.feedbackCorrect : round.feedbackIncorrect,
      interaction.metrics.map((metric) => {
        const value = projected[metric.id] ?? 0;
        const ok = metricSatisfied(metric, value);
        return `${metric.label}: ${formatNumber(value)}${metric.unit} (${ok ? "within limit" : "outside limit"} of ${metric.limit}${metric.unit})`;
      }),
    );
  }

  if (interaction.type === "agent" && action.type === "agent") {
    const missingTools = interaction.tools.filter((tool) => tool.needed && !action.toolIds.includes(tool.id));
    const harmfulTools = interaction.tools.filter((tool) => tool.harmful && action.toolIds.includes(tool.id));
    const missingControls = interaction.controls.filter((control) => control.needed && !action.controlIds.includes(control.id));
    const harmfulControls = interaction.controls.filter((control) => control.harmful && action.controlIds.includes(control.id));
    const success = missingTools.length + harmfulTools.length + missingControls.length + harmfulControls.length === 0;
    return baseEvaluation(round, success ? ROUND_MAX_POINTS : 0, success, success ? round.feedbackCorrect : round.feedbackIncorrect, [
      missingTools.length ? `Missing tools: ${missingTools.map((tool) => tool.label).join(", ")}.` : "Needed tools are present.",
      harmfulTools.length ? `Unsafe tools: ${harmfulTools.map((tool) => tool.label).join(", ")}.` : "No unsafe tools selected.",
      missingControls.length ? `Missing controls: ${missingControls.map((control) => control.label).join(", ")}.` : "Needed controls are present.",
      harmfulControls.length ? `Unsafe controls: ${harmfulControls.map((control) => control.label).join(", ")}.` : "No unsafe controls selected.",
    ]);
  }

  if (interaction.type === "retrieval" && action.type === "retrieval") {
    const ranked = rankChunks({
      method: action.method,
      queryVector: interaction.queryVector,
      queryKeywords: interaction.queryKeywords,
      chunks: interaction.chunks,
      topK: interaction.topK,
      filter: interaction.filter,
      useFilter: action.useFilter,
    });
    const quality = retrievalQuality(ranked, interaction.chunks);
    const success = quality.recall + 1e-9 >= interaction.minRecall && quality.precision + 1e-9 >= interaction.minPrecision;
    return baseEvaluation(round, success ? ROUND_MAX_POINTS : 0, success, success ? round.feedbackCorrect : round.feedbackIncorrect, [
      `Method ${action.method}${action.useFilter ? " with metadata filter" : ""}.`,
      `Precision ${percent(quality.precision)} (minimum ${percent(interaction.minPrecision)}).`,
      `Recall ${percent(quality.recall)} (minimum ${percent(interaction.minRecall)}).`,
      `Ranked: ${ranked.map((row) => row.chunk.title).join(", ") || "none"}.`,
    ]);
  }

  if (interaction.type === "composer" && action.type === "composer") {
    const selected = interaction.blocks.filter((block) => action.blockIds.includes(block.id));
    const cost = selected.reduce((sum, block) => sum + block.cost, 0);
    const latency = selected.reduce((sum, block) => sum + block.latency, 0);
    const covers = new Set(selected.flatMap((block) => block.covers));
    const missing = interaction.requiredCovers.filter((cover) => !covers.has(cover));
    const conflicts = selected.filter((block) => block.conflicts.some((conflict) => action.blockIds.includes(conflict)));
    const success = missing.length === 0 && conflicts.length === 0 && cost <= interaction.maxCost && latency <= interaction.maxLatency;
    return baseEvaluation(round, success ? ROUND_MAX_POINTS : 0, success, success ? round.feedbackCorrect : round.feedbackIncorrect, [
      `Relative cost ${cost} / ${interaction.maxCost}.`,
      `Relative latency ${latency} / ${interaction.maxLatency}.`,
      missing.length ? `Missing concerns: ${missing.join(", ")}.` : "Required concerns are covered.",
      conflicts.length ? "Two selected blocks conflict." : "No selected blocks conflict.",
    ]);
  }

  if (interaction.type === "foundry" && action.type === "foundry") {
    const coverage = foundryCoverage(interaction, action);
    const points = coverage.fraction >= 1 ? ROUND_MAX_POINTS : Math.round(coverage.fraction * ROUND_MAX_POINTS);
    const success = points === ROUND_MAX_POINTS;
    return baseEvaluation(
      round,
      points,
      success,
      success ? round.feedbackCorrect : round.feedbackIncorrect,
      coverage.breakdown,
    );
  }

  return empty;
}

export function representativeSuccessAction(round: RoundDefinition): GameAction | null {
  const interaction = round.interaction;
  if (interaction.type === "choice") {
    const best = interaction.options.find((option) => option.quality === "best");
    return best ? { type: "choice", optionId: best.id } : null;
  }
  if (interaction.type === "tokenizer") {
    const best = interaction.strategies.find((strategy) => strategy.quality === "best");
    return best ? { type: "tokenizer", strategyId: best.id } : null;
  }
  if (interaction.type === "attention") {
    const head = interaction.heads[interaction.answerHead];
    if (!head) return null;
    const result = attend(head.query, head.keys, interaction.scale);
    return { type: "attention", tokenIndex: result.winner };
  }
  if (interaction.type === "workflow") {
    const temperature = interaction.temperatures.find((item) => item.quality === "best");
    return {
      type: "workflow",
      stepIds: interaction.steps.filter((step) => step.required).map((step) => step.id),
      temperature: temperature?.value ?? 0,
    };
  }
  if (interaction.type === "rank") {
    let bestId = interaction.responses[0]?.id ?? "";
    let bestReward = -Infinity;
    for (const response of interaction.responses) {
      const reward = weightedReward(interaction.weights, response);
      if (reward > bestReward) {
        bestReward = reward;
        bestId = response.id;
      }
    }
    return { type: "rank", responseId: bestId };
  }
  if (interaction.type === "agent") {
    return {
      type: "agent",
      toolIds: interaction.tools.filter((tool) => tool.needed).map((tool) => tool.id),
      controlIds: interaction.controls.filter((control) => control.needed).map((control) => control.id),
    };
  }
  if (interaction.type === "levers") {
    return { type: "levers", leverIds: solveLevers(interaction) };
  }
  if (interaction.type === "composer") {
    return { type: "composer", blockIds: solveComposer(interaction) };
  }
  if (interaction.type === "budget") {
    return solveBudget(interaction);
  }
  if (interaction.type === "retrieval") {
    return solveRetrieval(interaction);
  }
  if (interaction.type === "curve") {
    return solveCurve(interaction);
  }
  if (interaction.type === "foundry") {
    return solveFoundry(interaction);
  }
  return null;
}

export function gameIsSolvable(game: GameDefinition): boolean {
  return game.rounds.every((round) => {
    const action = representativeSuccessAction(round);
    const result = evaluateRound(round, action);
    return result.success;
  });
}

function baseEvaluation(
  round: RoundDefinition,
  rawPoints: number,
  success: boolean,
  feedback: string,
  breakdown: string[],
): Evaluation {
  return {
    rawPoints,
    maxPoints: ROUND_MAX_POINTS,
    success,
    partial: rawPoints > 0 && !success,
    feedback,
    explanation: round.explanation,
    breakdown: breakdown.map((detail, index) => ({ label: `Check ${index + 1}`, detail })),
  };
}

function tokenCost(tokens: number, pricePerMillion: number, calls: number): number {
  return (tokens / 1_000_000) * pricePerMillion * calls;
}

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function weightedReward(
  weights: { helpfulness: number; safety: number; factuality: number },
  response: { helpfulness: number; safety: number; factuality: number },
): number {
  return (
    weights.helpfulness * response.helpfulness +
    weights.safety * response.safety +
    weights.factuality * response.factuality
  );
}

function foundryCoverage(
  interaction: Extract<RoundDefinition["interaction"], { type: "foundry" }>,
  action: Extract<GameAction, { type: "foundry" }>,
): { fraction: number; lines: ReadoutLine[]; breakdown: string[] } {
  const selected = interaction.decisions.map((decision) => {
    const optionId = action.choices[decision.id];
    return decision.options.find((option) => option.id === optionId) ?? null;
  });
  const covers = new Set(selected.flatMap((option) => option?.covers ?? []));
  const misses = new Set(selected.flatMap((option) => option?.misses ?? []));
  let earned = 0;
  let possible = 0;
  const breakdown: string[] = [];
  const lines: ReadoutLine[] = [];
  for (const item of interaction.rubric) {
    possible += item.points;
    if (item.id === "problem-statement") {
      const ok = action.problemStatement.trim().length >= interaction.minProblemChars;
      if (ok) earned += item.points;
      breakdown.push(`${item.label}: ${ok ? "addressed" : "not yet addressed"}.`);
      lines.push({ label: item.label, value: ok ? "Addressed" : "Missing", tone: ok ? "good" : "poor" });
      continue;
    }
    if (item.id === "reflection") {
      const ok = action.reflection.trim().length >= interaction.reflectionMinChars;
      if (ok) earned += item.points;
      breakdown.push(`${item.label}: ${ok ? "addressed" : "too short"}.`);
      lines.push({ label: item.label, value: ok ? "Addressed" : "Missing", tone: ok ? "good" : "poor" });
      continue;
    }
    if (item.id === "self-assessment") {
      const ok = interaction.rubric
        .filter((criterion) => criterion.id !== "self-assessment")
        .every((criterion) => typeof action.selfRatings[criterion.id] === "number");
      if (ok) earned += item.points;
      breakdown.push(`${item.label}: ${ok ? "completed" : "incomplete"}.`);
      lines.push({ label: item.label, value: ok ? "Completed" : "Incomplete", tone: ok ? "good" : "poor" });
      continue;
    }
    const met = covers.has(item.id) && !misses.has(item.id);
    if (met) earned += item.points;
    const self = action.selfRatings[item.id];
    const selfNote = typeof self === "number" ? ` Self-rating ${self}/4.` : "";
    breakdown.push(`${item.label}: ${met ? "covered by the selected design" : "not covered"}.${selfNote}`);
    lines.push({ label: item.label, value: met ? "Covered" : "Not covered", tone: met ? "good" : "poor" });
  }
  if (interaction.requiresProblemStatement && !interaction.rubric.some((item) => item.id === "problem-statement")) {
    possible += 1;
    const ok = action.problemStatement.trim().length >= interaction.minProblemChars;
    if (ok) earned += 1;
    breakdown.push(ok ? "Problem statement is specific enough." : "Problem statement is missing.");
  }
  return { fraction: possible === 0 ? 0 : earned / possible, lines, breakdown };
}

function solveLevers(interaction: Extract<RoundDefinition["interaction"], { type: "levers" }>): string[] {
  const ids = interaction.levers.map((lever) => lever.id);
  const total = 1 << ids.length;
  for (let mask = 0; mask < total; mask += 1) {
    const leverIds = ids.filter((_, index) => (mask & (1 << index)) !== 0);
    const projected = projectMetrics(interaction.baseline, interaction.levers, leverIds);
    if (allMetricsSatisfied(interaction.metrics, projected)) return leverIds;
  }
  return [];
}

function solveComposer(interaction: Extract<RoundDefinition["interaction"], { type: "composer" }>): string[] {
  const ids = interaction.blocks.map((block) => block.id);
  const total = 1 << ids.length;
  for (let mask = 0; mask < total; mask += 1) {
    const blockIds = ids.filter((_, index) => (mask & (1 << index)) !== 0);
    const result = evaluateRound(
      { interaction } as RoundDefinition,
      { type: "composer", blockIds },
    );
    if (result.success) return blockIds;
  }
  return [];
}

function solveBudget(interaction: Extract<RoundDefinition["interaction"], { type: "budget" }>): GameAction {
  for (const strategy of interaction.strategies) {
    if (strategy.mode === "fixed-summary") {
      const action: GameAction = { type: "budget", strategyId: strategy.id, spanIds: [] };
      if (evaluateRound({ interaction } as RoundDefinition, action).success) return action;
      continue;
    }
    const spans = interaction.spans;
    const total = 1 << spans.length;
    for (let mask = 0; mask < total; mask += 1) {
      const spanIds = spans.filter((_, index) => (mask & (1 << index)) !== 0).map((span) => span.id);
      const action: GameAction = { type: "budget", strategyId: strategy.id, spanIds };
      if (evaluateRound({ interaction } as RoundDefinition, action).success) return action;
    }
  }
  return { type: "budget", strategyId: interaction.strategies[0]?.id ?? "", spanIds: [] };
}

function solveRetrieval(interaction: Extract<RoundDefinition["interaction"], { type: "retrieval" }>): GameAction {
  const methods = ["keyword", "vector", "hybrid"] as const;
  for (const method of methods) {
    for (const useFilter of [false, true]) {
      const action: GameAction = { type: "retrieval", method, useFilter };
      if (evaluateRound({ interaction } as RoundDefinition, action).success) return action;
    }
  }
  return { type: "retrieval", method: "hybrid", useFilter: false };
}

function solveCurve(interaction: Extract<RoundDefinition["interaction"], { type: "curve" }>): GameAction {
  const learningRates = [0.0002, 0.0004, 0.0005, 0.0008, 0.0012];
  const epochs = [3, 4, 5, 6, 8];
  const batches = [16, 32];
  const methods = ["lora", "full"] as const;
  for (const method of methods) {
    for (const learningRate of learningRates) {
      for (const epochCount of epochs) {
        for (const batchSize of batches) {
          const action: GameAction = { type: "curve", learningRate, epochs: epochCount, batchSize, method };
          if (evaluateRound({ interaction } as RoundDefinition, action).success) return action;
        }
      }
    }
  }
  return { type: "curve", ...interaction.initial };
}

function solveFoundry(interaction: Extract<RoundDefinition["interaction"], { type: "foundry" }>): GameAction {
  const choiceLists = interaction.decisions.map((decision) => decision.options.map((option) => option.id));
  const combinations = cartesian(choiceLists);
  const selfRatings = Object.fromEntries(
    interaction.rubric.filter((item) => item.id !== "self-assessment").map((item) => [item.id, 3]),
  );
  for (const combo of combinations) {
    const choices: Record<string, string> = {};
    interaction.decisions.forEach((decision, index) => {
      const optionId = combo[index];
      if (optionId) choices[decision.id] = optionId;
    });
    const action: GameAction = {
      type: "foundry",
      choices,
      reflection: "x".repeat(interaction.reflectionMinChars + 5),
      problemStatement: "x".repeat(interaction.minProblemChars + 5),
      selfRatings,
    };
    if (evaluateRound({ interaction } as RoundDefinition, action).success) return action;
  }
  return {
    type: "foundry",
    choices: {},
    reflection: "",
    problemStatement: "",
    selfRatings: {},
  };
}

function cartesian(lists: string[][]): string[][] {
  return lists.reduce<string[][]>(
    (accumulator, list) => accumulator.flatMap((prefix) => list.map((item) => [...prefix, item])),
    [[]],
  );
}
