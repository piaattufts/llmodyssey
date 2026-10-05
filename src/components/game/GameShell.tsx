import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { referenceById } from "@content/references.ts";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { initialAction, evaluateRound, type Evaluation, type GameAction } from "../../game-engine/evaluate.ts";
import { courseGames, recommendedNext, thresholdFor } from "../../game-engine/prerequisites.ts";
import { blankGameRecord, projectRecord } from "../../game-engine/records.ts";
import { games } from "../../content/load-games.ts";
import type { GameDefinition } from "../../game-engine/schema.ts";
import { applyHintPenalty, gradeBandLabel, letterGrade, MAX_HINTS, ROUND_MAX_POINTS } from "../../game-engine/scoring.ts";
import { useLearner } from "../../hooks/use-learner.tsx";
import type { RoundRecord } from "../../storage/types.ts";
import { InteractionHost } from "./InteractionHost.tsx";

const hintLabels = ["Conceptual cue", "Directional guidance", "Partial solution"];

function GuideButton({ children }: { children: string }) {
  return (
    <DialogTrigger className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
      {children}
    </DialogTrigger>
  );
}

export function GameShell({ game, basePath }: { game: GameDefinition; basePath: string }) {
  const learner = useLearner();
  const reduceMotion = useReducedMotion();
  const threshold = thresholdFor(game);
  const [phase, setPhase] = useState<"intro" | "round" | "feedback" | "reflection" | "complete">("intro");
  const [roundIndex, setRoundIndex] = useState(0);
  const [action, setAction] = useState<GameAction | null>(null);
  const [hints, setHints] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [lockedScore, setLockedScore] = useState<number | null>(null);
  const round = game.rounds[roundIndex];
  const record = learner.state?.games[game.id];
  const [reflectionDraft, setReflectionDraft] = useState<string | null>(null);
  const reflection = reflectionDraft ?? record?.reflection ?? "";

  useEffect(() => {
    const started = Date.now();
    return () => {
      const elapsed = Date.now() - started;
      void learner.update((state) => {
        const current = state.games[game.id] ?? blankGameRecord(game.id);
        return { ...state, games: { ...state.games, [game.id]: { ...current, timeSpentMs: current.timeSpentMs + elapsed } } };
      });
    };
    // Record time for this visit. Re-subscribing on every state change would double-count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);

  if (!round) return <p>This game has no rounds.</p>;

  async function start() {
    setAction(initialAction(round));
    setPhase("round");
    await learner.update((state) => {
      const current = state.games[game.id] ?? blankGameRecord(game.id);
      return {
        ...state,
        games: {
          ...state.games,
          [game.id]: { ...current, startedAt: current.startedAt ?? new Date().toISOString(), attempts: current.attempts + 1 },
        },
      };
    });
    await learner.track({ gameId: game.id, roundId: round.id, actionType: "game_start", success: null, durationMs: null, metadata: {} });
  }

  async function submit() {
    const result = evaluateRound(round, action);
    const score = applyHintPenalty(result.rawPoints, hints);
    setEvaluation(result);
    setLockedScore(score);
    setPhase("feedback");
    await learner.update((state) => {
      const current = state.games[game.id] ?? blankGameRecord(game.id);
      const previous = current.rounds[round.id];
      const better = !previous || score >= previous.bestScore;
      const nextRound: RoundRecord = {
        roundId: round.id,
        bestScore: better ? score : previous.bestScore,
        maxScore: ROUND_MAX_POINTS,
        hintsOnBestAttempt: better ? hints : previous.hintsOnBestAttempt,
        totalHints: (previous?.totalHints ?? 0) + hints,
        attempts: (previous?.attempts ?? 0) + 1,
        lastSuccess: result.success,
      };
      const updated = projectRecord(game, { ...current, rounds: { ...current.rounds, [round.id]: nextRound } }, threshold);
      return { ...state, games: { ...state.games, [game.id]: updated } };
    });
    await learner.track({
      gameId: game.id,
      roundId: round.id,
      actionType: "round_submit",
      success: result.success,
      durationMs: null,
      metadata: { rawPoints: result.rawPoints, hints, score },
    });
  }

  function retry() {
    setHints(0);
    setEvaluation(null);
    setLockedScore(null);
    setAction(initialAction(round));
    setPhase("round");
  }

  function next() {
    if (roundIndex < game.rounds.length - 1) {
      const following = game.rounds[roundIndex + 1];
      setRoundIndex(roundIndex + 1);
      setHints(0);
      setEvaluation(null);
      setLockedScore(null);
      setAction(following ? initialAction(following) : null);
      setPhase("round");
      return;
    }
    setPhase("reflection");
  }

  async function finish(skip: boolean) {
    const text = skip ? "" : reflection;
    await learner.update((state) => {
      const current = state.games[game.id] ?? blankGameRecord(game.id);
      const updated = projectRecord(game, { ...current, reflection: text, completedAt: new Date().toISOString() }, threshold);
      return { ...state, games: { ...state.games, [game.id]: updated } };
    });
    await learner.track({ gameId: game.id, roundId: null, actionType: "game_complete", success: true, durationMs: null, metadata: { skippedReflection: skip } });
    setPhase("complete");
  }

  const earned = game.rounds.reduce((sum, item) => sum + (record?.rounds[item.id]?.bestScore ?? 0), 0);
  const possible = game.rounds.length * ROUND_MAX_POINTS;
  const percent = possible === 0 ? 0 : Math.round((earned / possible) * 100);
  const nextGame = learner.state ? recommendedNext(courseGames(games), learner.state, learner.bypassLocks) : null;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">Tier {game.tier} · {game.estimatedMinutes} min · mastery {threshold}%</p>
        <h1 className="text-3xl font-semibold tracking-tight" data-testid="game-title">{game.title}</h1>
        <p>{game.summary}</p>
        <p className="rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm">
          <strong>Implementation. </strong>{game.implementation.label}. {game.implementation.whatIsReal} {game.implementation.whatIsSimulated}
        </p>
        <Progress value={((roundIndex + (phase === "intro" ? 0 : 1)) / game.rounds.length) * 100} aria-label="Round progress" />
      </header>

      {phase === "intro" ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Learning objectives</h2>
          <ul className="list-disc space-y-1 pl-5">{game.learningObjectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
          <p><strong>Bloom levels. </strong>{game.bloomLevels.join(", ")}</p>
          <p><strong>Misconception in view. </strong>{game.misconception}</p>
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <GuideButton>Worked example</GuideButton>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{game.workedExample.title}</DialogTitle>
                  <DialogDescription>A worked example before you start. It does not reveal later answers.</DialogDescription>
                </DialogHeader>
                <ol className="list-decimal space-y-2 pl-5">{game.workedExample.steps.map((step) => <li key={step}>{step}</li>)}</ol>
              </DialogContent>
            </Dialog>
            <ConceptGuide game={game} />
            <Button className="min-h-11" data-testid="start-game" onClick={() => void start()}>Start game</Button>
          </div>
        </section>
      ) : null}

      {phase === "round" || phase === "feedback" ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{round.title}</h2>
              <p className="text-sm text-muted-foreground">Concept: {round.concept}</p>
            </div>
            <p className="text-sm">Score so far {earned}/{possible} · {percent}% · {gradeBandLabel(letterGrade(percent))}</p>
          </div>
          <p>{round.scenario}</p>
          <p><strong>Task. </strong>{round.learnerTask}</p>
          <details className="rounded-lg border border-border p-3 text-sm">
            <summary className="cursor-pointer font-medium">How this round is scored</summary>
            <p className="mt-2">{round.scoringRule}</p>
            <p className="mt-2">Expected reasoning, visible to you before you answer: {round.expectedReasoning}</p>
          </details>
          <InteractionHost round={round} action={action} disabled={phase === "feedback"} onChange={setAction} />
          <div className="rounded-xl border border-border p-4">
            <h3 className="font-medium">Hints</h3>
            <p className="text-sm text-muted-foreground">Hints used {hints}/{MAX_HINTS}. Each hint subtracts {1} point from this round after scoring, to a floor of 0.</p>
            <ol className="mt-2 space-y-2">
              {round.hints.slice(0, hints).map((hint, index) => (
                <li key={hint}><strong>{hintLabels[index]}. </strong>{hint}</li>
              ))}
            </ol>
            {phase === "round" && hints < MAX_HINTS ? (
              <Button variant="outline" className="mt-3 min-h-11" onClick={() => {
                setHints(hints + 1);
                void learner.track({ gameId: game.id, roundId: round.id, actionType: "hint", success: null, durationMs: null, metadata: { level: hints + 1 } });
              }}>Reveal next hint</Button>
            ) : null}
          </div>
          {phase === "round" ? (
            <Button className="min-h-11" data-testid="submit-round" disabled={action === null} onClick={() => void submit()}>Lock in this round</Button>
          ) : null}
          {phase === "feedback" && evaluation && lockedScore !== null ? (
            <motion.div
              className="space-y-3 rounded-xl border border-border p-4"
              data-testid="feedback"
              aria-live="polite"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-lg font-semibold">{evaluation.success ? "Met the round target" : evaluation.partial ? "Partly met" : "Not met"}</p>
              <p>{evaluation.feedback}</p>
              <p>{evaluation.explanation}</p>
              <ul className="list-disc pl-5 text-sm">{evaluation.breakdown.map((line) => <li key={line.detail}>{line.detail}</li>)}</ul>
              <p className="text-sm">Raw points {evaluation.rawPoints}. Hint penalty {hints}. Round score {lockedScore} / {ROUND_MAX_POINTS}.</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="min-h-11" onClick={retry}>Retry this round</Button>
                <Button className="min-h-11" onClick={next}>{roundIndex < game.rounds.length - 1 ? "Next round" : "Continue to reflection"}</Button>
              </div>
            </motion.div>
          ) : null}
        </section>
      ) : null}

      {phase === "reflection" ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Reflection</h2>
          <p>{game.reflectionPrompt}</p>
          <textarea className="min-h-32 w-full rounded-lg border border-border bg-background p-3" value={reflection} onChange={(event) => setReflectionDraft(event.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button className="min-h-11" onClick={() => void finish(false)}>Save reflection</Button>
            <Button variant="outline" className="min-h-11" onClick={() => void finish(true)}>Skip for now</Button>
          </div>
        </section>
      ) : null}

      {phase === "complete" ? (
        <section className="space-y-3" data-testid="game-complete">
          <h2 className="text-xl font-semibold">{record?.mastered ? "Mastered" : "Completed, not yet mastered"}</h2>
          <p>Best score {record?.bestPercent ?? percent}%. Letter {letterGrade(record?.bestPercent ?? percent)}. Mastery threshold {threshold}%.</p>
          <p>You can retry any time. The best round scores are kept.</p>
          {nextGame && nextGame.id !== game.id ? <Link className="inline-flex min-h-11 items-center underline" to={`${basePath}/play/${nextGame.id}`}>Next recommended: {nextGame.title}</Link> : <Link className="inline-flex min-h-11 items-center underline" to={`${basePath}/progress`}>Review progress</Link>}
        </section>
      ) : null}
    </div>
  );
}

function ConceptGuide({ game }: { game: GameDefinition }) {
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
        <p><strong>Concepts. </strong>{game.concepts.join(", ")}</p>
        <ul className="space-y-2 text-sm">
          {refs.map((reference) => (
            <li key={reference.id}>
              <a className="underline" href={reference.url}>{reference.authors} ({reference.year}). {reference.title}.</a>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
