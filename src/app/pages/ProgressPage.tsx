import { Link } from "react-router";
import { achievementCatalog } from "@content/achievements.ts";
import { games } from "../../content/load-games.ts";
import { courseGames, recommendedNext } from "../../game-engine/prerequisites.ts";
import { gradeBandLabel, letterGrade } from "../../game-engine/scoring.ts";
import { useLearner } from "../../hooks/use-learner.tsx";
import { assessmentCsv, downloadText, eventsCsv, eventsJson, progressCsv } from "../../storage/export.ts";

export function ProgressPage({ basePath }: { basePath: string }) {
  const learner = useLearner();
  if (learner.loading || !learner.state) return <p>Loading the local record…</p>;
  const state = learner.state;
  const visible = courseGames(games);
  const next = recommendedNext(visible, state, learner.bypassLocks);
  const concepts = new Map<string, { seen: number; mastered: number }>();
  for (const game of visible) {
    const mastered = Boolean(state.games[game.id]?.mastered);
    for (const concept of game.concepts) {
      const current = concepts.get(concept) ?? { seen: 0, mastered: 0 };
      current.seen += 1;
      if (mastered) current.mastered += 1;
      concepts.set(concept, current);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Progress</h1>
        <p>This record lives in this browser. Session {state.sessionId}.</p>
        {next ? (
          <p>
            Recommended next activity: <Link className="underline" to={`${basePath}/play/${next.id}`}>{next.title}</Link>
          </p>
        ) : (
          <p>Every open game is mastered, or none are unlocked yet.</p>
        )}
      </header>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Games</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-2">Game</th>
                <th className="p-2">Best</th>
                <th className="p-2">Grade</th>
                <th className="p-2">Attempts</th>
                <th className="p-2">Hints</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((game) => {
                const record = state.games[game.id];
                const hints = record ? Object.values(record.rounds).reduce((sum, round) => sum + round.totalHints, 0) : 0;
                return (
                  <tr key={game.id} className="border-t border-border">
                    <td className="p-2">
                      <Link className="underline" to={`${basePath}/play/${game.id}`}>{game.title}</Link>
                    </td>
                    <td className="p-2">{record ? `${record.bestPercent}%` : "—"}</td>
                    <td className="p-2">{record ? gradeBandLabel(letterGrade(record.bestPercent)) : "—"}</td>
                    <td className="p-2">{record?.attempts ?? 0}</td>
                    <td className="p-2">{hints}</td>
                    <td className="p-2">{record?.mastered ? "Mastered" : record?.completedAt ? "Completed" : record ? "In progress" : "Not started"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Concept exposure</h2>
        <p className="text-sm text-muted-foreground">A concept counts as mastered here only when a game that lists it has been mastered. That is a progress summary, not a separate psychometric scale.</p>
        <ul className="grid gap-2 md:grid-cols-2">
          {[...concepts.entries()].map(([concept, counts]) => (
            <li key={concept} className="rounded-lg border border-border p-3 text-sm">
              {concept}: mastered in {counts.mastered} of {counts.seen} listing games
            </li>
          ))}
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Achievements</h2>
        <ul className="space-y-2">
          {achievementCatalog.map((item) => {
            const earned = state.achievements.includes(item.id);
            return (
              <li key={item.id} className="rounded-lg border border-border p-3">
                <p className="font-medium">{item.title} · {earned ? "Earned" : "Not yet"} · {item.kind}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="flex flex-wrap gap-2">
        <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-progress.csv", progressCsv(state), "text/csv")}>Export progress CSV</button>
        <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-assessments.csv", assessmentCsv(state), "text/csv")}>Export assessments CSV</button>
        <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-events.json", eventsJson(state), "application/json")}>Export events JSON</button>
        <button type="button" className="min-h-11 rounded-lg border border-border px-4" onClick={() => downloadText("odyssey-events.csv", eventsCsv(state), "text/csv")}>Export events CSV</button>
        <button
          type="button"
          className="min-h-11 rounded-lg border border-destructive px-4 text-destructive"
          onClick={() => {
            if (window.confirm("Delete this browser’s learner record for the current mode? This cannot be undone.")) {
              void learner.clear();
            }
          }}
        >
          Delete local data
        </button>
      </section>
    </div>
  );
}
