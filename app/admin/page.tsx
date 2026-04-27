"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { getQuestions } from "@/lib/questions";
import type { Question } from "@/lib/types";

const PW_KEY = "evil-ai-admin-pw";

export default function AdminPage() {
  const [pwInput, setPwInput] = useState("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [presenterUrl, setPresenterUrl] = useState("");
  const [playUrl, setPlayUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [exportJson, setExportJson] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(PW_KEY);
    if (stored) setPassword(stored);
    setAuthReady(true);
    setQuestions(getQuestions());
    const origin = window.location.origin;
    setPresenterUrl(`${origin}/presenter`);
    setPlayUrl(`${origin}/play`);
  }, []);

  useEffect(() => {
    setExportJson(JSON.stringify(questions, null, 2));
  }, [questions]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwInput }),
    });
    if (!res.ok) {
      setLoginError("Falsches Passwort");
      return;
    }
    window.localStorage.setItem(PW_KEY, pwInput);
    setPassword(pwInput);
  }

  function updateOption(
    qi: number,
    oi: number,
    field: "label" | "evilScore",
    value: string | number
  ) {
    setQuestions((qs) => {
      const next = qs.map((q, i) =>
        i !== qi
          ? q
          : {
              ...q,
              options: q.options.map((o, j) =>
                j !== oi ? o : { ...o, [field]: value }
              ),
            }
      );
      setSaved(false);
      return next;
    });
  }

  function updateQuestion(qi: number, field: "title", value: string) {
    setQuestions((qs) => {
      const next = qs.map((q, i) =>
        i !== qi ? q : { ...q, [field]: value }
      );
      setSaved(false);
      return next;
    });
  }

  function handleExportDownload() {
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleSaveToSession() {
    // Speichert Fragen im LocalStorage → wird in dieser Browser-Session genutzt
    window.localStorage.setItem("evil-ai-custom-questions", exportJson);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!authReady) return <div className="min-h-screen" />;

  if (!password) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-sm w-full"
        >
          <BrandLogo size="sm" className="mb-6" />
          <h1 className="text-2xl font-light mb-6">Admin</h1>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            placeholder="Passwort"
            autoFocus
            className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[var(--color-brand-turquoise)] mb-3"
          />
          {loginError && (
            <p className="text-[var(--color-brand-pink)] text-sm mb-3">
              {loginError}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-[var(--color-brand-turquoise)] text-black font-bold py-3 rounded-lg"
          >
            Einloggen
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <BrandLogo size="sm" />
        <button
          onClick={() => {
            window.localStorage.removeItem(PW_KEY);
            setPassword("");
          }}
          className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)] hover:text-white"
        >
          Logout
        </button>
      </header>

      {/* Workshop-Links */}
      <section className="mb-10 bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-brand-turquoise)] mb-4">
          Workshop-Links
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-[var(--color-fg-muted)] w-28 shrink-0">Beamer:</span>
            <a
              href={presenterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-brand-turquoise)] hover:underline break-all"
            >
              {presenterUrl}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[var(--color-fg-muted)] w-28 shrink-0">Teilnehmer:</span>
            <a
              href={playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-brand-turquoise)] hover:underline break-all"
            >
              {playUrl}
            </a>
          </div>
        </div>
      </section>

      {/* Fragen-Editor */}
      <section className="mb-8">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-brand-turquoise)] mb-6">
          Voting-Fragen
        </h2>
        <div className="space-y-8">
          {questions.map((q, qi) => (
            <div
              key={q.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-[var(--color-brand-pink)] text-xs uppercase tracking-widest w-6 shrink-0 mt-1">
                  {qi + 1}
                </span>
                <textarea
                  value={q.title}
                  onChange={(e) => updateQuestion(qi, "title", e.target.value)}
                  rows={2}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-base font-light resize-none focus:outline-none focus:border-[var(--color-brand-turquoise)]"
                />
              </div>
              <div className="ml-9 space-y-3">
                {q.options.map((opt, oi) => (
                  <div key={opt.id} className="flex gap-3 items-center">
                    <span className="text-[var(--color-brand-turquoise)] text-xs w-5 shrink-0 font-bold">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) =>
                        updateOption(qi, oi, "label", e.target.value)
                      }
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-light focus:outline-none focus:border-[var(--color-brand-turquoise)]"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-[var(--color-fg-muted)] uppercase">Evil</span>
                      <input
                        type="number"
                        min={-2}
                        max={2}
                        step={1}
                        value={opt.evilScore}
                        onChange={(e) =>
                          updateOption(qi, oi, "evilScore", Number(e.target.value))
                        }
                        className="w-14 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-[var(--color-brand-pink)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="ml-9 mt-2 text-[10px] text-[var(--color-fg-muted)] uppercase tracking-widest">
                Monster-Part: {q.monsterPart}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Export / Session-Save */}
      <section className="flex flex-wrap gap-3 items-center mb-16">
        <button
          onClick={handleSaveToSession}
          className="px-5 py-2.5 rounded-lg bg-[var(--color-brand-turquoise)] text-black font-bold text-sm hover:opacity-90"
        >
          {saved ? "✓ Gespeichert" : "In Browser speichern"}
        </button>
        <button
          onClick={handleExportDownload}
          className="px-5 py-2.5 rounded-lg border border-white/20 text-sm font-light hover:bg-white/5"
        >
          Als JSON exportieren
        </button>
        <p className="text-[10px] text-[var(--color-fg-muted)] w-full mt-1">
          „In Browser speichern" gilt nur für diesen Browser-Tab. Für dauerhafte Änderungen: JSON exportieren und{" "}
          <code className="font-mono text-white/60">data/questions.json</code> im Repo ersetzen.
        </p>
      </section>
    </main>
  );
}
