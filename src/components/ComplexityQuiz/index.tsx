import { ALGORITHMS } from "@/data/algorithms";
import {
  buildNextQuizQuestion,
  buildQuizQuestion,
  checkAnswer,
  type QuizQuestion,
} from "@/quiz";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ComplexityQuiz.module.css";

type Phase = "picking" | "revealed";

function newQuestion(previousSlug: string | null): QuizQuestion {
  return previousSlug
    ? buildNextQuizQuestion(ALGORITHMS, previousSlug)
    : buildQuizQuestion(ALGORITHMS);
}

/**
 * Presentation: квиз «угадай среднюю Big O».
 * Domain — только через @/quiz (без чтения complexity из карточки).
 */
export default function ComplexityQuiz() {
  const [question, setQuestion] = useState<QuizQuestion>(() => newQuestion(null));
  const [phase, setPhase] = useState<Phase>("picking");
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const result =
    phase === "revealed" && chosen !== null
      ? checkAnswer(question, chosen)
      : null;

  const onPick = useCallback(
    (notation: string) => {
      if (phase !== "picking") return;
      const verdict = checkAnswer(question, notation);
      setChosen(notation);
      setPhase("revealed");
      setScore((prev) => ({
        correct: prev.correct + (verdict.correct ? 1 : 0),
        total: prev.total + 1,
      }));
    },
    [phase, question],
  );

  const onNext = useCallback(() => {
    setQuestion(newQuestion(question.slug));
    setChosen(null);
    setPhase("picking");
  }, [question.slug]);

  return (
    <div className={styles.root}>
      <div className={styles.scoreRow} aria-live="polite">
        <span className={styles.scoreLabel}>Счёт</span>
        <span className={styles.scoreValue}>
          {score.correct}
          <span className={styles.scoreSep}>/</span>
          {score.total}
        </span>
      </div>

      <div className={styles.prompt}>
        <p className={styles.promptEyebrow}>Средняя сложность (average)</p>
        <h3 className={styles.algoName}>
          {question.name}
          <span className={styles.algoNameRu}>{question.nameRu}</span>
        </h3>
        <p className={styles.algoHint}>{question.shortDescription}</p>
      </div>

      <div className={styles.choices} role="group" aria-label="Варианты Big O">
        {question.choices.map((choice) => {
          const isChosen = chosen === choice.notation;
          const isCorrectChoice =
            phase === "revealed" && choice.notation === question.correctNotation;
          const isWrongPick =
            phase === "revealed" && isChosen && !isCorrectChoice;

          return (
            <button
              key={choice.id}
              type="button"
              className={[
                styles.choice,
                isCorrectChoice ? styles.choiceCorrect : "",
                isWrongPick ? styles.choiceWrong : "",
                phase === "revealed" && !isCorrectChoice && !isWrongPick
                  ? styles.choiceMuted
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onPick(choice.notation)}
              disabled={phase === "revealed"}
              aria-pressed={isChosen}
            >
              <span className={styles.choiceNotation}>{choice.notation}</span>
            </button>
          );
        })}
      </div>

      {result && (
        <div
          className={`${styles.feedback} ${result.correct ? styles.feedbackOk : styles.feedbackBad}`}
          role="status"
        >
          <p className={styles.feedbackText}>
            {result.correct
              ? "Верно — это средняя сложность."
              : `Неверно. Правильный ответ: ${result.correctNotation}`}
          </p>
          <div className={styles.feedbackActions}>
            <Link
              to={`/algorithm/${question.slug}`}
              className={styles.algoLink}
            >
              Открыть {question.nameRu}
            </Link>
            <button type="button" className={styles.nextBtn} onClick={onNext}>
              Дальше
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
