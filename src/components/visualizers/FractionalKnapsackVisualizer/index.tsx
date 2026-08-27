import type { KnapsackGreedyStep } from "@/algorithms/types";
import styles from "./FractionalKnapsackVisualizer.module.css";

interface FractionalKnapsackVisualizerProps {
  step: KnapsackGreedyStep | null;
  task?: string;
  ruleHint?: string;
}

export default function FractionalKnapsackVisualizer({
  step,
  task = "Задача о рюкзаке (дробный): максимум ценности при лимите веса",
  ruleHint = "Сортируем по value/weight ↓; берём целиком или долю",
}: FractionalKnapsackVisualizerProps) {
  if (!step) {
    return <div className={styles.placeholder}>Нет данных для визуализации</div>;
  }

  const byId = new Map(step.items.map((item) => [item.id, item]));
  const filled = step.capacity === 0 ? 0 : 1 - step.remaining / step.capacity;

  return (
    <div className={styles.root}>
      <p className={styles.task}>
        <span className={styles.taskLabel}>Задача:</span> {task}
        <span className={styles.sep}>·</span>
        вместимость{" "}
        <span className={styles.metaStrong}>{step.capacity}</span>
      </p>
      <p className={styles.rule}>
        <span className={styles.taskLabel}>Правило:</span> {ruleHint}
      </p>
      {step.formula && (
        <p className={styles.formula}>
          <span className={styles.taskLabel}>Сейчас:</span> {step.formula}
        </p>
      )}

      <div className={styles.bag} aria-label="Заполнение рюкзака">
        <div className={styles.bagTrack}>
          <div className={styles.bagFill} style={{ width: `${filled * 100}%` }} />
        </div>
        <span className={styles.bagLabel}>
          занято {(filled * 100).toFixed(0)}% · остаток {step.remaining} · ценность{" "}
          {step.totalValue.toFixed(1)}
        </span>
      </div>

      <ul className={styles.list}>
        {step.orderIds.map((id) => {
          const item = byId.get(id);
          if (!item) return null;
          const density = (item.value / item.weight).toFixed(2);
          const fraction = step.takenFraction[id] ?? 0;
          const isConsidering = step.consideringId === id;

          return (
            <li
              key={id}
              className={`${styles.item} ${isConsidering ? styles.itemActive : ""}`}
            >
              <div className={styles.itemHead}>
                <strong>{item.label}</strong>
                <span>
                  w={item.weight} · v={item.value} · ρ={density}
                </span>
              </div>
              <div className={styles.itemBarTrack}>
                <div
                  className={styles.itemBar}
                  style={{ width: `${fraction * 100}%` }}
                />
              </div>
              <span className={styles.itemFrac}>
                взято {(fraction * 100).toFixed(0)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
