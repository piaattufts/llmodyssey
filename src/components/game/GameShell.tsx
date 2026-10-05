import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { initialAction, evaluateRound, type Evaluation, type GameAction } from "../../game-engine/evaluate.ts";
import { courseGames, recommendedNext, thresholdFor } from "../../game-engine/prerequisites.ts";
import { blankGameRecord, projectRecord } from "../../game-engine/records.ts";
import { games } from "../../content/load-games.ts";
import { completionAllowed, type GameDefinition } from "../../game-engine/schema.ts";
import { applyHintPenalty, ROUND_MAX_POINTS } from "../../game-engine/scoring.ts";
import { useLearner } from "../../hooks/use-learner.tsx";
import type { RoundRecord } from "../../storage/types.ts";
import { ConceptGuide, WorkedExample } from "./ConceptGuide.tsx";
import { FeedbackPanel } from "./FeedbackPanel.tsx";
import { GameCompletion } from "./GameCompletion.tsx";
import { GameHeader } from "./GameHeader.tsx";
import { HintPanel } from "./HintPanel.tsx";
import { InteractionHost } from "./InteractionHost.tsx";
import { LearningObjectives } from "./LearningObjectives.tsx";
import { RoundProgress } from "./RoundProgress.tsx";
import { ScorePanel } from "./ScorePanel.tsx";

export function GameShell({ game, basePath }: { game: GameDefinition; basePath: string }) {
  const learner = useLearner();
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
    if (!completionAllowed(game.status)) return;
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

  const following = nextGame && nextGame.id !== game.id ? nextGame : null;

  return (
    <div className="space-y-6">
      <GameHeader game={game} threshold={threshold} />
      <RoundProgress
        value={((roundIndex + (phase === "intro" ? 0 : 1)) / game.rounds.length) * 100}
        label="Round progress"
      />

      {phase === "intro" ? (
        <LearningObjectives
          game={game}
          actions={
            <>
              <WorkedExample game={game} />
              <ConceptGuide game={game} />
              <Button className="min-h-11" data-testid="start-game" onClick={() => void start()}>
                Start game
              </Button>
            </>
          }
        />
      ) : null}

      {phase === "round" || phase === "feedback" ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{round.title}</h2>
              <p className="text-sm text-muted-foreground">Concept: {round.concept}</p>
            </div>
            <ScorePanel earned={earned} possible={possible} percent={percent} />
          </div>
          <p>{round.scenario}</p>
          <p>
            <strong>Task. </strong>
            {round.learnerTask}
          </p>
          <details className="rounded-lg border border-border p-3 text-sm">
            <summary className="cursor-pointer font-medium">How this round is scored</summary>
            <p className="mt-2">{round.scoringRule}</p>
            <p className="mt-2">Expected reasoning, visible to you before you answer: {round.expectedReasoning}</p>
          </details>
          <InteractionHost round={round} action={action} disabled={phase === "feedback"} onChange={setAction} />
          <HintPanel
            hints={[...round.hints]}
            revealed={hints}
            canReveal={phase === "round" && hints < round.hints.length}
            onReveal={() => {
              setHints(hints + 1);
              void learner.track({
                gameId: game.id,
                roundId: round.id,
                actionType: "hint",
                success: null,
                durationMs: null,
                metadata: { level: hints + 1 },
              });
            }}
          />
          {phase === "round" ? (
            <Button className="min-h-11" data-testid="submit-round" disabled={action === null} onClick={() => void submit()}>
              Lock in this round
            </Button>
          ) : null}
          {phase === "feedback" && evaluation && lockedScore !== null ? (
            <FeedbackPanel
              evaluation={evaluation}
              hints={hints}
              score={lockedScore}
              isLastRound={roundIndex >= game.rounds.length - 1}
              onRetry={retry}
              onNext={next}
            />
          ) : null}
        </section>
      ) : null}

      {phase === "reflection" ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Reflection</h2>
          <p>{game.reflectionPrompt}</p>
          <textarea
            className="min-h-32 w-full rounded-lg border border-border bg-background p-3"
            value={reflection}
            onChange={(event) => setReflectionDraft(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button className="min-h-11" onClick={() => void finish(false)}>
              Save reflection
            </Button>
            <Button variant="outline" className="min-h-11" onClick={() => void finish(true)}>
              Skip for now
            </Button>
          </div>
        </section>
      ) : null}

      {phase === "complete" ? (
        <GameCompletion game={game} record={record} percent={percent} threshold={threshold} nextGame={following} basePath={basePath} />
      ) : null}
    </div>
  );
}
