import type { KnnStep } from "@/algorithms/types";
import styles from "./KnnVisualizer.module.css";

interface KnnVisualizerProps {
  step: KnnStep | null;
  task?: string;
  ruleHint?: string;
}

/**
 * 2D scatter двух классов + query + подсветка k соседей и голосов.
 */
export default function KnnVisualizer({
  step,
  task = "k ближайших соседей: классифицировать новую точку",
  ruleHint = "Берём k ближайших по евклидову расстоянию и голосуем большинством",
}: KnnVisualizerProps) {
  if (!step) {
    return <div className={styles.placeholder}>Нет данных для визуализации</div>;
  }

  const neighborSet = new Set(step.neighborIds);
  const radius =
    step.neighborIds.length > 0 && step.distances.length > 0
      ? Math.max(
          ...step.distances
            .filter((d) => neighborSet.has(d.id))
            .map((d) => d.distance),
          0,
        )
      : 0;

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

      <div className={styles.meta}>
        <span>
          k = <span className={styles.metaStrong}>{step.k}</span>
        </span>
        {step.prediction && (
          <span>
            класс: <span className={styles.metaStrong}>{step.prediction}</span>
          </span>
        )}
        {step.votes && (
          <span>
            голоса:{" "}
            <span className={styles.metaStrong}>
              {Object.entries(step.votes)
                .map(([label, count]) => `${label}×${count}`)
                .join(" · ")}
            </span>
          </span>
        )}
      </div>

      <ul className={styles.legend}>
        <li>
          <span className={`${styles.swatch} ${styles.swatchA}`} />
          класс A
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchB}`} />
          класс B
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchQuery}`} />
          query
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchNeighbor}`} />
          сосед
        </li>
      </ul>

      <svg
        className={styles.canvas}
        viewBox="0 0 400 260"
        role="img"
        aria-label={step.message ?? "k-NN"}
      >
        {radius > 0 && (step.action === "rank" || step.action === "vote" || step.action === "done") && (
          <circle
            cx={step.query.x}
            cy={step.query.y}
            r={radius}
            className={styles.kCircle}
          />
        )}

        {step.points.map((point) => {
          const isNeighbor = neighborSet.has(point.id);
          const isFocus = step.focusId === point.id;
          return (
            <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
              <circle
                r={isNeighbor || isFocus ? 11 : 9}
                className={`${styles.point} ${
                  point.label === "A" ? styles.pointA : styles.pointB
                } ${isNeighbor ? styles.pointNeighbor : ""} ${
                  isFocus ? styles.pointFocus : ""
                }`}
              />
              <text className={styles.pointLabel} textAnchor="middle" dy="0.35em">
                {point.label}
              </text>
            </g>
          );
        })}

        <g transform={`translate(${step.query.x}, ${step.query.y})`}>
          <circle r={12} className={styles.query} />
          <text className={styles.queryLabel} textAnchor="middle" dy="0.35em">
            ?
          </text>
        </g>
      </svg>
    </div>
  );
}
