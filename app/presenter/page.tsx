"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import { NetworkLines } from "@/components/NetworkLines";
import { Monster } from "@/components/Monster";
import {
  CoverSlide,
  HookSlide,
  DefinitionSlide,
  OverviewSlide,
  TopicIntroSlide,
  VoteSlide,
  ResultsSlide,
  MonsterGrowSlide,
  MetaIntroSlide,
  FinalRevealSlide,
  OutroBridgeSlide,
  CtaSlide,
} from "@/components/slides";
import { useWorkshop } from "@/lib/use-workshop";
import { aggregateCounts, computeMonster } from "@/lib/workshop-logic";
import { SECTIONS } from "@/lib/sections";
import { getQuestions } from "@/lib/questions";
import { INITIAL_STATE, type WorkshopState } from "@/lib/types";

const PASSWORD_STORAGE_KEY = "evil-ai-presenter-pw";

export default function PresenterPage() {
  const [password, setPassword] = useState<string>("");
  const [pwInput, setPwInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [showDebug, setShowDebug] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lade Passwort aus LocalStorage beim ersten Mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(PASSWORD_STORAGE_KEY);
    if (stored) {
      setPassword(stored);
    }
    const origin = window.location.origin;
    setJoinUrl(`${origin}/play`);
    setCtaUrl(
      process.env.NEXT_PUBLIC_CTA_URL ||
        "https://home.agile-heroes.com/ai-automation-engineer"
    );
    setAuthReady(true);
  }, []);

  const { state, setState, votes } = useWorkshop({ presenter: !!password });

  const questions = useMemo(() => getQuestions(), []);
  const counts = useMemo(() => aggregateCounts(votes), [votes]);
  const monster = useMemo(
    () => computeMonster(counts, questions, state.slideIndex),
    [counts, questions, state.slideIndex]
  );

  const broadcastState = useCallback(
    async (next: WorkshopState) => {
      if (!password) return;
      try {
        await fetch("/api/state", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password,
          },
          body: JSON.stringify(next),
        });
      } catch (e) {
        console.error("State broadcast failed:", e);
      }
    },
    [password]
  );

  const goToSection = useCallback(
    (index: number) => {
      const target = Math.max(0, Math.min(SECTIONS.length - 1, index));
      const targetSection = SECTIONS[target];
      // Voting bleibt offen auf vote UND results – erst bei monster-grow schließen
      const votingOpen =
        targetSection.kind === "vote" || targetSection.kind === "results";
      const questionId =
        "questionId" in targetSection ? targetSection.questionId : undefined;
      const next: WorkshopState = {
        phase: targetSection.kind === "vote" ? "vote-open" : "slide",
        slideIndex: target,
        currentQuestionId: questionId,
        votingOpen,
        rev: state.rev + 1,
      };
      setState(next);
      broadcastState(next);
    },
    [setState, broadcastState, state.rev]
  );

  // Fullscreen toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // Fullscreen state sync
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!password) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goToSection(state.slideIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToSection(state.slideIndex - 1);
      } else if (e.key === "Home") {
        goToSection(0);
      } else if (e.key === "End") {
        goToSection(SECTIONS.length - 1);
      } else if (e.key.toLowerCase() === "d") {
        setShowDebug((s) => !s);
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [password, state.slideIndex, goToSection]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwInput }),
      });
      if (!res.ok) {
        setLoginError("Falsches Passwort");
        return;
      }
      window.localStorage.setItem(PASSWORD_STORAGE_KEY, pwInput);
      setPassword(pwInput);
      // Initialer State auf intro setzen
      const initial = { ...INITIAL_STATE, rev: Date.now() };
      setState(initial);
      void fetch("/api/state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": pwInput,
        },
        body: JSON.stringify(initial),
      });
    } catch {
      setLoginError("Fehler beim Login");
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(PASSWORD_STORAGE_KEY);
    setPassword("");
    setPwInput("");
  }

  async function handleResetVotes() {
    if (!confirm("Alle bisherigen Stimmen verwerfen? Alle Smartphones werden ebenfalls zurückgesetzt.")) return;
    window.localStorage.removeItem("evil-ai-presenter-votes");
    // Reset-Event an alle Clients broadcasten (löscht voted-Flags auf Smartphones)
    try {
      await fetch("/api/reset", {
        method: "POST",
        headers: { "x-admin-password": password },
      });
    } catch (e) {
      console.error("Reset broadcast failed:", e);
    }
    window.location.reload();
  }

  if (!authReady) {
    return <div className="min-h-screen" />;
  }

  if (!password) {
    return (
      <main className="stage relative min-h-screen flex items-center justify-center px-8 py-12">
        <NetworkLines intensity={0.2} />
        <form
          onSubmit={handleLogin}
          className="relative bg-white/5 border border-white/10 rounded-2xl p-10 max-w-md w-full backdrop-blur"
        >
          <BrandLogo size="md" className="mb-8" />
          <h1 className="text-3xl font-light mb-2">Presenter Login</h1>
          <p className="text-sm text-[var(--color-fg-muted)] mb-8">
            Diese Ansicht steuert den Workshop am Beamer.
          </p>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            autoFocus
            placeholder="Admin-Passwort"
            className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-lg font-light focus:outline-none focus:border-[var(--color-brand-turquoise)]"
          />
          {loginError && (
            <p className="text-[var(--color-brand-pink)] text-sm mt-3">
              {loginError}
            </p>
          )}
          <button
            type="submit"
            className="w-full mt-6 bg-[var(--color-brand-turquoise)] text-black font-bold py-3 rounded-lg hover:opacity-90"
          >
            Workshop starten
          </button>
        </form>
      </main>
    );
  }

  const section = SECTIONS[state.slideIndex];
  const currentQuestion =
    "questionId" in section
      ? questions.find((q) => q.id === section.questionId)
      : undefined;
  const currentCounts = currentQuestion ? counts[currentQuestion.id] ?? {} : {};

  return (
    <main className="stage relative min-h-screen overflow-hidden flex items-center justify-center px-12 py-12 select-none">
      <NetworkLines intensity={0.18} />

      {/* Floating Logo */}
      <div className="absolute top-8 left-8 z-10">
        <BrandLogo size="sm" />
      </div>

      {/* Section Counter */}
      <div className="absolute top-8 right-8 z-10 text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
        {state.slideIndex + 1} / {SECTIONS.length}
      </div>

      {/* Mini-Monster ab erstem Topic-Slide */}
      {state.slideIndex >= 4 &&
        section.kind !== "monster-grow" &&
        section.kind !== "final-reveal" &&
        section.kind !== "topic-intro" && (
          <div className="absolute bottom-8 right-8 z-10 opacity-90">
            <Monster state={monster} size={120} />
          </div>
        )}

      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-7xl flex items-center justify-center"
        >
          {section.kind === "cover" && <CoverSlide joinUrl={joinUrl} />}
          {section.kind === "hook" && <HookSlide />}
          {section.kind === "definition" && <DefinitionSlide />}
          {section.kind === "overview" && <OverviewSlide />}
          {section.kind === "topic-intro" && (
            <TopicIntroSlide topic={section.topic} monster={monster} />
          )}
          {section.kind === "vote" && currentQuestion && (
            <VoteSlide
              question={currentQuestion}
              counts={currentCounts}
              joinUrl={joinUrl}
            />
          )}
          {section.kind === "results" && currentQuestion && (
            <ResultsSlide question={currentQuestion} counts={currentCounts} />
          )}
          {section.kind === "monster-grow" && currentQuestion && (
            <MonsterGrowSlide question={currentQuestion} monster={monster} />
          )}
          {section.kind === "meta-intro" && <MetaIntroSlide />}
          {section.kind === "final-reveal" && (
            <FinalRevealSlide monster={monster} />
          )}
          {section.kind === "outro-bridge" && <OutroBridgeSlide />}
          {section.kind === "cta" && <CtaSlide ctaUrl={ctaUrl} />}
        </motion.div>
      </AnimatePresence>

      {/* Fullscreen-Button – groß und immer sichtbar oben links (neben Logo) */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? "Vollbild beenden (F)" : "Vollbild (F)"}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-black/40 text-[11px] uppercase tracking-widest text-[var(--color-fg-muted)] hover:border-[var(--color-brand-turquoise)] hover:text-[var(--color-brand-turquoise)] transition backdrop-blur"
      >
        {isFullscreen ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
        )}
        {isFullscreen ? "Vollbild beenden" : "Vollbild"}
      </button>

      {/* Bottom controls (versteckt, klein) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] opacity-50 hover:opacity-100 transition">
        <span>← / → / Space: Navigieren</span>
        <span>·</span>
        <button onClick={() => setShowDebug((s) => !s)}>D: Debug</button>
        <span>·</span>
        <button onClick={handleResetVotes}>Reset Stimmen</button>
        <span>·</span>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {showDebug && (
        <div className="absolute top-20 right-8 z-20 bg-black/80 border border-white/15 rounded-lg p-4 text-xs font-mono space-y-1 max-w-sm">
          <div>Section: {section.kind} ({state.slideIndex})</div>
          <div>Votes total: {votes.length}</div>
          <div>Monster: {JSON.stringify(monster)}</div>
        </div>
      )}
    </main>
  );
}
