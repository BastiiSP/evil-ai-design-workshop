"use client";

import { motion } from "framer-motion";
import type { MonsterState } from "@/lib/types";

/**
 * Modulares Comic-Monster. Body-Parts skalieren je nach `state` (-10..+10).
 * Negativ = freundlich (Türkis-Glow, sanfte Form). Positiv = böse (Pink-Glitch, scharfe Formen).
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
  // Helper: Werte normalisieren
  const norm = (v: number) => Math.max(-1, Math.min(1, v / 10));
  const eyes = norm(state.eyes);
  const mouth = norm(state.mouth);
  const spikes = norm(state.spikes);
  const tentacles = norm(state.tentacles);
  const aura = norm(state.aura);

  // Body-Farbe driftet mit aura
  const bodyTurquoise = "#87cdcb";
  const bodyPink = "#db73a6";
  const bodyMix = aura >= 0 ? bodyPink : bodyTurquoise;
  const bodyAlt = aura >= 0 ? bodyTurquoise : bodyPink;
  const auraMagnitude = Math.abs(aura);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Aura / Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: `radial-gradient(circle, ${bodyMix}55 0%, ${bodyMix}11 50%, transparent 75%)`,
          scale: 1 + auraMagnitude * 0.3,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <svg
        viewBox="-100 -120 200 240"
        width={size}
        height={size}
        className="relative"
      >
        <defs>
          <radialGradient id="bodyGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={bodyAlt} stopOpacity="0.85" />
            <stop offset="60%" stopColor={bodyMix} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#212121" stopOpacity="1" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glitch" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
            <feDisplacementMap in="SourceGraphic" scale={4 + auraMagnitude * 6} />
          </filter>
        </defs>

        {/* Tentakeln (unten, wachsen mit `tentacles`) */}
        {[-1, -0.5, 0, 0.5, 1].map((offset, i) => {
          const baseLength = 30;
          const grow = Math.max(0, tentacles) * 70;
          const length = baseLength + grow;
          const x = offset * 35;
          return (
            <motion.path
              key={`tentacle-${i}`}
              d={`M ${x} 60 Q ${x + offset * 15} ${60 + length * 0.5}, ${x + offset * 25} ${60 + length}`}
              stroke={bodyMix}
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
              opacity={tentacles > -0.3 ? 0.8 : 0.2}
              animate={{ pathLength: 0.5 + Math.max(0, tentacles) * 0.5 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          );
        })}

        {/* Stacheln (Ring, wachsen mit `spikes`) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const baseR = 80;
          const grow = Math.max(0, spikes) * 30;
          const r1 = baseR + 5;
          const r2 = baseR + 15 + grow;
          const x1 = Math.cos(angle) * r1;
          const y1 = Math.sin(angle) * r1;
          const x2 = Math.cos(angle) * r2;
          const y2 = Math.sin(angle) * r2;
          return (
            <motion.line
              key={`spike-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={bodyMix}
              strokeWidth={Math.max(2, 2 + spikes * 3)}
              strokeLinecap="round"
              opacity={spikes > -0.3 ? 0.9 : 0.15}
              animate={{
                x2,
                y2,
                strokeWidth: Math.max(2, 2 + spikes * 3),
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          );
        })}

        {/* Körper (Blob) */}
        <motion.ellipse
          cx={0}
          cy={0}
          rx={75}
          ry={75}
          fill="url(#bodyGradient)"
          animate={{
            rx: 75 + (aura > 0 ? aura * 5 : 0),
            ry: 75 + (aura > 0 ? aura * -3 : aura * 2),
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          filter={aura > 0.3 ? "url(#glitch)" : undefined}
        />

        {/* Augen */}
        <g>
          {/* Linkes Auge */}
          <motion.circle
            cx={-25}
            cy={-15}
            r={14}
            fill="#f5f5f5"
            animate={{
              r: 14 + Math.abs(eyes) * 4,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.circle
            cx={-25}
            cy={-15}
            r={6}
            fill={eyes > 0 ? "#212121" : "#212121"}
            animate={{
              r: eyes > 0 ? 4 : 7, // bei "evil" verengen sich die Pupillen
              cx: -25 + eyes * 3,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          {/* Hypnose-Spirale wenn evil */}
          {eyes > 0.3 && (
            <motion.circle
              cx={-25}
              cy={-15}
              r={10}
              fill="none"
              stroke={bodyPink}
              strokeWidth={1}
              opacity={eyes}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "-25px -15px" }}
              strokeDasharray="2 4"
            />
          )}

          {/* Rechtes Auge */}
          <motion.circle
            cx={25}
            cy={-15}
            r={14}
            fill="#f5f5f5"
            animate={{
              r: 14 + Math.abs(eyes) * 4,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.circle
            cx={25}
            cy={-15}
            r={6}
            fill="#212121"
            animate={{
              r: eyes > 0 ? 4 : 7,
              cx: 25 + eyes * 3,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          {eyes > 0.3 && (
            <motion.circle
              cx={25}
              cy={-15}
              r={10}
              fill="none"
              stroke={bodyPink}
              strokeWidth={1}
              opacity={eyes}
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "25px -15px" }}
              strokeDasharray="2 4"
            />
          )}
        </g>

        {/* Mund */}
        {mouth > 0 ? (
          // Evil-Mode: zu viele Zähne, falsches Lächeln
          <g>
            <motion.path
              d="M -30 25 Q 0 50, 30 25 L 30 30 L -30 30 Z"
              fill="#212121"
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            {/* Zähne */}
            {[-25, -15, -5, 5, 15, 25].map((x, i) => (
              <motion.polygon
                key={i}
                points={`${x},25 ${x + 4},25 ${x + 2},${25 + 5 + mouth * 5}`}
                fill="#f5f5f5"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              />
            ))}
          </g>
        ) : (
          // Good-Mode: ehrliches, freundliches Lächeln
          <motion.path
            d={`M -22 25 Q 0 ${30 + Math.max(0, -mouth) * 8}, 22 25`}
            fill="none"
            stroke="#212121"
            strokeWidth={4}
            strokeLinecap="round"
            animate={{
              d: `M -22 25 Q 0 ${30 + Math.max(0, -mouth) * 8}, 22 25`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}
      </svg>

      {showLabel && (
        <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-[var(--color-fg-muted)] uppercase tracking-widest">
          Eyes {state.eyes.toFixed(1)} · Mouth {state.mouth.toFixed(1)} · Spikes{" "}
          {state.spikes.toFixed(1)} · Tentacles {state.tentacles.toFixed(1)} ·
          Aura {state.aura.toFixed(1)}
        </div>
      )}
    </div>
  );
}
