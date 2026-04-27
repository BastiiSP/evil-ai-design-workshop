"use client";

const KEY = "evil-ai-client-id";

export function getOrCreateClientId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

export function hasVoted(questionId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(`evil-ai-voted-${questionId}`) === "1";
}

export function markVoted(questionId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`evil-ai-voted-${questionId}`, "1");
}

export function clearVotes(): void {
  if (typeof window === "undefined") return;
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith("evil-ai-voted-"))
    .forEach((k) => window.localStorage.removeItem(k));
}
