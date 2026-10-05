export type SelfMark = "understand" | "practice";

const KEY = "llmodyssey-self-evaluation";

type Store = Record<string, Record<string, SelfMark>>;

function readStore(): Store {
  if (typeof localStorage === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Store;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function readSelfMarks(gameId: string): Record<string, SelfMark> {
  return readStore()[gameId] ?? {};
}

export function writeSelfMark(gameId: string, objective: string, mark: SelfMark): Record<string, SelfMark> {
  const store = readStore();
  const next = { ...(store[gameId] ?? {}), [objective]: mark };
  store[gameId] = next;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(store));
  }
  return next;
}
