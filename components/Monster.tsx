"use client";

import { motion } from "framer-motion";
import type { MonsterState } from "@/lib/types";

/**
 * Modulares Comic-Monster.
 * score < 0  → freundlich (Türkis, große Augen, Lächeln, türkise Beulen)
 * score > 0  → böse      (Pink-Glitch, Stacheln, S-Tentakel, böse Augen, Zähne)
 *
 * Normalisierung: Wert -10..+10 → -1..+1 intern
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

  const eyes      = clamp(state.eyes);       // Manipulation
  const mouth     = clamp(state.mouth);      // Täuschung
  const spikes    = clamp(state.spikes);     // Diskriminierung
  const tentacles = clamp(state.tentacles);  // Abhängigkeit
  const aura      = clamp(state.aura);       // Gesamt-Stimmung

  const overallEvil = (eyes + mouth + spikes + tentacles + aura) / 5;

  const turquoise = "#87cdcb";
  const pink      = "#db73a6";

  const bodyColor = overallEvil > 0 ? pink : turquoise;
  const bodyAlt   = overallEvil > 0 ? turquoise : pink;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Aura-Glow */}
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

        {/* ── TENTAKEL (Abhängigkeit) ── */}

        {/* BÖSE: S-förmige Tentakel mit Saugnäpfen */}
        {tentacles > 0 &&
          [-50, -25, 0, 25, 50].map((xBase, i) => {
            const v   = tentacles;
            const len = 55 + v * 75;
            const wx  = (i % 2 === 0 ? 1 : -1) * (20 + v * 30);
            const sw  = 5 + v * 8;
            const mx  = xBase + wx;
            const my  = 68 + len * 0.45;
            const ex  = xBase - wx * 0.4;
            const ey  = 68 + len;
            return (
              <g key={`tg${i}`}>
                <motion.path
                  d={`M ${xBase} 68 Q ${xBase + wx * 1.3} ${68 + len * 0.28} ${mx} ${my} Q ${xBase - wx * 0.8} ${68 + len * 0.72} ${ex} ${ey}`}
                  stroke={pink}
                  strokeWidth={sw}
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.75 + v * 0.25 }}
                  transition={{ duration: 1.3, ease: "easeOut", delay: i * 0.1 }}
                />
                {/* Saugnäpfe – erscheinen ab mittlerer Bösheit */}
                {v > 0.25 && (
                  <>
                    <motion.circle
                      cx={xBase + wx * 0.9} cy={68 + len * 0.25}
                      r={2 + v * 2} fill={turquoise}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, v * 0.9, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.8 + i * 0.15 }}
                    />
                    <motion.circle
                      cx={xBase - wx * 0.3} cy={68 + len * 0.62}
                      r={1.5 + v * 1.5} fill={turquoise}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, v * 0.8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.2 + i * 0.15 }}
                    />
                  </>
                )}
              </g>
            );
          })}

        {/* FREUNDLICH: türkise Beulen an der Unterseite */}
        {tentacles < -0.3 &&
          [-40, -20, 0, 20, 40].map((x, i) => {
            const v = Math.min(1, (-tentacles - 0.3) / 0.7);
            return (
              <motion.ellipse
                key={`ft${i}`}
                cx={x} cy={70}
                rx={5 + v * 5} ry={4 + v * 5}
                fill={turquoise}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.45 + v * 0.35, scaleY: 1 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: "backOut" }}
                style={{ transformOrigin: `${x}px 74px` }}
              />
            );
          })}

        {/* ── STACHELN (Diskriminierung) ── ring außen, nur bei positivem score */}
        {spikes > 0 &&
          Array.from({ length: 12 }).map((_, i) => {
            const angle   = (i / 12) * Math.PI * 2;
            const visible = spikes;
            const r1      = 82;
            const r2      = 82 + 15 + visible * 45;
            const width   = 2 + visible * 5;
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

        {/* LINKES AUGE */}
        {/* Augapfel – böse: breiter Squint, gut: großes rundes Auge */}
        <motion.ellipse
          cx={-27} cy={-18}
          animate={{
            rx: eyes < 0 ? 14 - eyes * 2 : 14 + eyes * 6,
            ry: 14 - eyes * 6,   // böse: schmal (~8), neutral: 14, gut: groß (~20)
          }}
          fill="#f5f5f5"
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        {/* Rosa Iris – nur bei evil */}
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
        {/* Pupille – NUR bei evil zur Nase/oben verschieben; bei gut zentriert */}
        <motion.circle
          cx={-27} cy={-18}
          animate={{
            r:  eyes > 0 ? 3 : 7,
            cx: -27 + Math.max(0, eyes) * 5,
            cy: -18 - Math.max(0, eyes) * 3,
          }}
          fill="#0a0a0a"
          transition={{ duration: 0.9 }}
        />
        {/* Glanzpunkt – freundliche/neutrale Augen */}
        {eyes <= 0.1 && (
          <circle cx={-32} cy={-22} r={2.5} fill="white" opacity={0.75} />
        )}
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
        {/* Augenbraue: böse = V-Form zur Nase, gut = sanfte Wölbung */}
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

        {/* RECHTES AUGE */}
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
            r:  eyes > 0 ? 3 : 7,
            cx: 27 - Math.max(0, eyes) * 5,
            cy: -18 - Math.max(0, eyes) * 3,
          }}
          fill="#0a0a0a"
          transition={{ duration: 0.9 }}
        />
        {eyes <= 0.1 && (
          <circle cx={22} cy={-22} r={2.5} fill="white" opacity={0.75} />
        )}
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
          // BÖSE: große ovale Öffnung mit langen Zähnen und Glühen
          <g>
            {/* Mundöffnung als dunkles Oval */}
            <motion.ellipse
              cx={0} cy={35}
              rx={30 + mouth * 10} ry={10 + mouth * 7}
              fill="#0a0a0a"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            {/* 5 große Zähne – starten an der Oberkante des Ovals */}
            {[-24, -12, 0, 12, 24].map((x, i) => {
              const topY = 35 - (10 + mouth * 7);       // Oberkante Oval
              const tipY = 35 + (10 + mouth * 7) * 0.6; // ~60% Tiefe
              return (
                <motion.polygon
                  key={i}
                  points={`${x - 5},${topY} ${x + 5},${topY} ${x},${tipY}`}
                  fill="#f5f5f5"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.3, delay: 0.35 + i * 0.07 }}
                  style={{ transformOrigin: `${x}px ${topY}px` }}
                />
              );
            })}
            {/* Pinkes Zungen-Glühen */}
            {mouth > 0.4 && (
              <motion.ellipse
                cx={0} cy={40}
                rx={14 + mouth * 6} ry={4 + mouth * 2}
                fill={pink}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 0.9 }}
              />
            )}
          </g>
        ) : (
          // GUT/NEUTRAL: ehrliches Lächeln
          <motion.path
            d={`M -24 28 Q 0 ${38 + Math.max(0, -mouth) * 12} 24 28`}
            fill="none" stroke="#0a0a0a" strokeWidth={4} strokeLinecap="round"
            animate={{ d: `M -24 28 Q 0 ${38 + Math.max(0, -mouth) * 12} 24 28` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}

        {/* Wangen-Röte bei freundlich */}
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
