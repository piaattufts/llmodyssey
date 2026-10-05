import { referenceById } from "@content/references.ts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import type { GameDefinition } from "../../game-engine/schema.ts";

function GuideButton({ children }: { children: string }) {
  return (
    <DialogTrigger className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
      {children}
    </DialogTrigger>
  );
}

export function ConceptGuide({ game }: { game: GameDefinition }) {
  const refs = game.furtherReadingIds.map((id) => referenceById(id)).filter((item) => item !== undefined);
  return (
    <Dialog>
      <GuideButton>Concept guide</GuideButton>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{game.title} concept guide</DialogTitle>
          <DialogDescription>{game.purpose}</DialogDescription>
        </DialogHeader>
        <p>{game.whyItMatters}</p>
        <p>
          <strong>Concepts. </strong>
          {game.concepts.join(", ")}
        </p>
        <ul className="space-y-2 text-sm">
          {refs.map((reference) => (
            <li key={reference.id}>
              <a className="underline" href={reference.url}>
                {reference.authors} ({reference.year}). {reference.title}.
              </a>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export function WorkedExample({ game }: { game: GameDefinition }) {
  return (
    <Dialog>
      <GuideButton>Worked example</GuideButton>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{game.workedExample.title}</DialogTitle>
          <DialogDescription>A worked example before you start. It does not reveal later answers.</DialogDescription>
        </DialogHeader>
        <ol className="list-decimal space-y-2 pl-5">
          {game.workedExample.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
