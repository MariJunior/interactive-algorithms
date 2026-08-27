import type { Graph, GraphStep } from "@/algorithms/types";
import {
  DEMO_GRAPH_START,
  createDemoGraph,
  graphStepGenerators,
  hasGraphVisualization,
} from "@/algorithms/graph";
import PlaybackControls from "@/components/ui/PlaybackControls";
import GraphVisualizer from "@/components/visualizers/GraphVisualizer";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useMemo, useState } from "react";
import styles from "./GraphPlaybackPanel.module.css";

interface GraphPlaybackPanelProps {
  slug: string;
}

/** Собираем шаги без number[]-runner — вход здесь Graph + start */
function collectSteps(
  slug: string,
  graph: Graph,
  startId: string,
): GraphStep[] {
  const create = graphStepGenerators[slug];
  if (!create) {
    return [
      {
        graph,
        action: "done",
        frontier: [],
        visited: [],
        visitOrder: [],
        message: "Визуализация пока недоступна",
      },
    ];
  }
  return Array.from(create(graph, startId));
}

/**
 * Composition root для BFS/DFS на странице алгоритма.
 * Domain (генератор) → player → GraphVisualizer.
 */
export default function GraphPlaybackPanel({ slug }: GraphPlaybackPanelProps) {
  const [graph] = useState(() => createDemoGraph());
  const [startId, setStartId] = useState(DEMO_GRAPH_START);

  const steps = useMemo(
    () => collectSteps(slug, graph, startId),
    [slug, graph, startId],
  );

  const stepsId = `${slug}:${startId}:${graph.nodes.map((n) => n.id).join("")}`;
  const player = useAlgorithmPlayer(steps, stepsId);

  const isDfs = slug === "dfs";
  const isDijkstra = slug === "dijkstra";
  const frontierLabel = isDijkstra
    ? "Кандидаты PQ (по возрастанию dist)"
    : isDfs
      ? "Стек (ожидают, последний сверху)"
      : "Очередь (ожидают, первые слева)";
  const task = isDijkstra
    ? "Найти кратчайшие пути от старта во взвешенном графе (без отрицательных рёбер)"
    : isDfs
      ? "Обойти граф вглубь от старта и показать порядок первого посещения вершин"
      : "Обойти граф слоями от старта и показать порядок первого посещения вершин";
  const visitOrderHint = isDijkstra
    ? "порядок фиксации вершин (extract-min)"
    : "результат обхода — последовательность вершин";

  if (!hasGraphVisualization(slug)) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.startRow}>
        <label className={styles.startLabel} htmlFor={`graph-start-${slug}`}>
          Откуда начинаем
        </label>
        <select
          id={`graph-start-${slug}`}
          className={styles.startSelect}
          value={startId}
          onChange={(event) => setStartId(event.target.value)}
          aria-label="Стартовая вершина обхода"
        >
          {graph.nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.label}
            </option>
          ))}
        </select>
      </div>

      <GraphVisualizer
        step={player.currentStep}
        startId={startId}
        frontierLabel={frontierLabel}
        task={task}
        visitOrderHint={visitOrderHint}
        showDistances={isDijkstra}
      />

      <PlaybackControls
        isPlaying={player.isPlaying}
        isAtStart={player.isAtStart}
        isAtEnd={player.isAtEnd}
        currentIndex={player.currentIndex}
        totalSteps={player.totalSteps}
        speed={player.speed}
        stats={player.stats}
        elapsedMs={player.elapsedMs}
        message={player.currentStep?.message}
        onToggle={player.toggle}
        onStepBack={player.stepBack}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onSpeedChange={player.setSpeed}
        comparisonsLabel={isDijkstra ? "Релаксаций / рёбер" : "Просмотров рёбер"}
        movesLabel={isDijkstra ? "Фиксаций" : "Посещений"}
        onRandom={() => {
          // «Случайный» сценарий = другая стартовая вершина на том же графе
          const pick =
            graph.nodes[Math.floor(Math.random() * graph.nodes.length)]?.id ??
            DEMO_GRAPH_START;
          setStartId(pick);
        }}
      />
    </div>
  );
}
