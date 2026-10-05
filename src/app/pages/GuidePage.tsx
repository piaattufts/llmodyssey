import { Link } from "react-router";
import { conceptGroups } from "@content/concept-index.ts";
import { conceptGuides } from "@content/concept-guides/index.ts";
import { referenceById } from "@content/references.ts";
import { games } from "../../content/load-games.ts";

export function GuidePage({ basePath }: { basePath: string }) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Concept Index</h1>
        <p>
          Concepts are grouped by the kind of decision they support. Each one links to the game whose guide explains it. The same text is available inside the game, and opening that guide does not reset a round.
        </p>
      </header>
      {conceptGroups.map((group) => (
        <section key={group.id} className="space-y-3">
          <h2 className="text-2xl font-semibold">{group.title}</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {group.concepts.map((concept) => {
              const game = games.find((item) => item.id === concept.gameId);
              return (
                <li key={`${group.id}-${concept.name}`} className="rounded-xl border border-border p-4">
                  <h3 className="font-medium">{concept.name}</h3>
                  <p className="mt-1 text-sm">{concept.note}</p>
                  {game ? (
                    <Link className="mt-2 inline-flex min-h-11 items-center underline" to={`${basePath}/play/${game.id}`}>
                      {game.title} guide
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Guides by game</h2>
        {conceptGuides.map((guide) => (
          <article key={guide.id} className="space-y-2 rounded-xl border border-border p-4">
            <h3 className="text-xl font-semibold">{guide.title}</h3>
            <p>{guide.purpose}</p>
            <p className="text-sm">
              <strong>Concepts. </strong>
              {guide.concepts.join(", ")}
            </p>
            <p className="text-sm">
              <strong>Misconception. </strong>
              {guide.misconception}
            </p>
            <ul className="list-disc pl-5 text-sm">
              {guide.furtherReadingIds.map((id) => {
                const reference = referenceById(id);
                if (!reference) return <li key={id}>{id}</li>;
                return (
                  <li key={id}>
                    <a className="underline" href={reference.url}>
                      {reference.authors} ({reference.year}). {reference.title}.
                    </a>
                  </li>
                );
              })}
            </ul>
            <Link className="inline-flex min-h-11 items-center underline" to={`${basePath}/play/${guide.id}`}>
              Open {guide.title}
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
