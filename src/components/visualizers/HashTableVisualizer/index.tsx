import type { HashTableStep } from "@/algorithms/types";
import styles from "./HashTableVisualizer.module.css";

interface HashTableVisualizerProps {
  step: HashTableStep | null;
  task?: string;
  ruleHint?: string;
}

/**
 * Массив бакетов + цепочки (chaining) для учебной хеш-таблицы.
 */
export default function HashTableVisualizer({
  step,
  task = "Хеш-таблица: положить и найти ключ в среднем за O(1)",
  ruleHint = "hash(key) = сумма кодов символов % capacity; коллизии — в цепочку",
}: HashTableVisualizerProps) {
  if (!step) {
    return <div className={styles.placeholder}>Нет данных для визуализации</div>;
  }

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
          <span className={`${styles.swatch} ${styles.swatchFocus}`} />
          бакет в фокусе
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchEntry}`} />
          запись
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchHit}`} />
          найдено / только что положили
        </li>
      </ul>

      <div
        className={styles.buckets}
        role="img"
        aria-label={step.message ?? "Состояние хеш-таблицы"}
      >
        {step.buckets.map((chain, index) => {
          const isFocus = step.focusIndex === index;
          return (
            <div
              key={index}
              className={`${styles.bucket} ${isFocus ? styles.bucketFocus : ""}`}
            >
              <span className={styles.bucketIndex}>[{index}]</span>
              <div className={styles.chain}>
                {chain.length === 0 ? (
                  <span className={styles.empty}>∅</span>
                ) : (
                  chain.map((entry) => {
                    const isHit =
                      entry.key === step.focusKey &&
                      (step.action === "found" ||
                        step.action === "place" ||
                        step.action === "collide");
                    return (
                      <span
                        key={`${entry.key}:${entry.value}`}
                        className={`${styles.entry} ${isHit ? styles.entryHit : ""}`}
                      >
                        <strong>{entry.key}</strong>
                        <span className={styles.arrow}>→</span>
                        {entry.value}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(step.hashSum !== undefined || step.focusKey) && (
        <p className={styles.meta}>
          {step.focusKey && (
            <>
              ключ <span className={styles.metaStrong}>{step.focusKey}</span>
            </>
          )}
          {step.hashIndex !== undefined && (
            <>
              {" "}
              · индекс <span className={styles.metaStrong}>{step.hashIndex}</span>
            </>
          )}
          {step.hashSum !== undefined && (
            <>
              {" "}
              · Σ = <span className={styles.metaStrong}>{step.hashSum}</span>
            </>
          )}
        </p>
      )}
    </div>
  );
}
