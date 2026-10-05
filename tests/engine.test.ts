import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { customGame } from "../examples/custom-game/sample.ts";
import { foundryChallenges } from "../content/challenges/foundry.ts";
import { games } from "../src/content/load-games.ts";
import { registeredGames } from "../src/games/register.ts";
import { attend } from "../src/game-engine/models/attention.ts";
import { describeDecision, evaluateRound, gameIsSolvable, representativeSuccessAction } from "../src/game-engine/evaluate.ts";
import { odysseyConfig } from "../src/game-engine/config.ts";
import { unlockStatus } from "../src/game-engine/prerequisites.ts";
import { blankGameRecord, projectRecord } from "../src/game-engine/records.ts";
import { applyHintPenalty, gamePercent, isMastered, letterGrade } from "../src/game-engine/scoring.ts";
import { completionAllowed, parseGame } from "../src/game-engine/schema.ts";
import { createLlmProvider } from "../src/llm/providers.ts";
import { researchModeEnabled } from "../src/research/mode.ts";
import { progressCsv } from "../src/storage/export.ts";
import { createMemoryRepository, resetMemoryRepository } from "../src/storage/repository.ts";
import { emptyLearnerState, type GameRecord, type LearnerState } from "../src/storage/types.ts";

const root = process.cwd();

function masteredRecord(gameId: string): GameRecord {
  const game = games.find((item) => item.id === gameId);
  if (!game) throw new Error(gameId);
  const record = blankGameRecord(gameId);
  record.completedAt = "2026-01-01T00:00:00.000Z";
  for (const round of game.rounds) {
    record.rounds[round.id] = {
      roundId: round.id,
      bestScore: 10,
      maxScore: 10,
      hintsOnBestAttempt: 0,
      totalHints: 0,
      attempts: 1,
      lastSuccess: true,
    };
  }
  return projectRecord(game, record, 70);
}

function stateWith(records: GameRecord[], exploreAhead = false): LearnerState {
  const state = emptyLearnerState("test-session");
  state.exploreAhead = exploreAhead;
  for (const record of records) state.games[record.gameId] = record;
  return state;
}

describe("course content", () => {
  it("registers exactly 13 games in both catalogs", () => {
    expect(games).toHaveLength(13);
    expect(registeredGames.map((game) => game.id)).toEqual(games.map((game) => game.id));
    expect(new Set(games.map((game) => game.id)).size).toBe(13);
    expect(foundryChallenges.map((challenge) => challenge.pathId)).toEqual([
      "industry",
      "healthcare",
      "robotics",
      "ethics",
      "education",
      "sandbox",
    ]);
  });

  it("solves every round of every game", () => {
    for (const game of games) {
      expect(gameIsSolvable(game), game.id).toBe(true);
      for (const round of game.rounds) {
        const action = representativeSuccessAction(round);
        const result = evaluateRound(round, action);
        expect(result.success, `${game.id}:${round.id}`).toBe(true);
        expect(result.rawPoints).toBeGreaterThan(0);
      }
    }
  });

  it("keeps Token Forge counts honest and attention winners unique", () => {
    const legal = games[0]?.rounds.find((round) => round.id === "legal-cost");
    if (!legal || legal.interaction.type !== "tokenizer") throw new Error("missing legal round");
    const counts = Object.fromEntries(legal.interaction.strategies.map((strategy) => [strategy.id, strategy.tokens.length]));
    expect(counts.sentencepiece).toBe(19);
    expect(counts.wordpiece).toBe(23);
    expect(legal.interaction.strategies.flatMap((strategy) => strategy.tokens)).not.toContain("cap");
    const attention = games.find((game) => game.id === "attention-architect");
    if (!attention) throw new Error("missing attention");
    for (const round of attention.rounds) {
      if (round.interaction.type !== "attention") continue;
      const head = round.interaction.heads[round.interaction.answerHead];
      if (!head) throw new Error(round.id);
      const result = attend(head.query, head.keys, round.interaction.scale);
      expect(result.uniqueWinner, round.id).toBe(true);
      const action = representativeSuccessAction(round);
      expect(action).toEqual({ type: "attention", tokenIndex: result.winner });
    }
  });

  it("marks only Token Forge implemented and keeps prototypes playable", () => {
    const implemented = games.filter((game) => game.status === "implemented").map((game) => game.id);
    const prototypes = games.filter((game) => game.status === "prototype");
    expect(implemented).toEqual(["token-forge"]);
    expect(prototypes).toHaveLength(12);
    expect(games.some((game) => game.status === "planned")).toBe(false);
    for (const game of games) {
      expect(game.learningObjectives.length).toBeGreaterThan(0);
      expect(game.concepts.length).toBeGreaterThan(0);
      expect(completionAllowed(game.status)).toBe(true);
    }
  });

  it("refuses completion for a planned game", () => {
    const forge = games.find((game) => game.id === "token-forge");
    if (!forge) throw new Error("forge");
    const planned = { ...forge, id: "planned-example", status: "planned" as const };
    const record = blankGameRecord(planned.id);
    record.completedAt = "2026-01-01T00:00:00.000Z";
    for (const round of planned.rounds) {
      record.rounds[round.id] = {
        roundId: round.id,
        bestScore: 10,
        maxScore: 10,
        hintsOnBestAttempt: 0,
        totalHints: 0,
        attempts: 1,
        lastSuccess: true,
      };
    }
    const projected = projectRecord(planned, record, 70);
    expect(completionAllowed("planned")).toBe(false);
    expect(projected.mastered).toBe(false);
    expect(projected.completedAt).toBeNull();
    expect(projected.rounds).toEqual({});
    expect(projected.bestPercent).toBe(0);
  });

  it("requires a complete orientation on every game", () => {
    const sections = ["overview", "whyItMatters", "whatYouWillDo", "howItWorks", "implementationNote", "mastery"] as const;
    for (const game of games) {
      const orientation = game.orientation;
      for (const section of sections) {
        expect(orientation[section].trim().length, `${game.id}.${section}`).toBeGreaterThan(40);
      }
      expect(orientation.learningObjectives.length, game.id).toBeGreaterThanOrEqual(3);
      expect(orientation.learningObjectives.length, game.id).toBeLessThanOrEqual(5);
      expect(orientation.howToPlay.length, game.id).toBeGreaterThanOrEqual(5);
      expect(orientation.howToPlay.every((step) => step.trim().length > 0), game.id).toBe(true);
      expect(orientation.evaluation.whatEarnsPoints.trim().length, game.id).toBeGreaterThan(20);
      expect(orientation.evaluation.hintEffect.toLowerCase(), game.id).toContain("hint");
      expect(orientation.evaluation.masteryThreshold, game.id).toContain("70");
      expect(orientation.implementationNote.toLowerCase(), game.id).toContain("simulation disclosure");
      expect(orientation.progress.rounds, game.id).toHaveLength(game.rounds.length);
      expect(orientation.roundGuides, game.id).toHaveLength(game.rounds.length);
      for (const guide of orientation.roundGuides) {
        expect(guide.goal.trim().length, game.id).toBeGreaterThan(10);
        expect(guide.tradeoff.trim().length, game.id).toBeGreaterThan(10);
        expect(guide.takeaway.trim().length, game.id).toBeGreaterThan(10);
        expect(guide.realSystem.trim().length, game.id).toBeGreaterThan(10);
      }
      expect(orientation.estimatedTime.trim().length, game.id).toBeGreaterThan(4);
      expect(orientation.beforeYouStart.length, game.id).toBeGreaterThanOrEqual(2);
      expect(orientation.selfCheck.length, game.id).toBeGreaterThanOrEqual(2);
      expect(orientation.reflectionPrompts).toHaveLength(2);
    }
    const forge = games.find((game) => game.id === "token-forge");
    if (!forge) throw new Error("forge");
    expect(forge.orientation.overview.toLowerCase()).toContain("token");
    expect(forge.status).toBe("implemented");
    const prototypes = games.filter((game) => game.status === "prototype");
    expect(prototypes).toHaveLength(12);
    const decision = describeDecision(forge.rounds[0]!, { type: "tokenizer", strategyId: "bpe" });
    expect(decision).toContain("BPE");
  });

  it("requires teaching, a guide, and reference status only on Token Forge", () => {
    expect(games).toHaveLength(13);
    for (const game of games) {
      const teaching = game.teaching;
      expect(teaching.whyThisGameExists.length, game.id).toBeGreaterThanOrEqual(2);
      expect(teaching.bloomExplanation.length, game.id).toBeGreaterThan(40);
      expect(teaching.misconceptions.length, game.id).toBeGreaterThanOrEqual(1);
      expect(teaching.assigning.required.length, game.id).toBeGreaterThan(10);
      expect(teaching.scoringNarrative.toLowerCase(), game.id).toContain("hint");
      expect(teaching.transferExplanation.length, game.id).toBeGreaterThan(20);
      expect(teaching.selfEvaluationQuestions.length, game.id).toBeGreaterThanOrEqual(4);
      expect(teaching.roundNotes, game.id).toHaveLength(game.rounds.length);
      expect(teaching.educator.evidencePrompts.length, game.id).toBeGreaterThanOrEqual(3);
      expect(teaching.discussionQuestions.length, game.id).toBeGreaterThanOrEqual(3);
      expect(teaching.nextConnection.path.length, game.id).toBeGreaterThan(5);
      expect(teaching.guide.overview.length, game.id).toBeGreaterThan(40);
      expect(teaching.guide.keyConcepts.length, game.id).toBeGreaterThanOrEqual(4);
      expect(teaching.guide.workedExamples.length, game.id).toBeGreaterThanOrEqual(1);
      expect(teaching.guide.applications.length, game.id).toBeGreaterThan(20);
      expect(teaching.guide.bestPractices.length, game.id).toBeGreaterThanOrEqual(3);
      expect(teaching.guide.pitfalls.length, game.id).toBeGreaterThanOrEqual(3);
      expect(game.furtherReadingIds.length, game.id).toBeGreaterThanOrEqual(1);
      expect(game.orientation.implementationNote.toLowerCase(), game.id).toContain("simulation");
      if (game.id === "token-forge") {
        expect(game.status).toBe("implemented");
        expect(teaching.atAGlance.statusExplanation).toContain("Reference Implementation");
      } else {
        expect(game.status).toBe("prototype");
        expect(teaching.atAGlance.statusExplanation).toContain("Playable Prototype");
        expect(teaching.atAGlance.statusExplanation).not.toContain("Reference Implementation");
      }
    }
  });

  it("rejects a broken educator file with a path", () => {
    expect(() => parseGame({ id: "nope" }, "content/games/nope.ts")).toThrow(/content\/games\/nope.ts/);
    expect(customGame.id).toBe("example-custom-game");
    expect(games.some((game) => game.id === customGame.id)).toBe(false);
  });
});

describe("scoring and gates", () => {
  it("applies the published bands, hint penalty, and 70 percent mastery", () => {
    expect(letterGrade(90)).toBe("A");
    expect(letterGrade(80)).toBe("B");
    expect(letterGrade(70)).toBe("C");
    expect(letterGrade(60)).toBe("D");
    expect(letterGrade(59)).toBe("F");
    expect(applyHintPenalty(10, 1)).toBe(9);
    expect(applyHintPenalty(10, 3)).toBe(7);
    expect(applyHintPenalty(2, 3)).toBe(0);
    expect(gamePercent(35, 5)).toBe(70);
    expect(isMastered(70, 70)).toBe(true);
    expect(isMastered(69, 70)).toBe(false);
    const forge = games[0];
    if (!forge) throw new Error("forge");
    const weak = evaluateRound(forge.rounds[0]!, { type: "tokenizer", strategyId: "unigram" });
    expect(weak.rawPoints).toBeLessThan(10);
  });

  it("unlocks tier 2 after four core games and tier 3 after three systems games", () => {
    const ship = games.find((game) => game.id === "ship-it-simulator");
    const foundry = games.find((game) => game.id === "foundry-arena");
    if (!ship || !foundry) throw new Error("missing gate games");
    const empty = stateWith([]);
    expect(unlockStatus(ship, games, empty).unlocked).toBe(false);
    const four = stateWith(
      ["token-forge", "attention-architect", "context-compression", "promptsmith"].map(masteredRecord),
    );
    expect(unlockStatus(ship, games, four).unlocked).toBe(true);
    expect(unlockStatus(foundry, games, four).unlocked).toBe(false);
    const systems = stateWith(
      ["ship-it-simulator", "agent-architect", "retrieval-lab"].map(masteredRecord),
    );
    expect(unlockStatus(foundry, games, systems).unlocked).toBe(true);
    expect(unlockStatus(foundry, games, empty, true).unlocked).toBe(true);
    expect(unlockStatus(foundry, games, stateWith([], true)).unlocked).toBe(true);
    expect(odysseyConfig.masteryThreshold).toBe(70);
  });
});

describe("local records", () => {
  it("saves, exports, and deletes a memory record", async () => {
    resetMemoryRepository("unit");
    const repository = createMemoryRepository("unit");
    const initial = await repository.load();
    initial.games["token-forge"] = masteredRecord("token-forge");
    await repository.save(initial);
    const loaded = await repository.load();
    expect(loaded.games["token-forge"]?.mastered).toBe(true);
    expect(progressCsv(loaded)).toContain("token-forge");
    await repository.clear();
    const cleared = await repository.load();
    expect(cleared.games["token-forge"]).toBeUndefined();
    expect(progressCsv(cleared)).not.toContain("token-forge");
  });
});

describe("optional modes", () => {
  it("keeps research off and the model provider mocked by default", async () => {
    expect(researchModeEnabled()).toBe(false);
    const provider = createLlmProvider();
    expect(provider.id).toBe("mock");
    const reply = await provider.generate({ prompt: "hello" });
    expect(reply.simulated).toBe(true);
  });
});

describe("repository identity", () => {
  it("uses the public GitHub URL and does not depend on Base44", () => {
    const readme = readFileSync(join(root, "README.md"), "utf8");
    const citation = readFileSync(join(root, "CITATION.cff"), "utf8");
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { name: string; repository: { url: string } };
    expect(pkg.name).toBe("llmodyssey");
    expect(pkg.repository.url).toContain("https://github.com/piaattufts/llmodyssey");
    expect(readme).toContain("git clone https://github.com/piaattufts/llmodyssey.git");
    expect(readme).toContain("cd llmodyssey");
    expect(citation).toContain("https://github.com/piaattufts/llmodyssey");
    expect(readme).not.toContain("your-org");
    expect(readme).not.toContain("example.com");
    expect(readme.toLowerCase()).not.toContain("dr. pia");
    const packageText = readFileSync(join(root, "package.json"), "utf8");
    expect(packageText.toLowerCase()).not.toContain("base44");
    const offenders: string[] = [];
    walk(join(root, "src"), offenders);
    expect(offenders).toEqual([]);
  });
});

function walk(directory: string, offenders: string[]) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) {
      walk(full, offenders);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry)) continue;
    if (readFileSync(full, "utf8").toLowerCase().includes("base44")) offenders.push(full);
  }
}
