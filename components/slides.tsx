"use client";

import { motion } from "framer-motion";
import { BrandLogo } from "./BrandLogo";
import { Monster } from "./Monster";
import { QrCode } from "./QrCode";
import { VoteBars, type VoteCounts } from "./VoteBars";
import type { MonsterState, Question } from "@/lib/types";
import { TOPICS, type TopicKey } from "@/lib/sections";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const },
};

export function CoverSlide() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-12">
      <motion.h1
        {...fadeUp}
        className="text-[10rem] leading-none font-extrabold tracking-tight"
      >
        <span
          className="text-glitch text-white"
          data-text="Evil AI Design"
        >
          Evil AI Design
        </span>
      </motion.h1>
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-3xl font-light text-[var(--color-fg-muted)] max-w-3xl"
      >
        Wenn KI nicht b&ouml;se will – aber Schaden anrichtet.
      </motion.p>
    </div>
  );
}

export function HookSlide() {
  return (
    <div className="flex flex-col items-start justify-center gap-8 max-w-5xl">
      <motion.p {...fadeUp} className="text-6xl font-light leading-tight">
        Stell dir vor:
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-6xl leading-tight"
      >
        Deine KI ist <span className="text-[var(--color-brand-turquoise)]">freundlich</span>.
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="text-6xl leading-tight"
      >
        Sie ist <span className="text-[var(--color-brand-turquoise)]">hilfreich</span>.
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="text-7xl leading-tight font-bold"
      >
        Und sie ist{" "}
        <span
          className="text-glitch text-[var(--color-brand-pink)]"
          data-text="manipulativ"
        >
          manipulativ
        </span>
        .
      </motion.p>
    </div>
  );
}

export function DefinitionSlide() {
  return (
    <div className="flex flex-col items-start justify-center gap-12 max-w-5xl">
      <motion.div
        {...fadeUp}
        className="text-sm uppercase tracking-[0.4em] text-[var(--color-brand-turquoise)]"
      >
        Was ist Evil AI Design?
      </motion.div>
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-6xl font-light leading-tight"
      >
        Dark Patterns –<br />
        in <span className="text-[var(--color-brand-pink)]">KI-Systemen</span>.
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="text-3xl text-[var(--color-fg-muted)] leading-snug"
      >
        Selten b&ouml;ser Wille.
        <br />
        Oft b&ouml;ses Ergebnis durch falsche Anreize.
      </motion.p>
    </div>
  );
}

export function OverviewSlide() {
  const items = [
    { label: "Manipulation & Nudging", color: "#db73a6" },
    { label: "Täuschung & Intransparenz", color: "#db73a6" },
    { label: "Diskriminierung durch Design", color: "#db73a6" },
    { label: "Abhängigkeit by Design", color: "#db73a6" },
  ];
  return (
    <div className="flex flex-col items-start justify-center gap-10 max-w-5xl">
      <motion.div
        {...fadeUp}
        className="text-sm uppercase tracking-[0.4em] text-[var(--color-brand-turquoise)]"
      >
        Vier Strömungen, ein Monster
      </motion.div>
      <motion.h2 {...fadeUp} transition={{ duration: 0.8, delay: 0.2 }} className="text-7xl font-light leading-tight">
        Wir bauen es <span className="text-[var(--color-brand-pink)]">live</span>. Zusammen.
      </motion.h2>
      <ul className="space-y-4 text-3xl mt-4">
        {items.map((it, i) => (
          <motion.li
            key={it.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.2 }}
            className="flex items-center gap-4"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: it.color }}
            />
            <span className="font-light text-white">{it.label}</span>
          </motion.li>
        ))}
      </ul>
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="text-2xl text-[var(--color-fg-muted)] mt-6"
      >
        Du entscheidest mit, wie es aussieht.
      </motion.p>
    </div>
  );
}

export function TopicIntroSlide({
  topic,
  monster,
}: {
  topic: TopicKey;
  monster: MonsterState;
}) {
  const t = TOPICS[topic];
  return (
    <div className="grid grid-cols-[1fr_auto] gap-12 items-center max-w-7xl w-full">
      <div className="flex flex-col gap-8">
        <motion.div
          {...fadeUp}
          className="text-sm uppercase tracking-[0.4em] text-[var(--color-brand-turquoise)]"
        >
          Strömung
        </motion.div>
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl font-light leading-tight"
        >
          {t.headline}
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-3xl text-[var(--color-fg-muted)] leading-snug max-w-2xl"
        >
          {t.tagline}
        </motion.p>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-2xl text-white leading-relaxed max-w-2xl mt-4 italic"
        >
          {t.example}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        <Monster state={monster} size={340} />
      </motion.div>
    </div>
  );
}

export function VoteSlide({
  question,
  counts,
  joinUrl,
}: {
  question: Question;
  counts: VoteCounts;
  joinUrl: string;
}) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return (
    <div className="grid grid-cols-[1fr_auto] gap-12 items-start max-w-7xl w-full">
      <div className="flex flex-col gap-8">
        <motion.div
          {...fadeUp}
          className="text-sm uppercase tracking-[0.4em] text-[var(--color-brand-pink)]"
        >
          Voting offen
        </motion.div>
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl font-light leading-tight"
        >
          {question.title}
        </motion.h2>
        <ul className="space-y-3 mt-4">
          {question.options.map((opt, i) => (
            <motion.li
              key={opt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="text-2xl flex gap-4 items-start"
            >
              <span className="text-[var(--color-brand-turquoise)] font-bold w-8 shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-white font-light">{opt.label}</span>
            </motion.li>
          ))}
        </ul>
        <div className="text-3xl font-bold text-[var(--color-brand-pink)] mt-4 tabular-nums">
          {total}{" "}
          <span className="text-base font-light text-[var(--color-fg-muted)] uppercase tracking-widest">
            {total === 1 ? "Stimme" : "Stimmen"} eingegangen
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <QrCode value={joinUrl} size={260} />
        <div className="text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
          Jetzt mitmachen
        </div>
        <div className="text-xs text-[var(--color-fg-muted)] font-light max-w-[260px] text-center break-all">
          {joinUrl.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>
  );
}

export function ResultsSlide({
  question,
  counts,
}: {
  question: Question;
  counts: VoteCounts;
}) {
  return (
    <div className="flex flex-col items-start justify-center gap-8 max-w-6xl w-full">
      <motion.div
        {...fadeUp}
        className="text-sm uppercase tracking-[0.4em] text-[var(--color-brand-turquoise)]"
      >
        Eure Antwort
      </motion.div>
      <motion.h2
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="text-4xl font-light leading-tight"
      >
        {question.title}
      </motion.h2>
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full mt-4"
      >
        <VoteBars question={question} counts={counts} showEvilHint />
      </motion.div>
    </div>
  );
}

export function MonsterGrowSlide({
  monster,
  question,
}: {
  monster: MonsterState;
  question: Question;
}) {
  // Welcher Body-Part wurde gerade beeinflusst?
  const partNames: Record<string, string> = {
    eyes: "Augen",
    mouth: "Mund",
    spikes: "Stacheln",
    tentacles: "Tentakeln",
    aura: "Aura",
  };
  const partName = partNames[question.monsterPart] ?? question.monsterPart;
  const score = monster[question.monsterPart];
  const direction = score > 0 ? "böser" : score < 0 ? "freundlicher" : "neutral";
  const directionColor =
    score > 0
      ? "var(--color-brand-pink)"
      : score < 0
        ? "var(--color-brand-turquoise)"
        : "var(--color-fg)";
  return (
    <div className="grid grid-cols-[auto_1fr] gap-16 items-center max-w-7xl w-full">
      <Monster state={monster} size={500} />
      <div className="flex flex-col gap-6">
        <motion.div
          {...fadeUp}
          className="text-sm uppercase tracking-[0.4em] text-[var(--color-brand-turquoise)]"
        >
          Das Monster wächst
        </motion.div>
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl font-light leading-tight"
        >
          {partName}.
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-3xl"
          style={{ color: directionColor }}
        >
          {direction}.
        </motion.p>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-xl text-[var(--color-fg-muted)] mt-4 max-w-md leading-relaxed"
        >
          Eure Antworten formen, was hier auf der Bühne entsteht. Noch{" "}
          {Math.max(0, 5 - 1 - getResolvedQuestionIndex(question.id))}{" "}
          {(5 - 1 - getResolvedQuestionIndex(question.id)) === 1 ? "Frage" : "Fragen"} zu gehen.
        </motion.p>
      </div>
    </div>
  );
}

function getResolvedQuestionIndex(qid: string): number {
  const order = [
    "q1-manipulation",
    "q2-deception",
    "q3-discrimination",
    "q4-addiction",
    "q5-responsibility",
  ];
  return order.indexOf(qid);
}

export function MetaIntroSlide() {
  return (
    <div className="flex flex-col items-start justify-center gap-8 max-w-5xl">
      <motion.div
        {...fadeUp}
        className="text-sm uppercase tracking-[0.4em] text-[var(--color-brand-pink)]"
      >
        Eine letzte Frage
      </motion.div>
      <motion.h2
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-7xl font-light leading-tight"
      >
        Nicht über die KI –<br />
        <span className="text-[var(--color-brand-turquoise)]">über uns</span>.
      </motion.h2>
    </div>
  );
}

export function FinalRevealSlide({ monster }: { monster: MonsterState }) {
  // Gesamt-Evil-Score
  const total =
    monster.eyes +
    monster.mouth +
    monster.spikes +
    monster.tentacles +
    monster.aura;
  const verdict =
    total > 8
      ? { headline: "Das ist Evil AI.", color: "var(--color-brand-pink)" }
      : total < -8
        ? {
            headline: "Das ist Heroes AI.",
            color: "var(--color-brand-turquoise)",
          }
        : {
            headline: "Das ist eure KI.",
            color: "var(--color-fg)",
          };
  return (
    <div className="grid grid-cols-[auto_1fr] gap-16 items-center max-w-7xl w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Monster state={monster} size={560} />
      </motion.div>
      <div className="flex flex-col gap-6">
        <motion.div
          {...fadeUp}
          className="text-sm uppercase tracking-[0.4em] text-[var(--color-brand-turquoise)]"
        >
          Reveal
        </motion.div>
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-7xl font-bold leading-tight"
          style={{ color: verdict.color }}
        >
          {verdict.headline}
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-3xl text-[var(--color-fg-muted)] leading-snug"
        >
          Genau das, was ihr entschieden habt.
        </motion.p>
      </div>
    </div>
  );
}

export function OutroBridgeSlide() {
  return (
    <div className="flex flex-col items-start justify-center gap-8 max-w-5xl">
      <motion.p {...fadeUp} className="text-5xl font-light leading-tight">
        Dein Monster steht da.
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-5xl font-light leading-tight"
      >
        Aber: KI fährt nicht von allein in die richtige Richtung.
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="text-6xl leading-tight"
      >
        Wie ein <span className="text-[var(--color-brand-turquoise)]">Auto</span>{" "}
        braucht sie jemanden am{" "}
        <span className="text-[var(--color-brand-pink)]">Steuer</span>.
      </motion.p>
    </div>
  );
}

export function CtaSlide({ ctaUrl }: { ctaUrl: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-16 items-center max-w-7xl w-full">
      <div className="flex flex-col gap-8">
        <motion.div
          {...fadeUp}
          className="text-sm uppercase tracking-[0.4em] text-[var(--color-brand-turquoise)]"
        >
          AI Automation Engineer
        </motion.div>
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl font-bold leading-tight"
        >
          <span className="text-[var(--color-brand-turquoise)]">AUTO</span>matisch gut
          <br />
          statt automatisch{" "}
          <span className="text-[var(--color-brand-pink)]">böse</span>.
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-3xl font-light text-white"
        >
          Werde AI Automation Engineer.
        </motion.p>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-xl text-[var(--color-fg-muted)] max-w-xl leading-relaxed"
        >
          AUTO – die Ausbildung für die, die keinen KI Unfall bauen wollen.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-3"
      >
        <QrCode value={ctaUrl} size={300} />
        <div className="text-sm uppercase tracking-widest text-[var(--color-fg-muted)]">
          Mehr erfahren
        </div>
        <BrandLogo size="md" className="mt-4 items-center" />
      </motion.div>
    </div>
  );
}
