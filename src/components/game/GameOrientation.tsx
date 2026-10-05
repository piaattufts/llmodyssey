import { Button } from "@/components/ui/button.tsx";
import { learnerStatusCopy, universalSelfEvaluation } from "@content/orientation/copy.ts";
import { tierCopy } from "../../app/copy.ts";
import type { GameDefinition, GameOrientation as OrientationContent } from "../../game-engine/schema.ts";

export function GameOrientation({ game, onStart }: { game: GameDefinition; onStart: () => void }) {
  const orientation = game.orientation;
  return (
    <div className="space-y-4" data-testid="game-orientation">
      <GameOverview game={game} />
      <div className="grid gap-4 lg:grid-cols-2">
        <LearningObjectives gameTitle={game.title} objectives={orientation.learningObjectives} misconception={game.misconception} />
        <WhyItMatters text={orientation.whyItMatters} />
        <WhatYouWillDo text={orientation.whatYouWillDo} />
        <HowItWorks text={orientation.howItWorks} />
      </div>
      <HowToPlay steps={orientation.howToPlay} />
      <details className="rounded-xl border border-border p-4">
        <summary className="cursor-pointer font-medium">Worked example: {game.workedExample.title}</summary>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {game.workedExample.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </details>
      <HowYouAreEvaluated orientation={orientation} threshold={game.masteryThreshold} />
      <ProgressAndMastery orientation={orientation} roundCount={game.rounds.length} />
      <SimulationDisclosure game={game} />
      <EstimatedTime time={orientation.estimatedTime} notes={orientation.beforeYouStart} />
      <StartGameButton onStart={onStart} />
    </div>
  );
}

export function GameOverview({ game }: { game: GameDefinition }) {
  const status = learnerStatusCopy(game.status);
  const orientation = game.orientation;
  return (
    <header className="space-y-3 rounded-xl border border-border p-4">
      <p className="text-sm text-muted-foreground">Game {game.order} of 13</p>
      <h1 className="text-3xl font-semibold tracking-tight" data-testid="game-title">
        {game.title}
      </h1>
      <p className="text-lg">{orientation.tagline}</p>
      <ul className="flex flex-wrap gap-2 text-sm">
        <li className="rounded-full border border-border px-3 py-1">Tier {game.tier} · {tierCopy[game.tier].name}</li>
        <li className="rounded-full border border-border px-3 py-1 capitalize">{game.difficulty}</li>
        <li className="rounded-full border border-border px-3 py-1">{orientation.estimatedTime}</li>
        {game.concepts.map((concept) => (
          <li key={concept} className="rounded-full border border-border px-3 py-1">
            {concept}
          </li>
        ))}
      </ul>
      <p className="text-sm font-medium" data-testid="implementation-status">
        Implementation status: {status.title}
      </p>
      {game.status === "prototype" ? (
        <p className="text-sm text-muted-foreground" data-testid="prototype-status">
          Playable Prototype. Scores on this page are calculated from your answers. Token Forge is the reference implementation for this release. {status.detail}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground" data-testid="reference-status">
          {status.title}. {status.detail}
        </p>
      )}
      <p>{orientation.overview}</p>
    </header>
  );
}

export function LearningObjectives({
  gameTitle,
  objectives,
  misconception,
}: {
  gameTitle: string;
  objectives: string[];
  misconception: string;
}) {
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">What will I learn?</h2>
      <p className="text-sm text-muted-foreground">After {gameTitle} you should be able to:</p>
      <ul className="list-disc space-y-1 pl-5">
        {objectives.map((objective) => (
          <li key={objective}>{objective}</li>
        ))}
      </ul>
      <p className="text-sm">
        <strong>Watch for this misconception. </strong>
        {misconception}
      </p>
    </section>
  );
}

export function WhyItMatters({ text }: { text: string }) {
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">Why does this matter?</h2>
      <p>{text}</p>
    </section>
  );
}

export function WhatYouWillDo({ text }: { text: string }) {
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">What will I do?</h2>
      <p>{text}</p>
    </section>
  );
}

export function HowItWorks({ text }: { text: string }) {
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">How does the game work?</h2>
      <p>{text}</p>
    </section>
  );
}

export function HowToPlay({ steps }: { steps: string[] }) {
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">How to play</h2>
      <ol className="list-decimal space-y-1 pl-5">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}

export function HowYouAreEvaluated({ orientation, threshold }: { orientation: OrientationContent; threshold: number }) {
  const evaluation = orientation.evaluation;
  return (
    <section className="space-y-3 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">How am I evaluated?</h2>
      <p>{evaluation.whatEarnsPoints}</p>
      <p>{evaluation.maximumScore}</p>
      <p>
        <strong>Penalties. </strong>
        {evaluation.penalties}
      </p>
      <p>
        <strong>Hints. </strong>
        {evaluation.hintEffect}
      </p>
      <p>
        <strong>Retries. </strong>
        {evaluation.retryEffect}
      </p>
      <p>
        <strong>Mastery threshold. </strong>
        {threshold}% ({evaluation.masteryThreshold} unless the course config overrides it).
      </p>
      <p>
        <strong>Efficiency. </strong>
        {evaluation.efficiencyMatters}
      </p>
      <p>
        <strong>More than one acceptable answer. </strong>
        {evaluation.multipleAcceptableAnswers}
      </p>
      <p className="text-sm">Grades: A 90–100 · B 80–89 · C 70–79 · D 60–69 · F below 60.</p>
      <SelfEvaluationPrimer orientation={orientation} />
    </section>
  );
}

export function SelfEvaluationPrimer({ orientation }: { orientation: OrientationContent }) {
  return (
    <div className="space-y-2 border-t border-border pt-3">
      <h2 className="text-lg font-semibold">{universalSelfEvaluation.heading}</h2>
      <p>{universalSelfEvaluation.intro}</p>
      <ol className="list-decimal space-y-1 pl-5">
        {universalSelfEvaluation.questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
      <ul className="space-y-1 text-sm">
        <li>
          <strong>Completion. </strong>
          {universalSelfEvaluation.completion}
        </li>
        <li>
          <strong>Performance. </strong>
          {universalSelfEvaluation.performance}
        </li>
        <li>
          <strong>Mastery. </strong>
          {universalSelfEvaluation.mastery}
        </li>
      </ul>
      <p>{orientation.mastery}</p>
      <ul className="list-disc pl-5">
        {orientation.selfCheck.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ProgressAndMastery({ orientation, roundCount }: { orientation: OrientationContent; roundCount: number }) {
  const progress = orientation.progress;
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">How you progress</h2>
      <p>
        {roundCount} rounds. You are about to start round 1. Difficulty increases with the focus of each round.
      </p>
      <ol className="space-y-1">
        {progress.rounds.map((round) => (
          <li key={round.label}>
            <strong>{round.label}. </strong>
            {round.difficulty} — {round.focus}
          </li>
        ))}
      </ol>
      <p>{progress.afterIncorrect}</p>
      <p>{progress.retry}</p>
      <p>{progress.completedWhen}</p>
      <p>{progress.belowMastery}</p>
      <p>
        <strong>Suggested next. </strong>
        {progress.recommendedNext}
      </p>
    </section>
  );
}

export function SimulationDisclosure({ game }: { game: GameDefinition }) {
  return (
    <section className="space-y-2 rounded-xl border border-primary/40 bg-primary/10 p-4">
      <h2 className="text-lg font-semibold">What is simulated, and what is computed?</h2>
      <p>{game.orientation.implementationNote}</p>
      <p className="text-sm">
        <strong>{game.implementation.label}. </strong>
        {game.implementation.whatIsReal} {game.implementation.whatIsSimulated}
      </p>
    </section>
  );
}

export function EstimatedTime({ time, notes }: { time: string; notes: string[] }) {
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">Before you start</h2>
      <p>
        <strong>Estimated time. </strong>
        {time}
      </p>
      <ul className="list-disc pl-5">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  );
}

export function StartGameButton({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="mb-3 text-sm text-muted-foreground">When the sections above make sense, start round 1.</p>
      <Button className="min-h-11 w-full sm:w-auto" data-testid="start-game" onClick={onStart}>
        Start game
      </Button>
    </div>
  );
}
