import type { CSSProperties } from "react";
import styles from "./AlgorithmPreview.module.css";

/**
 * Pure-CSS превью Step 9.3: searching + tree + graph.
 * Та же дисциплина, что у сортировок: один узнаваемый шаг алгоритма, без «мигания ради мигания».
 */

const CELL = 10;
const SEARCH_PAD = 5;

/** Ряд ячеек массива для поиска. */
function SearchCells({
  art,
  count,
  cellClass,
}: {
  art: string;
  count: number;
  cellClass?: (index: number) => string | undefined;
}) {
  return (
    <div
      className={styles.stage}
      data-art={art}
      style={{ "--cell": `${CELL}px`, "--pad": `${SEARCH_PAD}px` } as CSSProperties}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={[styles.searchCell, cellClass?.(index)].filter(Boolean).join(" ")}
          style={{ "--i": index } as CSSProperties}
        />
      ))}
    </div>
  );
}

/** Linear: курсор идёт слева направо и «находит» цель. */
function LinearSearchArt() {
  return (
    <SearchCells
      art="linear-search"
      count={7}
      cellClass={(index) => {
        if (index === 4) return styles.linTarget;
        return styles.linScan;
      }}
    />
  );
}

/**
 * Binary: сужение диапазона — края тухнут, mid вспыхивает, затем фокус на правой половине → цель.
 * Ячейки 0..6, цель = 5.
 */
function BinarySearchArt() {
  return (
    <SearchCells
      art="binary-search"
      count={7}
      cellClass={(index) => {
        if (index === 5) return styles.binTarget;
        if (index === 3) return styles.binMid;
        if (index < 3) return styles.binLeftOut;
        return styles.binRightKeep;
      }}
    />
  );
}

/** Общее SVG-дерево (7 узлов) — порядок обхода задаётся animation-delay на узлах. */
function TreeArt({
  art,
  order,
}: {
  art: string;
  /** индексы узлов в порядке посещения (0=root …) */
  order: number[];
}) {
  const delays = new Map(order.map((node, step) => [node, step]));
  const nodes: { id: number; cx: number; cy: number; r: number }[] = [
    { id: 0, cx: 40, cy: 9, r: 5 },
    { id: 1, cx: 22, cy: 22, r: 4 },
    { id: 2, cx: 58, cy: 22, r: 4 },
    { id: 3, cx: 12, cy: 36, r: 3.5 },
    { id: 4, cx: 32, cy: 36, r: 3.5 },
    { id: 5, cx: 48, cy: 36, r: 3.5 },
    { id: 6, cx: 68, cy: 36, r: 3.5 },
  ];

  return (
    <div className={`${styles.stage} ${styles.treeStage}`} data-art={art}>
      <svg className={styles.treeSvg} viewBox="0 0 80 48" aria-hidden>
        <line className={styles.treeLine} x1="40" y1="9" x2="22" y2="22" />
        <line className={styles.treeLine} x1="40" y1="9" x2="58" y2="22" />
        <line className={styles.treeLine} x1="22" y1="22" x2="12" y2="36" />
        <line className={styles.treeLine} x1="22" y1="22" x2="32" y2="36" />
        <line className={styles.treeLine} x1="58" y1="22" x2="48" y2="36" />
        <line className={styles.treeLine} x1="58" y1="22" x2="68" y2="36" />
        {nodes.map((node) => (
          <circle
            key={node.id}
            className={styles.treeNode}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            style={{ "--step": delays.get(node.id) ?? 0 } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}

function PreorderArt() {
  // NLR: root, L, LL, LR, R, RL, RR
  return <TreeArt art="preorder-traversal" order={[0, 1, 3, 4, 2, 5, 6]} />;
}

function InorderArt() {
  // LNR
  return <TreeArt art="inorder-traversal" order={[3, 1, 4, 0, 5, 2, 6]} />;
}

function PostorderArt() {
  // LRN
  return <TreeArt art="postorder-traversal" order={[3, 4, 1, 5, 6, 2, 0]} />;
}

/**
 * BFS: волна по уровням от старта.
 * Узлы: 0 start, level1: 1,2 — level2: 3,4,5
 */
function BfsArt() {
  const nodes = [
    { id: 0, cx: 14, cy: 24, level: 0 },
    { id: 1, cx: 36, cy: 12, level: 1 },
    { id: 2, cx: 36, cy: 36, level: 1 },
    { id: 3, cx: 62, cy: 8, level: 2 },
    { id: 4, cx: 66, cy: 24, level: 2 },
    { id: 5, cx: 62, cy: 40, level: 2 },
  ];
  return (
    <div className={`${styles.stage} ${styles.graphStage}`} data-art="bfs">
      <svg className={styles.graphSvg} viewBox="0 0 80 48" aria-hidden>
        <line className={styles.graphLine} x1="14" y1="24" x2="36" y2="12" />
        <line className={styles.graphLine} x1="14" y1="24" x2="36" y2="36" />
        <line className={styles.graphLine} x1="36" y1="12" x2="62" y2="8" />
        <line className={styles.graphLine} x1="36" y1="12" x2="66" y2="24" />
        <line className={styles.graphLine} x1="36" y1="36" x2="66" y2="24" />
        <line className={styles.graphLine} x1="36" y1="36" x2="62" y2="40" />
        {nodes.map((node) => (
          <circle
            key={node.id}
            className={styles.bfsNode}
            cx={node.cx}
            cy={node.cy}
            r={node.level === 0 ? 5 : 4}
            style={{ "--level": node.level } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * DFS: уход вглубь по одному пути (spine), потом лёгкий backtrack.
 * Путь: 0 → 1 → 3
 */
function DfsArt() {
  return (
    <div className={`${styles.stage} ${styles.graphStage}`} data-art="dfs">
      <svg className={styles.graphSvg} viewBox="0 0 80 48" aria-hidden>
        <line className={styles.graphLine} x1="16" y1="10" x2="16" y2="24" />
        <line className={`${styles.graphLine} ${styles.dfsEdge}`} x1="16" y1="24" x2="40" y2="24" />
        <line className={`${styles.graphLine} ${styles.dfsEdge}`} x1="40" y1="24" x2="64" y2="24" />
        <line className={styles.graphLine} x1="16" y1="24" x2="16" y2="38" />
        <line className={styles.graphLine} x1="40" y1="24" x2="40" y2="38" />

        <circle className={`${styles.dfsNode} ${styles.dfsN0}`} cx="16" cy="10" r="4" />
        <circle className={`${styles.dfsNode} ${styles.dfsN1}`} cx="16" cy="24" r="4.5" />
        <circle className={`${styles.dfsNode} ${styles.dfsN2}`} cx="40" cy="24" r="4.5" />
        <circle className={`${styles.dfsNode} ${styles.dfsN3}`} cx="64" cy="24" r="4.5" />
        <circle className={styles.dfsNode} cx="16" cy="38" r="3.5" />
        <circle className={styles.dfsNode} cx="40" cy="38" r="3.5" />
      </svg>
    </div>
  );
}

/**
 * Dijkstra: от источника «доезжает» кратчайший путь (подсветка рёбер+узлов),
 * обходной длинный путь остаётся тусклым.
 */
function DijkstraArt() {
  return (
    <div className={`${styles.stage} ${styles.graphStage}`} data-art="dijkstra">
      <svg className={styles.graphSvg} viewBox="0 0 80 48" aria-hidden>
        {/* длинный обход S→A→B→T */}
        <line className={`${styles.graphLine} ${styles.dijkLong}`} x1="12" y1="24" x2="28" y2="10" />
        <line className={`${styles.graphLine} ${styles.dijkLong}`} x1="28" y1="10" x2="52" y2="10" />
        <line className={`${styles.graphLine} ${styles.dijkLong}`} x1="52" y1="10" x2="68" y2="24" />
        {/* короткий S→T */}
        <line className={`${styles.graphLine} ${styles.dijkShort}`} x1="12" y1="24" x2="40" y2="36" />
        <line className={`${styles.graphLine} ${styles.dijkShort}`} x1="40" y1="36" x2="68" y2="24" />

        <circle className={`${styles.dijkNode} ${styles.dijkSrc}`} cx="12" cy="24" r="5" />
        <circle className={`${styles.dijkNode} ${styles.dijkDetour}`} cx="28" cy="10" r="3.5" />
        <circle className={`${styles.dijkNode} ${styles.dijkDetour}`} cx="52" cy="10" r="3.5" />
        <circle className={`${styles.dijkNode} ${styles.dijkVia}`} cx="40" cy="36" r="4" />
        <circle className={`${styles.dijkNode} ${styles.dijkTgt}`} cx="68" cy="24" r="5" />
      </svg>
    </div>
  );
}

export const CORE_PREVIEW_SLUGS = [
  "linear-search",
  "binary-search",
  "preorder-traversal",
  "inorder-traversal",
  "postorder-traversal",
  "bfs",
  "dfs",
  "dijkstra",
] as const;

export function CorePreview({ slug }: { slug: string }) {
  switch (slug) {
    case "linear-search":
      return <LinearSearchArt />;
    case "binary-search":
      return <BinarySearchArt />;
    case "preorder-traversal":
      return <PreorderArt />;
    case "inorder-traversal":
      return <InorderArt />;
    case "postorder-traversal":
      return <PostorderArt />;
    case "bfs":
      return <BfsArt />;
    case "dfs":
      return <DfsArt />;
    case "dijkstra":
      return <DijkstraArt />;
    default:
      return null;
  }
}
