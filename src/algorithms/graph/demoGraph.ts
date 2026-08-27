import type { Graph, GraphEdge } from "@/algorithms/types";

/** Учебный неориентированный граф — фиксированная раскладка для визуализатора */
export function createDemoGraph(): Graph {
  return {
    directed: false,
    nodes: [
      { id: "A", label: "A", x: 200, y: 36 },
      { id: "B", label: "B", x: 100, y: 110 },
      { id: "C", label: "C", x: 300, y: 110 },
      { id: "D", label: "D", x: 40, y: 200 },
      { id: "E", label: "E", x: 160, y: 200 },
      { id: "F", label: "F", x: 240, y: 200 },
      { id: "G", label: "G", x: 360, y: 200 },
    ],
    edges: [
      { from: "A", to: "B", weight: 2 },
      { from: "A", to: "C", weight: 4 },
      { from: "B", to: "D", weight: 3 },
      { from: "B", to: "E", weight: 1 },
      { from: "C", to: "F", weight: 2 },
      { from: "C", to: "G", weight: 5 },
      { from: "E", to: "F", weight: 3 },
    ],
  };
}

/** Старт по умолчанию — корень учебного графа */
export const DEMO_GRAPH_START = "A";

/**
 * Список смежности: соседи отсортированы — обход детерминирован.
 * Для неориентированного графа ребро добавляется в обе стороны.
 */
export function buildAdjacency(graph: Graph): Map<string, string[]> {
  const adj = new Map<string, string[]>();

  for (const node of graph.nodes) {
    adj.set(node.id, []);
  }

  const add = (from: string, to: string) => {
    const list = adj.get(from);
    if (!list) return;
    if (!list.includes(to)) list.push(to);
  };

  for (const edge of graph.edges) {
    add(edge.from, edge.to);
    if (!graph.directed) {
      add(edge.to, edge.from);
    }
  }

  for (const [, neighbors] of adj) {
    neighbors.sort((a, b) => a.localeCompare(b));
  }

  return adj;
}

export interface WeightedNeighbor {
  to: string;
  weight: number;
}

/** Список смежности с весами (по умолчанию weight = 1) */
export function buildWeightedAdjacency(
  graph: Graph,
): Map<string, WeightedNeighbor[]> {
  const adj = new Map<string, WeightedNeighbor[]>();

  for (const node of graph.nodes) {
    adj.set(node.id, []);
  }

  const add = (from: string, to: string, weight: number) => {
    const list = adj.get(from);
    if (!list) return;
    if (!list.some((n) => n.to === to)) {
      list.push({ to, weight });
    }
  };

  for (const edge of graph.edges) {
    const weight = edge.weight ?? 1;
    add(edge.from, edge.to, weight);
    if (!graph.directed) {
      add(edge.to, edge.from, weight);
    }
  }

  for (const [, neighbors] of adj) {
    neighbors.sort((a, b) => a.to.localeCompare(b.to));
  }

  return adj;
}

/** Ключ неориентированного ребра — чтобы подсвечивать без дублей */
export function undirectedEdgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function edgeMatches(
  edge: GraphEdge,
  pair: [string, string] | undefined,
  directed: boolean | undefined,
): boolean {
  if (!pair) return false;
  const [from, to] = pair;
  if (edge.from === from && edge.to === to) return true;
  if (!directed && edge.from === to && edge.to === from) return true;
  return false;
}
