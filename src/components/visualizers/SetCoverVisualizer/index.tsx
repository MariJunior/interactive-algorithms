import type { SetCoverGreedyStep } from "@/algorithms/types";
import styles from "./SetCoverVisualizer.module.css";

interface SetCoverVisualizerProps {
  step: SetCoverGreedyStep | null;
  task?: string;
  ruleHint?: string;
}

/**
 * Универсум + кандидатные подмножества для жадного покрытия.
 */
export default function SetCoverVisualizer({
  step,
  task = "Задача о покрытии множества: покрыть универсум минимумом подмножеств",
  ruleHint = "На каждом шаге берём множество, закрывающее больше всего ещё непокрытых элементов",
}: SetCoverVisualizerProps) {
  if (!step) {
    return <div className={styles.placeholder}>Нет данных для визуализации</div>;
  }

  const uncovered = new Set(step.uncoveredIds);
  const selected = new Set(step.selectedIds);
  const byId = new Map(step.universe.map((el) => [el.id, el]));

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
          <span className={`${styles.swatch} ${styles.swatchUncovered}`} />
          непокрыт
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchCovered}`} />
          покрыт
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchSelected}`} />
          выбрано
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchConsider}`} />
          смотрим
        </li>
      </ul>

      <div className={styles.universe} aria-label="Универсум">
        <span className={styles.blockLabel}>Универсум</span>
        <div className={styles.chips}>
          {step.universe.map((el) => {
            const isOpen = uncovered.has(el.id);
            return (
              <span
                key={el.id}
                className={`${styles.chip} ${
                  isOpen ? styles.chipUncovered : styles.chipCovered
                }`}
              >
                {el.label}
              </span>
            );
          })}
        </div>
      </div>

      <ul className={styles.sets} aria-label="Кандидатные множества">
        {step.candidates.map((candidate) => {
          const isSelected = selected.has(candidate.id);
          const isConsidering = step.consideringId === candidate.id;
          const gain =
            isConsidering && step.gain !== undefined
              ? step.gain
              : candidate.elementIds.filter((id) => uncovered.has(id)).length;

          return (
            <li
              key={candidate.id}
              className={`${styles.set} ${
                isSelected ? styles.setSelected : ""
              } ${isConsidering ? styles.setConsider : ""}`}
            >
              <div className={styles.setHead}>
                <strong>{candidate.label}</strong>
                <span className={styles.gain}>
                  {isSelected ? "взято" : `+${gain}`}
                </span>
              </div>
              <div className={styles.chips}>
                {candidate.elementIds.map((id) => {
                  const el = byId.get(id);
                  return (
                    <span
                      key={id}
                      className={`${styles.chip} ${
                        uncovered.has(id) ? styles.chipUncovered : styles.chipCovered
                      }`}
                    >
                      {el?.label ?? id}
                    </span>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
