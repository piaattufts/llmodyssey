import { Menu } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useSearchParams } from "react-router";
import { games } from "../content/load-games.ts";
import { odysseyConfig } from "../game-engine/config.ts";
import { courseGames, recommendedNext } from "../game-engine/prerequisites.ts";
import { releaseStatusLabel } from "../game-engine/schema.ts";
import { useLearner } from "../hooks/use-learner.tsx";
import { researchModeEnabled, runtimeWarnings } from "../research/mode.ts";
import { citation, repository } from "../site.ts";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx";
import { ResearchConsent } from "./ResearchConsent.tsx";
import { tierCopy } from "./copy.ts";
import { TourBar } from "./TourBar.tsx";

export function AppShell({ basePath, mode }: { basePath: string; mode: "learner" | "demo" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const warnings = runtimeWarnings();
  const links = [
    { to: basePath || "/", label: "AI Games Arcade", end: true, group: "Learn" },
    { to: `${basePath}/guide`, label: "Concept Index", end: false, group: "Learn" },
    { to: `${basePath}/progress`, label: "Progress", end: false, group: "Learn" },
    { to: `${basePath}/play/foundry-arena`, label: "The Foundry", end: false, group: "Apply" },
    { to: `${basePath}/assess/pre`, label: "Pre-assessment", end: false, group: "Assess" },
    { to: `${basePath}/assess/post`, label: "Post-assessment", end: false, group: "Assess" },
    { to: `${basePath}/feedback`, label: "Feedback", end: false, group: "Assess" },
    { to: `${basePath}/educator`, label: "Educator Guide", end: false, group: "Teach" },
    mode === "demo"
      ? { to: "/", label: "Leave demo", end: true, group: "Demo" }
      : { to: "/demo", label: "Demo Mode", end: true, group: "Demo" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2" href="#main">
        Skip to content
      </a>
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        <aside className="hidden border-r border-border md:block">
          <Brand />
          <nav aria-label="Course" className="flex flex-col gap-1 p-3">
            <NavGroups links={links} />
            <Journey basePath={basePath} />
            <GameLinks basePath={basePath} />
          </nav>
        </aside>
        <div>
          <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3" aria-label="Open navigation">
                <Menu aria-hidden="true" />
                Menu
              </SheetTrigger>
              <SheetContent side="left" className="w-72 sm:max-w-xs">
                <SheetHeader>
                  <SheetTitle>{odysseyConfig.title}</SheetTitle>
                </SheetHeader>
                <nav aria-label="Course" className="flex flex-col gap-1 px-3">
                  <NavGroups links={links} onNavigate={() => setMenuOpen(false)} />
                  <Journey basePath={basePath} />
                  <GameLinks basePath={basePath} onNavigate={() => setMenuOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>
            <p className="font-semibold">{odysseyConfig.title}</p>
          </header>
          {warnings.length > 0 ? (
            <div className="border-b border-border bg-muted px-4 py-2 text-sm" role="status">
              {warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          ) : null}
          {mode === "demo" ? <DemoBanner /> : null}
          <main id="main" className="mx-auto max-w-5xl px-4 py-6">
            <Outlet />
          </main>
          <footer className="border-t border-border px-4 py-6 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">LLM Odyssey</p>
            <p>Created by {citation.author}</p>
            <p>Tufts Institute for Artificial Intelligence</p>
            <p>Tufts University</p>
            <p className="mt-2 flex flex-wrap gap-3">
              <a className="underline" href={repository.url}>Project</a>
              <a className="underline" href={repository.url}>GitHub</a>
              <a className="underline" href={`${repository.url}/blob/main/CITATION.cff`}>Citation</a>
              <a className="underline" href={citation.arxivUrl}>Research paper</a>
              <a className="underline" href={`mailto:${citation.email}`}>Contact</a>
            </p>
          </footer>
        </div>
      </div>
      {researchModeEnabled() ? <ResearchConsent /> : null}
    </div>
  );
}

function Brand() {
  return (
    <div className="border-b border-border p-4">
      {odysseyConfig.logoSrc ? (
        <img src={odysseyConfig.logoSrc} alt={odysseyConfig.institution || "Institution logo"} className="mb-3 h-10 w-auto" />
      ) : null}
      <p className="text-lg font-semibold">{odysseyConfig.title}</p>
      {odysseyConfig.institution ? <p className="text-sm text-muted-foreground">{odysseyConfig.institution}</p> : null}
      <p className="mt-2 text-xs text-muted-foreground">{odysseyConfig.tagline}</p>
    </div>
  );
}

function NavGroups({
  links,
  onNavigate,
}: {
  links: Array<{ to: string; label: string; end: boolean; group: string }>;
  onNavigate?: () => void;
}) {
  const groups = ["Learn", "Apply", "Assess", "Teach", "Demo"];
  return (
    <>
      {groups.map((group) => (
        <div key={group} className="mb-2">
          <p className="px-3 pt-2 text-xs font-medium tracking-wide text-muted-foreground">{group}</p>
          {links
            .filter((link) => link.group === group)
            .map((link) => (
              <SideLink key={link.label} to={link.to} end={link.end} onClick={onNavigate}>
                {link.label}
              </SideLink>
            ))}
        </div>
      ))}
    </>
  );
}

function Journey({ basePath }: { basePath: string }) {
  const learner = useLearner();
  const visible = courseGames(games);
  const state = learner.state;
  const mastered = state ? visible.filter((game) => state.games[game.id]?.mastered).length : 0;
  const next = state ? recommendedNext(visible, state, learner.bypassLocks) : null;
  return (
    <div className="mt-2 rounded-lg border border-border p-3 text-sm">
      <p className="text-xs font-medium tracking-wide text-muted-foreground">Your journey</p>
      <p className="mt-1">{state ? `${mastered} of ${visible.length} games at the mastery threshold` : "Progress appears when the local record loads."}</p>
      <p className="text-muted-foreground">{next ? `Current game: ${next.title}` : "Review Progress for the full record."}</p>
      <NavLink className="mt-1 inline-flex min-h-11 items-center underline" to={`${basePath}/progress`}>
        Open the progress record
      </NavLink>
    </div>
  );
}

function DemoBanner() {
  const [params] = useSearchParams();
  const onTour = params.has("tour");
  return (
    <div className="space-y-3 border-b border-border bg-primary/10 px-4 py-3 text-sm">
      <h2 className="text-base font-semibold">About Demo Mode</h2>
      <p>
        Demo mode uses a separate local record. It does not call a model API, and it does not change the learner record.
      </p>
      <p>
        Demo Mode is intended for instructors, reviewers, workshops, and conference demonstrations. It allows you to explore LLM Odyssey without changing a learner&apos;s saved progress. Demo activity is stored separately in your browser. The default demonstration does not require a paid model API or remote learner account. Use this mode to preview games, inspect teaching materials, or present the platform.
      </p>
      {onTour ? <TourBar /> : null}
    </div>
  );
}

function GameLinks({ basePath, onNavigate }: { basePath: string; onNavigate?: () => void }) {
  const visible = courseGames(games);
  return (
    <div className="mt-4 space-y-2 border-t border-border pt-3">
      <p className="px-3 text-xs font-medium text-muted-foreground">Game list</p>
      {([1, 2, 3] as const).map((tier) => (
        <div key={tier}>
          <p className="px-3 text-xs text-muted-foreground">{tierCopy[tier].name}</p>
          {visible
            .filter((game) => game.tier === tier)
            .map((game) => (
              <SideLink key={game.id} to={`${basePath}/play/${game.id}`} end={false} onClick={onNavigate}>
                {`${game.order}. ${game.title} · ${releaseStatusLabel(game.status)}`}
              </SideLink>
            ))}
        </div>
      ))}
    </div>
  );
}

function SideLink({ to, end, children, onClick }: { to: string; end: boolean; children: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex min-h-11 items-center rounded-lg px-3 text-sm ${isActive ? "bg-primary/15 font-medium" : "hover:bg-muted"}`
      }
    >
      {children}
    </NavLink>
  );
}
