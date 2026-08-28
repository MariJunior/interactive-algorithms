import type { CSSProperties } from "react";
import styles from "./AlgorithmPreview.module.css";

/**
 * Мини-демо сортировок в кадре 80×48.
 * Столбики — position:absolute + фиксированная ширина (без flex-сжатия).
 * Движение только через translate к целевому слоту.
 */

const SLOT = 10; // px между левыми краями соседних столбиков
const BAR_W = 7;
const PAD = 5; // отступ слева до первого столбика

type BarSpec = {
  h: number;
  className?: string;
  /** целевой слот для анимации перемещения */
  target?: number;
};

function Bars({ art, bars }: { art: string; bars: BarSpec[] }) {
  return (
    <div
      className={styles.stage}
      data-art={art}
      style={{ "--slot": `${SLOT}px`, "--bar-w": `${BAR_W}px`, "--pad": `${PAD}px` } as CSSProperties}
    >
      {bars.map((bar, index) => (
        <span
          key={index}
          className={[styles.bar, bar.className].filter(Boolean).join(" ")}
          style={
            {
              "--h": `${bar.h}px`,
              "--i": index,
              "--target": bar.target ?? index,
              "--dx": `${((bar.target ?? index) - index) * SLOT}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Bubble: пара соседей полностью меняется местами (±1 слот). */
function BubbleArt() {
  return (
    <Bars
      art="bubble-sort"
      bars={[
        { h: 20 },
        { h: 32, className: styles.swapA, target: 2 },
        { h: 24, className: styles.swapB, target: 1 },
        { h: 28, className: styles.swapA2, target: 4 },
        { h: 16, className: styles.swapB2, target: 3 },
        { h: 26, className: styles.settled },
      ]}
    />
  );
}

/**
 * Selection: скан → min; полный swap головы (0) и min (4).
 * --dx = ±4 слота.
 */
function SelectionArt() {
  return (
    <Bars
      art="selection-sort"
      bars={[
        { h: 26, className: styles.selHead, target: 4 },
        { h: 20, className: styles.selScan },
        { h: 30, className: styles.selScan },
        { h: 22, className: styles.selScan },
        { h: 12, className: `${styles.selScan} ${styles.selMin}`, target: 0 },
        { h: 28, className: styles.selScan },
      ]}
    />
  );
}

/**
 * Insertion: отсортированный префикс [14,22,30], ключ 18 вставляется между 14 и 22.
 * (раньше ключ был самым высоким — выглядело как вставка «не туда».)
 */
function InsertionArt() {
  return (
    <Bars
      art="insertion-sort"
      bars={[
        { h: 14, className: styles.insSorted },
        { h: 22, className: `${styles.insSorted} ${styles.insShift}`, target: 2 },
        { h: 30, className: `${styles.insSorted} ${styles.insShift}`, target: 3 },
        { h: 18, className: styles.insKey, target: 1 },
        { h: 26 },
        { h: 34 },
      ]}
    />
  );
}

/**
 * Merge: две половины сходятся в отсортированный ряд (без вертикального «столбика»-разделителя).
 */
function MergeArt() {
  // start: 22,28,34 | 16,26,30 → sorted by height
  const bars: BarSpec[] = [
    { h: 22, className: styles.mergeLeft, target: 1 },
    { h: 28, className: styles.mergeLeft, target: 3 },
    { h: 34, className: styles.mergeLeft, target: 5 },
    { h: 16, className: styles.mergeRight, target: 0 },
    { h: 26, className: styles.mergeRight, target: 2 },
    { h: 30, className: styles.mergeRight, target: 4 },
  ];
  return (
    <div
      className={styles.stage}
      data-art="merge-sort"
      style={{ "--slot": `${SLOT}px`, "--bar-w": `${BAR_W}px`, "--pad": `${PAD}px` } as CSSProperties}
    >
      {bars.map((bar, index) => (
        <span
          key={index}
          className={[styles.bar, bar.className].filter(Boolean).join(" ")}
          style={
            {
              "--h": `${bar.h}px`,
              "--i": index,
              "--target": bar.target ?? index,
              "--dx": `${((bar.target ?? index) - index) * SLOT}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * Quick: pivot на месте; меньшие собираются слева, большие справа
 * (полные целевые слоты, без «сдвига на 4px»).
 */
function QuickArt() {
  // initial: [18,30,14,34,26,20] pivot=34 at i=3
  // partition: [18,14,20, 34, 30,26] → targets 0,4,1,3,5,2
  return (
    <Bars
      art="quick-sort"
      bars={[
        { h: 18, className: styles.qMove, target: 0 },
        { h: 30, className: styles.qMove, target: 4 },
        { h: 14, className: styles.qMove, target: 1 },
        { h: 34, className: styles.qPivot, target: 3 },
        { h: 26, className: styles.qMove, target: 5 },
        { h: 20, className: styles.qMove, target: 2 },
      ]}
    />
  );
}

/** Heap: SVG-дерево — рёбра и узлы в одной системе координат. */
function HeapArt() {
  return (
    <div className={`${styles.stage} ${styles.heapStage}`} data-art="heap-sort">
      <svg className={styles.heapSvg} viewBox="0 0 80 48" aria-hidden>
        {/* рёбра */}
        <line className={styles.heapLine} x1="40" y1="10" x2="24" y2="22" />
        <line className={styles.heapLine} x1="40" y1="10" x2="56" y2="22" />
        <line className={styles.heapLine} x1="24" y1="22" x2="14" y2="34" />
        <line className={styles.heapLine} x1="24" y1="22" x2="34" y2="34" />
        <line className={styles.heapLine} x1="56" y1="22" x2="46" y2="34" />
        <line className={styles.heapLine} x1="56" y1="22" x2="66" y2="34" />

        {/* узлы */}
        <circle className={`${styles.heapDot} ${styles.heapRoot}`} cx="40" cy="10" r="5" />
        <circle className={`${styles.heapDot} ${styles.heapChildL}`} cx="24" cy="22" r="4" />
        <circle className={`${styles.heapDot} ${styles.heapChildR}`} cx="56" cy="22" r="4" />
        <circle className={styles.heapDot} cx="14" cy="34" r="3.5" />
        <circle className={styles.heapDot} cx="34" cy="34" r="3.5" />
        <circle className={styles.heapDot} cx="46" cy="34" r="3.5" />
        <circle className={styles.heapDot} cx="66" cy="34" r="3.5" />
      </svg>
    </div>
  );
}

/**
 * Radix: чипы выровнены по bottom; медленный цикл без мерцания.
 * Старт → бакеты снизу → сборка в ряд по digit (тоже bottom).
 */
function RadixArt() {
  const items = [
    { digit: 1, h: 18 },
    { digit: 3, h: 28 },
    { digit: 0, h: 14 },
    { digit: 2, h: 22 },
  ];
  return (
    <div
      className={`${styles.stage} ${styles.radixStage}`}
      data-art="radix-sort"
      style={{ "--slot": "16px", "--pad": "8px" } as CSSProperties}
    >
      <div className={styles.radixBuckets} aria-hidden>
        {[0, 1, 2, 3].map((d) => (
          <span key={d} className={styles.radixBucket} />
        ))}
      </div>
      {items.map((item, index) => (
        <span
          key={index}
          className={styles.radixChip}
          style={
            {
              "--i": index,
              "--digit": item.digit,
              "--h": `${item.h}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * Counting: 3 дискретных значения.
 * Вспышка одинаковых высот («подсчитали») → разъезд в отсортированный ряд.
 * start [22,30,14,30,22,14] → sorted [14,14,22,22,30,30]
 */
function CountingArt() {
  return (
    <Bars
      art="counting-sort"
      bars={[
        { h: 22, className: `${styles.countItem} ${styles.countMid}`, target: 2 },
        { h: 30, className: `${styles.countItem} ${styles.countHi}`, target: 4 },
        { h: 14, className: `${styles.countItem} ${styles.countLo}`, target: 0 },
        { h: 30, className: `${styles.countItem} ${styles.countHi}`, target: 5 },
        { h: 22, className: `${styles.countItem} ${styles.countMid}`, target: 3 },
        { h: 14, className: `${styles.countItem} ${styles.countLo}`, target: 1 },
      ]}
    />
  );
}

export const SORTING_PREVIEW_SLUGS = [
  "bubble-sort",
  "selection-sort",
  "insertion-sort",
  "merge-sort",
  "quick-sort",
  "heap-sort",
  "radix-sort",
  "counting-sort",
] as const;

export function SortingPreview({ slug }: { slug: string }) {
  switch (slug) {
    case "bubble-sort":
      return <BubbleArt />;
    case "selection-sort":
      return <SelectionArt />;
    case "insertion-sort":
      return <InsertionArt />;
    case "merge-sort":
      return <MergeArt />;
    case "quick-sort":
      return <QuickArt />;
    case "heap-sort":
      return <HeapArt />;
    case "radix-sort":
      return <RadixArt />;
    case "counting-sort":
      return <CountingArt />;
    default:
      return null;
  }
}
