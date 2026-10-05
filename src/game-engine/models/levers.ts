export interface LeverMetric {
  id: string;
  label: string;
  unit: string;
  direction: "max" | "min";
  limit: number;
}

export interface LeverSpec {
  id: string;
  label: string;
  description: string;
  effects: Record<string, number>;
}

export function projectMetrics(
  baseline: Record<string, number>,
  levers: LeverSpec[],
  enabledIds: string[],
): Record<string, number> {
  const projected: Record<string, number> = { ...baseline };
  for (const lever of levers) {
    if (!enabledIds.includes(lever.id)) continue;
    for (const [metricId, delta] of Object.entries(lever.effects)) {
      projected[metricId] = (projected[metricId] ?? 0) + delta;
    }
  }
  return projected;
}

export function metricSatisfied(metric: LeverMetric, value: number): boolean {
  if (metric.direction === "max") return value <= metric.limit + 1e-9;
  return value + 1e-9 >= metric.limit;
}

export function allMetricsSatisfied(
  metrics: LeverMetric[],
  projected: Record<string, number>,
): boolean {
  return metrics.every((metric) => metricSatisfied(metric, projected[metric.id] ?? 0));
}
