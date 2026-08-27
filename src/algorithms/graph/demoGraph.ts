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
      { from: "A", to: "B" },
      { from: "A", to: "C" },
      { from: "B", to: "D" },
      { from: "B", to: "E" },
      { from: "C", to: "F" },
      { from: "C", to: "G" },
      { from: "E", to: "F" },
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
