import { Link } from "react-router";
import { releaseStatusLabel, type GameDefinition } from "../../game-engine/schema.ts";

export function NextGameCard({ game, basePath }: { game: GameDefinition | null; basePath: string }) {
  if (!game) {
    return (
      <Link className="inline-flex min-h-11 items-center underline" to={`${basePath}/progress`}>
        Review progress
      </Link>
    );
  }
  return (
    <Link className="block rounded-xl border border-border p-4" to={`${basePath}/play/${game.id}`}>
      <p className="text-sm text-muted-foreground">Next recommended · {releaseStatusLabel(game.status)}</p>
      <p className="text-lg font-medium">{game.title}</p>
      <p className="text-sm">{game.summary}</p>
    </Link>
  );
}
