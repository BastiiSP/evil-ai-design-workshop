"use client";

import { motion } from "framer-motion";
import type { Question } from "@/lib/types";

export type VoteCounts = Record<string, number>;

export function VoteBars({
  question,
  counts,
  showEvilHint = false,
}: {
  question: Question;
  counts: VoteCounts;
  /** Zeigt ein dezentes Pink-Glow auf bösen Optionen, sobald Ergebnis offen */
  showEvilHint?: boolean;
}) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return (
    <div className="space-y-4 w-full max-w-3xl">
      {question.options.map((opt) => {
        const count = counts[opt.id] ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const isEvil = showEvilHint && opt.evilScore > 0;
        const isGood = showEvilHint && opt.evilScore < 0;
        return (
          <div key={opt.id} className="relative">
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <span
                className={`text-xl font-light leading-snug ${
                  isEvil
                    ? "text-[var(--color-brand-pink)]"
                    : isGood
                      ? "text-[var(--color-brand-turquoise)]"
                      : "text-white"
                }`}
              >
                {opt.label}
              </span>
              <span className="text-2xl font-bold tabular-nums text-white shrink-0">
                {pct}%
                <span className="ml-2 text-sm font-light text-[var(--color-fg-muted)]">
                  ({count})
                </span>
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: isEvil
                    ? "linear-gradient(90deg, #db73a6, #f094c0)"
                    : isGood
                      ? "linear-gradient(90deg, #87cdcb, #b8e0df)"
                      : "linear-gradient(90deg, #87cdcb, #db73a6)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
      <div className="text-sm text-[var(--color-fg-muted)] mt-2 uppercase tracking-widest">
        {total} {total === 1 ? "Stimme" : "Stimmen"}
      </div>
    </div>
  );
}
