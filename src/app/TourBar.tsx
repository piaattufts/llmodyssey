import { Link, useSearchParams } from "react-router";
import { tourSteps } from "./copy.ts";

export function TourBar() {
  const [params] = useSearchParams();
  const current = Number(params.get("tour") ?? "0");
  const step = tourSteps.find((item) => item.id === current);
  if (!step) {
    return (
      <p className="rounded-xl border border-border p-3 text-sm">
        <Link className="underline" to="/demo?tour=1">
          Start the guided tour
        </Link>
        . It is eight short stops and is meant to run in about five to eight minutes.
      </p>
    );
  }
  const next = tourSteps.find((item) => item.id === step.id + 1);
  return (
    <section className="rounded-xl border border-primary/40 bg-primary/10 p-4" aria-label="Guided tour">
      <p className="text-sm text-muted-foreground">
        Guided tour · step {step.id} of {tourSteps.length}
      </p>
      <h2 className="text-lg font-semibold">{step.title}</h2>
      <p className="mt-1 text-sm">{step.body}</p>
      <p className="mt-3">
        {next ? (
          <Link className="inline-flex min-h-11 items-center underline" to={`${next.path}?tour=${next.id}`}>
            Next: {next.title}
          </Link>
        ) : (
          <Link className="inline-flex min-h-11 items-center underline" to="/demo">
            End tour
          </Link>
        )}
      </p>
    </section>
  );
}
