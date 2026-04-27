export type MonsterPart = "eyes" | "mouth" | "spikes" | "tentacles" | "aura";

export type QuestionOption = {
  id: string;
  label: string;
  /** -2 (good) bis +2 (evil) */
  evilScore: number;
};

export type Question = {
  id: string;
  order: number;
  title: string;
  /** Welcher Body-Part wird durch diese Frage beeinflusst */
  monsterPart: MonsterPart;
  options: QuestionOption[];
};

export type WorkshopPhase =
  | "intro"
  | "slide"
  | "vote-open"
  | "vote-results"
  | "monster"
  | "outro";

export type WorkshopState = {
  phase: WorkshopPhase;
  slideIndex: number;
  currentQuestionId?: string;
  votingOpen: boolean;
  /** Monotonically increasing for tie-breaking on late joiners */
  rev: number;
};

export type VotePayload = {
  questionId: string;
  optionId: string;
  clientId: string;
};

export type MonsterState = Record<MonsterPart, number>;

export const PUSHER_CHANNEL = "workshop";

export const PUSHER_EVENTS = {
  STATE: "state-change",
  VOTE: "vote-cast",
  QUESTIONS: "questions-update",
  RESET: "reset",
} as const;

export const INITIAL_STATE: WorkshopState = {
  phase: "intro",
  slideIndex: 0,
  votingOpen: false,
  rev: 0,
};

export const INITIAL_MONSTER: MonsterState = {
  eyes: 0,
  mouth: 0,
  spikes: 0,
  tentacles: 0,
  aura: 0,
};
