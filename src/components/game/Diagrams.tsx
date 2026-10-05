import type { ReactNode } from "react";

/** Labeled teaching diagrams. Text carries the meaning; color is not the only cue. */

export function EducationalDiagram({ gameId }: { gameId: string }) {
  if (gameId === "token-forge") return <TokenChips />;
  if (gameId === "attention-architect") return <AttentionSketch />;
  if (gameId === "context-compression") return <BudgetMeter />;
  if (gameId === "promptsmith") return <PromptAnatomy />;
  if (gameId === "gradient-playground") return <CurveSketch />;
  if (gameId === "reasoning-reactor") return <DecodeTree />;
  if (gameId === "alignment-arena") return <AlignmentPipe />;
  if (gameId === "ship-it-simulator") return <ServingSketch />;
  if (gameId === "agent-architect") return <AgentLoop />;
  if (gameId === "retrieval-lab") return <RetrievalPipe />;
  if (gameId === "system-composer") return <ArchitectureGraph />;
  if (gameId === "prodops-gauntlet") return <IncidentTimeline />;
  if (gameId === "foundry-arena") return <DesignCanvas />;
  return null;
}

function Frame({ title, children, note }: { title: string; children: ReactNode; note: string }) {
  return (
    <figure className="space-y-2 rounded-xl border border-border p-4">
      <figcaption className="font-medium">{title}</figcaption>
      {children}
      <p className="text-sm text-muted-foreground">{note}</p>
    </figure>
  );
}

function TokenChips() {
  const rows = [
    ["The", "quick", "brown", "fox"],
    ["The", "qu", "ick", "brown", "fox"],
  ];
  return (
    <Frame title="Token chips" note="Two authored segmentations of the same words. The piece count is the token count in this exercise.">
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.join("-")} className="flex flex-wrap gap-2">
            {row.map((piece, index) => (
              <span key={`${piece}-${index}`} className="rounded-md border border-border px-2 py-1 text-sm">
                {piece}
                <span className="sr-only"> token</span>
              </span>
            ))}
            <span className="self-center text-sm">{row.length} pieces</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function AttentionSketch() {
  return (
    <Frame title="Query, key, value, and a weight row" note="An educational sketch. The weights are not a trace of a model's reasoning.">
      <p className="text-sm">Query from the current position · keys and values at other positions · weights after a scaled dot product and softmax · weighted sum of values.</p>
      <table className="text-sm">
        <caption className="sr-only">Illustrative attention weights for three positions</caption>
        <thead>
          <tr>
            <th className="p-1 text-left">From</th>
            <th className="p-1">to A</th>
            <th className="p-1">to B</th>
            <th className="p-1">to C</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="p-1 text-left">Position B</th>
            <td className="p-1 text-center">0.2</td>
            <td className="p-1 text-center">0.5</td>
            <td className="p-1 text-center">0.3</td>
          </tr>
        </tbody>
      </table>
    </Frame>
  );
}

function BudgetMeter() {
  return (
    <Frame title="Token budget" note="The goal is to keep task-relevant information, not merely to shorten the text.">
      <p className="text-sm">Budget 100 tokens. Original passage marked 140, over budget. Compressed passage marked 80, inside budget, with a kept-fact label.</p>
      <div className="h-3 w-full rounded border border-border" role="img" aria-label="A meter filled past the budget line for the original, and inside the budget for the compressed passage.">
        <div className="h-full w-4/5 border-r-2 border-foreground bg-muted" />
      </div>
    </Frame>
  );
}

function PromptAnatomy() {
  const parts = ["Instruction", "Context", "Examples", "Output constraint"];
  return (
    <Frame title="Prompt anatomy" note="A prompt is a specification for a probabilistic model, not a magic phrase.">
      <ol className="list-decimal space-y-1 pl-5 text-sm">
        {parts.map((part) => (
          <li key={part}>{part}</li>
        ))}
      </ol>
    </Frame>
  );
}

function CurveSketch() {
  return (
    <Frame title="Training and validation sketch" note="These curves are educational simulations. They are not the result of a training run.">
      <table className="text-sm">
        <caption className="sr-only">Illustrative loss values</caption>
        <thead>
          <tr>
            <th className="p-1 text-left">Epoch</th>
            <th className="p-1">Training loss</th>
            <th className="p-1">Validation loss</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1">1</td>
            <td className="p-1 text-center">1.2</td>
            <td className="p-1 text-center">1.3</td>
          </tr>
          <tr>
            <td className="p-1">4</td>
            <td className="p-1 text-center">0.4</td>
            <td className="p-1 text-center">0.9</td>
          </tr>
        </tbody>
      </table>
      <p className="text-sm">The gap at epoch 4 is the pattern the game calls overfitting in the simulation.</p>
    </Frame>
  );
}

function DecodeTree() {
  return (
    <Frame title="Decoding choices" note="Temperature, top-k, top-p, and beam search are sampling or search settings. None of them is a guarantee of correct reasoning.">
      <p className="text-sm">Prompt → several candidate next steps → a check against the task → a selected continuation. Self-consistency would compare several paths. This page uses a precomputed table.</p>
    </Frame>
  );
}

function AlignmentPipe() {
  return (
    <Frame title="Preference to optimization" note="Alignment is not one agreed scalar. The page computes a weighted sum of authored ratings.">
      <p className="text-sm">Responses compared → preference or ranking → a reward or preference model → an optimization step such as RLHF or a direct preference method. Constitutional feedback is another source of critique, not a replacement for the disagreement.</p>
    </Frame>
  );
}

function ServingSketch() {
  return (
    <Frame title="Serving path" note="Latency and cost on this page are authored effects added to a baseline.">
      <p className="text-sm">User → gateway → route (small or expensive model) → optional cache → fallback. Indicators: latency, errors, concurrency, token cost.</p>
    </Frame>
  );
}

function AgentLoop() {
  return (
    <Frame title="Agent loop" note="Selecting a control does not run an agent or call a tool.">
      <ol className="list-decimal pl-5 text-sm">
        <li>Goal</li>
        <li>Observation</li>
        <li>Model proposes an action</li>
        <li>Permission and check</li>
        <li>Stop or escalate</li>
      </ol>
    </Frame>
  );
}

function RetrievalPipe() {
  return (
    <Frame title="Retrieval pipeline" note="Toy vectors and keyword overlap are computed in the browser. No answer is generated.">
      <p className="text-sm">Question → query representation → candidate retrieval → filter → rank (top-k) → context assembly. Generation is a later, separate check.</p>
    </Frame>
  );
}

function ArchitectureGraph() {
  return (
    <Frame title="Architecture graph" note="Each box should name the requirement it covers. Cost and latency are relative teaching units.">
      <p className="text-sm">Request → router → model, retrieval, tools, guardrail, cache, log, fallback, escalation. A box with no requirement is a candidate to remove.</p>
    </Frame>
  );
}

function IncidentTimeline() {
  return (
    <Frame title="Incident timeline" note="Times and metrics are written on the card. Nothing is read from a live system.">
      <ol className="list-decimal pl-5 text-sm">
        <li>Detect the signal</li>
        <li>Diagnose the layer that changed</li>
        <li>Mitigate</li>
        <li>Verify</li>
        <li>Document</li>
        <li>Prevent recurrence</li>
      </ol>
    </Frame>
  );
}

function DesignCanvas() {
  return (
    <Frame title="Design canvas" note="The rubric is visible before you submit. More than one design can cover it.">
      <ul className="list-disc pl-5 text-sm">
        <li>Scenario and stakeholders</li>
        <li>Requirements and constraints</li>
        <li>Components you include and refuse</li>
        <li>Risk, evaluation plan, and reflection</li>
      </ul>
    </Frame>
  );
}
