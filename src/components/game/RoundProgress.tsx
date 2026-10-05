import { Progress } from "@/components/ui/progress.tsx";

export function RoundProgress({ value, label }: { value: number; label: string }) {
  return <Progress value={value} aria-label={label} />;
}
