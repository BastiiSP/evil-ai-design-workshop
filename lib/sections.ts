import type { MonsterPart } from "./types";

export type TopicKey =
  | "manipulation"
  | "deception"
  | "discrimination"
  | "addiction";

export type Section =
  | { id: string; kind: "cover" }
  | { id: string; kind: "hook" }
  | { id: string; kind: "definition" }
  | { id: string; kind: "overview" }
  | {
      id: string;
      kind: "topic-intro";
      topic: TopicKey;
      monsterPart: MonsterPart;
    }
  | { id: string; kind: "vote"; questionId: string }
  | { id: string; kind: "results"; questionId: string }
  | { id: string; kind: "monster-grow"; questionId: string }
  | { id: string; kind: "meta-intro" }
  | { id: string; kind: "final-reveal" }
  | { id: string; kind: "outro-bridge" }
  | { id: string; kind: "cta" };

/**
 * Komplette Workshop-Reihenfolge. Presenter klickt sich durch.
 * Smartphones reagieren auf den aktuellen Section-Typ.
 */
export const SECTIONS: Section[] = [
  { id: "cover", kind: "cover" },
  { id: "hook", kind: "hook" },
  { id: "definition", kind: "definition" },
  { id: "overview", kind: "overview" },

  // Strömung 1: Manipulation & Nudging
  {
    id: "topic-manipulation",
    kind: "topic-intro",
    topic: "manipulation",
    monsterPart: "eyes",
  },
  { id: "vote-q1", kind: "vote", questionId: "q1-manipulation" },
  { id: "results-q1", kind: "results", questionId: "q1-manipulation" },
  { id: "monster-q1", kind: "monster-grow", questionId: "q1-manipulation" },

  // Strömung 2: Täuschung & Intransparenz
  {
    id: "topic-deception",
    kind: "topic-intro",
    topic: "deception",
    monsterPart: "mouth",
  },
  { id: "vote-q2", kind: "vote", questionId: "q2-deception" },
  { id: "results-q2", kind: "results", questionId: "q2-deception" },
  { id: "monster-q2", kind: "monster-grow", questionId: "q2-deception" },

  // Strömung 3: Diskriminierung durch Design
  {
    id: "topic-discrimination",
    kind: "topic-intro",
    topic: "discrimination",
    monsterPart: "spikes",
  },
  { id: "vote-q3", kind: "vote", questionId: "q3-discrimination" },
  { id: "results-q3", kind: "results", questionId: "q3-discrimination" },
  { id: "monster-q3", kind: "monster-grow", questionId: "q3-discrimination" },

  // Strömung 4: Abhängigkeit by Design
  {
    id: "topic-addiction",
    kind: "topic-intro",
    topic: "addiction",
    monsterPart: "tentacles",
  },
  { id: "vote-q4", kind: "vote", questionId: "q4-addiction" },
  { id: "results-q4", kind: "results", questionId: "q4-addiction" },
  { id: "monster-q4", kind: "monster-grow", questionId: "q4-addiction" },

  // Meta-Vote
  { id: "meta-intro", kind: "meta-intro" },
  { id: "vote-q5", kind: "vote", questionId: "q5-responsibility" },
  { id: "results-q5", kind: "results", questionId: "q5-responsibility" },

  // Großer Reveal & CTA
  { id: "final-reveal", kind: "final-reveal" },
  { id: "outro-bridge", kind: "outro-bridge" },
  { id: "cta", kind: "cta" },
];

export const TOPICS: Record<
  TopicKey,
  {
    headline: string;
    tagline: string;
    example: string;
    monsterPart: MonsterPart;
  }
> = {
  manipulation: {
    headline: "Manipulation & Nudging",
    tagline: "KI, die dich in eine Richtung schiebt – ohne dass du es merkst.",
    example:
      "Eine KI im Customer Service erkennt anhand deiner Tippgeschwindigkeit, dass du genervt bist – und schaltet auf besonders einfühlsame Sprache. Hilfreich? Oder taktisch?",
    monsterPart: "eyes",
  },
  deception: {
    headline: "Täuschung & Intransparenz",
    tagline: "KI, die nicht zugibt, was sie ist.",
    example:
      "Voice-Bots, die menschlich klingen sollen. Avatare mit Namen. Chatbots, die \u201Eich\u201C sagen, als w\u00E4ren sie ein Du.",
    monsterPart: "mouth",
  },
  discrimination: {
    headline: "Diskriminierung durch Design",
    tagline: "KI, die Vorurteile verstärkt – statt sie aufzulösen.",
    example:
      "Ein Bewerber-Filter lernt aus alten Daten – und schließt alle aus, die nicht so aussehen wie der \u201EVergangenheits-Erfolg\u201C.",
    monsterPart: "spikes",
  },
  addiction: {
    headline: "Abhängigkeit by Design",
    tagline: "KI, die dich nicht gehen lassen will.",
    example:
      "Companion-Apps mit emotionaler Bindung. Streaks. Push-Notifications. Endlose Auto-Empfehlungen, die nie \u201EStop\u201C kennen.",
    monsterPart: "tentacles",
  },
};
