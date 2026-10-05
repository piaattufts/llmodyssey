import { useState } from "react";
import { Link, useParams } from "react-router";
import { assessmentItems, scoreAssessment } from "@content/assessments/index.ts";
import { useLearner } from "../../hooks/use-learner.tsx";

export function AssessmentPage({ basePath }: { basePath: string }) {
  const params = useParams();
  const kind = params.kind === "pre" || params.kind === "post" ? params.kind : null;
  const learner = useLearner();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  if (!kind) return <p role="alert">Use the pre or post assessment.</p>;
  if (learner.loading || !learner.state) return <p>Loading the local record…</p>;
  const existing = learner.state.assessments[kind];
  const score = scoreAssessment(answers);

  async function submit() {
    const started = Date.now();
    await learner.update((state) => ({
      ...state,
      assessments: {
        ...state.assessments,
        [kind!]: {
          kind: kind!,
          scorePercent: scoreAssessment(answers),
          answers,
          completedAt: new Date().toISOString(),
          timeSpentMs: started,
        },
      },
    }));
    setSubmitted(true);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{kind === "pre" ? "Pre-assessment" : "Post-assessment"}</h1>
        <p>
          This check exists so you can see what you already know before the games, or what you can answer after them. Plan on about 10 to 15 minutes. It measures recognition of ideas the course names. It does not unlock, lock, or grade the games. Your game progression is independent of this score.
        </p>
        <p>
          Answers stay in this browser’s local record until you reset that record. The public site does not enroll you in a study. Research upload is a separate, optional mode and is off unless a build explicitly enables it.
        </p>
        <p>Ten questions. The score is the percent correct. This is a knowledge check, not a certified exam. {existing ? `A previous ${kind} score of ${existing.scorePercent}% is already stored. Submitting replaces it.` : "Nothing is stored until you submit."}</p>
      </header>
      <ol className="space-y-6">
        {assessmentItems.map((item, index) => (
          <li key={item.id} className="space-y-2">
            <p className="font-medium">{index + 1}. {item.prompt}</p>
            <p className="text-sm text-muted-foreground">{item.domain}</p>
            <div className="space-y-2">
              {item.choices.map((choice) => {
                const selected = answers[item.id] === choice.id;
                const show = submitted;
                const correct = choice.id === item.correctChoiceId;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    aria-pressed={selected}
                    className="block min-h-11 w-full rounded-lg border border-border px-3 py-2 text-left aria-pressed:border-primary aria-pressed:bg-primary/10"
                    onClick={() => setAnswers({ ...answers, [item.id]: choice.id })}
                  >
                    {choice.label}
                    {selected ? " · selected" : ""}
                    {show && correct ? " · answer key" : ""}
                    {show && selected && !correct ? " · not the keyed answer" : ""}
                  </button>
                );
              })}
            </div>
            {submitted ? <p className="text-sm">{item.explanation}</p> : null}
          </li>
        ))}
      </ol>
      <button type="button" className="min-h-11 rounded-lg bg-primary px-4 text-primary-foreground" onClick={() => void submit()}>
        Submit {kind}-assessment
      </button>
      {submitted ? <p role="status">Score {score}%. The explanation under each item is the answer key.</p> : null}
      <p>
        <Link className="underline" to={basePath || "/"}>Back to the course</Link>
      </p>
    </div>
  );
}
