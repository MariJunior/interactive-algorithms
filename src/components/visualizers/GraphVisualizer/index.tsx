import type { GraphStep } from "@/algorithms/types";
import { edgeMatches } from "@/algorithms/graph";
import { motion } from "framer-motion";
import styles from "./GraphVisualizer.module.css";

type NodeState = "default" | "frontier" | "current" | "visited";

interface GraphVisualizerProps {
  step: GraphStep | null;
  /** Стартовая вершина текущего запуска */
  startId?: string;
  /** Подпись структуры frontier: очередь / стек / PQ */
  frontierLabel?: string;
  /** Задача демо: что алгоритм делает прямо сейчас */
  task?: string;
  /** Зачем смотреть на «порядок» */
  visitOrderHint?: string;
  /** Показывать таблицу dist[] (Dijkstra) */
  showDistances?: boolean;
  /** Подписи весов на рёбрах — только для взвешенных алгоритмов (Dijkstra) */
  showWeights?: boolean;
}

function resolveNodeState(id: string, step: GraphStep): NodeState {
  if (step.current === id && step.action !== "done") return "current";
  if (step.visited.includes(id)) return "visited";
  if (step.frontier.includes(id)) return "frontier";
  return "default";
}

function formatDist(value: number | null | undefined): string {
  if (value === null || value === undefined) return "∞";
  return String(value);
}

/**
 * 2D SVG-визуализатор обхода графа.
 * Presentation: только рисует GraphStep, без алгоритмической логики.
 */
export default function GraphVisualizer({
  step,
  startId,
  frontierLabel = "Очередь (ждут своей очереди)",
  task = "Обойти все достижимые вершины от старта",
  visitOrderHint = "в каком порядке вершины были посещены",
  showDistances = false,
  showWeights = false,
}: GraphVisualizerProps) {
  if (!step || step.graph.nodes.length === 0) {
    return <div className={styles.empty}>Нет данных для визуализации</div>;
  }

  const { graph } = step;
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const startLabel = startId ?? step.visitOrder[0] ?? graph.nodes[0]?.id ?? "?";
  const distances = step.distances;
  const isDone = step.action === "done";
  // Итоговая строка dist[] — отдельно от порядка фиксации (visitOrder ≠ расстояния)
  const distanceSummary =
    showDistances && distances
      ? graph.nodes
          .map((node) => `${node.label}=${formatDist(distances[node.id])}`)
          .join(", ")
      : null;

  return (
    <div className={styles.root}>
      <p className={styles.task} aria-live="polite">
        <span className={styles.taskLabel}>Задача:</span> {task}
        <span className={styles.taskSep}>·</span>
        старт — <span className={styles.metaStrong}>{startLabel}</span>
      </p>

      {step.formula && (
        <p className={styles.formula}>
          <span className={styles.taskLabel}>{isDone ? "Итог:" : "Сейчас:"}</span>{" "}
          {step.formula}
        </p>
      )}

      {isDone && distanceSummary && (
        <p className={styles.result} aria-live="polite">
          <span className={styles.taskLabel}>Кратчайшие расстояния:</span>{" "}
          <span className={styles.metaStrong}>{distanceSummary}</span>
        </p>
      )}

      <div className={styles.meta}>
        <span title="Вершины, которые алгоритм уже «запланировал», но ещё не посетил">
          {frontierLabel}:{" "}
          <span className={styles.metaStrong}>
            {step.frontier.length > 0 ? step.frontier.join(" · ") : "пусто"}
          </span>
        </span>
        <span title={visitOrderHint}>
          {showDistances ? "Порядок фиксации" : "Порядок посещения"}{" "}
          <span className={styles.metaHint}>({visitOrderHint})</span>:{" "}
          <span className={styles.metaStrong}>
            {step.visitOrder.length > 0 ? step.visitOrder.join(" → ") : "ещё никого"}
          </span>
        </span>
      </div>

      <ul className={styles.legend} aria-label="Обозначения вершин">
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendCurrent}`} />
          сейчас
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendFrontier}`} />
          в ожидании
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendVisited}`} />
          {showDistances ? "зафиксирована" : "посещена"}
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendDefault}`} />
          ещё нет
        </li>
      </ul>

      <svg
        className={styles.canvas}
        viewBox="0 0 400 240"
        role="img"
        aria-label={step.message ?? "Состояние обхода графа"}
      >
        {graph.edges.map((edge) => {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);
          if (!from || !to) return null;

          const active = edgeMatches(edge, step.exploringEdge, graph.directed);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={active ? styles.edgeActive : styles.edge}
              />
              {showWeights && edge.weight !== undefined && (
                <text
                  x={midX}
                  y={midY - 4}
                  className={styles.edgeWeight}
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {graph.nodes.map((node) => {
          const state = resolveNodeState(node.id, step);
          const distLabel =
            showDistances && distances
              ? formatDist(distances[node.id])
              : null;

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <motion.circle
                r={18}
                className={`${styles.node} ${styles[state]}`}
                layout
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
              <text className={styles.nodeLabel} textAnchor="middle" dy="0.35em">
                {node.label}
              </text>
              {distLabel !== null && (
                <text className={styles.distLabel} textAnchor="middle" y={30}>
                  {distLabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {showDistances && distances && (
        <div className={styles.distBlock}>
          <p className={styles.distCaption}>
            {isDone ? "Итоговый dist[]" : "Текущий dist[]"}
          </p>
          <div className={styles.distTable} aria-label="Таблица расстояний">
            {graph.nodes.map((node) => (
              <span
                key={node.id}
                className={`${styles.distCell} ${
                  step.current === node.id ? styles.distCellActive : ""
                } ${step.visited.includes(node.id) ? styles.distCellSettled : ""}`}
              >
                <span className={styles.distKey}>{node.label}</span>
                <span className={styles.distVal}>
                  {formatDist(distances[node.id])}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
