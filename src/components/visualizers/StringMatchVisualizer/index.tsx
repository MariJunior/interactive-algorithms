import type { StringStep } from "@/algorithms/types";
import styles from "./StringMatchVisualizer.module.css";

type CharState = "default" | "window" | "matched" | "focus" | "foundCell";

interface StringMatchVisualizerProps {
  step: StringStep | null;
  task?: string;
  strategyHint?: string;
}

function textCharState(index: number, step: StringStep): CharState {
  if (
    step.action === "done" &&
    step.foundStarts.some(
      (start) => index >= start && index < start + step.pattern.length,
    )
  ) {
    return "foundCell";
  }
  if (step.textIndex === index) return "focus";
  if (step.matchedInWindow?.includes(index)) return "matched";
  if (
    index >= step.windowStart &&
    index < step.windowStart + step.pattern.length
  ) {
    return "window";
  }
  return "default";
}

function patternCharState(index: number, step: StringStep): CharState {
  if (step.patternIndex === index) return "focus";
  if (
    step.matchedInWindow?.some(
      (ti) => ti - step.windowStart === index,
    )
  ) {
    return "matched";
  }
  return "default";
}

/**
 * Визуализация поиска подстроки: текст + выровненный паттерн.
 */
export default function StringMatchVisualizer({
  step,
  task = "Найти все вхождения паттерна в тексте",
  strategyHint = "сравниваем символы в текущем окне",
}: StringMatchVisualizerProps) {
  if (!step) {
    return <div className={styles.placeholder}>Нет данных для визуализации</div>;
  }

  const patternOffset = step.windowStart;

  return (
    <div className={styles.root}>
      <p className={styles.task} aria-live="polite">
        <span className={styles.taskLabel}>Задача:</span> {task}
      </p>
      <p className={styles.strategy}>
        <span className={styles.taskLabel}>Стратегия:</span> {strategyHint}
      </p>

      <ul className={styles.legend} aria-label="Обозначения">
        <li>
          <span className={`${styles.swatch} ${styles.swatchFocus}`} />
          сравниваем
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchMatched}`} />
          совпало
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchWindow}`} />
          окно
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchFound}`} />
          найдено
        </li>
      </ul>

      <div className={styles.board} role="img" aria-label={step.message ?? "Поиск подстроки"}>
        <div className={styles.rowLabel}>Текст</div>
        <div className={styles.row}>
          {step.text.split("").map((ch, index) => (
            <span
              key={`t-${index}`}
              className={`${styles.cell} ${styles[textCharState(index, step)]}`}
            >
              {ch}
            </span>
          ))}
        </div>

        <div className={styles.rowLabel}>Паттерн</div>
        <div className={styles.row}>
          {/* Сдвиг паттерна под текущее окно */}
          {Array.from({ length: patternOffset }).map((_, index) => (
            <span key={`pad-${index}`} className={`${styles.cell} ${styles.pad}`} />
          ))}
          {step.pattern.split("").map((ch, index) => (
            <span
              key={`p-${index}`}
              className={`${styles.cell} ${styles[patternCharState(index, step)]}`}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      {step.lps && step.lps.length > 0 && (
        <p className={styles.lps}>
          <span className={styles.taskLabel}>LPS:</span>{" "}
          <code>[{step.lps.join(", ")}]</code>
          <span className={styles.lpsHint}>
            {" "}
            — для каждого суффикса паттерна: длина совпадающего префикса (умный сдвиг)
          </span>
        </p>
      )}

      <p className={styles.foundLine}>
        Найдено:{" "}
        <span className={styles.metaStrong}>
          {step.foundStarts.length > 0
            ? step.foundStarts.map((s) => s).join(", ")
            : "пока ничего"}
        </span>
      </p>
    </div>
  );
}
