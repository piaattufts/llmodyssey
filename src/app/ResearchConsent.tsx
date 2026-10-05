import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";

const key = "llmodyssey.researchConsent";

export function ResearchConsent() {
  const [open, setOpen] = useState(() => typeof localStorage === "undefined" || localStorage.getItem(key) === null);

  function choose(value: "yes" | "no") {
    localStorage.setItem(key, value);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Optional local event log</DialogTitle>
          <DialogDescription>
            Research mode is enabled in this build. Gameplay does not require a yes. A yes stores anonymous interaction events in this browser and, only if a backend was configured, sends that same anonymous record. This screen does not ask for a name or an email.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm">
          Turning research mode on does not mean this deployment has an ethics approval, and it does not enroll anyone in a study run by the original author. The institution operating this copy is responsible for its own review.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button className="min-h-11" onClick={() => choose("yes")}>
            Keep anonymous events
          </Button>
          <Button className="min-h-11" variant="outline" onClick={() => choose("no")}>
            Do not log events
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
