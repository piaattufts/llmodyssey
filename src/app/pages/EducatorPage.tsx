import { useState } from "react";
import { assessmentItems } from "@content/assessments/index.ts";
import { games } from "../../content/load-games.ts";
import { odysseyConfig } from "../../game-engine/config.ts";
import { courseGames, thresholdFor } from "../../game-engine/prerequisites.ts";
import { useLearner } from "../../hooks/use-learner.tsx";
import { researchModeEnabled } from "../../research/mode.ts";
import { createRepository } from "../../storage/repository.ts";
import { assessmentCsv, downloadText, eventsCsv, eventsJson, progressCsv } from "../../storage/export.ts";
import { sampleLearnerState } from "../demo-seed.ts";
import { tierCopy } from "../copy.ts";

export function EducatorPage() {
  const learner = useLearner();
  const [notice, setNotice] = useState<string | null>(null);
  if (learner.loading || !learner.state) return <p>Loading the local record…</p>;
  const state = learner.state;
  const visible = courseGames(games);

  async function resetDemo() {
    const repository = createRepository("demo");
    const current = await repository.load();
    await repository.save(sampleLearnerState(current.sessionId));
    setNotice("The demo record was restored to the sample. Open Demo mode to see it. The learner record on this page was not changed.");
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Educator mode</h1>
        <p>No account is required. This page reads the game definitions. It does not show a private research database.</p>
        <p className="text-sm text-muted-foreground">
          Research mode is {researchModeEnabled() ? "on" : "off"}. Branding, unlock counts, and the default mastery threshold are build-time settings in config/odyssey.config.ts.
        </p>
      </header>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Classroom patterns</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Lecture companion: teach the mechanism, then open the matching game for one or two rounds.</li>
          <li>Lab: assign a game and ask students to export the progress CSV before they leave.</li>
          <li>Independent module: assign a tier and the pre/post assessment.</li>
          <li>Capstone: use one Foundry path and grade the reflection against the rubric printed in the round.</li>
        </ul>
        <p>A six-week map is in the README. Week 1 is Token Forge and Attention Architect. Week 6 is Foundry Arena.</p>
      </section>
      <section className="overflow-x-auto">
        <h2 className="mb-3 text-xl font-semibold">Curriculum</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2">Game</th>
              <th className="p-2">Tier</th>
              <th className="p-2">Minutes</th>
              <th className="p-2">Bloom</th>
              <th className="p-2">Mastery</th>
              <th className="p-2">Prerequisites listed</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((game) => (
              <tr key={game.id} className="border-t border-border align-top">
                <td className="p-2">{game.title}</td>
                <td className="p-2">{tierCopy[game.tier].name}</td>
                <td className="p-2">{game.estimatedMinutes}</td>
                <td className="p-2">{game.bloomLevels.join(", ")}</td>
                <td className="p-2">{thresholdFor(game)}%</td>
                <td className="p-2">{game.prerequisites.length ? game.prerequisites.join(", ") : "None listed"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Objectives and misconceptions</h2>
        {visible.map((game) => (
          <article key={game.id} className="rounded-xl border border-border p-4">
            <h3 className="text-lg font-medium">{game.title}</h3>
            <p className="text-sm text-muted-foreground">{game.implementation.label}</p>
            <ul className="mt-2 list-disc pl-5">{game.learningObjectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
            <p className="mt-2 text-sm"><strong>Misconception. </strong>{game.misconception}</p>
            <p className="text-sm"><strong>Concepts. </strong>{game.concepts.join(", ")}</p>
          </article>
        ))}
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Assessments</h2>
        <p>{assessmentItems.length} items, scored as the percent correct. Explanations are shown after submission. Items are in content/assessments/index.ts.</p>
        <ul className="list-disc pl-5 text-sm">
          {assessmentItems.map((item) => (
            <li key={item.id}>{item.domain}: {item.prompt}</li>
          ))}
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Exports for this browser</h2>
        <p className="text-sm">These files contain only the record loaded in the current mode. In demo mode that is the demo record. On the course site it is the learner record.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-progress.csv", progressCsv(state), "text/csv")}>Progress CSV</button>
          <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-assessments.csv", assessmentCsv(state), "text/csv")}>Assessment CSV</button>
          <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-events.json", eventsJson(state), "application/json")}>Events JSON</button>
          <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-events.csv", eventsCsv(state), "text/csv")}>Events CSV</button>
          <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => void resetDemo()}>Reset Classroom Demo</button>
        </div>
        {notice ? <p role="status">{notice}</p> : null}
        <p className="text-sm text-muted-foreground">Institution: {odysseyConfig.institution || "Not set"}. Enabled games: {odysseyConfig.enabledGames.join(", ")}.</p>
      </section>
    </div>
  );
}
