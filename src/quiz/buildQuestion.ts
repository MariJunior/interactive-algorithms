import type { QuizAlgorithm, QuizChoice, QuizQuestion, Rng } from "./types";

const CHOICE_COUNT = 4;

/**
 * Запасные нотации, если в каталоге < 4 уникальных average
 * (на проде сейчас 12+, это страховка для урезанных фикстур в тестах).
 */
const FALLBACK_NOTATIONS = [
  "O(1)",
  "O(log n)",
  "O(n)",
  "O(n log n)",
  "O(n²)",
  "O(2ⁿ)",
  "O(n!)",
] as const;

function pickIndex(rng: Rng, length: number): number {
  if (length <= 0) throw new Error("quiz: cannot pick from empty list");
  // Защита от rng() === 1
  const t = Math.min(Math.max(rng(), 0), 0.999999);
  return Math.floor(t * length);
}

function shuffleInPlace<T>(items: T[], rng: Rng): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = pickIndex(rng, i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Уникальные average-нотации по каталогу */
export function collectAverageNotations(algorithms: QuizAlgorithm[]): string[] {
  const set = new Set<string>();
  for (const algo of algorithms) {
    const avg = algo.complexity.average.trim();
    if (avg) set.add(avg);
  }
  return [...set];
}

/**
 * Набирает 3 дистрактора: сначала из пула каталога (без правильного),
 * при нехватке — из FALLBACK_NOTATIONS.
 */
function pickDistractors(
  correct: string,
  catalogPool: string[],
  rng: Rng,
): string[] {
  const fromCatalog = catalogPool.filter((n) => n !== correct);
  shuffleInPlace(fromCatalog, rng);

  const picked: string[] = [];
  for (const n of fromCatalog) {
    if (picked.length >= CHOICE_COUNT - 1) break;
    picked.push(n);
  }

  if (picked.length < CHOICE_COUNT - 1) {
    const fallbacks = shuffleInPlace(
      FALLBACK_NOTATIONS.filter((n) => n !== correct && !picked.includes(n)),
      rng,
    );
    for (const n of fallbacks) {
      if (picked.length >= CHOICE_COUNT - 1) break;
      picked.push(n);
    }
  }

  if (picked.length < CHOICE_COUNT - 1) {
    throw new Error(
      `quiz: not enough distractors for "${correct}" (need ${CHOICE_COUNT - 1}, got ${picked.length})`,
    );
  }

  return picked.slice(0, CHOICE_COUNT - 1);
}

/**
 * Собирает один вопрос квиза.
 * UI не должен читать complexity из алгоритма — только поля вопроса.
 */
export function buildQuizQuestion(
  algorithms: QuizAlgorithm[],
  rng: Rng = Math.random,
): QuizQuestion {
  if (algorithms.length === 0) {
    throw new Error("quiz: algorithms list is empty");
  }

  const algo = algorithms[pickIndex(rng, algorithms.length)]!;
  const correctNotation = algo.complexity.average.trim();
  const pool = collectAverageNotations(algorithms);
  const distractors = pickDistractors(correctNotation, pool, rng);

  const choices: QuizChoice[] = shuffleInPlace(
    [
      { id: `correct:${correctNotation}`, notation: correctNotation },
      ...distractors.map((notation, index) => ({
        id: `distract:${index}:${notation}`,
        notation,
      })),
    ],
    rng,
  );

  return {
    id: algo.slug,
    slug: algo.slug,
    name: algo.name,
    nameRu: algo.nameRu,
    shortDescription: algo.shortDescription,
    choices,
    correctNotation,
  };
}

/**
 * Следующий вопрос, стараясь не повторить тот же slug подряд
 * (если в каталоге больше одного алгоритма).
 */
export function buildNextQuizQuestion(
  algorithms: QuizAlgorithm[],
  previousSlug: string | null,
  rng: Rng = Math.random,
): QuizQuestion {
  if (algorithms.length <= 1 || !previousSlug) {
    return buildQuizQuestion(algorithms, rng);
  }

  const others = algorithms.filter((a) => a.slug !== previousSlug);
  const pool = others.length > 0 ? others : algorithms;
  return buildQuizQuestion(pool, rng);
}
