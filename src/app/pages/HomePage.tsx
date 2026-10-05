import { Link } from "react-router";
import { games } from "../../content/load-games.ts";
import { odysseyConfig } from "../../game-engine/config.ts";
import { releaseStatusLabel } from "../../game-engine/schema.ts";
import { countMastered, courseGames, recommendedNext, unlockStatus } from "../../game-engine/prerequisites.ts";
import { useLearner } from "../../hooks/use-learner.tsx";
import { tierCopy } from "../copy.ts";
import { TourBar } from "../TourBar.tsx";

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
        <p className="text-sm text-muted-foreground">{odysseyConfig.tagline}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{odysseyConfig.title}</h1>
        <p className="max-w-3xl text-2xl font-medium tracking-tight">Master LLM Engineering Through Interactive Games</p>
        <ul className="flex flex-wrap gap-2 text-sm">
          {["13 games", "3 learning tiers", "No API key required", "Open source"].map((item) => (
            <li key={item} className="rounded-full border border-border px-3 py-1">
              {item}
            </li>
          ))}
        </ul>
        <p className="max-w-3xl text-lg">
          Token Forge is the reference implementation. The other twelve games are playable prototypes. Their scores are calculated, and each card shows that status. Nothing here calls a paid model API.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-primary-foreground" to={`${basePath}/play/token-forge`}>
            Start Learning
          </Link>
          <Link className="inline-flex min-h-11 items-center rounded-lg border border-border px-4" to={`${basePath}/educator`}>
            Educator Guide
          </Link>
          <Link className="inline-flex min-h-11 items-center rounded-lg border border-border px-4" to={demo ? "/demo?tour=1" : "/demo"}>
            Demo Tour
          </Link>
          {next ? (
            <Link className="inline-flex min-h-11 items-center rounded-lg border border-border px-4" to={`${basePath}/play/${next.id}`}>
              Continue: {next.title}
            </Link>
          ) : null}
        </div>
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
      {demo ? <TourBar /> : null}
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
                        {game.status === "implemented" ? " · Reference" : ""}
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
