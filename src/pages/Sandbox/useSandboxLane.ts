import type {
  BinaryTree,
  Graph,
  GraphStep,
  SearchStep,
  SortStep,
  TreeStep,
} from "@/algorithms/types";
import {
  DEMO_GRAPH_START,
  createDemoGraph,
  graphStepGenerators,
  hasGraphVisualization,
} from "@/algorithms/graph";
import { hasSearchingVisualization, searchingStepGenerators } from "@/algorithms/searching";
import { hasSortingVisualization, sortingStepGenerators } from "@/algorithms/sorting";
import {
  createDemoTree,
  hasTreeVisualization,
  treeStepGenerators,
} from "@/algorithms/tree";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useAlgorithmRunner } from "@/hooks/useAlgorithmRunner";
import { useMemo } from "react";

type AnyStep = SortStep | SearchStep | GraphStep | TreeStep;

export type SandboxLaneKind =
  | "sorting"
  | "searching"
  | "graph"
  | "tree"
  | "none";

function* emptySteps(_input: number[]): Generator<AnyStep> {
  yield { array: [], action: "done", message: "Алгоритм недоступен" } as SortStep;
}

/**
 * Одна дорожка песочницы.
 * sorting/searching — number[]; graph — Graph+start; tree — BinaryTree.
 */
export function useSandboxLane(
  slug: string,
  input: number[],
  target: number,
  graph: Graph,
  graphStartId: string,
  tree: BinaryTree,
) {
  const kind: SandboxLaneKind = hasSortingVisualization(slug)
    ? "sorting"
    : hasSearchingVisualization(slug)
      ? "searching"
      : hasGraphVisualization(slug)
        ? "graph"
        : hasTreeVisualization(slug)
          ? "tree"
          : "none";

  const laneInput = useMemo(() => {
    if (slug === "binary-search") {
      return [...input].sort((a, b) => a - b);
    }
    return input;
  }, [slug, input]);

  const arraySteps = useAlgorithmRunner(
    useMemo(() => {
      if (kind === "sorting") {
        return sortingStepGenerators[slug] ?? emptySteps;
      }
      if (kind === "searching") {
        const searchGen = searchingStepGenerators[slug];
        if (!searchGen) return emptySteps;
        return (arr: number[]) => searchGen(arr, target);
      }
      return emptySteps;
    }, [kind, slug, target]),
    kind === "sorting" || kind === "searching" ? laneInput : [],
  );

  const graphSteps = useMemo(() => {
    if (kind !== "graph") return [] as GraphStep[];
    const create = graphStepGenerators[slug];
    if (!create) return [] as GraphStep[];
    return Array.from(create(graph, graphStartId));
  }, [kind, slug, graph, graphStartId]);

  const treeSteps = useMemo(() => {
    if (kind !== "tree") return [] as TreeStep[];
    const create = treeStepGenerators[slug];
    if (!create) return [] as TreeStep[];
    return Array.from(create(tree));
  }, [kind, slug, tree]);

  const steps =
    kind === "graph" ? graphSteps : kind === "tree" ? treeSteps : arraySteps.steps;

  const stepsId =
    kind === "graph"
      ? `${slug}:g:${graphStartId}:${graph.edges.length}`
      : kind === "tree"
        ? `${slug}:t:${tree.rootId}:${tree.nodes.length}`
        : `${slug}:${laneInput.join(",")}:${kind === "searching" ? target : "-"}`;

  const player = useAlgorithmPlayer(steps, stepsId);

  return { kind, steps, player, laneInput };
}

export { DEMO_GRAPH_START, createDemoGraph, createDemoTree };
