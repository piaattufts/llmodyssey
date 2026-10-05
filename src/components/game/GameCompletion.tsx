import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { universalSelfEvaluation } from "@content/orientation/copy.ts";
import { letterGrade } from "../../game-engine/scoring.ts";
import type { GameDefinition } from "../../game-engine/schema.ts";
import { readSelfMarks, writeSelfMark, type SelfMark } from "../../storage/self-evaluation.ts";
import type { GameRecord } from "../../storage/types.ts";
import { ConceptGuide } from "./ConceptGuide.tsx";
import { NextGameCard } from "./NextGameCard.tsx";

export function GameCompletion({
  game,
  record,
  percent,
  threshold,
  nextGame,
  nextInOrder,
  basePath,
  reflection,
  onReflectionChange,
  onSaveReflection,
  onReplay,
}: {
  game: GameDefinition;
  record: GameRecord | undefined;
  percent: number;
  threshold: number;
  nextGame: GameDefinition | null;
  nextInOrder: GameDefinition | null;
  basePath: string;
  reflection: string;
  onReflectionChange: (value: string) => void;
  onSaveReflection: () => void;
  onReplay: () => void;
}) {
  const shown = record?.bestPercent ?? percent;
  const rounds = Object.values(record?.rounds ?? {});
  const hints = rounds.reduce((sum, round) => sum + round.totalHints, 0);
  const attempts = rounds.reduce((sum, round) => sum + round.attempts, 0);
  const [marks, setMarks] = useState<Record<string, SelfMark>>(() => readSelfMarks(game.id));
  const mastered = record?.mastered ?? shown >= threshold;

  function mark(objective: string, value: SelfMark) {
    setMarks(writeSelfMark(game.id, objective, value));
  }

  return (
    <section className="space-y-6" data-testid="game-complete">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your result</h2>
        <p>{mastered ? "Mastery threshold reached." : "Game completed, but mastery not yet reached. You may replay the game."}</p>
        <ul className="space-y-1">
          <li>Score: {shown}%</li>
          <li>Grade: {letterGrade(shown)}</li>
          <li>Rounds completed: {rounds.length} of {game.rounds.length}</li>
          <li>Hints used: {hints}</li>
          <li>Attempts: {attempts}</li>
          <li>Mastery status: {mastered ? `Reached (threshold ${threshold}%)` : `Not yet reached (threshold ${threshold}%)`}</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          {universalSelfEvaluation.completion} {universalSelfEvaluation.performance} {universalSelfEvaluation.mastery}{" "}
          {universalSelfEvaluation.transfer} The self-check below does not change the score.
        </p>
      </div>

      <div className="space-y-3" data-testid="self-evaluation">
        <h2 className="text-xl font-semibold">How Well Do I Understand This?</h2>
        <p>What you should now be able to explain:</p>
        <ul className="space-y-3">
          {game.teaching.selfEvaluationQuestions.map((objective) => (
            <li key={objective} className="rounded-xl border border-border p-3">
              <p>{objective}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={marks[objective] === "confident" ? "default" : "outline"}
                  className="min-h-11"
                  onClick={() => mark(objective, "confident")}
                >
                  I can explain this confidently
                </Button>
                <Button
                  type="button"
                  variant={marks[objective] === "partial" ? "default" : "outline"}
                  className="min-h-11"
                  onClick={() => mark(objective, "partial")}
                >
                  I partly understand this
                </Button>
                <Button
                  type="button"
                  variant={marks[objective] === "practice" ? "default" : "outline"}
                  className="min-h-11"
                  onClick={() => mark(objective, "practice")}
                >
                  I need more practice
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <h3 className="text-lg font-medium">Learning objectives</h3>
        <ul className="list-disc space-y-1 pl-5">
          {game.orientation.learningObjectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Concept summary</h2>
        <p>{game.orientation.mastery}</p>
        <p>
          <strong>Concepts. </strong>
          {game.concepts.join(", ")}
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Reflect</h2>
        {game.orientation.reflectionPrompts.map((prompt) => (
          <p key={prompt}>{prompt}</p>
        ))}
        <p className="text-sm text-muted-foreground">{game.reflectionPrompt}</p>
        <textarea
          className="min-h-32 w-full rounded-lg border border-border bg-background p-3"
          value={reflection}
          onChange={(event) => onReflectionChange(event.target.value)}
        />
        <Button variant="outline" className="min-h-11" onClick={onSaveReflection}>
          Save reflection
        </Button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Next step</h2>
        <p className="text-sm">
          {universalSelfEvaluation.completion} {universalSelfEvaluation.performance} {universalSelfEvaluation.mastery} A score under {threshold}% does not hide the next game.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="min-h-11" onClick={onReplay}>
            Replay
          </Button>
          <ConceptGuide game={game} />
        </div>
        {nextInOrder ? (
          <Link className="inline-flex min-h-11 items-center underline" to={`${basePath}/play/${nextInOrder.id}`}>
            Continue to next game: {nextInOrder.title}
          </Link>
        ) : (
          <Link className="inline-flex min-h-11 items-center underline" to={`${basePath}/progress`}>
            Review progress
          </Link>
        )}
        <NextGameCard game={nextGame} basePath={basePath} />
      </div>
    </section>
  );
}
