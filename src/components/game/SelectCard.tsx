import { cn } from "cn";
import type { ReactNode } from "react";

export function SelectCard({
  selected,
  disabled,
  onClick,
  title,
  description,
  testId,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  testId?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      data-testid={testId}
      className={cn(
        "min-h-11 w-full rounded-xl border px-4 py-3 text-left transition focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border-primary bg-primary/15" : "border-border bg-card hover:border-primary/50",
        disabled && "cursor-not-allowed opacity-70",
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-medium">{title}</span>
        <span className="text-xs font-semibold tracking-wide uppercase">{selected ? "Selected" : "Select"}</span>
      </span>
      {description ? <span className="mt-1 block text-sm text-muted-foreground">{description}</span> : null}
      {children}
    </button>
  );
}
