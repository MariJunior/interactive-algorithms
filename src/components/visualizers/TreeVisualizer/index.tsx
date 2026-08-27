import type { TreeStep } from "@/algorithms/types";
import { treeEdges } from "@/algorithms/tree";
import { motion } from "framer-motion";
import styles from "./TreeVisualizer.module.css";

type NodeState = "default" | "stack" | "current" | "visited";

interface TreeVisualizerProps {
  step: TreeStep | null;
  task?: string;
  formulaHint?: string;
}

function resolveNodeState(id: string, step: TreeStep): NodeState {
  if (step.current === id && step.action !== "done") return "current";
  if (step.visitOrder.includes(id)) return "visited";
  if (step.callStack.includes(id)) return "stack";
  return "default";
}

/**
 * SVG-визуализатор обхода бинарного дерева.
 * Presentation: только TreeStep + понятные подписи задачи/порядка.
 */
export default function TreeVisualizer({
  step,
  task = "Обойти все узлы дерева и показать порядок посещения",
  formulaHint = "корень / левое / правое — см. алгоритм",
}: TreeVisualizerProps) {
  if (!step || step.tree.nodes.length === 0) {
    return <div className={styles.empty}>Нет данных для визуализации</div>;
  }

  const { tree } = step;
  const nodeById = new Map(tree.nodes.map((node) => [node.id, node]));
  const edges = treeEdges(tree);

  return (
    <div className={styles.root}>
      <p className={styles.task} aria-live="polite">
        <span className={styles.taskLabel}>Задача:</span> {task}
        <span className={styles.taskSep}>·</span>
        корень — <span className={styles.metaStrong}>{tree.rootId}</span>
      </p>

      <p className={styles.formula}>
        <span className={styles.taskLabel}>Правило:</span> {formulaHint}
      </p>

      <div className={styles.meta}>
        <span title="Узлы на пути рекурсии от корня к текущему">
          Стек вызовов:{" "}
          <span className={styles.metaStrong}>
            {step.callStack.length > 0 ? step.callStack.join(" → ") : "пусто"}
          </span>
        </span>
        <span title="Результат обхода — последовательность узлов">
          Порядок посещения{" "}
          <span className={styles.metaHint}>(результат обхода)</span>:{" "}
          <span className={styles.metaStrong}>
            {step.visitOrder.length > 0 ? step.visitOrder.join(" → ") : "ещё никого"}
          </span>
        </span>
      </div>

      <ul className={styles.legend} aria-label="Обозначения узлов">
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendCurrent}`} />
          сейчас
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendStack}`} />
          в стеке
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.legendVisited}`} />
          посещён
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
        aria-label={step.message ?? "Состояние обхода дерева"}
      >
        {edges.map((edge) => {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);
          if (!from || !to) return null;
          const active =
            step.exploringEdge?.[0] === edge.from &&
            step.exploringEdge?.[1] === edge.to;
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={active ? styles.edgeActive : styles.edge}
            />
          );
        })}

        {tree.nodes.map((node) => {
          const state = resolveNodeState(node.id, step);
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
            </g>
          );
        })}
      </svg>
    </div>
  );
}
