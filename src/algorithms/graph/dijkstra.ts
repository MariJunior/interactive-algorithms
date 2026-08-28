import type { Graph, GraphStep } from "@/algorithms/types";
import { buildWeightedAdjacency } from "./demoGraph";

function snapshotDistances(
  nodes: string[],
  dist: Map<string, number>,
): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  for (const id of nodes) {
    const value = dist.get(id) ?? Infinity;
    out[id] = Number.isFinite(value) ? value : null;
  }
  return out;
}

/** Кандидаты PQ: не зафиксированные вершины с конечным dist, по возрастанию */
function priorityFrontier(
  nodeIds: string[],
  dist: Map<string, number>,
  settled: Set<string>,
): string[] {
  return nodeIds
    .filter((id) => !settled.has(id) && Number.isFinite(dist.get(id) ?? Infinity))
    .sort((a, b) => (dist.get(a)! - dist.get(b)!) || a.localeCompare(b));
}

/** Чистый Dijkstra: кратчайшие расстояния от start (без отрицательных весов) */
export function dijkstra(
  graph: Graph,
  startId: string,
): { distances: Record<string, number | null>; order: string[] } {
  const adj = buildWeightedAdjacency(graph);
  const nodeIds = graph.nodes.map((n) => n.id);
  if (!adj.has(startId)) {
    return { distances: {}, order: [] };
  }

  const dist = new Map<string, number>();
  for (const id of nodeIds) dist.set(id, Infinity);
  dist.set(startId, 0);

  const settled = new Set<string>();
  const order: string[] = [];

  while (true) {
    let current: string | null = null;
    let best = Infinity;
    for (const id of nodeIds) {
      if (settled.has(id)) continue;
      const d = dist.get(id) ?? Infinity;
      if (d < best) {
        best = d;
        current = id;
      }
    }
    if (current === null || !Number.isFinite(best)) break;

    settled.add(current);
    order.push(current);

    for (const { to, weight } of adj.get(current) ?? []) {
      if (settled.has(to)) continue;
      const alt = (dist.get(current) ?? Infinity) + weight;
      if (alt < (dist.get(to) ?? Infinity)) {
        dist.set(to, alt);
      }
    }
  }

  return { distances: snapshotDistances(nodeIds, dist), order };
}

/**
 * Генератор шагов Dijkstra.
 * extract-min → visit; просмотр ребра → explore; улучшение → relax.
 */
export function* dijkstraSteps(
  graph: Graph,
  startId: string,
): Generator<GraphStep> {
  const adj = buildWeightedAdjacency(graph);
  const nodeIds = graph.nodes.map((n) => n.id);

  if (!adj.has(startId)) {
    yield {
      graph,
      action: "done",
      frontier: [],
      visited: [],
      visitOrder: [],
      distances: {},
      message: `Вершина ${startId} не найдена в графе`,
    };
    return;
  }

  const dist = new Map<string, number>();
  for (const id of nodeIds) dist.set(id, Infinity);
  dist.set(startId, 0);

  const settled = new Set<string>();
  const visitOrder: string[] = [];

  yield {
    graph,
    action: "explore",
    current: startId,
    frontier: [startId],
    visited: [],
    visitOrder: [],
    distances: snapshotDistances(nodeIds, dist),
    formula: `dist[${startId}] = 0, остальные = ∞`,
    message: `Dijkstra: старт ${startId}, ищем кратчайшие пути`,
  };

  while (true) {
    let current: string | null = null;
    let best = Infinity;
    for (const id of nodeIds) {
      if (settled.has(id)) continue;
      const d = dist.get(id) ?? Infinity;
      if (d < best) {
        best = d;
        current = id;
      }
    }

    if (current === null || !Number.isFinite(best)) break;

    settled.add(current);
    visitOrder.push(current);

    yield {
      graph,
      action: "visit",
      current,
      frontier: priorityFrontier(nodeIds, dist, settled),
      visited: [...settled],
      visitOrder: [...visitOrder],
      distances: snapshotDistances(nodeIds, dist),
      formula: `Извлекаем min: ${current} (dist = ${best})`,
      message: `Фиксируем ${current}: кратчайший путь найден`,
    };

    for (const { to, weight } of adj.get(current) ?? []) {
      if (settled.has(to)) continue;

      const fromDist = dist.get(current) ?? Infinity;
      const oldDist = dist.get(to) ?? Infinity;
      const alt = fromDist + weight;

      yield {
        graph,
        action: "explore",
        current,
        exploringEdge: [current, to],
        frontier: priorityFrontier(nodeIds, dist, settled),
        visited: [...settled],
        visitOrder: [...visitOrder],
        distances: snapshotDistances(nodeIds, dist),
        formula: `Смотрим ${current}→${to} (вес ${weight}): ${fromDist} + ${weight} = ${alt}`,
        message: `Релаксация ребра ${current} → ${to}`,
      };

      if (alt < oldDist) {
        dist.set(to, alt);
        yield {
          graph,
          action: "relax",
          current,
          exploringEdge: [current, to],
          frontier: priorityFrontier(nodeIds, dist, settled),
          visited: [...settled],
          visitOrder: [...visitOrder],
          distances: snapshotDistances(nodeIds, dist),
          formula: `dist[${to}]: ${Number.isFinite(oldDist) ? oldDist : "∞"} → ${alt}`,
          message: `Улучшили оценку для ${to}`,
        };
      }
    }
  }

  const finalDist = snapshotDistances(nodeIds, dist);
  // Человекочитаемый итог: A=0, B=2, … — и в formula, и в message (PlaybackControls)
  const summary = nodeIds
    .filter((id) => finalDist[id] !== null)
    .map((id) => `${id}=${finalDist[id]}`)
    .join(", ");

  yield {
    graph,
    action: "done",
    frontier: [],
    visited: [...settled],
    visitOrder: [...visitOrder],
    distances: finalDist,
    formula: summary,
    message: `Готово. Кратчайшие расстояния от ${startId}: ${summary}`,
  };
}
