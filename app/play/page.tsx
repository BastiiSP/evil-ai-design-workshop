"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import { useWorkshop } from "@/lib/use-workshop";
import { getQuestions } from "@/lib/questions";
import { SECTIONS } from "@/lib/sections";
import { getOrCreateClientId, hasVoted, markVoted } from "@/lib/client-id";

export default function PlayPage() {
  const { state } = useWorkshop({ presenter: false });
  const [clientId, setClientId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [justVoted, setJustVoted] = useState<string | null>(null); // optionId
  const [error, setError] = useState<string | null>(null);
  const [ctaUrl, setCtaUrl] = useState("");

  useEffect(() => {
    setClientId(getOrCreateClientId());
    setCtaUrl(
      process.env.NEXT_PUBLIC_CTA_URL ||
        "https://home.agile-heroes.com/ai-automation-engineer"
    );
  }, []);

  const questions = useMemo(() => getQuestions(), []);
  const section = SECTIONS[state.slideIndex];
  const activeQuestion =
    section?.kind === "vote" && "questionId" in section
      ? questions.find((q) => q.id === section.questionId)
      : undefined;

  // Wenn die Question wechselt, Reset des "just voted"-Banners
  useEffect(() => {
    setJustVoted(null);
    setError(null);
  }, [activeQuestion?.id]);

  async function submitVote(optionId: string) {
    if (!activeQuestion || !clientId || submitting) return;
    if (hasVoted(activeQuestion.id)) {
      setJustVoted(optionId);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: activeQuestion.id,
          optionId,
          clientId,
        }),
      });
      if (!res.ok) {
        setError("Stimme konnte nicht gesendet werden. Bitte erneut versuchen.");
        setSubmitting(false);
        return;
      }
      markVoted(activeQuestion.id);
      setJustVoted(optionId);
    } catch {
      setError("Verbindung verloren. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  }

  // Welcher Screen wird angezeigt?
  const screen = (() => {
    if (!section) return "wait";
    if (section.kind === "cta") return "cta";
    if (section.kind === "vote" && activeQuestion) {
      if (justVoted || (clientId && hasVoted(activeQuestion.id))) return "voted";
      return "vote";
    }
    if (
      section.kind === "results" ||
      section.kind === "monster-grow" ||
      section.kind === "final-reveal"
    ) {
      return "results";
    }
    return "wait";
  })();

  return (
    <main className="min-h-[100dvh] flex flex-col p-6 max-w-md mx-auto w-full">
      <header className="flex items-center justify-between py-4 mb-2">
        <BrandLogo size="sm" />
        <span className="text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
          Evil AI Workshop
        </span>
      </header>

      <AnimatePresence mode="wait">
        {screen === "wait" && (
          <motion.section
            key="wait"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-2"
          >
            <div className="w-12 h-12 rounded-full border-2 border-[var(--color-brand-turquoise)] border-t-transparent animate-spin" />
            <h2 className="text-2xl font-light leading-snug mt-4">
              Schau auf den Beamer.
            </h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Gleich geht&apos;s los. Die nächste Frage erscheint hier automatisch.
            </p>
          </motion.section>
        )}

        {screen === "vote" && activeQuestion && (
          <motion.section
            key={`vote-${activeQuestion.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col gap-5"
          >
            <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-brand-pink)] mb-1">
              Voting offen
            </div>
            <h1 className="text-2xl font-light leading-snug">
              {activeQuestion.title}
            </h1>
            <ul className="flex flex-col gap-3 mt-2">
              {activeQuestion.options.map((opt, i) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => submitVote(opt.id)}
                    className="w-full text-left px-5 py-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 hover:border-[var(--color-brand-turquoise)] transition disabled:opacity-50 flex items-start gap-4 min-h-[64px]"
                  >
                    <span className="text-[var(--color-brand-turquoise)] font-bold w-6 shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-base leading-snug font-light">
                      {opt.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {error && (
              <p className="text-[var(--color-brand-pink)] text-sm">{error}</p>
            )}
          </motion.section>
        )}

        {screen === "voted" && activeQuestion && (
          <motion.section
            key={`voted-${activeQuestion.id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-2"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-brand-turquoise)] flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mt-4">Stimme abgegeben.</h2>
            <p className="text-sm text-[var(--color-fg-muted)] max-w-xs">
              Schau auf den Beamer – dort siehst du gleich, was die Crowd entschieden hat.
            </p>
          </motion.section>
        )}

        {screen === "results" && (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-2"
          >
            <div
              className="w-3 h-3 rounded-full animate-pulse-slow"
              style={{ background: "var(--color-brand-pink)" }}
            />
            <h2 className="text-2xl font-light leading-snug mt-2">
              Ergebnisse auf dem Beamer.
            </h2>
            <p className="text-sm text-[var(--color-fg-muted)] max-w-xs">
              Die nächste Frage kommt gleich.
            </p>
          </motion.section>
        )}

        {screen === "cta" && (
          <motion.section
            key="cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col gap-6 justify-center"
          >
            <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-brand-turquoise)]">
              AI Automation Engineer
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              <span className="text-[var(--color-brand-turquoise)]">AUTO</span>matisch
              gut statt automatisch{" "}
              <span className="text-[var(--color-brand-pink)]">böse</span>.
            </h1>
            <p className="text-base text-[var(--color-fg-muted)] leading-relaxed">
              AUTO – die Ausbildung für die, die keinen KI Unfall bauen wollen.
            </p>
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[var(--color-brand-turquoise)] text-black font-bold py-4 rounded-xl text-lg hover:opacity-90 mt-4"
            >
              Mehr erfahren →
            </a>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="text-center text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] pt-4 pb-2 opacity-60">
        Agile Heroes Intelligence
      </footer>
    </main>
  );
}
