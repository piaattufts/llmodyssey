import { useState } from "react";
import { Link } from "react-router";
import { assessmentItems } from "@content/assessments/index.ts";
import { games } from "../../content/load-games.ts";
import { odysseyConfig } from "../../game-engine/config.ts";
import { courseGames, thresholdFor } from "../../game-engine/prerequisites.ts";
import { releaseStatusLabel } from "../../game-engine/schema.ts";
import { useLearner } from "../../hooks/use-learner.tsx";
import { researchModeEnabled } from "../../research/mode.ts";
import { citation, repository } from "../../site.ts";
import { createRepository } from "../../storage/repository.ts";
import { assessmentCsv, downloadText, eventsCsv, eventsJson, progressCsv } from "../../storage/export.ts";
import { sampleLearnerState } from "../demo-seed.ts";
import { tierCopy } from "../copy.ts";

export function EducatorPage({ basePath = "" }: { basePath?: string }) {
  const learner = useLearner();
  const [notice, setNotice] = useState<string | null>(null);
  if (learner.loading || !learner.state) return <p>Loading the local record…</p>;
  const state = learner.state;
  const visible = courseGames(games);
  const threshold = odysseyConfig.masteryThreshold;

  async function resetDemo() {
    const repository = createRepository("demo");
    const current = await repository.load();
    await repository.save(sampleLearnerState(current.sessionId));
    setNotice("The demo record was restored to the sample. Open Demo mode to see it. The learner record on this page was not changed.");
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">For instructors</p>
        <h1 className="text-3xl font-semibold">LLM Odyssey Educator Guide</h1>
        <p className="max-w-3xl text-lg">
          LLM Odyssey is a browser course for LLM engineering. Students make a decision, see the result, and can retry. No account and no paid model API are required for the hosted site or a local run.
        </p>
        <p>
          In v0.1.0, Token Forge is the reference implementation. The other twelve games are playable prototypes. Prototype scores are calculated from the student’s answers. They are not finished reference designs.
        </p>
        <p className="text-sm">
          <a className="underline" href={repository.url}>GitHub repository</a>
          {" · "}
          <a className="underline" href={`${repository.url}/blob/main/README.md`}>README</a>
          {" · "}
          <a className="underline" href={`${repository.url}/blob/main/CITATION.cff`}>CITATION.cff</a>
          {" · "}
          <a className="underline" href={`${repository.url}/releases/tag/v0.1.0`}>Release v0.1.0</a>
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What the platform is for</h2>
        <p>
          Use it when a lecture has named a mechanism and you want students to practice the decision: which segmentation is cheaper, which passage must stay inside a context budget, which tool an agent should be allowed to call. The platform is designed to support that practice. It is not, by itself, evidence that the practice improves learning. A formal estimate of learning outcomes is still an empirical question for a particular course.
        </p>
        <p>
          Research collection is {researchModeEnabled() ? "on in this build" : "off in this build"}. Visitors of the public site are not enrolled in a study. An institution that later turns research mode on obtains its own ethics approval where one is required. An approval from another campus does not transfer.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Three tiers</h2>
        <ul className="space-y-2">
          {([1, 2, 3] as const).map((tier) => (
            <li key={tier}>
              <strong>Tier {tier} · {tierCopy[tier].name}. </strong>
              {tierCopy[tier].goal} Bloom emphasis: {tierCopy[tier].bloom}.
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Early games ask students to inspect a mechanism. Later games ask them to judge a system. Foundry Arena asks for a design under a brief. There is not one hidden correct architecture.
        </p>
      </section>

      <section className="overflow-x-auto">
        <h2 className="mb-3 text-xl font-semibold">Games, status, and time</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Game</th>
              <th className="p-2">Tier</th>
              <th className="p-2">Students learn</th>
              <th className="p-2">Status</th>
              <th className="p-2">Minutes</th>
              <th className="p-2">Bloom</th>
              <th className="p-2">Mastery</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((game) => (
              <tr key={game.id} className="border-t border-border align-top">
                <td className="p-2">{game.order}</td>
                <td className="p-2">
                  <Link className="underline" to={`${basePath}/play/${game.id}`}>{game.title}</Link>
                </td>
                <td className="p-2">{tierCopy[game.tier].name}</td>
                <td className="p-2">{game.summary}</td>
                <td className="p-2">
                  {releaseStatusLabel(game.status)}
                  {game.status === "implemented" ? " · Reference" : ""}
                </td>
                <td className="p-2">{game.estimatedMinutes}</td>
                <td className="p-2">{game.bloomLevels.join(", ")}</td>
                <td className="p-2">{thresholdFor(game)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Learning objectives</h2>
        {visible.map((game) => (
          <article key={game.id} className="rounded-xl border border-border p-4">
            <h3 className="text-lg font-medium">
              {game.order}. {game.title}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {releaseStatusLabel(game.status)}
                {game.status === "implemented" ? " · Reference" : ""}
              </span>
            </h3>
            <p className="mt-1 text-sm">{game.purpose}</p>
            <ul className="mt-2 list-disc pl-5">
              {game.learningObjectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm"><strong>Concepts. </strong>{game.concepts.join(", ")}</p>
            <p className="text-sm"><strong>Misconception in view. </strong>{game.misconception}</p>
            <p className="text-sm"><strong>What the screen is doing. </strong>{game.implementation.whatIsReal} {game.implementation.whatIsSimulated}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Orientation preview</h2>
        <p>
          Every game now begins with a pre-game orientation before round 1. The notes below are the same learner-facing content: objectives, instructions, evaluation, mastery, simulation disclosure, duration, and status. Open the game if you want the page students see.
        </p>
        {visible.map((game) => (
          <details key={game.id} className="rounded-xl border border-border p-4" data-testid={`educator-orientation-${game.id}`}>
            <summary className="cursor-pointer font-medium">
              {game.order}. {game.title} · {releaseStatusLabel(game.status)}
              {game.status === "implemented" ? " · Reference Implementation" : ""}
              {game.status === "prototype" ? " · Playable Prototype" : ""} · {game.orientation.estimatedTime} · mastery {thresholdFor(game)}%
            </summary>
            <div className="mt-3 space-y-2 text-sm">
              <p>{game.orientation.tagline}</p>
              <p>
                <strong>Learning objectives. </strong>
              </p>
              <ul className="list-disc pl-5">
                {game.orientation.learningObjectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
              <p>
                <strong>Learner instructions. </strong>
                {game.orientation.whatYouWillDo}
              </p>
              <ol className="list-decimal pl-5">
                {game.orientation.howToPlay.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p>
                <strong>Evaluation method. </strong>
                {game.orientation.evaluation.whatEarnsPoints} {game.orientation.evaluation.hintEffect}
              </p>
              <p>
                <strong>Mastery threshold. </strong>
                {thresholdFor(game)}%. {game.orientation.mastery}
              </p>
              <p>
                <strong>Simulation disclosure. </strong>
                {game.orientation.implementationNote}
              </p>
              <p>
                <strong>Expected duration. </strong>
                {game.orientation.estimatedTime}
              </p>
              <p>
                <strong>Game status. </strong>
                {releaseStatusLabel(game.status)}
                {game.status === "implemented" ? " · Reference Implementation" : ""}
                {game.status === "prototype" ? " · Playable Prototype" : ""}
              </p>
            </div>
          </details>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Ways to assign it</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Lecture companion.</strong> Teach tokenization, then assign <Link className="underline" to={`${basePath}/play/token-forge`}>Token Forge</Link> before the next meeting.</li>
          <li><strong>Lab.</strong> Students complete one game in the lab period and export the progress CSV from Progress before they leave.</li>
          <li><strong>Independent module.</strong> Assign one tier and the optional pre/post check. Students do not need all 13 games.</li>
          <li><strong>Capstone.</strong> Use <Link className="underline" to={`${basePath}/play/foundry-arena`}>Foundry Arena</Link>. Grade the reflection and the constraints the student covered. The rubric is not a single official architecture.</li>
        </ul>
        <h3 className="text-lg font-medium">One-week module</h3>
        <p>Token Forge, Attention Architect, and Promptsmith. Enough to move from units of text, to how representations interact, to how a task is specified.</p>
        <h3 className="text-lg font-medium">Two-week module</h3>
        <p>The foundational games plus Retrieval Lab. Students finish with a concrete picture of context construction, not only of a single model call.</p>
        <h3 className="text-lg font-medium">Six-week sequence</h3>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Week 1: Token Forge and Attention Architect.</li>
          <li>Week 2: Context Compression and Promptsmith.</li>
          <li>Week 3: Gradient Playground, Reasoning Reactor, and Alignment Arena.</li>
          <li>Week 4: Retrieval Lab and Agent Architect.</li>
          <li>Week 5: Ship-It Simulator, System Composer, and ProdOps Gauntlet.</li>
          <li>Week 6: Foundry Arena.</li>
        </ol>
        <p>A single game is a valid assignment. The sequence is a teaching order, not a claim that production systems are built in this order. Correct selections are not sufficient evidence of learning. Ask students to justify the decision and apply it to a new case.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Scoring and mastery</h2>
        <p>
          Each round is scored out of 10. A strong answer scores 10, an acceptable answer scores 6, and a poor fit scores 0. Each revealed hint then subtracts 1 point, to a floor of 0. The game percent is the sum of the best round scores. The default mastery line is {threshold}%. Letter bands are A 90+, B 80–89, C 70–79, D 60–69, and F below 60. Students may retry. The best score on each round is kept. Finishing a game below {threshold}% is recorded and is not called mastery.
        </p>
        <p className="text-sm text-muted-foreground">
          Later tiers can stay locked until earlier games are mastered. Students can turn on Practice ahead on the home page. Listed prerequisites stay visible either way. Unlock counts live in config/odyssey.config.ts.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Progress on the student’s computer</h2>
        <p>
          The default record stays in the browser. It holds a random session id, games started, games completed, scores, attempts, rounds, hints, mastery, and timestamps. Refresh does not erase it. Students can export CSV or JSON from Progress, and Reset progress asks for confirmation before it deletes that browser’s record for the current mode. The public site does not require an account, a backend, or a research upload.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Change it for your course</h2>
        <p>Game text, hints, and objectives are in <code>content/games/</code>. Branding, which games are enabled, order, and the mastery threshold are in <code>config/odyssey.config.ts</code>.</p>
        <pre className="overflow-x-auto rounded-lg border border-border p-3 text-sm">{`masteryThreshold: 70,
enabledGames: ["token-forge"],
gameOrder: ["token-forge"],`}</pre>
        <p className="text-sm">
          That example keeps a tokenizer lesson and leaves the other games out of the course list. Rebuild after editing the config. The file in this repository is{" "}
          <a className="underline" href={`${repository.url}/blob/main/config/odyssey.config.ts`}>config/odyssey.config.ts</a>.
        </p>
        <p className="text-sm text-muted-foreground">Institution line in this build: {odysseyConfig.institution || "not set"}. Set <code>institution</code> and <code>logoSrc</code> in the same config file if you want them in the sidebar.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Optional check and exports</h2>
        <p>
          {assessmentItems.length} optional pre/post items live in <code>content/assessments/index.ts</code>. Explanations appear after submission. They are a classroom check, not a validated instrument.
        </p>
        <p>
          <Link className="underline" to={`${basePath}/assess/pre`}>Open the pre-check</Link>
          {" · "}
          <Link className="underline" to={`${basePath}/assess/post`}>Open the post-check</Link>
        </p>
        <p className="text-sm">These downloads contain only the record in the current mode on this browser.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-progress.csv", progressCsv(state), "text/csv")}>Progress CSV</button>
          <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-assessments.csv", assessmentCsv(state), "text/csv")}>Assessment CSV</button>
          <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-events.json", eventsJson(state), "application/json")}>Events JSON</button>
          <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-events.csv", eventsCsv(state), "text/csv")}>Events CSV</button>
          <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => void resetDemo()}>Reset Classroom Demo</button>
        </div>
        {notice ? <p role="status">{notice}</p> : null}
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-xl font-semibold">Citation</h2>
        <p>
          {citation.author}, {citation.affiliation}. {citation.platformTitle}. Software, version 0.1.0.{" "}
          <a className="underline" href={repository.url}>{repository.url}</a>
        </p>
        <p>
          Associated preprint: {citation.paperTitle}. arXiv:{citation.arxivId}, {citation.year}.{" "}
          <a className="underline" href={citation.arxivUrl}>{citation.arxivUrl}</a>. DOI: {citation.arxivDoi}.
        </p>
        <p className="text-muted-foreground">{citation.historicalAffiliation}</p>
      </section>
    </div>
  );
}
