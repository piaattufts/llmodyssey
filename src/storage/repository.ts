import { openDB } from "idb";
import { emptyLearnerState, type LearnerState } from "./types.ts";

export interface LearnerRepository {
  load(): Promise<LearnerState>;
  save(state: LearnerState): Promise<void>;
  clear(): Promise<void>;
}

const memoryStores = new Map<string, LearnerState>();

export function createMemoryRepository(namespace: string, initial?: LearnerState): LearnerRepository {
  if (!memoryStores.has(namespace)) {
    memoryStores.set(namespace, initial ?? emptyLearnerState(sessionStorageId(namespace)));
  }
  return {
    async load() {
      return structuredClone(memoryStores.get(namespace) ?? emptyLearnerState(sessionStorageId(namespace)));
    },
    async save(state) {
      memoryStores.set(namespace, structuredClone(state));
    },
    async clear() {
      const sessionId = sessionStorageId(namespace);
      memoryStores.set(namespace, emptyLearnerState(sessionId));
      removeSessionId(namespace);
    },
  };
}

export function resetMemoryRepository(namespace: string): void {
  memoryStores.delete(namespace);
}

export function createRepository(namespace: string): LearnerRepository {
  return new BrowserRepository(namespace);
}

class BrowserRepository implements LearnerRepository {
  private mode: "idb" | "local" | "unknown" = "unknown";
  private readonly namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  async load(): Promise<LearnerState> {
    const fromIdb = await this.tryIdb("load");
    if (fromIdb) return fromIdb;
    const fallback = readFallback(this.namespace);
    if (fallback) return fallback;
    return emptyLearnerState(sessionStorageId(this.namespace));
  }

  async save(state: LearnerState): Promise<void> {
    writeFallback(this.namespace, state);
    await this.tryIdb("save", state);
  }

  async clear(): Promise<void> {
    removeFallback(this.namespace);
    removeSessionId(this.namespace);
    await this.tryIdb("clear");
  }

  private async tryIdb(op: "load" | "save" | "clear", state?: LearnerState): Promise<LearnerState | null> {
    if (this.mode === "local" || typeof indexedDB === "undefined") {
      this.mode = "local";
      return null;
    }
    try {
      const db = await openDB(`llmodyssey-${this.namespace}`, 1, {
        upgrade(database) {
          if (!database.objectStoreNames.contains("learner")) {
            database.createObjectStore("learner");
          }
        },
      });
      this.mode = "idb";
      if (op === "load") {
        const stored = await db.get("learner", "state");
        return stored ? (stored as LearnerState) : null;
      }
      if (op === "save" && state) {
        await db.put("learner", state, "state");
        return state;
      }
      if (op === "clear") {
        await db.delete("learner", "state");
      }
      return null;
    } catch {
      this.mode = "local";
      return null;
    }
  }
}

function fallbackKey(namespace: string): string {
  return `llmodyssey.fallback.${namespace}`;
}

function sessionKey(namespace: string): string {
  return namespace === "demo" ? "llmodyssey.demo.sessionId" : "llmodyssey.sessionId";
}

export function sessionStorageId(namespace: string): string {
  if (typeof localStorage === "undefined") return `session-${namespace}`;
  const existing = localStorage.getItem(sessionKey(namespace));
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(sessionKey(namespace), created);
  return created;
}

function removeSessionId(namespace: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(sessionKey(namespace));
}

function readFallback(namespace: string): LearnerState | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(fallbackKey(namespace));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LearnerState;
  } catch {
    return null;
  }
}

function writeFallback(namespace: string, state: LearnerState): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(fallbackKey(namespace), JSON.stringify(state));
}

function removeFallback(namespace: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(fallbackKey(namespace));
}
