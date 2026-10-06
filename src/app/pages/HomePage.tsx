import { Link } from "react-router";
import { games } from "../../content/load-games.ts";
import { releaseStatusLabel } from "../../game-engine/schema.ts";
import { countMastered, courseGames, recommendedNext, unlockStatus } from "../../game-engine/prerequisites.ts";
import { useLearner } from "../../hooks/use-learner.tsx";
import { repository } from "../../site.ts";
import { tierCopy } from "../copy.ts";

export function HomePage({ basePath, demo = false }: { basePath: string; demo?: boolean }) {
  const learner = useLearner();
  if (learner.loading || !learner.state) return <p>Loading the local record…</p>;
  if (learner.error) return <p role="alert">The local record could not be read. {learner.error}</p>;
  const state = learner.state;
  const visible = courseGames(games);
  const next = recommendedNext(visible, state, learner.bypassLocks);
  const mastered = visible.filter((game) => state.games[game.id]?.mastered).length;

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <p className="text-sm text-muted-foreground">The Odyssey · Master the Machine</p>
        <h1 className="text-4xl font-semibold tracking-tight">LLM Odyssey</h1>
        {demo ? <p className="text-2xl font-medium">LLM Odyssey Demo</p> : null}
        <p className="max-w-3xl text-2xl font-medium tracking-tight">Learn LLM Engineering Through Interactive Games</p>
        <p className="max-w-3xl text-lg">
          LLM Odyssey is an open-source, browser-based learning environment that turns core LLM engineering concepts into interactive decision-making activities.
        </p>
        <p className="max-w-3xl">
          Students move from foundational topics such as tokenization and attention to retrieval, agents, production operations, and system design.
        </p>
        <ul className="flex flex-wrap gap-2 text-sm">
          {["13 interactive games", "3 learning tiers", "No paid API required", "Open source", "Local-first", "Educator reusable"].map((item) => (
            <li key={item} className="rounded-full border border-border px-3 py-1">
              {item}
            </li>
          ))}
        </ul>
        <p className="max-w-3xl">
          Token Forge is the reference implementation. The other twelve games are playable prototypes. Their scores are calculated, and each card shows that status. Nothing here calls a paid model API.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-primary-foreground" to={`${basePath}/play/token-forge`}>
            Start Learning
          </Link>
          <Link className="inline-flex min-h-11 items-center rounded-lg border border-border px-4" to={`${basePath}/educator`}>
            Explore as Educator
          </Link>
          <Link className="inline-flex min-h-11 items-center rounded-lg border border-border px-4" to={demo ? "/demo?tour=1" : "/demo?tour=1"}>
            Take the Demo Tour
          </Link>
          {next ? (
            <Link className="inline-flex min-h-11 items-center rounded-lg border border-border px-4" to={`${basePath}/play/${next.id}`}>
              Continue: {next.title}
            </Link>
          ) : null}
        </div>
        <p>
          <a className="inline-flex min-h-11 items-center underline" href={repository.url}>
            View on GitHub
          </a>
        </p>
        <p>
          {mastered} of {visible.length} games mastered
          {next ? `. Recommended next: ${next.title}.` : "."}
        </p>
        <Link className="inline-flex min-h-11 items-center text-sm underline" to={`${basePath}/assess/pre`}>
          {state.assessments.pre ? "Review pre-assessment" : "Optional pre-assessment"}
        </Link>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="size-5"
            checked={state.exploreAhead}
            onChange={(event) => {
              void learner.update((current) => ({ ...current, exploreAhead: event.target.checked }));
            }}
          />
          Practice ahead. Opens later tiers before the mastery counts are met. Listed prerequisites stay visible either way.
        </label>
      </header>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">How the Odyssey works</h2>
        <ol className="grid gap-3 md:grid-cols-2">
          {[
            ["1. Understand", "Read why the game exists, what you will do, and what the screen is actually calculating."],
            ["2. Experiment", "Make a decision on a scenario. The examples stay the same for every learner."],
            ["3. Get feedback", "See why the choice fit, why the alternatives were weaker, and what a real system would require."],
            ["4. Reflect", "Answer a short prompt. The reflection does not change the score."],
            ["5. Apply", "Use the concept guide and, later, a design brief in Foundry Arena."],
            ["6. Progress", "Completion, the score, and the mastery threshold are recorded separately. Transfer is whether you can explain a new case."],
          ].map(([title, body]) => (
            <li key={title} className="rounded-xl border border-border p-4">
              <h3 className="font-medium">{title}</h3>
              <p className="mt-1 text-sm">{body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">The learning journey</h2>
        <p>
          The path below is a pedagogical sequence. It is not a claim that every production LLM system is built in this exact order.
        </p>
        <p className="text-sm">
          Raw text → Token Forge → Attention Architect → Context Compression → Promptsmith → Gradient Playground → Reasoning Reactor → Alignment Arena → Ship-It Simulator → Agent Architect → Retrieval Lab → System Composer → ProdOps Gauntlet → Foundry Arena
        </p>
      </section>
      {demo ? (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">LLM Odyssey Demo</h2>
          <p>Explore the entire curriculum without affecting learner progress.</p>
          <p>Demo Mode uses a separate browser-local record. It does not modify normal learner progress. No paid model API is required. Use Demo Mode to preview games before assigning them or to demonstrate Odyssey in a classroom or conference setting.</p>
          <div className="flex flex-wrap gap-3">
            <Link className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-primary-foreground" to="/demo?tour=1">
              Start Guided Tour
            </Link>
            <Link className="inline-flex min-h-11 items-center rounded-lg border border-border px-4" to="/demo/play/token-forge">
              Explore Any Game
            </Link>
            <Link className="inline-flex min-h-11 items-center rounded-lg border border-border px-4" to="/demo/educator">
              Open Educator Guide
            </Link>
          </div>
        </section>
      ) : null}
      {([1, 2, 3] as const).map((tier) => {
        const tierGames = visible.filter((game) => game.tier === tier);
        if (tierGames.length === 0) return null;
        const copy = tierCopy[tier];
        return (
          <section key={tier} className="space-y-3">
            <h2 className="text-2xl font-semibold">
              Tier {tier} · {copy.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {copy.goal} Bloom emphasis: {copy.bloom}. Mastered in this tier: {countMastered(state, visible, tier)}.
            </p>
            <ul className="grid gap-3 md:grid-cols-2">
              {tierGames.map((game) => {
                const record = state.games[game.id];
                const gate = unlockStatus(game, games, state, learner.bypassLocks);
                return (
                  <li key={game.id}>
                    <Link className="block min-h-11 rounded-xl border border-border p-4 hover:border-primary" to={`${basePath}/play/${game.id}`}>
                      <span className="text-lg font-medium">
                        {game.order}. {game.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{game.summary}</span>
                      <span className="mt-2 block text-sm">
                        {releaseStatusLabel(game.status)}
                        {game.status === "planned"
                          ? " · Not playable"
                          : record?.mastered
                            ? ` · Mastered · ${record.bestPercent}%`
                            : record
                              ? ` · In progress · ${record.bestPercent}%`
                              : " · Not started"}
                        {gate.unlocked ? "" : ` · Locked. ${gate.reason}`}
                        <span className="sr-only">{record?.mastered ? " Status mastered." : " Status open."}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
