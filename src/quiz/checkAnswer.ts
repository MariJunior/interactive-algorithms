import type { CheckAnswerResult, QuizQuestion } from "./types";

/** Сверяет выбранную нотацию с правильным average */
export function checkAnswer(
  question: QuizQuestion,
  chosenNotation: string,
): CheckAnswerResult {
  const chosen = chosenNotation.trim();
  const correct = question.correctNotation.trim();
  return {
    correct: chosen === correct,
    correctNotation: correct,
    chosenNotation: chosen,
  };
}
