import type { TspStep } from "@/algorithms/types";
import styles from "./TspVisualizer.module.css";

interface TspVisualizerProps {
  step: TspStep | null;
  task?: string;
  ruleHint?: string;
}

function pathPoints(
  cities: TspStep["cities"],
  path: string[],
  close: boolean,
): string {
  const byId = new Map(cities.map((c) => [c.id, c]));
  const pts: string[] = [];
  for (const id of path) {
    const city = byId.get(id);
    if (city) pts.push(`${city.x},${city.y}`);
  }
  if (close && path.length > 1) {
    const first = byId.get(path[0]);
    if (first) pts.push(`${first.x},${first.y}`);
  }
  return pts.join(" ");
}

/**
 * 2D-города + текущий/лучший тур. Баннер про NP — обязателен для учебного акцента.
 */
export default function TspVisualizer({
  step,
  task = "Задача о коммивояжёре: кратчайший цикл по всем городам",
  ruleHint = "Полный перебор или жадный nearest-neighbor",
}: TspVisualizerProps) {
  if (!step) {
    return <div className={styles.placeholder}>Нет данных для визуализации</div>;
  }

  const showCurrent =
    step.path.length > 1 &&
    (step.action === "explore" || step.action === "take" || step.action === "improve");
  const showBest = step.bestPath.length > 1;

  return (
    <div className={styles.root}>
      <p className={styles.npBanner} role="note">
        <span className={styles.npStrong}>NP-полная задача.</span> Точный ответ на больших
        n нереален: при фиксированном старте уже (n−1)! туров. Здесь n=
        {step.cities.length} → {step.totalTours} туров.
      </p>

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
          Метод:{" "}
          <span className={styles.metaStrong}>
            {step.method === "brute" ? "полный перебор" : "nearest-neighbor"}
          </span>
        </span>
        {step.method === "brute" && (
          <span>
            Туров:{" "}
            <span className={styles.metaStrong}>
              {step.toursChecked} / {step.totalTours}
            </span>
          </span>
        )}
        <span>
          Лучшая длина:{" "}
          <span className={styles.metaStrong}>
            {Number.isFinite(step.bestLength) ? step.bestLength : "—"}
          </span>
        </span>
      </div>

      <ul className={styles.legend}>
        <li>
          <span className={`${styles.swatch} ${styles.swatchBest}`} />
          лучший тур
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchCurrent}`} />
          текущий
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchCity}`} />
          город
        </li>
      </ul>

      <svg
        className={styles.canvas}
        viewBox="0 0 400 260"
        role="img"
        aria-label={step.message ?? "Тур коммивояжёра"}
      >
        {showBest && (
          <polyline
            points={pathPoints(step.cities, step.bestPath, true)}
            className={styles.tourBest}
          />
        )}
        {showCurrent && (
          <polyline
            points={pathPoints(
              step.cities,
              step.path,
              step.method === "brute" || step.action === "done",
            )}
            className={styles.tourCurrent}
          />
        )}

        {step.cities.map((city) => (
          <g key={city.id} transform={`translate(${city.x}, ${city.y})`}>
            <circle r={14} className={styles.city} />
            <text className={styles.cityLabel} textAnchor="middle" dy="0.35em">
              {city.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
