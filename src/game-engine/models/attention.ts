export function dot(left: number[], right: number[]): number {
  let sum = 0;
  for (let index = 0; index < left.length; index += 1) {
    sum += (left[index] ?? 0) * (right[index] ?? 0);
  }
  return sum;
}

export function softmax(values: number[]): number[] {
  if (values.length === 0) return [];
  const peak = Math.max(...values);
  const shifted = values.map((value) => Math.exp(value - peak));
  const total = shifted.reduce((sum, value) => sum + value, 0);
  return shifted.map((value) => value / total);
}

export interface AttentionHeadResult {
  scores: number[];
  weights: number[];
  winner: number;
  uniqueWinner: boolean;
}

export function attend(query: number[], keys: number[][], scale: number): AttentionHeadResult {
  const scores = keys.map((key) => dot(query, key) / scale);
  const weights = softmax(scores);
  let winner = 0;
  let uniqueWinner = true;
  weights.forEach((weight, index) => {
    const best = weights[winner] ?? 0;
    if (weight > best + 1e-9) {
      winner = index;
      uniqueWinner = true;
    } else if (index !== winner && Math.abs(weight - best) <= 1e-9) {
      uniqueWinner = false;
    }
  });
  return { scores, weights, winner, uniqueWinner };
}
