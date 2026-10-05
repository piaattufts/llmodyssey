export interface RoundRecord {
  roundId: string;
  bestScore: number;
  maxScore: number;
  hintsOnBestAttempt: number;
  totalHints: number;
  attempts: number;
  lastSuccess: boolean;
}

export interface GameRecord {
  gameId: string;
  startedAt: string | null;
  completedAt: string | null;
  timeSpentMs: number;
  attempts: number;
  rounds: Record<string, RoundRecord>;
  reflection: string;
  mastered: boolean;
  bestPercent: number;
}

export interface AssessmentRecord {
  kind: "pre" | "post";
  scorePercent: number;
  answers: Record<string, string>;
  completedAt: string;
  timeSpentMs: number;
}

export interface InteractionEvent {
  eventId: string;
  sessionId: string;
  timestamp: string;
  gameId: string;
  roundId: string | null;
  actionType: string;
  success: boolean | null;
  durationMs: number | null;
  metadata: Record<string, string | number | boolean | null>;
}

export interface LearnerState {
  sessionId: string;
  createdAt: string;
  games: Record<string, GameRecord>;
  assessments: {
    pre?: AssessmentRecord;
    post?: AssessmentRecord;
  };
  events: InteractionEvent[];
  achievements: string[];
  exploreAhead: boolean;
}

export function emptyLearnerState(sessionId: string): LearnerState {
  return {
    sessionId,
    createdAt: new Date().toISOString(),
    games: {},
    assessments: {},
    events: [],
    achievements: [],
    exploreAhead: false,
  };
}

export function appendEvent(state: LearnerState, event: InteractionEvent): LearnerState {
  const events = [...state.events, event];
  return { ...state, events: events.slice(-2000) };
}
