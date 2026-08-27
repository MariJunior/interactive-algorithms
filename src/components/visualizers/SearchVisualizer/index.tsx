import type { SearchStep } from "@/algorithms/types";
import { motion } from "framer-motion";
import styles from "./SearchVisualizer.module.css";

type CellState = "default" | "checking" | "found" | "eliminated" | "inRange";

interface SearchVisualizerProps {
  /** Текущий шаг из генератора — визуализатор только рендерит */
  step: SearchStep | null;
}

function resolveCellState(index: number, step: SearchStep): CellState {
  // Приоритет: найденный / проверяемый важнее отсечённых
  if (step.foundIndex === index || (step.action === "found" && step.checking === index)) {
    return "found";
  }
  if (step.checking === index) return "checking";
  if (step.eliminated?.includes(index)) return "eliminated";
  // Бинарный поиск: подсвечиваем активное окно [low…high]
  if (
    step.low !== undefined &&
    step.high !== undefined &&
    index >= step.low &&
    index <= step.high
  ) {
    return "inRange";
  }
  return "default";
}

/**
 * 2D bar-chart визуализатор поиска.
 * Presentation layer: принимает SearchStep и ничего не вычисляет сам.
 */
export default function SearchVisualizer({ step }: SearchVisualizerProps) {
  if (!step || step.array.length === 0) {
    return <div className={styles.empty}>Нет данных для визуализации</div>;
  }

  const maxValue = Math.max(...step.array, 1);

  return (
    <div className={styles.root}>
      <p className={styles.target} aria-live="polite">
        Цель: <span className={styles.targetValue}>{step.target}</span>
      </p>

      <div className={styles.chart} role="img" aria-label={step.message ?? "Состояние поиска"}>
        {step.array.map((value, index) => {
          const state = resolveCellState(index, step);
          const heightPercent = Math.max((value / maxValue) * 100, 4);

          return (
            <div key={index} className={styles.barWrap}>
              <motion.div
                className={`${styles.bar} ${styles[state]}`}
                animate={{ height: `${heightPercent}%` }}
                layout
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
              <span className={styles.value}>{value}</span>
              <span className={styles.index}>{index}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
