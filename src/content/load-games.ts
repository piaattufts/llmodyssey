import agentArchitect from "@content/games/agent-architect.ts";
import alignmentArena from "@content/games/alignment-arena.ts";
import attentionArchitect from "@content/games/attention-architect.ts";
import contextCompression from "@content/games/context-compression.ts";
import foundryArena from "@content/games/foundry-arena.ts";
import gradientPlayground from "@content/games/gradient-playground.ts";
import prodopsGauntlet from "@content/games/prodops-gauntlet.ts";
import promptsmith from "@content/games/promptsmith.ts";
import reasoningReactor from "@content/games/reasoning-reactor.ts";
import retrievalLab from "@content/games/retrieval-lab.ts";
import shipItSimulator from "@content/games/ship-it-simulator.ts";
import systemComposer from "@content/games/system-composer.ts";
import tokenForge from "@content/games/token-forge.ts";
import { parseGame, type GameDefinition } from "../game-engine/schema.ts";

const sources: Array<[string, unknown]> = [
  ["content/games/token-forge.ts", tokenForge],
  ["content/games/attention-architect.ts", attentionArchitect],
  ["content/games/context-compression.ts", contextCompression],
  ["content/games/promptsmith.ts", promptsmith],
  ["content/games/gradient-playground.ts", gradientPlayground],
  ["content/games/reasoning-reactor.ts", reasoningReactor],
  ["content/games/alignment-arena.ts", alignmentArena],
  ["content/games/ship-it-simulator.ts", shipItSimulator],
  ["content/games/agent-architect.ts", agentArchitect],
  ["content/games/retrieval-lab.ts", retrievalLab],
  ["content/games/system-composer.ts", systemComposer],
  ["content/games/prodops-gauntlet.ts", prodopsGauntlet],
  ["content/games/foundry-arena.ts", foundryArena],
];

export function loadGames(): GameDefinition[] {
  const games = sources.map(([source, value]) => parseGame(value, source));
  if (games.length !== 13) {
    throw new Error(`LLM Odyssey expected 13 games and parsed ${games.length}.`);
  }
  return games;
}

export const games = loadGames();

export function gameById(id: string): GameDefinition | undefined {
  return games.find((game) => game.id === id);
}
