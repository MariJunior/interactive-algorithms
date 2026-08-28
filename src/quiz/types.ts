import type { AlgorithmMeta } from "@/algorithms/types";

/** Генератор [0, 1) — инъекция для детерминированных тестов */
export type Rng = () => number;

/** Один вариант ответа (нотация Big O) */
export interface QuizChoice {
  id: string;
  notation: string;
}

/**
 * Вопрос квиза «угадай среднюю сложность».
 * Намеренно без complexity в payload для UI — правильный ответ только в correctNotation.
 */
export interface QuizQuestion {
  /** Стабильный id вопроса (slug алгоритма) */
  id: string;
  slug: string;
  name: string;
  nameRu: string;
  shortDescription: string;
  /** Ровно 4 варианта; один из них = correctNotation */
  choices: QuizChoice[];
  correctNotation: string;
}

export type CheckAnswerResult = {
  correct: boolean;
  correctNotation: string;
  chosenNotation: string;
};

/** Минимальный срез метаданных, нужный квизу (удобно в тестах без всего каталога) */
export type QuizAlgorithm = Pick<
  AlgorithmMeta,
  "slug" | "name" | "nameRu" | "shortDescription" | "complexity"
>;
