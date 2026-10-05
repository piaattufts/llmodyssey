import { odysseyConfig } from "../game-engine/config.ts";

export function researchModeEnabled(): boolean {
  const env = import.meta.env.VITE_RESEARCH_MODE;
  if (env === "true") return true;
  if (env === "false") return false;
  return odysseyConfig.researchMode;
}

export function runtimeWarnings(): string[] {
  const warnings: string[] = [];
  const storage = import.meta.env.VITE_STORAGE_MODE;
  if (storage === "supabase" && !import.meta.env.VITE_SUPABASE_URL) {
    warnings.push("Supabase storage was requested, but VITE_SUPABASE_URL is empty. Learner data stays in this browser.");
  }
  const provider = import.meta.env.VITE_LLM_PROVIDER;
  if (provider && provider !== "mock" && !import.meta.env.VITE_LLM_PROXY_URL) {
    warnings.push("A live model provider was requested without VITE_LLM_PROXY_URL. Games continue with built-in exercises.");
  }
  if (researchModeEnabled() && storage === "supabase" && !import.meta.env.VITE_SUPABASE_URL) {
    warnings.push("Research mode is on, but the optional analytics backend is not configured. Events stay on this browser.");
  }
  return warnings;
}
