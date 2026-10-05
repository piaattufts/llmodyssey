import { useEffect, useRef, type ReactNode } from "react";
import { useLearner } from "../hooks/use-learner.tsx";
import { sampleLearnerState } from "./demo-seed.ts";

export function DemoSeed({ children }: { children: ReactNode }) {
  const learner = useLearner();
  const started = useRef(false);
  useEffect(() => {
    if (!learner.state || started.current) return;
    if (Object.keys(learner.state.games).length > 0) return;
    started.current = true;
    void learner.replace(sampleLearnerState(learner.state.sessionId));
  }, [learner]);
  return children;
}
