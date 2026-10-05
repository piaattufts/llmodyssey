import { cn } from "cn";

export function MetricList({
  lines,
}: {
  lines: Array<{ label: string; value: string; tone: "good" | "poor" | "neutral" }>;
}) {
  if (lines.length === 0) return null;
  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {lines.map((line) => (
        <div key={line.label} className="rounded-lg border border-border bg-background/40 px-3 py-2">
          <dt className="text-xs text-muted-foreground">{line.label}</dt>
          <dd className={cn("text-sm font-medium", line.tone === "good" && "text-emerald-200", line.tone === "poor" && "text-rose-200")}>
            <span className="sr-only">{line.tone === "good" ? "Within target. " : line.tone === "poor" ? "Outside target. " : ""}</span>
            {line.value}
            {line.tone === "good" ? " · met" : line.tone === "poor" ? " · not met" : ""}
          </dd>
        </div>
      ))}
    </dl>
  );
}
