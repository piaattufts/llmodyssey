import { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";
import { attend } from "../../game-engine/models/attention.ts";
import { simulateLoss } from "../../game-engine/models/loss-curve.ts";
import { rankChunks } from "../../game-engine/models/retrieval.ts";
import { liveReadout, type GameAction } from "../../game-engine/evaluate.ts";
import type { RoundDefinition } from "../../game-engine/schema.ts";
import { MetricList } from "./MetricList.tsx";
import { SelectCard } from "./SelectCard.tsx";

export function InteractionHost({
  round,
  action,
  disabled,
  onChange,
}: {
  round: RoundDefinition;
  action: GameAction | null;
  disabled: boolean;
  onChange: (action: GameAction) => void;
}) {
  const readout = liveReadout(round, action);
  const interaction = round.interaction;
  return (
    <div className="space-y-4">
      <InteractionBody round={round} action={action} disabled={disabled} onChange={onChange} />
      <div className="rounded-xl border border-border bg-background/30 p-4" aria-live="polite">
        <p className="text-sm text-muted-foreground">{readout.detail}</p>
        <div className="mt-3">
          <MetricList lines={readout.lines} />
        </div>
        {interaction.type === "attention" && action?.type === "attention" ? <AttentionHeat round={round} selected={action.tokenIndex} /> : null}
        {interaction.type === "curve" && action?.type === "curve" ? <CurveChart round={round} action={action} /> : null}
        {interaction.type === "retrieval" && action?.type === "retrieval" ? <RetrievalList round={round} action={action} /> : null}
        {interaction.type === "tokenizer" && action?.type === "tokenizer" ? <TokenChips round={round} strategyId={action.strategyId} /> : null}
      </div>
      <p className="text-xs text-muted-foreground">
        Preview only. Locking the round runs the scorer. {disabled ? "This round is locked." : "You can still change the selection."}
      </p>
    </div>
  );
}

function InteractionBody({
  round,
  action,
  disabled,
  onChange,
}: {
  round: RoundDefinition;
  action: GameAction | null;
  disabled: boolean;
  onChange: (action: GameAction) => void;
}) {
  const interaction = round.interaction;
  if (interaction.type === "choice") {
    return (
      <div className="space-y-3">
        <p>{interaction.prompt}</p>
        {interaction.options.map((option) => (
          <SelectCard
            key={option.id}
            testId={`option-${option.id}`}
            title={option.label}
            description={option.description}
            selected={action?.type === "choice" && action.optionId === option.id}
            disabled={disabled}
            onClick={() => onChange({ type: "choice", optionId: option.id })}
          />
        ))}
      </div>
    );
  }
  if (interaction.type === "tokenizer") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{interaction.objective}</p>
        <blockquote className="rounded-xl border border-border bg-card p-4 text-base">{interaction.text}</blockquote>
        {interaction.strategies.map((strategy) => (
          <SelectCard
            key={strategy.id}
            testId={`strategy-${strategy.id}`}
            title={strategy.name}
            description={strategy.summary}
            selected={action?.type === "tokenizer" && action.strategyId === strategy.id}
            disabled={disabled}
            onClick={() => onChange({ type: "tokenizer", strategyId: strategy.id })}
          />
        ))}
      </div>
    );
  }
  if (interaction.type === "attention") {
    return (
      <div className="space-y-3">
        <p>{interaction.prompt}</p>
        <div className="flex flex-wrap gap-2">
          {interaction.tokens.map((token, index) => (
            <button
              key={`${token}-${index}`}
              type="button"
              disabled={disabled}
              data-testid={`token-${index}`}
              aria-pressed={action?.type === "attention" && action.tokenIndex === index}
              onClick={() => onChange({ type: "attention", tokenIndex: index })}
              className="min-h-11 rounded-full border border-border px-4 py-2 aria-pressed:border-primary aria-pressed:bg-primary/15"
            >
              {token}
              {action?.type === "attention" && action.tokenIndex === index ? " · selected" : ""}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (interaction.type === "budget" && (action === null || action.type === "budget")) {
    const current = action?.type === "budget" ? action : { type: "budget" as const, strategyId: interaction.strategies[0]?.id ?? "", spanIds: [] };
    return (
      <div className="space-y-3">
        <p>{interaction.prompt}</p>
        {interaction.strategies.map((strategy) => (
          <SelectCard
            key={strategy.id}
            title={strategy.label}
            description={strategy.description}
            selected={current.strategyId === strategy.id}
            disabled={disabled}
            onClick={() => onChange({ ...current, strategyId: strategy.id })}
          />
        ))}
        {interaction.strategies.find((strategy) => strategy.id === current.strategyId)?.mode === "select-spans" ? (
          <div className="space-y-2">
            {interaction.spans.map((span) => {
              const selected = current.spanIds.includes(span.id);
              return (
                <SelectCard
                  key={span.id}
                  title={`${span.mustKeep ? "Must keep · " : ""}${span.text}`}
                  description={`${span.tokens} tokens · relevance ${span.relevance}`}
                  selected={selected}
                  disabled={disabled}
                  onClick={() => {
                    const spanIds = selected ? current.spanIds.filter((id) => id !== span.id) : [...current.spanIds, span.id];
                    onChange({ ...current, spanIds });
                  }}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
  if (interaction.type === "curve" && action?.type === "curve") {
    return (
      <div className="space-y-4">
        <p>{interaction.prompt}</p>
        <label className="block text-sm">
          Learning rate {action.learningRate}
          <input className="mt-1 w-full" type="range" min={interaction.lrMin} max={interaction.lrMax} step={0.0001} value={action.learningRate} disabled={disabled} onChange={(event) => onChange({ ...action, learningRate: Number(event.target.value) })} />
        </label>
        <label className="block text-sm">
          Epochs {action.epochs}
          <input className="mt-1 w-full" type="range" min={interaction.epochMin} max={interaction.epochMax} step={1} value={action.epochs} disabled={disabled} onChange={(event) => onChange({ ...action, epochs: Number(event.target.value) })} />
        </label>
        <label className="block text-sm">
          Batch size {action.batchSize}
          <input className="mt-1 w-full" type="range" min={8} max={64} step={8} value={action.batchSize} disabled={disabled} onChange={(event) => onChange({ ...action, batchSize: Number(event.target.value) })} />
        </label>
        <div className="flex flex-wrap gap-2">
          {(["lora", "full"] as const).map((method) => (
            <button key={method} type="button" disabled={disabled} aria-pressed={action.method === method} className="min-h-11 rounded-full border border-border px-4 aria-pressed:bg-primary/15" onClick={() => onChange({ ...action, method })}>
              {method === "lora" ? "LoRA" : "Full fine-tuning"}
              {action.method === method ? " · selected" : ""}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (interaction.type === "workflow" && (action === null || action.type === "workflow")) {
    const current = action?.type === "workflow" ? action : { type: "workflow" as const, stepIds: [], temperature: interaction.temperatures[0]?.value ?? 0 };
    return (
      <div className="space-y-3">
        <p>{interaction.prompt}</p>
        {interaction.steps.map((step) => {
          const selected = current.stepIds.includes(step.id);
          return (
            <SelectCard
              key={step.id}
              title={step.label}
              description={step.description}
              selected={selected}
              disabled={disabled}
              onClick={() => {
                const stepIds = selected ? current.stepIds.filter((id) => id !== step.id) : [...current.stepIds, step.id];
                onChange({ ...current, stepIds });
              }}
            />
          );
        })}
        <div className="flex flex-wrap gap-2">
          {interaction.temperatures.map((temperature) => (
            <button key={temperature.value} type="button" disabled={disabled} aria-pressed={current.temperature === temperature.value} className="min-h-11 rounded-full border border-border px-4 aria-pressed:bg-primary/15" onClick={() => onChange({ ...current, temperature: temperature.value })}>
              Temperature {temperature.label}
              {current.temperature === temperature.value ? " · selected" : ""}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (interaction.type === "rank") {
    return (
      <div className="space-y-3">
        <p>{interaction.prompt}</p>
        <p className="rounded-xl border border-border p-3 text-sm">Request: {interaction.userRequest}</p>
        <p className="text-sm text-muted-foreground">
          Weights — helpfulness {interaction.weights.helpfulness}, safety {interaction.weights.safety}, factuality {interaction.weights.factuality}.
        </p>
        {interaction.responses.map((response) => (
          <SelectCard
            key={response.id}
            title={`Reply ${response.id}`}
            description={response.text}
            selected={action?.type === "rank" && action.responseId === response.id}
            disabled={disabled}
            onClick={() => onChange({ type: "rank", responseId: response.id })}
          />
        ))}
      </div>
    );
  }
  if (interaction.type === "levers" && (action === null || action.type === "levers")) {
    const current = action?.type === "levers" ? action : { type: "levers" as const, leverIds: [] };
    return (
      <div className="space-y-3">
        <p>{interaction.prompt}</p>
        {interaction.levers.map((lever) => {
          const selected = current.leverIds.includes(lever.id);
          return (
            <SelectCard
              key={lever.id}
              title={lever.label}
              description={lever.description}
              selected={selected}
              disabled={disabled}
              onClick={() => {
                const leverIds = selected ? current.leverIds.filter((id) => id !== lever.id) : [...current.leverIds, lever.id];
                onChange({ type: "levers", leverIds });
              }}
            />
          );
        })}
      </div>
    );
  }
  if (interaction.type === "agent" && (action === null || action.type === "agent")) {
    const current = action?.type === "agent" ? action : { type: "agent" as const, toolIds: [], controlIds: [] };
    return (
      <div className="space-y-3">
        <p>{interaction.prompt}</p>
        <p className="text-sm text-muted-foreground">{interaction.goal}</p>
        <h3 className="font-medium">Tools</h3>
        {interaction.tools.map((tool) => {
          const selected = current.toolIds.includes(tool.id);
          return (
            <SelectCard key={tool.id} title={tool.label} description={tool.description} selected={selected} disabled={disabled} onClick={() => onChange({ ...current, toolIds: selected ? current.toolIds.filter((id) => id !== tool.id) : [...current.toolIds, tool.id] })} />
          );
        })}
        <h3 className="font-medium">Controls</h3>
        {interaction.controls.map((control) => {
          const selected = current.controlIds.includes(control.id);
          return (
            <SelectCard key={control.id} title={control.label} description={control.description} selected={selected} disabled={disabled} onClick={() => onChange({ ...current, controlIds: selected ? current.controlIds.filter((id) => id !== control.id) : [...current.controlIds, control.id] })} />
          );
        })}
      </div>
    );
  }
  if (interaction.type === "retrieval" && action?.type === "retrieval") {
    return (
      <div className="space-y-3">
        <p>{interaction.prompt}</p>
        <p className="text-sm">Query: {interaction.query}</p>
        <div className="flex flex-wrap gap-2">
          {(["keyword", "vector", "hybrid"] as const).map((method) => (
            <button key={method} type="button" disabled={disabled} aria-pressed={action.method === method} className="min-h-11 rounded-full border border-border px-4 capitalize aria-pressed:bg-primary/15" onClick={() => onChange({ ...action, method })}>
              {method}
              {action.method === method ? " · selected" : ""}
            </button>
          ))}
        </div>
        {interaction.filter ? (
          <SelectCard title={interaction.filter.label} description="Apply this metadata filter before ranking." selected={action.useFilter} disabled={disabled} onClick={() => onChange({ ...action, useFilter: !action.useFilter })} />
        ) : null}
      </div>
    );
  }
  if (interaction.type === "composer" && (action === null || action.type === "composer")) {
    const current = action?.type === "composer" ? action : { type: "composer" as const, blockIds: [] };
    return (
      <div className="space-y-3">
        <p>{interaction.prompt}</p>
        {interaction.blocks.map((block) => {
          const selected = current.blockIds.includes(block.id);
          return (
            <SelectCard
              key={block.id}
              title={block.label}
              description={`${block.description} Covers ${block.covers.join(", ") || "nothing by itself"}. Cost ${block.cost}, latency ${block.latency}.`}
              selected={selected}
              disabled={disabled}
              onClick={() => onChange({ type: "composer", blockIds: selected ? current.blockIds.filter((id) => id !== block.id) : [...current.blockIds, block.id] })}
            />
          );
        })}
      </div>
    );
  }
  if (interaction.type === "foundry" && (action === null || action.type === "foundry")) {
    const current = action?.type === "foundry" ? action : { type: "foundry" as const, choices: {}, reflection: "", problemStatement: "", selfRatings: {} };
    return (
      <div className="space-y-4">
        <p>{interaction.prompt}</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground">
          {interaction.constraints.map((constraint) => (
            <li key={constraint}>{constraint}</li>
          ))}
        </ul>
        {interaction.requiresProblemStatement ? (
          <label className="block text-sm">
            Problem statement
            <textarea className="mt-1 min-h-28 w-full rounded-lg border border-border bg-background p-3" disabled={disabled} value={current.problemStatement} onChange={(event) => onChange({ ...current, problemStatement: event.target.value })} />
          </label>
        ) : null}
        {interaction.decisions.map((decision) => (
          <fieldset key={decision.id} className="space-y-2">
            <legend className="text-sm font-medium">{decision.prompt}</legend>
            {decision.options.map((option) => (
              <SelectCard key={option.id} title={option.label} description={option.detail} selected={current.choices[decision.id] === option.id} disabled={disabled} onClick={() => onChange({ ...current, choices: { ...current.choices, [decision.id]: option.id } })} />
            ))}
          </fieldset>
        ))}
        <label className="block text-sm">
          Reflection
          <textarea className="mt-1 min-h-28 w-full rounded-lg border border-border bg-background p-3" disabled={disabled} value={current.reflection} onChange={(event) => onChange({ ...current, reflection: event.target.value })} />
        </label>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Self-assessment</h3>
          {interaction.rubric.filter((item) => item.id !== "self-assessment").map((item) => (
            <div key={item.id} className="flex flex-wrap items-center gap-2">
              <span className="min-w-48 text-sm">{item.label}</span>
              {[1, 2, 3, 4].map((rating) => (
                <button key={rating} type="button" disabled={disabled} aria-pressed={current.selfRatings[item.id] === rating} className="min-h-11 min-w-11 rounded-lg border border-border aria-pressed:bg-primary/15" onClick={() => onChange({ ...current, selfRatings: { ...current.selfRatings, [item.id]: rating } })}>
                  {rating}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <p>This round has no interaction yet.</p>;
}

function TokenChips({ round, strategyId }: { round: RoundDefinition; strategyId: string }) {
  if (round.interaction.type !== "tokenizer") return null;
  const strategy = round.interaction.strategies.find((item) => item.id === strategyId);
  if (!strategy) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Token pieces">
      {strategy.tokens.map((token, index) => (
        <li key={`${token}-${index}`} className="rounded-md border border-border px-2 py-1 font-mono text-sm">
          {token}
        </li>
      ))}
    </ul>
  );
}

function AttentionHeat({ round, selected }: { round: RoundDefinition; selected: number }) {
  const interaction = round.interaction;
  if (interaction.type !== "attention") return null;
  return (
    <div className="mt-4 space-y-3">
      {interaction.heads.map((head, headIndex) => {
        const result = attend(head.query, head.keys, interaction.scale);
        return (
          <div key={head.name}>
            <p className="text-sm font-medium">{head.name}{headIndex === interaction.answerHead ? " · scored head" : ""}</p>
            <div className="mt-2 space-y-1">
              {interaction.tokens.map((token, index) => (
                <div key={`${head.name}-${token}`} className="grid grid-cols-[8rem_1fr_4rem] items-center gap-2 text-sm">
                  <span>{token}{selected === index && headIndex === interaction.answerHead ? " (your pick)" : ""}</span>
                  <span className="h-3 rounded bg-secondary" aria-hidden="true">
                    <span className="block h-3 rounded bg-primary" style={{ width: `${(result.weights[index] ?? 0) * 100}%` }} />
                  </span>
                  <span>{((result.weights[index] ?? 0) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CurveChart({ round, action }: { round: RoundDefinition; action: Extract<GameAction, { type: "curve" }> }) {
  const interaction = round.interaction;
  const data = useMemo(() => {
    if (interaction.type !== "curve") return [];
    const series = simulateLoss(interaction.scenario, action);
    return series.train.map((train, index) => ({ epoch: index + 1, train, validation: series.val[index] ?? train }));
  }, [action, interaction]);
  if (interaction.type !== "curve") return null;
  return (
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis />
          <ChartTooltip />
          <Legend />
          <Line type="monotone" dataKey="train" name="Training loss" stroke="#d6b4ff" dot={false} />
          <Line type="monotone" dataKey="validation" name="Validation loss" stroke="#7ef0e4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function RetrievalList({ round, action }: { round: RoundDefinition; action: Extract<GameAction, { type: "retrieval" }> }) {
  const interaction = round.interaction;
  if (interaction.type !== "retrieval") return null;
  const ranked = rankChunks({
    method: action.method,
    queryVector: interaction.queryVector,
    queryKeywords: interaction.queryKeywords,
    chunks: interaction.chunks,
    topK: interaction.chunks.length,
    filter: interaction.filter,
    useFilter: action.useFilter,
  });
  return (
    <ol className="mt-3 space-y-2 text-sm">
      {ranked.map((row, index) => (
        <li key={row.chunk.id} className="rounded-lg border border-border px-3 py-2">
          {index < interaction.topK ? "In top-k. " : "Below top-k. "}
          {row.chunk.title} · score {row.score.toFixed(2)} · {row.chunk.relevant ? "relevant to this question" : "not relevant"}
          <span className="mt-1 block text-muted-foreground">{row.chunk.text}</span>
        </li>
      ))}
    </ol>
  );
}
