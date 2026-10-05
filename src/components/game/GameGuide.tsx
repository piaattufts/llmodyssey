import { referenceById } from "@content/references.ts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { universalSelfEvaluation } from "@content/orientation/copy.ts";
import type { GameDefinition } from "../../game-engine/schema.ts";

export function GameGuide({ game }: { game: GameDefinition }) {
  const orientation = game.orientation;
  const guide = game.teaching.guide;
  const refs = game.furtherReadingIds.map((id) => referenceById(id)).filter((item) => item !== undefined);
  return (
    <Dialog>
      <DialogTrigger
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
        data-testid="open-game-guide"
      >
        How this game works
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl" data-testid="game-guide">
        <DialogHeader>
          <DialogTitle>How this game works</DialogTitle>
          <DialogDescription>{orientation.tagline}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList className="flex h-auto w-full flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="play">How to Play</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="concepts">Concepts</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="practices">Best Practices</TabsTrigger>
            <TabsTrigger value="pitfalls">Pitfalls</TabsTrigger>
            <TabsTrigger value="reading">Further Reading</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-2 pt-3">
            <p>{guide.overview}</p>
            <p>{orientation.whatYouWillDo}</p>
            <p>{guide.howItWorks}</p>
          </TabsContent>
          <TabsContent value="play" className="pt-3">
            <ol className="list-decimal space-y-1 pl-5">
              {orientation.howToPlay.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </TabsContent>
          <TabsContent value="scoring" className="space-y-2 pt-3">
            <p>{game.teaching.scoringNarrative}</p>
            <p>{orientation.evaluation.hintEffect}</p>
            <p>
              Mastery threshold {orientation.evaluation.masteryThreshold}. {orientation.mastery}
            </p>
            <p>
              <strong>Completion</strong> means {universalSelfEvaluation.completion} <strong>Performance</strong> means{" "}
              {universalSelfEvaluation.performance} <strong>Mastery</strong> means {universalSelfEvaluation.mastery}{" "}
              <strong>Transfer</strong> means {universalSelfEvaluation.transfer}
            </p>
          </TabsContent>
          <TabsContent value="concepts" className="space-y-2 pt-3">
            {guide.keyConcepts.map((concept) => (
              <p key={concept.term}>
                <strong>{concept.term}. </strong>
                {concept.explanation}
              </p>
            ))}
          </TabsContent>
          <TabsContent value="examples" className="space-y-2 pt-3">
            {guide.workedExamples.map((example) => (
              <div key={example.title}>
                <p className="font-medium">{example.title}</p>
                <p className="text-sm text-muted-foreground">{example.label}</p>
                <p>{example.body}</p>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="applications" className="space-y-2 pt-3">
            <p>{guide.applications}</p>
            <p>{guide.tradeoffs}</p>
            <p>{guide.productionConsiderations}</p>
          </TabsContent>
          <TabsContent value="practices" className="pt-3">
            <ul className="list-disc space-y-1 pl-5">
              {guide.bestPractices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="pitfalls" className="pt-3">
            <ul className="list-disc space-y-1 pl-5">
              {guide.pitfalls.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="reading" className="pt-3">
            <ul className="list-disc space-y-1 pl-5">
              {refs.map((reference) => (
                <li key={reference.id}>
                  <a className="underline" href={reference.url}>
                    {reference.authors} ({reference.year}). {reference.title}.
                  </a>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
