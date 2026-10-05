import agentArchitect from "../games/agent-architect.ts";
import alignmentArena from "../games/alignment-arena.ts";
import attentionArchitect from "../games/attention-architect.ts";
import contextCompression from "../games/context-compression.ts";
import foundryArena from "../games/foundry-arena.ts";
import gradientPlayground from "../games/gradient-playground.ts";
import prodopsGauntlet from "../games/prodops-gauntlet.ts";
import promptsmith from "../games/promptsmith.ts";
import reasoningReactor from "../games/reasoning-reactor.ts";
import retrievalLab from "../games/retrieval-lab.ts";
import shipItSimulator from "../games/ship-it-simulator.ts";
import systemComposer from "../games/system-composer.ts";
import tokenForge from "../games/token-forge.ts";

const sources = [
  tokenForge,
  attentionArchitect,
  contextCompression,
  promptsmith,
  gradientPlayground,
  reasoningReactor,
  alignmentArena,
  shipItSimulator,
  agentArchitect,
  retrievalLab,
  systemComposer,
  prodopsGauntlet,
  foundryArena,
];

export const conceptGuides = sources.map((game) => ({
  id: game.id,
  title: game.title,
  purpose: game.purpose,
  concepts: game.concepts,
  misconception: game.misconception,
  furtherReadingIds: game.furtherReadingIds,
  implementationLabel: game.implementation.label,
}));
