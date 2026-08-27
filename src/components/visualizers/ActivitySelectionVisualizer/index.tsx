import type { ActivityGreedyStep } from "@/algorithms/types";
import styles from "./ActivitySelectionVisualizer.module.css";

interface ActivitySelectionVisualizerProps {
  step: ActivityGreedyStep | null;
  task?: string;
  ruleHint?: string;
}

/**
 * Timeline задачи составления расписания (жадный выбор интервалов).
 */
export default function ActivitySelectionVisualizer({
  step,
  task = "Задача составления расписания: максимум непересекающихся интервалов",
  ruleHint = "Сортируем по окончанию ↑; берём, если start ≥ lastFinish",
}: ActivitySelectionVisualizerProps) {
  if (!step) {
    return <div className={styles.placeholder}>Нет данных для визуализации</div>;
  }

  const maxT = Math.max(...step.activities.map((a) => a.finish), 1);
  const byId = new Map(step.activities.map((a) => [a.id, a]));

  return (
    <div className={styles.root}>
      <p className={styles.task}>
        <span className={styles.taskLabel}>Задача:</span> {task}
      </p>
      <p className={styles.rule}>
        <span className={styles.taskLabel}>Правило:</span> {ruleHint}
      </p>
      {step.formula && (
        <p className={styles.formula}>
          <span className={styles.taskLabel}>Сейчас:</span> {step.formula}
        </p>
      )}

      <ul className={styles.legend}>
        <li>
          <span className={`${styles.swatch} ${styles.swatchSelected}`} />
          выбрана
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchConsider}`} />
          смотрим
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchSkip}`} />
          пропуск
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchIdle}`} />
          ещё нет
        </li>
      </ul>

      <div className={styles.timeline} role="img" aria-label={step.message ?? "Расписание"}>
        {step.orderIds.map((id) => {
          const activity = byId.get(id);
          if (!activity) return null;
          const left = (activity.start / maxT) * 100;
          const width = ((activity.finish - activity.start) / maxT) * 100;
          const isSelected = step.selectedIds.includes(id);
          const isConsidering = step.consideringId === id;
          const wasSkipped =
            step.action === "skip" && isConsidering
              ? true
              : !isSelected &&
                step.orderIds.indexOf(id) <
                  step.orderIds.indexOf(step.consideringId ?? "") &&
                step.consideringId !== undefined;

          const stateClass = isConsidering
            ? step.action === "skip"
              ? styles.barSkip
              : styles.barConsider
            : isSelected
              ? styles.barSelected
              : wasSkipped
                ? styles.barSkip
                : styles.barIdle;

          return (
            <div key={id} className={styles.row}>
              <span className={styles.rowLabel}>{activity.label}</span>
              <div className={styles.track}>
                <div
                  className={`${styles.bar} ${stateClass}`}
                  style={{ left: `${left}%`, width: `${Math.max(width, 2)}%` }}
                  title={`${activity.label}: [${activity.start}, ${activity.finish})`}
                />
              </div>
              <span className={styles.rowTime}>
                {activity.start}–{activity.finish}
              </span>
            </div>
          );
        })}
      </div>

      <p className={styles.meta}>
        Выбрано:{" "}
        <span className={styles.metaStrong}>
          {step.selectedIds.length > 0
            ? step.selectedIds
                .map((id) => byId.get(id)?.label ?? id)
                .join(", ")
            : "пока ничего"}
        </span>
        {step.lastFinish !== -Infinity && (
          <>
            {" "}
            · lastFinish=
            <span className={styles.metaStrong}>{step.lastFinish}</span>
          </>
        )}
      </p>
    </div>
  );
}
