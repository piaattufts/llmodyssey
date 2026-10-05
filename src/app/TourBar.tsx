import { Link, useSearchParams } from "react-router";
import { tourSteps } from "./copy.ts";

export function TourBar() {
  const [params] = useSearchParams();
  const current = Number(params.get("tour") ?? "0");
  const step = tourSteps.find((item) => item.id === current);
  if (!step) {
    return (
      <section className="space-y-2 rounded-xl border border-border p-4" aria-label="Guided tour">
        <h2 className="text-lg font-semibold">Guided tour</h2>
        <p className="text-sm">Eleven short stops, about five to eight minutes. You can leave at any step. The tour does not call a model API.</p>
        <Link className="inline-flex min-h-11 items-center underline" to="/demo?tour=1">
          Start Guided Tour
        </Link>
      </section>
    );
  }
  const next = tourSteps.find((item) => item.id === step.id + 1);
  const previous = tourSteps.find((item) => item.id === step.id - 1);
  return (
    <section className="rounded-xl border border-primary/40 bg-primary/10 p-4" aria-label="Guided tour">
      <p className="text-sm text-muted-foreground">
        Guided tour · step {step.id} of {tourSteps.length}
      </p>
      <h2 className="text-lg font-semibold">{step.title}</h2>
      <p className="mt-1 text-sm">{step.body}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {previous ? (
          <Link className="inline-flex min-h-11 items-center underline" to={`${previous.path}?tour=${previous.id}`}>
            Back
          </Link>
        ) : null}
        {next ? (
          <Link className="inline-flex min-h-11 items-center underline" to={`${next.path}?tour=${next.id}`}>
            Next
          </Link>
        ) : (
          <Link className="inline-flex min-h-11 items-center underline" to="/demo">
            Finish tour
          </Link>
        )}
        <Link className="inline-flex min-h-11 items-center underline" to="/demo">
          Exit Tour
        </Link>
      </div>
    </section>
  );
}
