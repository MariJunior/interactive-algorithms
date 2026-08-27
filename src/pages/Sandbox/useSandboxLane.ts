import type {
  BinaryTree,
  DpStep,
  Graph,
  GraphStep,
  SearchStep,
  SortStep,
  StringStep,
  TreeStep,
} from "@/algorithms/types";
import {
  DEMO_DP_N,
  dpStepGenerators,
  hasDpVisualization,
} from "@/algorithms/dp";
import {
  DEMO_GRAPH_START,
  createDemoGraph,
  graphStepGenerators,
  hasGraphVisualization,
} from "@/algorithms/graph";
import { hasSearchingVisualization, searchingStepGenerators } from "@/algorithms/searching";
import { hasSortingVisualization, sortingStepGenerators } from "@/algorithms/sorting";
import {
  DEMO_PATTERN,
  DEMO_TEXT,
  hasStringVisualization,
  stringStepGenerators,
} from "@/algorithms/string";
import {
  createDemoTree,
  hasTreeVisualization,
  treeStepGenerators,
} from "@/algorithms/tree";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useAlgorithmRunner } from "@/hooks/useAlgorithmRunner";
import { useMemo } from "react";

type AnyStep = SortStep | SearchStep | GraphStep | TreeStep | DpStep | StringStep;

export type SandboxLaneKind =
  | "sorting"
  | "searching"
  | "graph"
  | "tree"
  | "dp"
  | "string"
  | "none";

function* emptySteps(_input: number[]): Generator<AnyStep> {
  yield { array: [], action: "done", message: "Алгоритм недоступен" } as SortStep;
}

export function useSandboxLane(
  slug: string,
  input: number[],
  target: number,
  graph: Graph,
  graphStartId: string,
  tree: BinaryTree,
  dpN: number,
  text: string,
  pattern: string,
) {
  const kind: SandboxLaneKind = hasSortingVisualization(slug)
    ? "sorting"
    : hasSearchingVisualization(slug)
      ? "searching"
      : hasGraphVisualization(slug)
        ? "graph"
        : hasTreeVisualization(slug)
          ? "tree"
          : hasDpVisualization(slug)
            ? "dp"
            : hasStringVisualization(slug)
              ? "string"
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

  const dpSteps = useMemo(() => {
    if (kind !== "dp") return [] as DpStep[];
    const create = dpStepGenerators[slug];
    if (!create) return [] as DpStep[];
    return Array.from(create(dpN));
  }, [kind, slug, dpN]);

  const stringSteps = useMemo(() => {
    if (kind !== "string") return [] as StringStep[];
    const create = stringStepGenerators[slug];
    if (!create) return [] as StringStep[];
    return Array.from(create(text, pattern));
  }, [kind, slug, text, pattern]);

  const steps =
    kind === "graph"
      ? graphSteps
      : kind === "tree"
        ? treeSteps
        : kind === "dp"
          ? dpSteps
          : kind === "string"
            ? stringSteps
            : arraySteps.steps;

  const stepsId =
    kind === "graph"
      ? `${slug}:g:${graphStartId}:${graph.edges.length}`
      : kind === "tree"
        ? `${slug}:t:${tree.rootId}:${tree.nodes.length}`
        : kind === "dp"
          ? `${slug}:dp:${dpN}`
          : kind === "string"
            ? `${slug}:s:${text}:${pattern}`
            : `${slug}:${laneInput.join(",")}:${kind === "searching" ? target : "-"}`;

  const player = useAlgorithmPlayer(steps, stepsId);

  return { kind, steps, player, laneInput };
}

export {
  DEMO_DP_N,
  DEMO_GRAPH_START,
  DEMO_PATTERN,
  DEMO_TEXT,
  createDemoGraph,
  createDemoTree,
};
