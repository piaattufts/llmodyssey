import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-semibold">That page is not in LLM Odyssey</h1>
      <p className="mt-3">The course, progress, educator view, demo, and the thirteen game routes are linked from the home page.</p>
      <Link className="mt-6 inline-flex min-h-11 items-center underline" to="/">
        Back to the course
      </Link>
    </main>
  );
}
