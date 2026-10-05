import { Link } from "react-router";
import { conceptGuides } from "@content/concept-guides/index.ts";
import { referenceById } from "@content/references.ts";

export function GuidePage({ basePath }: { basePath: string }) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Concept index</h1>
        <p>Each entry is generated from the game definition. The same text is what the in-game concept guide shows.</p>
      </header>
      {conceptGuides.map((guide) => (
        <article key={guide.id} className="space-y-2 rounded-xl border border-border p-4">
          <h2 className="text-xl font-semibold">{guide.title}</h2>
          <p>{guide.purpose}</p>
          <p className="text-sm"><strong>Concepts. </strong>{guide.concepts.join(", ")}</p>
          <p className="text-sm"><strong>Misconception. </strong>{guide.misconception}</p>
          <ul className="list-disc pl-5 text-sm">
            {guide.furtherReadingIds.map((id) => {
              const reference = referenceById(id);
              if (!reference) return <li key={id}>{id}</li>;
              return (
                <li key={id}>
                  <a className="underline" href={reference.url}>{reference.authors} ({reference.year}). {reference.title}.</a>
                </li>
              );
            })}
          </ul>
          <Link className="inline-flex min-h-11 items-center underline" to={`${basePath}/play/${guide.id}`}>Open {guide.title}</Link>
        </article>
      ))}
    </div>
  );
}
