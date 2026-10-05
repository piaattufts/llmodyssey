import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { universalSelfEvaluation } from "@content/orientation/copy.ts";
import type { GameDefinition } from "../../game-engine/schema.ts";

export function GameGuide({ game }: { game: GameDefinition }) {
  const orientation = game.orientation;
  return (
    <Dialog>
      <DialogTrigger
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
        data-testid="open-game-guide"
      >
        Game Guide
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl" data-testid="game-guide">
        <DialogHeader>
          <DialogTitle>How this game works</DialogTitle>
          <DialogDescription>{orientation.tagline}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="goal">
          <TabsList className="flex h-auto w-full flex-wrap">
            <TabsTrigger value="goal">Goal</TabsTrigger>
            <TabsTrigger value="play">How to Play</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="concepts">Concepts</TabsTrigger>
            <TabsTrigger value="simulation">Simulation Note</TabsTrigger>
          </TabsList>
          <TabsContent value="goal" className="space-y-2 pt-3">
            <p>{orientation.overview}</p>
            <p>{orientation.whatYouWillDo}</p>
            <p>{orientation.whyItMatters}</p>
          </TabsContent>
          <TabsContent value="play" className="pt-3">
            <ol className="list-decimal space-y-1 pl-5">
              {orientation.howToPlay.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </TabsContent>
          <TabsContent value="scoring" className="space-y-2 pt-3">
            <p>{orientation.evaluation.whatEarnsPoints}</p>
            <p>{orientation.evaluation.maximumScore}</p>
            <p>{orientation.evaluation.hintEffect}</p>
            <p>{orientation.evaluation.retryEffect}</p>
            <p>
              Mastery threshold {orientation.evaluation.masteryThreshold}. {orientation.mastery}
            </p>
            <p>
              <strong>Completion</strong> means {universalSelfEvaluation.completion} <strong>Performance</strong> means{" "}
              {universalSelfEvaluation.performance} <strong>Mastery</strong> means {universalSelfEvaluation.mastery}
            </p>
          </TabsContent>
          <TabsContent value="concepts" className="space-y-2 pt-3">
            <ul className="list-disc pl-5">
              {orientation.learningObjectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
            <p>{game.concepts.join(", ")}</p>
          </TabsContent>
          <TabsContent value="simulation" className="space-y-2 pt-3">
            <p>{orientation.implementationNote}</p>
            <p>{orientation.howItWorks}</p>
            <p>
              {game.implementation.whatIsReal} {game.implementation.whatIsSimulated}
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
