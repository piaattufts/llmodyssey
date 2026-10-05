import { Link, useParams } from "react-router";
import { GameShell } from "../../components/game/GameShell.tsx";
import { gameById, games } from "../../content/load-games.ts";
import { unlockStatus } from "../../game-engine/prerequisites.ts";
import { completionAllowed, releaseStatusLabel } from "../../game-engine/schema.ts";
import { useLearner } from "../../hooks/use-learner.tsx";

export function GamePage({ basePath }: { basePath: string }) {
  const params = useParams();
  const learner = useLearner();
  const game = params.gameId ? gameById(params.gameId) : undefined;
  if (!game) {
    return (
      <p role="alert">
        That game is not in this build. <Link to={basePath || "/"}>Return to the course.</Link>
      </p>
    );
  }
  if (learner.loading || !learner.state) return <p>Loading the local record…</p>;
  const gate = unlockStatus(game, games, learner.state, learner.bypassLocks);
  if (!completionAllowed(game.status)) {
    return (
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">{releaseStatusLabel(game.status)}</p>
        <h1 className="text-3xl font-semibold">{game.title}</h1>
        <p>{game.purpose}</p>
        <p>{game.whyItMatters}</p>
        <p>
          <strong>Concepts. </strong>
          {game.concepts.join(", ")}
        </p>
        <ul className="list-disc pl-5">
          {game.learningObjectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
        <p>This game is not playable in this release. It cannot be scored or marked complete.</p>
        <Link className="inline-flex min-h-11 items-center underline" to={basePath || "/"}>
          Back to the course
        </Link>
      </section>
    );
  }
  if (!gate.unlocked) {
    return (
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">{game.title} is locked</h1>
        <p>{gate.reason}</p>
        <p>You can turn on Practice ahead from the course page, or lower the unlock counts in config/odyssey.config.ts and rebuild.</p>
        <Link className="inline-flex min-h-11 items-center underline" to={basePath || "/"}>
          Back to the course
        </Link>
      </section>
    );
  }
  return <GameShell game={game} basePath={basePath} />;
}
