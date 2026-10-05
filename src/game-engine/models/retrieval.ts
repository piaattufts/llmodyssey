export function cosine(left: number[], right: number[]): number {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    const a = left[index] ?? 0;
    const b = right[index] ?? 0;
    dot += a * b;
    leftNorm += a * a;
    rightNorm += b * b;
  }
  if (leftNorm === 0 || rightNorm === 0) return 0;
  return dot / Math.sqrt(leftNorm * rightNorm);
}

export function keywordOverlap(query: string[], keywords: string[]): number {
  if (query.length === 0) return 0;
  const known = new Set(keywords.map((keyword) => keyword.toLowerCase()));
  const hits = query.filter((keyword) => known.has(keyword.toLowerCase())).length;
  return hits / query.length;
}

export type RetrievalMethod = "keyword" | "vector" | "hybrid";

export interface RetrievalChunk {
  id: string;
  title: string;
  text: string;
  vector: number[];
  keywords: string[];
  metadata: Record<string, string>;
  relevant: boolean;
}

export interface RankedChunk {
  chunk: RetrievalChunk;
  score: number;
}

export function chunkScore(
  method: RetrievalMethod,
  queryVector: number[],
  queryKeywords: string[],
  chunk: RetrievalChunk,
): number {
  const vector = Math.max(0, cosine(queryVector, chunk.vector));
  const lexical = keywordOverlap(queryKeywords, chunk.keywords);
  if (method === "vector") return vector;
  if (method === "keyword") return lexical;
  return 0.5 * vector + 0.5 * lexical;
}

export function rankChunks(input: {
  method: RetrievalMethod;
  queryVector: number[];
  queryKeywords: string[];
  chunks: RetrievalChunk[];
  topK: number;
  filter: { field: string; value: string } | null;
  useFilter: boolean;
}): RankedChunk[] {
  const pool = input.chunks.filter((chunk) => {
    if (!input.useFilter || !input.filter) return true;
    return chunk.metadata[input.filter.field] === input.filter.value;
  });
  const ranked = pool
    .map((chunk) => ({
      chunk,
      score: chunkScore(input.method, input.queryVector, input.queryKeywords, chunk),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.chunk.id.localeCompare(right.chunk.id);
    });
  return ranked.slice(0, input.topK);
}

export function retrievalQuality(ranked: RankedChunk[], chunks: RetrievalChunk[]): {
  precision: number;
  recall: number;
} {
  const relevantTotal = chunks.filter((chunk) => chunk.relevant).length;
  const relevantHit = ranked.filter((row) => row.chunk.relevant).length;
  const precision = ranked.length === 0 ? 0 : relevantHit / ranked.length;
  const recall = relevantTotal === 0 ? 0 : relevantHit / relevantTotal;
  return { precision, recall };
}
