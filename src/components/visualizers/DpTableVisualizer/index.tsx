import type { DpStep } from "@/algorithms/types";
import { motion } from "framer-motion";
import styles from "./DpTableVisualizer.module.css";

type CellState = "cellEmpty" | "filled" | "focus" | "reading";

interface DpTableVisualizerProps {
  step: DpStep | null;
  task?: string;
  recurrenceHint?: string;
  indexLabel?: string;
}

function resolveCellState(index: number, step: DpStep): CellState {
  if (step.focusIndex === index && step.action !== "done") return "focus";
  if (step.reading?.includes(index)) return "reading";
  if (step.table[index] !== null && step.table[index] !== undefined) return "filled";
  return "cellEmpty";
}

/**
 * 1D DP-таблица: ячейки + формула текущего шага.
 * Presentation only.
 */
export default function DpTableVisualizer({
  step,
  task = "Заполнить таблицу DP и получить ответ",
  recurrenceHint = "смотри формулу текущего шага",
  indexLabel = "i",
}: DpTableVisualizerProps) {
  if (!step || step.table.length === 0) {
    return <div className={styles.placeholder}>Нет данных для визуализации</div>;
  }

  return (
    <div className={styles.root}>
      <p className={styles.task} aria-live="polite">
        <span className={styles.taskLabel}>Задача:</span> {task}
        <span className={styles.taskSep}>·</span>
        n = <span className={styles.metaStrong}>{step.n}</span>
      </p>

      <p className={styles.formulaBlock}>
        <span className={styles.taskLabel}>Рекуррентность:</span> {recurrenceHint}
      </p>

      {step.formula && (
        <p className={styles.currentFormula} aria-live="polite">
          <span className={styles.taskLabel}>Сейчас:</span>{" "}
          <code className={styles.formulaCode}>{step.formula}</code>
        </p>
      )}

      <ul className={styles.legend} aria-label="Обозначения ячеек">
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendFocus}`} />
          считаем
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendReading}`} />
          читаем
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendFilled}`} />
          готово
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendEmpty}`} />
          пусто
        </li>
      </ul>

      <div
        className={styles.table}
        role="img"
        aria-label={step.message ?? "Состояние DP-таблицы"}
      >
        {step.table.map((value, index) => {
          const state = resolveCellState(index, step);
          return (
            <div key={index} className={styles.cellWrap}>
              <span className={styles.cellIndex}>
                {indexLabel}={index}
              </span>
              <motion.div
                className={`${styles.cell} ${styles[state]}`}
                layout
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                {value === null || value === undefined ? "·" : value}
              </motion.div>
            </div>
          );
        })}
      </div>

      {step.result !== undefined && step.action === "done" && (
        <p className={styles.result}>
          Ответ: <span className={styles.metaStrong}>{step.result}</span>
        </p>
      )}
    </div>
  );
}
