import type { MonsterState, Question, VotePayload } from "./types";
import { INITIAL_MONSTER } from "./types";
import { SECTIONS, type Section } from "./sections";

/** Vote-Counts pro Question, dedupliziert nach clientId */
export function aggregateCounts(
  votes: VotePayload[]
): Record<string, Record<string, number>> {
  const seen = new Map<string, string>(); // key: questionId|clientId, value: optionId
  for (const v of votes) {
    seen.set(`${v.questionId}|${v.clientId}`, v.optionId);
  }
  const result: Record<string, Record<string, number>> = {};
  for (const [key, optionId] of seen) {
    const [questionId] = key.split("|");
    result[questionId] ??= {};
    result[questionId][optionId] = (result[questionId][optionId] ?? 0) + 1;
  }
  return result;
}

/**
 * Aus Vote-Counts den MonsterState ableiten – nur für Fragen,
 * deren `monster-grow`-Section bereits durchschritten wurde
 * (also currentSectionIndex >= position der monster-grow Slide).
 *
 * Skala: avgEvilScore in [-2, +2] * 5 = monsterPart in [-10, +10]
 */
export function computeMonster(
  counts: Record<string, Record<string, number>>,
  questions: Question[],
  currentSectionIndex: number
): MonsterState {
  const monster: MonsterState = { ...INITIAL_MONSTER };
  const SCALE = 5;

  for (let i = 0; i <= currentSectionIndex; i++) {
    const section = SECTIONS[i];
    if (!section) continue;
    if (section.kind !== "monster-grow" && section.kind !== "final-reveal") {
      continue;
    }
    // Bei final-reveal alle bisherigen monster-grow Sections bleiben aktiv.
    if (section.kind !== "monster-grow") continue;

    const question = questions.find((q) => q.id === section.questionId);
    if (!question) continue;
    const qCounts = counts[question.id] ?? {};
    const total = Object.values(qCounts).reduce((s, n) => s + n, 0);
    if (total === 0) continue;

    let weighted = 0;
    for (const opt of question.options) {
      weighted += (qCounts[opt.id] ?? 0) * opt.evilScore;
    }
    const avg = weighted / total;
    monster[question.monsterPart] += avg * SCALE;

    // Aura zusätzlich kumulativ beeinflussen (kleinerer Effekt von allen)
    if (question.monsterPart !== "aura") {
      monster.aura += avg * (SCALE / 4);
    }
  }
  // Auf [-10, +10] clampen
  for (const k of Object.keys(monster) as Array<keyof MonsterState>) {
    monster[k] = Math.max(-10, Math.min(10, monster[k]));
  }
  return monster;
}

/** Findet das aktuelle Section-Objekt aus dem sectionIndex */
export function getSection(index: number): Section | undefined {
  return SECTIONS[index];
}

export function getActiveQuestionId(index: number): string | undefined {
  const section = SECTIONS[index];
  if (!section) return undefined;
  if (section.kind === "vote") return section.questionId;
  return undefined;
}
