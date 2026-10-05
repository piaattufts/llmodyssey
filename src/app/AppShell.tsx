import { Menu } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { odysseyConfig } from "../game-engine/config.ts";
import { researchModeEnabled, runtimeWarnings } from "../research/mode.ts";
import { citation } from "../site.ts";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx";
import { ResearchConsent } from "./ResearchConsent.tsx";

export function AppShell({ basePath, mode }: { basePath: string; mode: "learner" | "demo" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const warnings = runtimeWarnings();
  const links = [
    { to: basePath || "/", label: mode === "demo" ? "Demo home" : "Course", end: true },
    { to: `${basePath}/progress`, label: "Progress", end: false },
    { to: `${basePath}/educator`, label: "Educator", end: false },
    { to: `${basePath}/assess/pre`, label: "Pre-assessment", end: false },
    { to: `${basePath}/assess/post`, label: "Post-assessment", end: false },
    { to: `${basePath}/guide`, label: "Concept index", end: false },
    mode === "demo"
      ? { to: "/", label: "Leave demo", end: true }
      : { to: "/demo", label: "Demo mode", end: true },
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
            {links.map((link) => (
              <SideLink key={link.label} to={link.to} end={link.end}>
                {link.label}
              </SideLink>
            ))}
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
                  {links.map((link) => (
                    <SideLink key={link.label} to={link.to} end={link.end} onClick={() => setMenuOpen(false)}>
                      {link.label}
                    </SideLink>
                  ))}
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
          {mode === "demo" ? (
            <p className="border-b border-border bg-primary/10 px-4 py-2 text-sm">
              Demo mode uses a separate local record. It does not call a model API, and it does not change the learner record.
            </p>
          ) : null}
          <main id="main" className="mx-auto max-w-5xl px-4 py-6">
            <Outlet />
          </main>
          <footer className="border-t border-border px-4 py-6 text-sm text-muted-foreground">
            <p>
              {citation.platformTitle}. {citation.author}, {citation.affiliation}. If you use this in teaching or research, cite the software and{" "}
              <a className="underline" href={citation.arxivUrl}>
                arXiv:{citation.arxivId}
              </a>
              .
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
