import { Link } from "react-router";
import { researchModeEnabled } from "../../research/mode.ts";

export function FeedbackPage({ basePath }: { basePath: string }) {
  const research = researchModeEnabled();
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Feedback</h1>
        <p className="max-w-3xl text-lg">
          Tell us whether a game, a guide, or an explanation helped you learn. This page is optional. It does not change scores, mastery, or which game you can open.
        </p>
      </header>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What is requested</h2>
        <p>
          Educational feedback: which game you used, what was clear, what was confusing, and whether you could explain the idea afterward. A reflection you already saved on a game completion screen stays in your local progress record.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What is stored</h2>
        <p>
          The default site does not upload this form. There is no required account. If you want a human to read a comment, send it by email or a GitHub issue. Anything you type below stays in this browser until you clear it.
        </p>
        <p>Research mode is {research ? "enabled in this build" : "disabled in this build"}. Public visitors are not research participants. Optional research consent, when an institution turns it on, is separate from this educational note.</p>
      </section>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const note = {
            game: String(data.get("game") ?? ""),
            comment: String(data.get("comment") ?? ""),
            savedAt: new Date().toISOString(),
          };
          localStorage.setItem("llmodyssey-feedback-note", JSON.stringify(note));
          event.currentTarget.reset();
          const status = document.getElementById("feedback-status");
          if (status) status.textContent = "Saved in this browser only. Nothing was uploaded.";
        }}
      >
        <label className="block space-y-1">
          <span className="font-medium">Which game or page?</span>
          <input name="game" className="min-h-11 w-full rounded-lg border border-border bg-background px-3" />
        </label>
        <label className="block space-y-1">
          <span className="font-medium">What should an instructor or author know?</span>
          <textarea name="comment" className="min-h-32 w-full rounded-lg border border-border bg-background p-3" />
        </label>
        <button type="submit" className="min-h-11 rounded-lg bg-primary px-4 text-primary-foreground">
          Save feedback locally
        </button>
        <p id="feedback-status" role="status" />
      </form>
      <p>
        <Link className="underline" to={`${basePath}/educator`}>
          Educator Guide
        </Link>
        {" · "}
        <Link className="underline" to={`${basePath || "/"}`}>
          AI Games Arcade
        </Link>
      </p>
    </div>
  );
}
