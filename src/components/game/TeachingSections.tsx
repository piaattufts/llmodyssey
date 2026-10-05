import { referenceById } from "@content/references.ts";
import { learnerDifficultyLabel, type GameDefinition } from "../../game-engine/schema.ts";
import { EducationalDiagram } from "./Diagrams.tsx";

export function AtAGlance({ game }: { game: GameDefinition }) {
  const glance = game.teaching.atAGlance;
  const rows = [
    ["Learning tier", glance.tierExplanation],
    ["Recommended level", glance.recommendedLevel],
    ["Estimated activity time", glance.timeExplanation],
    ["Activity type", glance.activityType],
    ["Mastery target", glance.masteryExplanation],
    ["Current implementation", glance.statusExplanation],
    ["Primary concepts", game.concepts.join(", ")],
    ["Difficulty", `${learnerDifficultyLabel(game.difficulty)}. ${game.teaching.difficultyExplanation}`],
  ];
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">At a Glance</h2>
      <dl className="space-y-2">
        {rows.map(([term, detail]) => (
          <div key={term}>
            <dt className="font-medium">{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function WhyThisGame({ game }: { game: GameDefinition }) {
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">Why This Game Exists</h2>
      {game.teaching.whyThisGameExists.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}

export function BloomExplanation({ game }: { game: GameDefinition }) {
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">Level of Learning</h2>
      <p>
        <strong>Bloom's taxonomy. </strong>
        {game.bloomLevels.map((level) => level[0]?.toUpperCase() + level.slice(1)).join(" → ")}
      </p>
      <p>{game.teaching.bloomExplanation}</p>
    </section>
  );
}

export function MisconceptionPanel({ game }: { game: GameDefinition }) {
  return (
    <section className="space-y-3 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">Common Misconceptions This Game Addresses</h2>
      {game.teaching.misconceptions.map((item) => (
        <div key={item.statement} className="space-y-1">
          <p>{item.statement}</p>
          <p className="text-sm">
            <strong>How the activity addresses it. </strong>
            {item.howTheGameAddressesIt}
          </p>
        </div>
      ))}
    </section>
  );
}

export function AssigningPanel({ game }: { game: GameDefinition }) {
  const assigning = game.teaching.assigning;
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">Before Assigning This Game</h2>
      <p>
        <strong>Required. </strong>
        {assigning.required}
      </p>
      <p>
        <strong>Helpful, not required. </strong>
        {assigning.helpful}
      </p>
      <p>
        <strong>Not required. </strong>
        {assigning.notRequired}
      </p>
    </section>
  );
}

export function ScoringNarrative({ game }: { game: GameDefinition }) {
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">How Scoring Works</h2>
      <p>{game.teaching.scoringNarrative}</p>
      <p>{game.teaching.transferExplanation}</p>
    </section>
  );
}

export function IllustratedGuide({ game }: { game: GameDefinition }) {
  const guide = game.teaching.guide;
  const refs = game.furtherReadingIds.map((id) => referenceById(id)).filter((item) => item !== undefined);
  return (
    <section className="space-y-4 rounded-xl border border-border p-4" data-testid="concept-guide-body">
      <h2 className="text-xl font-semibold">{guide.title}</h2>
      <p className="text-sm text-muted-foreground">Complete illustrated guide</p>
      <EducationalDiagram gameId={game.id} />
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Overview</h3>
        <p>{guide.overview}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Key Concepts</h3>
        <dl className="space-y-2">
          {guide.keyConcepts.map((concept) => (
            <div key={concept.term}>
              <dt className="font-medium">{concept.term}</dt>
              <dd>{concept.explanation}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">How It Works</h3>
        <p>{guide.howItWorks}</p>
        <p className="text-sm">{guide.visualNote}</p>
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Worked Examples</h3>
        {guide.workedExamples.map((example) => (
          <article key={example.title} className="space-y-1">
            <h4 className="font-medium">{example.title}</h4>
            <p className="text-sm text-muted-foreground">{example.label}</p>
            <p>{example.body}</p>
          </article>
        ))}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Real-World Applications</h3>
        <p>{guide.applications}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Engineering Trade-offs</h3>
        <p>{guide.tradeoffs}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">When to Use This</h3>
        <p>{guide.whenToUse}</p>
        <h3 className="text-lg font-medium">When Not to Use This</h3>
        <p>{guide.whenNotToUse}</p>
        <h3 className="text-lg font-medium">Production Considerations</h3>
        <p>{guide.productionConsiderations}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Best Practices</h3>
        <ul className="list-disc space-y-1 pl-5">
          {guide.bestPractices.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Common Pitfalls</h3>
        <ul className="list-disc space-y-1 pl-5">
          {guide.pitfalls.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Check Your Understanding</h3>
        <ul className="list-disc space-y-1 pl-5">
          {guide.checkYourUnderstanding.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Further Reading</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {refs.map((reference) => (
            <li key={reference.id}>
              <a className="underline" href={reference.url}>
                {reference.authors} ({reference.year}). {reference.title}.
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function EducatorNotes({ game }: { game: GameDefinition }) {
  const notes = game.teaching.educator;
  return (
    <details className="rounded-xl border border-border p-4" data-testid="educator-notes">
      <summary className="cursor-pointer text-lg font-semibold">For Educators</summary>
      <div className="mt-3 space-y-3">
        <h3 className="font-medium">Why teach this?</h3>
        <p>{notes.whyTeach}</p>
        <h3 className="font-medium">What students actually do</h3>
        <p>{notes.whatStudentsDo}</p>
        <h3 className="font-medium">What evidence of learning should I look for?</h3>
        <p>A correct selection is not sufficient evidence. Look for whether students can justify the decision and transfer it.</p>
        <ul className="list-disc space-y-1 pl-5">
          {notes.evidencePrompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
        <h3 className="font-medium">Suggested classroom use</h3>
        <p>
          <strong>Before class. </strong>
          {notes.beforeClass}
        </p>
        <p>
          <strong>During class. </strong>
          {notes.duringClass}
        </p>
        <p>
          <strong>After class. </strong>
          {notes.afterClass}
        </p>
        <h3 className="font-medium">Optional assignment</h3>
        <p>{notes.assignment}</p>
        <h3 className="font-medium">Possible assignment extension</h3>
        <p>{notes.extension}</p>
        <h3 className="font-medium">Discussion questions</h3>
        <ul className="list-disc space-y-1 pl-5">
          {game.teaching.discussionQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
        <h3 className="font-medium">Related games</h3>
        <p>{notes.relatedGames}</p>
      </div>
    </details>
  );
}

export function NextConnection({ game }: { game: GameDefinition }) {
  const next = game.teaching.nextConnection;
  return (
    <section className="space-y-2 rounded-xl border border-border p-4">
      <h2 className="text-lg font-semibold">Where This Leads Next</h2>
      <p className="font-medium">{next.headline}</p>
      <p>{next.body}</p>
      <p className="text-sm">
        <strong>Path. </strong>
        {next.path}
      </p>
    </section>
  );
}
