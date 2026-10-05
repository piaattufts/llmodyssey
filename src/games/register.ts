import { definition as agentArchitect } from "./agent-architect/index.ts";
import { definition as alignmentArena } from "./alignment-arena/index.ts";
import { definition as attentionArchitect } from "./attention-architect/index.ts";
import { definition as contextCompression } from "./context-compression/index.ts";
import { definition as foundryArena } from "./foundry-arena/index.ts";
import { definition as gradientPlayground } from "./gradient-playground/index.ts";
import { definition as prodopsGauntlet } from "./prodops-gauntlet/index.ts";
import { definition as promptsmith } from "./promptsmith/index.ts";
import { definition as reasoningReactor } from "./reasoning-reactor/index.ts";
import { definition as retrievalLab } from "./retrieval-lab/index.ts";
import { definition as shipItSimulator } from "./ship-it-simulator/index.ts";
import { definition as systemComposer } from "./system-composer/index.ts";
import { definition as tokenForge } from "./token-forge/index.ts";

export const registeredGames = [
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
