import type { CSSProperties } from "react";
import styles from "./AlgorithmPreview.module.css";

/**
 * Pure-CSS превью Step 9.4: dp + greedy + string + data-structures + np-complete + ml.
 * Один узнаваемый шаг алгоритма; без JS-анимации.
 */

/* ─── DP ─── */

/** Fibonacci: ячейки dp[] заполняются слева направо, высота ~ росту F(i). */
function FibonacciArt() {
  // Относительные высоты для F: 1,1,2,3,5,8 (в пикселях кадра)
  const heights = [8, 8, 12, 18, 26, 34];
  return (
    <div
      className={styles.stage}
      data-art="fibonacci"
      style={{ "--pad": "6px", "--slot": "12px" } as CSSProperties}
    >
      {heights.map((h, index) => (
        <span
          key={index}
          className={`${styles.dpCell} ${styles.fibCell}`}
          style={{ "--i": index, "--h": `${h}px` } as CSSProperties}
        />
      ))}
    </div>
  );
}

/** Climbing stairs: ступени загораются; ways(i)=ways(i−1)+ways(i−2). */
function ClimbingStairsArt() {
  return (
    <div className={`${styles.stage} ${styles.stairsStage}`} data-art="climbing-stairs">
      {[0, 1, 2, 3, 4].map((index) => (
        <span
          key={index}
          className={styles.stair}
          style={{ "--i": index } as CSSProperties}
        />
      ))}
    </div>
  );
}

/* ─── String ─── */

/**
 * Naive: окно паттерна (3 символа) ползёт по тексту с шагом 1.
 * На позиции mismatch — вспышка, затем сдвиг +1.
 */
function NaiveStringArt() {
  // Текст: 8 ячеек; паттерн длина 3; цель совпадения на i=4
  return (
    <div className={`${styles.stage} ${styles.strStage}`} data-art="naive-string-search">
      {Array.from({ length: 8 }, (_, index) => (
        <span
          key={index}
          className={`${styles.strCell} ${styles.naiveText}`}
          style={{ "--i": index } as CSSProperties}
        />
      ))}
      {/* Окно паттерна — три полоски, едут translateX по слотам */}
      <span className={`${styles.strWin} ${styles.naiveWin0}`} style={{ "--w": 0 } as CSSProperties} />
      <span className={`${styles.strWin} ${styles.naiveWin1}`} style={{ "--w": 1 } as CSSProperties} />
      <span className={`${styles.strWin} ${styles.naiveWin2}`} style={{ "--w": 2 } as CSSProperties} />
    </div>
  );
}

/**
 * KMP: то же окно, но после mismatch делает «умный» прыжок (не +1),
 * быстрее доезжает до совпадения.
 */
function KmpStringArt() {
  return (
    <div className={`${styles.stage} ${styles.strStage}`} data-art="kmp-search">
      {Array.from({ length: 8 }, (_, index) => (
        <span
          key={index}
          className={`${styles.strCell} ${styles.kmpText}`}
          style={{ "--i": index } as CSSProperties}
        />
      ))}
      <span className={`${styles.strWin} ${styles.kmpWin0}`} style={{ "--w": 0 } as CSSProperties} />
      <span className={`${styles.strWin} ${styles.kmpWin1}`} style={{ "--w": 1 } as CSSProperties} />
      <span className={`${styles.strWin} ${styles.kmpWin2}`} style={{ "--w": 2 } as CSSProperties} />
    </div>
  );
}

/* ─── Greedy ─── */

/**
 * Activity selection: интервалы на таймлайне; жадно берём те,
 * что заканчиваются раньше и не пересекаются (1,3,5).
 */
function ActivitySelectionArt() {
  // [left%, width%] в кадре
  const intervals = [
    { left: 4, width: 22, pick: true }, // берём
    { left: 14, width: 28, pick: false }, // пересекается
    { left: 36, width: 18, pick: true },
    { left: 48, width: 24, pick: false },
    { left: 62, width: 20, pick: true },
  ];
  return (
    <div className={`${styles.stage} ${styles.actStage}`} data-art="activity-selection">
      {intervals.map((iv, index) => (
        <span
          key={index}
          className={`${styles.actBar} ${iv.pick ? styles.actPick : styles.actSkip}`}
          style={
            {
              "--i": index,
              left: `${iv.left}px`,
              width: `${iv.width}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * Fractional knapsack: предметы по плотности value/weight;
 * рюкзак заполняется, последний — дробью (половина высоты).
 */
function FractionalKnapsackArt() {
  // Три «вещи» слева → наполняют бак справа (fill до ~85%, last partial)
  return (
    <div className={`${styles.stage} ${styles.knapStage}`} data-art="fractional-knapsack">
      <span className={`${styles.knapItem} ${styles.knapI0}`} />
      <span className={`${styles.knapItem} ${styles.knapI1}`} />
      <span className={`${styles.knapItem} ${styles.knapI2}`} />
      <span className={styles.knapBag} />
      <span className={styles.knapFill} />
    </div>
  );
}

/**
 * Set cover: универсум (6 точек); жадно подсвечиваем множества,
 * закрывающие максимум непокрытых (setA → setB).
 */
function SetCoverArt() {
  const dots = [
    { x: 12, y: 14 },
    { x: 28, y: 10 },
    { x: 44, y: 14 },
    { x: 16, y: 34 },
    { x: 40, y: 36 },
    { x: 64, y: 24 },
  ];
  return (
    <div className={`${styles.stage} ${styles.coverStage}`} data-art="set-cover">
      <svg className={styles.coverSvg} viewBox="0 0 80 48" aria-hidden>
        {/* Кандидат-множества: эллипсы */}
        <ellipse className={`${styles.coverSet} ${styles.coverSetA}`} cx="28" cy="18" rx="22" ry="14" />
        <ellipse className={`${styles.coverSet} ${styles.coverSetB}`} cx="48" cy="30" rx="24" ry="14" />
        {dots.map((dot, index) => (
          <circle
            key={index}
            className={styles.coverDot}
            cx={dot.x}
            cy={dot.y}
            r={3}
            style={{ "--i": index } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Data structures ─── */

/**
 * Hash table: ключ падает в бакет (hash → index);
 * при коллизии цепочка растёт вниз.
 */
function HashTableArt() {
  return (
    <div className={`${styles.stage} ${styles.hashStage}`} data-art="hash-table">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={styles.hashBucket}
          style={{ "--i": index } as CSSProperties}
        />
      ))}
      {/* Ключ → бакет 2 */}
      <span className={styles.hashKey} />
      {/* Цепочка коллизии в бакете 2 */}
      <span className={`${styles.hashChain} ${styles.hashC0}`} />
      <span className={`${styles.hashChain} ${styles.hashC1}`} />
    </div>
  );
}

/* ─── NP-complete ─── */

/**
 * TSP brute: полный перебор туров.
 * Слева — слоты попыток с «длиной»; справа — города.
 * Туры сменяются по одному (не одновременно): длинный → средний → короткий (best).
 */
function TspBruteArt() {
  const cities: [number, number][] = [
    [36, 10],
    [64, 18],
    [58, 38],
    [28, 36],
    [22, 18],
  ];
  return (
    <div className={`${styles.stage} ${styles.tspStage}`} data-art="tsp-brute">
      <svg className={styles.tspSvg} viewBox="0 0 80 48" aria-hidden>
        {/* Панель попыток: номер слота + стол высоты = стоимость тура */}
        <g className={styles.tspTryPanel}>
          <rect className={`${styles.tspTrySlot} ${styles.tspTry0}`} x="4" y="6" width="5" height="5" rx="1" />
          <rect className={`${styles.tspCost} ${styles.tspCost0}`} x="11" y="6" width="10" height="5" rx="1" />
          <rect className={`${styles.tspTrySlot} ${styles.tspTry1}`} x="4" y="16" width="5" height="5" rx="1" />
          <rect className={`${styles.tspCost} ${styles.tspCost1}`} x="11" y="17" width="7" height="4" rx="1" />
          <rect className={`${styles.tspTrySlot} ${styles.tspTry2}`} x="4" y="26" width="5" height="5" rx="1" />
          <rect className={`${styles.tspCost} ${styles.tspCost2}`} x="11" y="28" width="4" height="3" rx="1" />
          {/* «…» — ещё (n−1)! − 3 перестановок за кадром */}
          <circle className={styles.tspTryMore} cx="6.5" cy="40" r="1.2" />
          <circle className={styles.tspTryMore} cx="11" cy="40" r="1.2" />
          <circle className={styles.tspTryMore} cx="15.5" cy="40" r="1.2" />
        </g>

        {/* Тур 1: скрещённый / длинный */}
        <polyline
          className={`${styles.tspBruteTour} ${styles.tspBruteT0}`}
          points="22,18 64,18 28,36 58,38 36,10 22,18"
          fill="none"
        />
        {/* Тур 2: другой порядок, средняя длина */}
        <polyline
          className={`${styles.tspBruteTour} ${styles.tspBruteT1}`}
          points="22,18 36,10 58,38 64,18 28,36 22,18"
          fill="none"
        />
        {/* Тур 3: короткий (почти оболочка) — лучший среди показанных */}
        <polyline
          className={`${styles.tspBruteTour} ${styles.tspBruteT2}`}
          points="22,18 36,10 64,18 58,38 28,36 22,18"
          fill="none"
        />

        {cities.map(([cx, cy], index) => (
          <circle key={index} className={styles.tspCity} cx={cx} cy={cy} r={3.2} />
        ))}

        {/* Метка «min» у лучшего слота — появляется вместе с T2 */}
        <path
          className={styles.tspBestMark}
          d="M18 29.5 l1.2 1.2 2.4-2.8"
          fill="none"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * TSP nearest neighbor: один путь растёт город→ближайший,
 * затем замыкание в старт.
 */
function TspNnArt() {
  return (
    <div className={`${styles.stage} ${styles.tspStage}`} data-art="tsp-nearest-neighbor">
      <svg className={styles.tspSvg} viewBox="0 0 80 48" aria-hidden>
        <line className={`${styles.tspEdge} ${styles.tspE0}`} x1="14" y1="24" x2="32" y2="12" />
        <line className={`${styles.tspEdge} ${styles.tspE1}`} x1="32" y1="12" x2="56" y2="14" />
        <line className={`${styles.tspEdge} ${styles.tspE2}`} x1="56" y1="14" x2="66" y2="30" />
        <line className={`${styles.tspEdge} ${styles.tspE3}`} x1="66" y1="30" x2="40" y2="38" />
        <line className={`${styles.tspEdge} ${styles.tspE4}`} x1="40" y1="38" x2="14" y2="24" />
        {[
          [14, 24],
          [32, 12],
          [56, 14],
          [66, 30],
          [40, 38],
        ].map(([cx, cy], index) => (
          <circle
            key={index}
            className={styles.tspNnCity}
            cx={cx}
            cy={cy}
            r={3.5}
            style={{ "--i": index } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── ML ─── */

/**
 * k-NN: query в центре; k=3 ближайших вспыхивают,
 * класс большинства (круги) «побеждает».
 */
function KnnArt() {
  const points = [
    { cx: 18, cy: 14, cls: "a" },
    { cx: 28, cy: 34, cls: "a" },
    { cx: 58, cy: 12, cls: "b" },
    { cx: 64, cy: 36, cls: "b" },
    { cx: 44, cy: 22, cls: "a" }, // сосед #1
    { cx: 36, cy: 30, cls: "a" }, // сосед #2
    { cx: 50, cy: 28, cls: "b" }, // сосед #3
  ];
  return (
    <div className={`${styles.stage} ${styles.knnStage}`} data-art="knn">
      <svg className={styles.knnSvg} viewBox="0 0 80 48" aria-hidden>
        {/* Радиус k-окрестности */}
        <circle className={styles.knnRadius} cx="42" cy="24" r="16" />
        {points.map((p, index) => (
          <circle
            key={index}
            className={`${styles.knnPt} ${p.cls === "a" ? styles.knnA : styles.knnB}`}
            cx={p.cx}
            cy={p.cy}
            r={3}
            style={{ "--i": index } as CSSProperties}
          />
        ))}
        <circle className={styles.knnQuery} cx="42" cy="24" r={4} />
      </svg>
    </div>
  );
}

export const ADVANCED_PREVIEW_SLUGS = [
  "fibonacci",
  "climbing-stairs",
  "naive-string-search",
  "kmp-search",
  "activity-selection",
  "fractional-knapsack",
  "set-cover",
  "hash-table",
  "tsp-brute",
  "tsp-nearest-neighbor",
  "knn",
] as const;

export function AdvancedPreview({ slug }: { slug: string }) {
  switch (slug) {
    case "fibonacci":
      return <FibonacciArt />;
    case "climbing-stairs":
      return <ClimbingStairsArt />;
    case "naive-string-search":
      return <NaiveStringArt />;
    case "kmp-search":
      return <KmpStringArt />;
    case "activity-selection":
      return <ActivitySelectionArt />;
    case "fractional-knapsack":
      return <FractionalKnapsackArt />;
    case "set-cover":
      return <SetCoverArt />;
    case "hash-table":
      return <HashTableArt />;
    case "tsp-brute":
      return <TspBruteArt />;
    case "tsp-nearest-neighbor":
      return <TspNnArt />;
    case "knn":
      return <KnnArt />;
    default:
      return null;
  }
}
