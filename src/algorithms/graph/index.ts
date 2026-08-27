import type { Graph, GraphStep } from "@/algorithms/types";
import { bfsSteps } from "./bfs";
import { dfsSteps } from "./dfs";

export { bfs, bfsSteps } from "./bfs";
export { dfs, dfsSteps } from "./dfs";
export {
  DEMO_GRAPH_START,
  buildAdjacency,
  createDemoGraph,
  edgeMatches,
  undirectedEdgeKey,
} from "./demoGraph";

/** Реестр генераторов обхода графа — ключ = slug из algorithms.ts */
export const graphStepGenerators: Record<
  string,
  (graph: Graph, startId: string) => Generator<GraphStep>
> = {
  bfs: bfsSteps,
  dfs: dfsSteps,
};

export function hasGraphVisualization(slug: string): boolean {
  return slug in graphStepGenerators;
}

export function collectGraphSteps(
  slug: string,
  graph: Graph,
  startId: string,
): GraphStep[] | null {
  const createSteps = graphStepGenerators[slug];
  if (!createSteps) return null;
  return Array.from(createSteps(graph, startId));
}
