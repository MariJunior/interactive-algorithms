export type {
  CheckAnswerResult,
  QuizAlgorithm,
  QuizChoice,
  QuizQuestion,
  Rng,
} from "./types";
export {
  buildNextQuizQuestion,
  buildQuizQuestion,
  collectAverageNotations,
} from "./buildQuestion";
export { checkAnswer } from "./checkAnswer";
