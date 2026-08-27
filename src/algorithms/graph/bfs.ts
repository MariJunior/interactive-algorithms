import type { Graph, GraphStep } from "@/algorithms/types";
import { buildAdjacency } from "./demoGraph";

/** Чистый BFS: порядок посещения вершин */
export function bfs(graph: Graph, startId: string): string[] {
  const adj = buildAdjacency(graph);
  if (!adj.has(startId)) return [];

  const visited = new Set<string>();
  const queue: string[] = [startId];
  const order: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;

    visited.add(current);
    order.push(current);

    for (const neighbor of adj.get(current) ?? []) {
      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return order;
}

/** Генератор шагов BFS — очередь (FIFO), без мутации графа */
export function* bfsSteps(graph: Graph, startId: string): Generator<GraphStep> {
  const adj = buildAdjacency(graph);

  if (!adj.has(startId)) {
    yield {
      graph,
      action: "done",
      frontier: [],
      visited: [],
      visitOrder: [],
      message: `Вершина ${startId} не найдена в графе`,
    };
    return;
  }

  const visited = new Set<string>();
  const queue: string[] = [startId];
  const visitOrder: string[] = [];

  yield {
    graph,
    action: "explore",
    current: startId,
    frontier: [...queue],
    visited: [],
    visitOrder: [],
    message: `BFS: кладём старт ${startId} в очередь`,
  };

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);
    visitOrder.push(current);

    yield {
      graph,
      action: "visit",
      current,
      frontier: [...queue],
      visited: [...visited],
      visitOrder: [...visitOrder],
      message: `Посещаем ${current} (порядок: ${visitOrder.join(" → ")})`,
    };

    for (const neighbor of adj.get(current) ?? []) {
      if (visited.has(neighbor) || queue.includes(neighbor)) {
        continue;
      }

      queue.push(neighbor);

      yield {
        graph,
        action: "explore",
        current,
        exploringEdge: [current, neighbor],
        frontier: [...queue],
        visited: [...visited],
        visitOrder: [...visitOrder],
        message: `В очередь: ${neighbor}`,
      };
    }
  }

  yield {
    graph,
    action: "done",
    frontier: [],
    visited: [...visited],
    visitOrder: [...visitOrder],
    message: `Готово: ${visitOrder.join(" → ")}`,
  };
}
