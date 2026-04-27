import questionsData from "@/data/questions.json";
import type { Question } from "./types";

export function getQuestions(): Question[] {
  return (questionsData as Question[])
    .slice()
    .sort((a, b) => a.order - b.order);
}

export function getQuestionById(id: string): Question | undefined {
  return getQuestions().find((q) => q.id === id);
}
