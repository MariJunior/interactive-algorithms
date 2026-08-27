import type { Graph, GraphStep } from "@/algorithms/types";
import { buildAdjacency } from "./demoGraph";

/** Чистый DFS (итеративный стек): порядок первого посещения */
export function dfs(graph: Graph, startId: string): string[] {
  const adj = buildAdjacency(graph);
  if (!adj.has(startId)) return [];

  const visited = new Set<string>();
  const stack: string[] = [startId];
  const order: string[] = [];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;

    visited.add(current);
    order.push(current);

    // Соседей кладём в обратном порядке — pop() берёт лексикографически меньшего первым
    const neighbors = [...(adj.get(current) ?? [])].reverse();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  return order;
}

/** Генератор шагов DFS — стек (LIFO), без мутации графа */
export function* dfsSteps(graph: Graph, startId: string): Generator<GraphStep> {
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
  const stack: string[] = [startId];
  const visitOrder: string[] = [];

  yield {
    graph,
    action: "explore",
    current: startId,
    frontier: [...stack],
    visited: [],
    visitOrder: [],
    message: `DFS: кладём старт ${startId} в стек`,
  };

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);
    visitOrder.push(current);

    yield {
      graph,
      action: "visit",
      current,
      frontier: [...stack],
      visited: [...visited],
      visitOrder: [...visitOrder],
      message: `Посещаем ${current} (порядок: ${visitOrder.join(" → ")})`,
    };

    const neighbors = [...(adj.get(current) ?? [])].reverse();
    for (const neighbor of neighbors) {
      if (visited.has(neighbor) || stack.includes(neighbor)) {
        continue;
      }

      stack.push(neighbor);

      yield {
        graph,
        action: "explore",
        current,
        exploringEdge: [current, neighbor],
        frontier: [...stack],
        visited: [...visited],
        visitOrder: [...visitOrder],
        message: `В стек: ${neighbor}`,
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
