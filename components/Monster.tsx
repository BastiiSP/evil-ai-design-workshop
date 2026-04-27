"use client";

import { motion } from "framer-motion";
import type { MonsterState } from "@/lib/types";

/**
 * Modulares Comic-Monster.
 * score < 0  → freundlich (Türkis, große Augen, Lächeln)
 * score > 0  → böse      (Pink-Glitch, Stacheln, Tentakeln, böse Augen)
 *
 * Normalisierung: Wert -10..+10 → -1..+1 intern
 * Gestaltungsprinzip: dramatische Übergänge, gut sichtbar auf Beamer
 */
export function Monster({
  state,
  size = 480,
  showLabel = false,
}: {
  state: MonsterState;
  size?: number;
  showLabel?: boolean;
}) {
  const clamp = (v: number) => Math.max(-1, Math.min(1, v / 10));

  const eyes = clamp(state.eyes);        // Manipulation
  const mouth = clamp(state.mouth);      // Täuschung
  const spikes = clamp(state.spikes);    // Diskriminierung
  const tentacles = clamp(state.tentacles); // Abhängigkeit
  const aura = clamp(state.aura);        // Gesamt-Stimmung

  // Gesamtbösheit für globale Farbverschiebung
  const overallEvil = (eyes + mouth + spikes + tentacles + aura) / 5;

  const turquoise = "#87cdcb";
  const pink = "#db73a6";

  // Körperfarbe interpoliert von Türkis (gut) nach Pink (böse)
  const bodyColor = overallEvil > 0 ? pink : turquoise;
  const bodyAlt = overallEvil > 0 ? turquoise : pink;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Aura-Glow – drastisch skaliert */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          background: `radial-gradient(circle, ${bodyColor}${overallEvil > 0 ? "60" : "33"} 0%, ${bodyColor}11 55%, transparent 75%)`,
          scale: 1 + Math.max(0, overallEvil) * 0.5,
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <svg viewBox="-110 -130 220 290" width={size} height={size} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="bodyGrad" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor={bodyAlt} stopOpacity="0.6" />
            <stop offset="50%" stopColor={bodyColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#111" stopOpacity="1" />
          </radialGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glitchFx" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="2" />
            <feDisplacementMap in="SourceGraphic" scale={Math.max(0, overallEvil) * 10} />
          </filter>
        </defs>

        {/* ── TENTAKELN (Abhängigkeit) ── wachsen unten raus, nur bei positivem score */}
        {tentacles > 0 &&
          [-50, -25, 0, 25, 50].map((xBase, i) => {
            const visible = tentacles; // 0..1
            const length = 40 + visible * 90;
            const wave = (i % 2 === 0 ? 1 : -1) * visible * 30;
            return (
              <motion.path
                key={`t${i}`}
                d={`M ${xBase} 65 Q ${xBase + wave} ${65 + length * 0.5} ${xBase + wave * 1.5} ${65 + length}`}
                stroke={pink}
                strokeWidth={Math.max(4, 4 + visible * 8)}
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 + visible * 0.8 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.08 }}
              />
            );
          })}

        {/* ── STACHELN (Diskriminierung) ── ring außen, nur bei positivem score */}
        {spikes > 0 &&
          Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const visible = spikes; // 0..1
            const r1 = 82;
            const r2 = 82 + 15 + visible * 45;
            const width = 2 + visible * 5;
            return (
              <motion.line
                key={`s${i}`}
                x1={Math.cos(angle) * r1}
                y1={Math.sin(angle) * r1}
                x2={Math.cos(angle) * r2}
                y2={Math.sin(angle) * r2}
                stroke={pink}
                strokeWidth={width}
                strokeLinecap="round"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 0.2 + visible * 0.8, scale: 1 }}
                transition={{ duration: 0.9, ease: "backOut", delay: i * 0.05 }}
                style={{ transformOrigin: "0px 0px" }}
              />
            );
          })}

        {/* ── KÖRPER ── */}
        <motion.ellipse
          cx={0} cy={0}
          rx={78} ry={78}
          fill="url(#bodyGrad)"
          animate={{
            rx: 78 + Math.max(0, overallEvil) * 8,
            ry: 78 - Math.max(0, overallEvil) * 4,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          filter={overallEvil > 0.4 ? "url(#glitchFx)" : undefined}
        />

        {/* ── AUGEN (Manipulation) ── */}
        {/* Linkes Auge – Weiß: böse = breiter Squint, gut = großes rundes Auge */}
        <motion.ellipse
          cx={-27} cy={-18}
          animate={{
            rx: eyes < 0 ? 14 - eyes * 2 : 14 + eyes * 6,
            ry: 14 - eyes * 6,   // böse: schmal (=8 bei max), gut: groß (=20 bei max)
          }}
          fill="#f5f5f5"
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        {/* Rosa Iris – erscheint erst bei evil */}
        {eyes > 0 && (
          <motion.circle
            cx={-27 + eyes * 5} cy={-18 - eyes * 3}
            r={5 + eyes * 2}
            fill={pink}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.55 + eyes * 0.25, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}
        {/* Pupille */}
        <motion.circle
          cx={-27} cy={-18}
          animate={{
            r: eyes > 0 ? 3 : 7,
            cx: -27 + eyes * 5,    // zur Nase hin
            cy: -18 - eyes * 3,    // leicht nach oben – bedrohlicher Blick
          }}
          fill="#0a0a0a"
          transition={{ duration: 0.9 }}
        />
        {/* Glow bei evil */}
        {eyes > 0.2 && (
          <motion.ellipse
            cx={-27 + eyes * 5} cy={-18 - eyes * 3}
            rx={14 + eyes * 6} ry={Math.max(3, 14 - eyes * 6)}
            fill="none" stroke={pink} strokeWidth={2}
            filter="url(#glow)"
            animate={{ opacity: [eyes * 0.5, eyes * 0.9, eyes * 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {/* Augenbraue: böse = zur Nase runter-geneigt (V-Form), gut = dezent gewölbt */}
        {eyes > 0.1 ? (
          <motion.path
            d={`M ${-38} ${-36 - eyes * 8} Q ${-27} ${-36 - eyes * 4} ${-16} ${-32}`}
            stroke="#0a0a0a" strokeWidth={2 + eyes * 2} fill="none" strokeLinecap="round"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : eyes < -0.3 ? (
          <path
            d={`M -37 -32 Q -27 ${-36 + eyes * 3} -17 -32`}
            stroke="#0a0a0a" strokeWidth={2} fill="none" strokeLinecap="round"
            opacity={0.4}
          />
        ) : null}

        {/* Rechtes Auge */}
        <motion.ellipse
          cx={27} cy={-18}
          animate={{
            rx: eyes < 0 ? 14 - eyes * 2 : 14 + eyes * 6,
            ry: 14 - eyes * 6,
          }}
          fill="#f5f5f5"
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        {eyes > 0 && (
          <motion.circle
            cx={27 - eyes * 5} cy={-18 - eyes * 3}
            r={5 + eyes * 2}
            fill={pink}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.55 + eyes * 0.25, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}
        <motion.circle
          cx={27} cy={-18}
          animate={{
            r: eyes > 0 ? 3 : 7,
            cx: 27 - eyes * 5,
            cy: -18 - eyes * 3,
          }}
          fill="#0a0a0a"
          transition={{ duration: 0.9 }}
        />
        {eyes > 0.2 && (
          <motion.ellipse
            cx={27 - eyes * 5} cy={-18 - eyes * 3}
            rx={14 + eyes * 6} ry={Math.max(3, 14 - eyes * 6)}
            fill="none" stroke={pink} strokeWidth={2}
            filter="url(#glow)"
            animate={{ opacity: [eyes * 0.5, eyes * 0.9, eyes * 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
        )}
        {eyes > 0.1 ? (
          <motion.path
            d={`M ${16} ${-32} Q ${27} ${-36 - eyes * 4} ${38} ${-36 - eyes * 8}`}
            stroke="#0a0a0a" strokeWidth={2 + eyes * 2} fill="none" strokeLinecap="round"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : eyes < -0.3 ? (
          <path
            d={`M 17 -32 Q 27 ${-36 + eyes * 3} 37 -32`}
            stroke="#0a0a0a" strokeWidth={2} fill="none" strokeLinecap="round"
            opacity={0.4}
          />
        ) : null}

        {/* ── MUND (Täuschung) ── */}
        {mouth > 0.1 ? (
          // Evil: falsches breites Lächeln mit Zähnen
          <g>
            <motion.path
              d={`M -35 28 Q 0 ${50 + mouth * 20} 35 28 L 35 36 Q 0 ${55 + mouth * 15} -35 36 Z`}
              fill="#0a0a0a"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
            {[-28, -18, -8, 2, 12, 22].map((x, i) => (
              <motion.polygon
                key={i}
                points={`${x},28 ${x + 5},28 ${x + 2.5},${35 + mouth * 10}`}
                fill="#f5f5f5"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
                style={{ transformOrigin: `${x + 2.5}px 28px` }}
              />
            ))}
          </g>
        ) : (
          // Good/Neutral: ehrliches Lächeln
          <motion.path
            d={`M -24 28 Q 0 ${38 + Math.max(0, -mouth) * 12} 24 28`}
            fill="none" stroke="#0a0a0a" strokeWidth={4} strokeLinecap="round"
            animate={{ d: `M -24 28 Q 0 ${38 + Math.max(0, -mouth) * 12} 24 28` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}

        {/* Wangen-Röte bei friendlich */}
        {overallEvil < -0.2 && (
          <>
            <circle cx={-55} cy={5} r={12} fill={turquoise} opacity={0.25} />
            <circle cx={55} cy={5} r={12} fill={turquoise} opacity={0.25} />
          </>
        )}
      </svg>

      {showLabel && (
        <div className="absolute -bottom-8 left-0 right-0 text-center text-[10px] text-[var(--color-fg-muted)] uppercase tracking-widest font-mono">
          👁 {state.eyes.toFixed(1)} · 👄 {state.mouth.toFixed(1)} ·
          🗡 {state.spikes.toFixed(1)} · 🐙 {state.tentacles.toFixed(1)} ·
          ✨ {state.aura.toFixed(1)}
        </div>
      )}
    </div>
  );
}
