import { releaseStatusLabel, type GameDefinition } from "../../game-engine/schema.ts";

export function GameHeader({ game, threshold }: { game: GameDefinition; threshold: number }) {
  const status = releaseStatusLabel(game.status);
  return (
    <header className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Tier {game.tier} · {game.estimatedMinutes} min · mastery {threshold}% · {status}
        {game.status === "implemented" ? " · Reference implementation" : ""}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight" data-testid="game-title">
        {game.title}
      </h1>
      <p>{game.summary}</p>
      {game.status === "prototype" ? (
        <p className="text-sm text-muted-foreground">
          Prototype. Scores on this page are calculated from your answers. Token Forge is the reference implementation for this release.
        </p>
      ) : null}
      <p className="rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm">
        <strong>Implementation. </strong>
        {game.implementation.label}. {game.implementation.whatIsReal} {game.implementation.whatIsSimulated}
      </p>
    </header>
  );
}
