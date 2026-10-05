import { Route, Routes } from "react-router";
import { AppShell } from "./app/AppShell.tsx";
import { DemoSeed } from "./app/DemoSeed.tsx";
import { AssessmentPage } from "./app/pages/AssessmentPage.tsx";
import { EducatorPage } from "./app/pages/EducatorPage.tsx";
import { FeedbackPage } from "./app/pages/FeedbackPage.tsx";
import { GamePage } from "./app/pages/GamePage.tsx";
import { GuidePage } from "./app/pages/GuidePage.tsx";
import { HomePage } from "./app/pages/HomePage.tsx";
import { NotFoundPage } from "./app/pages/NotFoundPage.tsx";
import { ProgressPage } from "./app/pages/ProgressPage.tsx";
import { LearnerProvider } from "./hooks/use-learner.tsx";

export default function App() {
  return (
    <Routes>
      <Route
        path="/demo"
        element={
          <LearnerProvider namespace="demo" bypassLocks>
            <DemoSeed>
              <AppShell basePath="/demo" mode="demo" />
            </DemoSeed>
          </LearnerProvider>
        }
      >
        <Route index element={<HomePage basePath="/demo" demo />} />
        <Route path="play/:gameId" element={<GamePage basePath="/demo" />} />
        <Route path="games/:gameId" element={<GamePage basePath="/demo" />} />
        <Route path="progress" element={<ProgressPage basePath="/demo" />} />
        <Route path="educator" element={<EducatorPage basePath="/demo" />} />
        <Route path="feedback" element={<FeedbackPage basePath="/demo" />} />
        <Route path="assess/:kind" element={<AssessmentPage basePath="/demo" />} />
        <Route path="guide" element={<GuidePage basePath="/demo" />} />
      </Route>
      <Route
        path="/"
        element={
          <LearnerProvider namespace="learner">
            <AppShell basePath="" mode="learner" />
          </LearnerProvider>
        }
      >
        <Route index element={<HomePage basePath="" />} />
        <Route path="play/:gameId" element={<GamePage basePath="" />} />
        <Route path="games/:gameId" element={<GamePage basePath="" />} />
        <Route path="progress" element={<ProgressPage basePath="" />} />
        <Route path="educator" element={<EducatorPage basePath="" />} />
        <Route path="feedback" element={<FeedbackPage basePath="" />} />
        <Route path="assess/:kind" element={<AssessmentPage basePath="" />} />
        <Route path="guide" element={<GuidePage basePath="" />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
