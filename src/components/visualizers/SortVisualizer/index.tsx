import type { SortStep } from "@/algorithms/types";
import { motion } from "framer-motion";
import styles from "./SortVisualizer.module.css";

type BarState = "default" | "comparing" | "swapping" | "sorted" | "selected";

interface SortVisualizerProps {
  /** Текущий шаг из генератора — визуализатор только рендерит, без алгоритмики */
  step: SortStep | null;
}

function resolveBarState(index: number, step: SortStep): BarState {
  // Приоритет: активные действия виднее фона уже отсортированных
  if (step.swapping?.includes(index)) return "swapping";
  if (step.action === "merge" && step.comparing?.includes(index)) return "selected";
  if (step.action === "insert" && step.comparing?.includes(index)) return "selected";
  if (step.comparing?.includes(index)) return "comparing";
  if (step.pivot === index) return "selected";
  if (step.sorted?.includes(index)) return "sorted";
  return "default";
}

/**
 * 2D bar-chart визуализатор сортировки.
 * Presentation layer: принимает SortStep и ничего не вычисляет сам.
 */
export default function SortVisualizer({ step }: SortVisualizerProps) {
  if (!step || step.array.length === 0) {
    return <div className={styles.empty}>Нет данных для визуализации</div>;
  }

  const maxValue = Math.max(...step.array, 1);

  return (
    <div className={styles.chart} role="img" aria-label={step.message ?? "Состояние массива"}>
      {step.array.map((value, index) => {
        const state = resolveBarState(index, step);
        const heightPercent = Math.max((value / maxValue) * 100, 4);

        return (
          <div key={index} className={styles.barWrap}>
            <motion.div
              className={`${styles.bar} ${styles[state]}`}
              // Анимируем высоту при swap/сдвигах; layout сглаживает соседние сдвиги
              animate={{ height: `${heightPercent}%` }}
              layout
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            />
            <span className={styles.value}>{value}</span>
          </div>
        );
      })}
    </div>
  );
}
